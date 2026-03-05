import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/app/models/User";
import { sanityWriteClient } from "@/lib/sanityWriteClient";
import { syncCustomerToMailchimp } from "@/lib/mailchimp";
import { logger } from "@/lib/logger";
import { Notification } from "@/app/models/Notification";
import { sendDiscountCodeEmail } from "@/lib/mailer";
import { sanity } from "@/lib/sanity";

type SanityPromo = {
  code?: string;
  discountType?: "percentage" | "flat";
  value?: number;
  active?: boolean;
  expires?: string;
};

async function getWelcomePromoFromSanity(): Promise<
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

    if (!code) return { ok: false, error: "No active promo code found in Sanity" };
    if (!Number.isFinite(value) || value <= 0) return { ok: false, error: "Promo code value is invalid" };

    return { ok: true, promo: { code, discountType, value } };
  } catch (err) {
    logger.error("Failed to fetch welcome promo from Sanity", err);
    return { ok: false, error: "Failed to fetch promo code" };
  }
}

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    await connectDB();

    const existing = await User.findOne({ email });
    if (existing) {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 400 }
      );
    }

    const user = await User.create({ name, email, password });

    // Best-effort: send welcome promo code email (Sanity-controlled; do not block signup)
    try {
      const welcomePromo = await getWelcomePromoFromSanity();
      if (welcomePromo.ok) {
        await sendDiscountCodeEmail({
          to: String(email),
          code: welcomePromo.promo.code,
          discountType: welcomePromo.promo.discountType,
          value: welcomePromo.promo.value,
          source: "signup",
        });
      }
    } catch (err) {
      logger.error("Discount email failed during signup", err, { email, source: "signup" });
    }

    // Best-effort: create an in-app notification with the code
    try {
      const welcomePromo = await getWelcomePromoFromSanity();
      if (welcomePromo.ok) {
        const { code, discountType, value } = welcomePromo.promo;
        const label = discountType === "flat" ? `$${value} off` : `${value}% off`;

        await Notification.create({
          userId: String((user as any)?._id || ""),
          title: "Welcome discount",
          message: `Welcome! Use code ${code} for ${label} your first service.`,
          type: "info",
          read: false,
        });
      }
    } catch (err) {
      logger.error("Failed to create signup discount notification", err, { email, source: "signup" });
    }

    // Best-effort Mailchimp sync (do not block signup on marketing platform failures)
    try {
      const fullName = String(name ?? "").trim();
      const parts = fullName ? fullName.split(/\s+/) : [];
      const firstName = parts[0] || undefined;
      const lastName = parts.length > 1 ? parts.slice(1).join(" ") : undefined;

      if (
        process.env.MAILCHIMP_API_KEY &&
        process.env.MAILCHIMP_SERVER_PREFIX &&
        process.env.MAILCHIMP_AUDIENCE_ID
      ) {
        await syncCustomerToMailchimp({
          email: String(email),
          firstName,
          lastName,
        });
      }
    } catch (err) {
      logger.error("Mailchimp sync failed during signup", err, {
        email,
        source: "signup",
      });
    }

    try {
      await sanityWriteClient.create({
        _type: "user",
        name,
        email,
        createdAt: new Date().toISOString(),
        source: "website-signup",
      });
    } catch (err) {
      logger.error("Sanity archive error", err, { email });
    }

    return NextResponse.json({ ok: true, redirect: "/login" });
  } catch (err) {
    logger.error("Signup API error", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
