import { NextResponse } from "next/server";

import { connectDB } from "@/lib/mongodb";
import { sendDiscountCodeEmail } from "@/lib/mailer";
import { syncCustomerToMailchimp } from "@/lib/mailchimp";
import { logger } from "@/lib/logger";
import { DiscountLead } from "@/app/models/DiscountLead";
import { sanity } from "@/lib/sanity";

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

type SanityPromo = {
  code?: string;
  discountType?: "percentage" | "flat";
  value?: number;
};

async function getActivePromoFromSanity(): Promise<
  | { ok: true; promo: { code: string; discountType: "percentage" | "flat"; value: number } }
  | { ok: false; error: string }
> {
  try {
    const promo = await sanity.fetch<SanityPromo>(
      `*[_type == "promoCode" && active == true && (!defined(expires) || expires > now())] | order(_createdAt desc)[0]{ code, discountType, value }`
    );

    const code = String(promo?.code || "").trim().toUpperCase();
    const discountType = promo?.discountType === "flat" ? "flat" : "percentage";
    const value = Number(promo?.value ?? 0);

    if (!code) return { ok: false, error: "No active promo code found" };
    if (!Number.isFinite(value) || value <= 0) return { ok: false, error: "Promo value is invalid" };

    return { ok: true, promo: { code, discountType, value } };
  } catch (err) {
    logger.error("Failed to fetch promo from Sanity (discount-signup)", err);
    return { ok: false, error: "Failed to fetch promo" };
  }
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
    const activePromo = await getActivePromoFromSanity();
    if (!activePromo.ok) {
      return NextResponse.json(
        { ok: false, error: activePromo.error || "No active discount available" },
        { status: 400 }
      );
    }

    const discountCode = activePromo.promo.code;
    const discountType = activePromo.promo.discountType;
    const discountValue = activePromo.promo.value;
    const discountPercent = discountType === "percentage" ? discountValue : 0;

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
          discountType,
          discountValue,
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
        await sendDiscountCodeEmail({
          to: email,
          code: discountCode,
          discountType,
          value: discountValue,
          source: "discount-popup",
        });
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
      discountType,
      value: discountValue,
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
