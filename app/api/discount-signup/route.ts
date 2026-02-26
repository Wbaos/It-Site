import { NextResponse } from "next/server";
import { Resend } from "resend";

import { connectDB } from "@/lib/mongodb";
import { transporter } from "@/lib/mailer";
import { syncCustomerToMailchimp } from "@/lib/mailchimp";
import { logger } from "@/lib/logger";
import { DiscountLead } from "@/app/models/DiscountLead";

const DISCOUNT_POPUP_SIGNED_UP_COOKIE = "ctc_discount_popup_signed_up";

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

function buildSignedUpCookie(): string {
  const ONE_YEAR_SECONDS = 60 * 60 * 24 * 365;
  const isProd = process.env.NODE_ENV === "production";
  return [
    `${DISCOUNT_POPUP_SIGNED_UP_COOKIE}=1`,
    "Path=/",
    `Max-Age=${ONE_YEAR_SECONDS}`,
    "SameSite=Lax",
    isProd ? "Secure" : null,
  ]
    .filter(Boolean)
    .join("; ");
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const email = String(url.searchParams.get("email") || "").trim();

    if (!email) {
      return NextResponse.json({ ok: false, error: "Missing email" }, { status: 400 });
    }

    if (!isValidEmail(email)) {
      return NextResponse.json({ ok: false, error: "Invalid email" }, { status: 400 });
    }

    const emailLower = email.toLowerCase();
    await connectDB();
    const exists = Boolean(await DiscountLead.exists({ emailLower }));

    return NextResponse.json({ ok: true, exists });
  } catch (err) {
    logger.error("Discount lead check API error", err);
    return NextResponse.json({ ok: false, error: "Server error" }, { status: 500 });
  }
}

async function sendDiscountEmail(to: string, code: string, percent: number) {
  const safePercent = Number.isFinite(percent) ? Math.min(100, Math.max(0, percent)) : 10;
  const subject = `Your ${safePercent}% discount code`;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://www.calltechcare.com";
  const headline = `Here’s your ${safePercent}% off code`;

  const html = `
    <div style="background:#f8fafc; padding:24px 12px; font-family:Arial, sans-serif; color:#0b1220;">
      <div style="max-width:520px; margin:0 auto; background:#ffffff; border:1px solid #e2e8f0; border-radius:14px; overflow:hidden;">
        <div style="padding:18px 18px 14px 18px; background:#0b1220; color:#ffffff;">
          <div style="font-size:12px; letter-spacing:1.2px; opacity:0.9;">CALLTECHCARE</div>
          <div style="font-size:22px; font-weight:800; line-height:1.2; margin-top:8px;">${headline}</div>
          <div style="font-size:13px; opacity:0.9; margin-top:6px;">Use this code at checkout to save on your first service.</div>
        </div>

        <div style="padding:18px;">
          <div style="background:#f1f5f9; border:1px solid #e2e8f0; border-radius:12px; padding:14px 14px; text-align:center;">
            <div style="font-size:11px; letter-spacing:1.4px; color:#334155; font-weight:700;">YOUR DISCOUNT CODE</div>
            <div style="font-size:22px; font-weight:900; letter-spacing:1px; margin-top:8px;">${code}</div>
            <div style="font-size:12px; color:#475569; margin-top:8px;">Applies ${safePercent}% off your first service.</div>
          </div>

          <div style="margin-top:16px; font-size:14px; color:#0b1220;">
            Ready to book? Click below:
          </div>

          <div style="margin-top:12px;">
            <a href="${baseUrl}" target="_blank" rel="noreferrer"
              style="display:inline-block; background:#0b1220; color:#ffffff; text-decoration:none; padding:12px 16px; border-radius:10px; font-weight:800; font-size:14px;">
              Book a service
            </a>
          </div>

          <div style="margin-top:14px; font-size:12px; color:#64748b;">
            Or copy/paste this link: <a href="${baseUrl}" target="_blank" rel="noreferrer" style="color:#0b1220;">${baseUrl}</a>
          </div>

          <div style="margin-top:18px; padding-top:14px; border-top:1px solid #e2e8f0; font-size:12px; color:#64748b;">
            If you didn’t request this, you can ignore this email.
          </div>
        </div>
      </div>
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
      .select({ redeemedAt: 1 })
      .lean()) as { redeemedAt?: Date } | null;

    if (existing) {
      if (existing?.redeemedAt) {
        return NextResponse.json(
          {
            ok: false,
            code: "ALREADY_USED",
            error: "This email has already used the one-time discount.",
          },
          { status: 409 }
        );
      }

      return NextResponse.json(
        {
          ok: false,
          code: "EMAIL_EXISTS",
          error: "This email is already signed up.",
        },
        { status: 409 }
      );
    }

    // New leads only reach here; no resend throttling needed.
    const shouldSend = canResend(null);

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
        await sendDiscountEmail(email, discountCode, discountPercent);
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
    }, {
      headers: {
        "Set-Cookie": buildSignedUpCookie(),
      },
    });
  } catch (err) {
    logger.error("Discount lead API error", err);
    return NextResponse.json({ ok: false, error: "Server error" }, { status: 500 });
  }
}
