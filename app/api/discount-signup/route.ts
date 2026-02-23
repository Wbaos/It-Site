import { NextResponse } from "next/server";
import { Resend } from "resend";

import { connectDB } from "@/lib/mongodb";
import { transporter } from "@/lib/mailer";
import { syncCustomerToMailchimp } from "@/lib/mailchimp";
import { logger } from "@/lib/logger";
import { DiscountLead } from "@/app/models/DiscountLead";

function getMailchimpEnabled(): boolean {
  return Boolean(
    process.env.MAILCHIMP_API_KEY &&
      process.env.MAILCHIMP_SERVER_PREFIX &&
      process.env.MAILCHIMP_AUDIENCE_ID
  );
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function normalizePhone(phone: string): string {
  return phone.replace(/[^0-9+]/g, "").trim();
}

function normalizeCode(code: string): string {
  return String(code || "").trim().toUpperCase();
}

function getDiscountCode(): string {
  const code = String(process.env.DISCOUNT_POPUP_CODE || "MYFIRSTSERVICE#-10");
  return normalizeCode(code);
}

function getDiscountPercent(): number {
  const raw = Number(process.env.DISCOUNT_POPUP_PERCENT || 10);
  if (!Number.isFinite(raw)) return 10;
  return Math.min(100, Math.max(0, raw));
}

function canResend(lastSentAt?: Date | null): boolean {
  if (!lastSentAt) return true;
  const ONE_DAY_MS = 24 * 60 * 60 * 1000;
  return Date.now() - lastSentAt.getTime() > ONE_DAY_MS;
}

async function sendDiscountEmail(to: string, code: string) {
  const subject = "Your 10% discount code";
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://www.calltechcare.com";

  const html = `
    <div style="font-family: Arial, sans-serif; line-height:1.5; color:#0b1220;">
      <h2 style="margin:0 0 12px 0;">Here’s your 10% off code</h2>
      <p style="margin:0 0 10px 0;">Use this code at checkout:</p>
      <p style="font-size:20px; font-weight:800; letter-spacing:1px; margin:0 0 16px 0;">${code}</p>
      <p style="margin:0 0 16px 0;">You can book a service anytime here:</p>
      <p style="margin:0 0 20px 0;"><a href="${baseUrl}" target="_blank" rel="noreferrer">${baseUrl}</a></p>
      <p style="font-size:12px; color:#334155; margin:0;">If you didn’t request this, you can ignore this email.</p>
    </div>
  `;

  if (process.env.RESEND_API_KEY) {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const from = process.env.FROM_EMAIL || "CallTechCare <support@calltechcare.com>";
    await resend.emails.send({ from, to: [to], subject, html });
    return;
  }

  const from = process.env.EMAIL_USER
    ? `CallTechCare <${process.env.EMAIL_USER}>`
    : "CallTechCare <support@calltechcare.com>";

  await transporter.sendMail({ from, to, subject, html });
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const email = String((body as any)?.email || "").trim();
    const phoneRaw = String((body as any)?.phone || "").trim();
    const consent = Boolean((body as any)?.consent);

    if (!email) {
      return NextResponse.json({ ok: false, error: "Missing email" }, { status: 400 });
    }

    if (!isValidEmail(email)) {
      return NextResponse.json({ ok: false, error: "Invalid email" }, { status: 400 });
    }

    const phone = normalizePhone(phoneRaw);
    if (!phone) {
      return NextResponse.json({ ok: false, error: "Missing phone" }, { status: 400 });
    }

    if (!consent) {
      return NextResponse.json({ ok: false, error: "Consent required" }, { status: 400 });
    }

    const emailLower = email.toLowerCase();
    const discountCode = getDiscountCode();
    const discountPercent = getDiscountPercent();

    await connectDB();

    const existing = (await DiscountLead.findOne({ emailLower })
      .select({ codeSentAt: 1, redeemedAt: 1 })
      .lean()) as { codeSentAt?: Date; redeemedAt?: Date } | null;

    if (existing?.redeemedAt) {
      // Customer already used their one-time discount.
      await DiscountLead.findOneAndUpdate(
        { emailLower },
        { $set: { phone, consent } }
      );
      return NextResponse.json({
        ok: true,
        mailchimpSynced: false,
        emailSent: false,
        discountCode,
        discountPercent,
        alreadyUsed: true,
      });
    }

    const shouldSend = canResend(existing?.codeSentAt ?? null);

    await DiscountLead.findOneAndUpdate(
      { emailLower },
      {
        $setOnInsert: {
          email,
          emailLower,
          source: "discount-popup",
        },
        $set: {
          phone,
          consent,
          discountCode,
          discountPercent,
        },
      },
      { upsert: true }
    );

    // Best-effort Mailchimp sync (lead capture)
    let mailchimpSynced = false;
    try {
      if (getMailchimpEnabled()) {
        const result = await syncCustomerToMailchimp({
          email,
          phone,
          serviceType: "discount-popup",
        });
        mailchimpSynced = !result?.skipped;
      }
    } catch (err) {
      logger.error("Mailchimp sync failed during discount popup", err, {
        email,
        source: "discount-popup",
      });
    }

    let emailSent = false;
    if (shouldSend) {
      try {
        await sendDiscountEmail(email, discountCode);
        emailSent = true;
        await DiscountLead.findOneAndUpdate(
          { emailLower },
          { $set: { codeSentAt: new Date() } }
        );
      } catch (err) {
        logger.error("Discount code email failed", err, {
          email,
          source: "discount-popup",
        });
      }
    }

    return NextResponse.json({
      ok: true,
      mailchimpSynced,
      emailSent,
      discountCode,
      discountPercent,
    });
  } catch (err) {
    logger.error("Discount lead API error", err);
    return NextResponse.json({ ok: false, error: "Server error" }, { status: 500 });
  }
}
