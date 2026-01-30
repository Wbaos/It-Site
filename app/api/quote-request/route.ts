import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { QuoteRequest } from "@/app/models/QuoteRequest";
import { syncCustomerToMailchimp } from "@/lib/mailchimp";
import { logger } from "@/lib/logger";

function getMailchimpEnabled(): boolean {
  return Boolean(
    process.env.MAILCHIMP_API_KEY &&
      process.env.MAILCHIMP_SERVER_PREFIX &&
      process.env.MAILCHIMP_AUDIENCE_ID
  );
}

function generateReferenceNumber() {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let body = "";
  for (let i = 0; i < 8; i++) body += alphabet[Math.floor(Math.random() * alphabet.length)];
  return `QR-${body}`;
}

function cleanString(value: unknown) {
  const s = typeof value === "string" ? value.trim() : "";
  return s.length ? s : undefined;
}

function asRecord(value: unknown): Record<string, unknown> {
  return typeof value === "object" && value !== null ? (value as Record<string, unknown>) : {};
}

function isDuplicateKeyError(error: unknown): boolean {
  const e = typeof error === "object" && error !== null ? (error as { code?: unknown }) : undefined;
  return e?.code === 11000;
}

type CreatedQuoteRequest = {
  _id?: unknown;
};

export async function POST(req: NextRequest) {
  try {
    const data = asRecord(await req.json());
    const service = asRecord(data.service);
    const contact = asRecord(data.contact);
    const location = asRecord(data.location);
    const details = asRecord(data.details);

    await connectDB();

    const doc = {
      service: Object.keys(service).length
        ? {
            category: cleanString(service.category),
            group: cleanString(service.group),
            service: cleanString(service.service),
          }
        : undefined,
      urgency: cleanString(data.urgency),
      other: cleanString(data.other),
      contact: {
        firstName: cleanString(contact.firstName),
        lastName: cleanString(contact.lastName),
        email: cleanString(contact.email),
        phone: cleanString(contact.phone),
      },
      location: {
        streetAddress: cleanString(location.streetAddress),
        city: cleanString(location.city),
        zipCode: cleanString(location.zipCode),
      },
      details: {
        projectDetails: cleanString(details.projectDetails),
        wantsTechnicianVisitFirst: Boolean(details.wantsTechnicianVisitFirst),
        preferredDate: cleanString(details.preferredDate),
        preferredTime: cleanString(details.preferredTime),
        heardAbout: cleanString(details.heardAbout),
      },
    };

    // Retry a few times in the extremely unlikely event of a reference collision.
    let created: CreatedQuoteRequest | null = null;
    let referenceNumber = "";
    for (let attempt = 0; attempt < 5; attempt++) {
      referenceNumber = generateReferenceNumber();
      try {
        created = (await QuoteRequest.create({ referenceNumber, ...doc })) as CreatedQuoteRequest;
        break;
      } catch (e: unknown) {
        // Duplicate key on referenceNumber
        if (isDuplicateKeyError(e)) continue;
        throw e;
      }
    }

    if (!created) {
      return NextResponse.json(
        { success: false, error: "Could not generate reference number" },
        { status: 500 }
      );
    }

    // Best-effort Mailchimp sync (lead capture)
    try {
      const email = doc.contact.email;
      if (getMailchimpEnabled() && email) {
        const serviceType =
          doc.service?.service ||
          doc.service?.group ||
          doc.service?.category ||
          doc.other ||
          undefined;

        const address = doc.location
          ? {
              addr1: doc.location.streetAddress,
              city: doc.location.city,
              zip: doc.location.zipCode,
              country: 'US',
            }
          : undefined;

        await syncCustomerToMailchimp({
          email,
          firstName: doc.contact.firstName,
          lastName: doc.contact.lastName,
          phone: doc.contact.phone,
          serviceType,
          address,
        });
      }
    } catch (err) {
      logger.error("Mailchimp sync failed during quote request", err, {
        email: doc.contact.email,
        referenceNumber,
        source: "quote-request",
      });
    }

    logger.info("Received quote request", { referenceNumber, id: created?._id });
    return NextResponse.json({ success: true, referenceNumber, id: created?._id }, { status: 201 });
  } catch (err: unknown) {
    logger.error("quote-request API error", err);
    const isSyntax = err instanceof SyntaxError;
    return NextResponse.json(
      { success: false, error: isSyntax ? "Invalid JSON" : "Server error" },
      { status: isSyntax ? 400 : 500 }
    );
  }
}
