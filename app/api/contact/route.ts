// app/api/contact/route.ts
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Contact } from "@/app/models/Contact";
import { syncCustomerToMailchimp } from "@/lib/mailchimp";
import { logger } from "@/lib/logger";
import { sendCompanyContactNotificationEmail } from "@/lib/mailer";

type EmailSendResult =
  | { ok: true; skipped: false; provider: "resend" | "nodemailer" }
  | { ok: false; skipped: true; reason: string };

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const name = String(body.name || "").trim();
    const email = String(body.email || "").trim();
    const message = String(body.message || "").trim();
    const company = String(body.company || "").trim(); 

    if (!name || !email || !message) {
      return NextResponse.json(
        { ok: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    await connectDB();
    const newContact = await Contact.create({
      name,
      email,
      message,
      company,
      date: new Date(),
    });

    let emailSent = false;
    let emailProvider: "resend" | "nodemailer" | null = null;
    let emailSkippedReason: string | null = null;
    let mailchimpSynced = false;

    const businessEmailTo = String(process.env.ORDER_NOTIFICATION_EMAIL || "").trim() || null;

    // Best-effort Mailchimp sync (do not block contact on marketing platform failures)
    try {
      if (
        process.env.MAILCHIMP_API_KEY &&
        process.env.MAILCHIMP_SERVER_PREFIX &&
        process.env.MAILCHIMP_AUDIENCE_ID
      ) {
        const fullName = String(name ?? "").trim();
        const parts = fullName ? fullName.split(/\s+/) : [];
        const firstName = parts[0] || undefined;
        const lastName = parts.length > 1 ? parts.slice(1).join(" ") : undefined;

        await syncCustomerToMailchimp({
          email: String(email),
          firstName,
          lastName,
          serviceType: "contact-form",
        });

        mailchimpSynced = true;
      }
    } catch (err) {
      logger.error("Mailchimp sync failed during contact", err, {
        email,
        source: "contact",
      });
    }

    // Best-effort email notification to business (do not block form submission)
    try {
      const result = (await sendCompanyContactNotificationEmail({
        contact: {
          name,
          email,
          company: company || undefined,
          message,
        },
        source: "api.contact",
      })) as EmailSendResult;

      emailSent = Boolean(result.ok);
      if (result.ok) {
        emailProvider = result.provider;
      } else {
        emailSkippedReason = result.reason;
      }
    } catch (err) {
      logger.error("Company contact notification failed", err, { source: "contact" });
    }

    const debug = process.env.NODE_ENV !== "production";

    return NextResponse.json({
      ok: true,
      id: newContact._id,
      emailSent,
      ...(debug
        ? {
            emailProvider,
            emailSkippedReason,
            businessEmailTo,
          }
        : {}),
      mailchimpSynced,
    });
  } catch (err: any) {
    console.error("❌ Contact API error:", err);
    return NextResponse.json(
      { ok: false, error: "Server error. Please try again later." },
      { status: 500 }
    );
  }
}
