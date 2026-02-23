import { NextResponse } from "next/server";
import { sanity } from "@/lib/sanity";
import { connectDB } from "@/lib/mongodb";
import { DiscountLead } from "@/app/models/DiscountLead";

function normalizeCode(code: string): string {
  return String(code || "").trim().toUpperCase();
}

function getDiscountPopupCode(): string {
  return normalizeCode(String(process.env.DISCOUNT_POPUP_CODE || "MYFIRSTSERVICE#-10"));
}

function getDiscountPopupPercent(): number {
  const raw = Number(process.env.DISCOUNT_POPUP_PERCENT || 10);
  if (!Number.isFinite(raw)) return 10;
  return Math.min(100, Math.max(0, raw));
}

export async function POST(req: Request) {
  try {
    const { code, email } = (await req.json().catch(() => ({}))) as {
      code?: string;
      email?: string;
    };

    const normalized = normalizeCode(code || "");
    if (!normalized) {
      return NextResponse.json(
        { ok: false, error: "No promo code provided" },
        { status: 400 }
      );
    }

    // 1) One-time lead codes (DiscountLead) — redeem atomically
    try {
      await connectDB();

      const emailLower = String(email || "").trim().toLowerCase();

      // Shared popup code is one-time per email.
      if (normalized === getDiscountPopupCode()) {
        if (!emailLower) {
          return NextResponse.json({
            ok: false,
            valid: false,
            error: "This code requires the same email used to request it.",
          });
        }

        const lead = await DiscountLead.findOneAndUpdate(
          {
            emailLower,
            discountCode: getDiscountPopupCode(),
            redeemedAt: { $exists: false },
          },
          { $set: { redeemedAt: new Date() } },
          { new: true }
        )
          .select({ discountPercent: 1 })
          .lean();

        if (!lead) {
          return NextResponse.json({
            ok: false,
            valid: false,
            error: "This code is invalid or already used.",
          });
        }

        const percent =
          typeof (lead as any).discountPercent === "number"
            ? (lead as any).discountPercent
            : getDiscountPopupPercent();

        return NextResponse.json({
          ok: true,
          valid: true,
          discountType: "percentage",
          value: percent,
          source: "discount-lead",
        });
      }

      // If email is provided, use it to disambiguate and enforce per-customer.
      const query: Record<string, unknown> = {
        discountCode: normalized,
        redeemedAt: { $exists: false },
      };
      if (emailLower) query.emailLower = emailLower;

      const lead = await DiscountLead.findOneAndUpdate(
        query,
        { $set: { redeemedAt: new Date() } },
        { new: true }
      )
        .select({ discountPercent: 1 })
        .lean();

      if (lead) {
        const percent =
          typeof (lead as any).discountPercent === "number"
            ? (lead as any).discountPercent
            : 10;

        return NextResponse.json({
          ok: true,
          valid: true,
          discountType: "percentage",
          value: percent,
          source: "discount-lead",
        });
      }

      // If code exists but already redeemed (or email mismatch), return a clearer message.
      const existing = await DiscountLead.find({ discountCode: normalized })
        .select({ redeemedAt: 1 })
        .limit(2)
        .lean();

      if (existing.length > 1 && !emailLower) {
        return NextResponse.json({
          ok: false,
          valid: false,
          error: "This code requires the same email used to request it.",
        });
      }

      if (existing.length === 1 && (existing[0] as any).redeemedAt) {
        return NextResponse.json({
          ok: false,
          valid: false,
          error: "This code has already been used.",
        });
      }
    } catch (err) {
      console.error("DiscountLead promo redeem error", err);
      // Continue to Sanity redeem
    }

    // 2) Sanity promo codes — increment usageCount on redeem
    const promo = await sanity.fetch(
      `*[_type == "promoCode" && code == $code][0]`,
      { code: normalized }
    );

    if (!promo) {
      return NextResponse.json({ ok: false, valid: false, error: "Invalid code" });
    }

    if (!promo.active) {
      return NextResponse.json({ ok: false, valid: false, error: "Code is not active" });
    }

    if (promo.expires && new Date(promo.expires) < new Date()) {
      return NextResponse.json({ ok: false, valid: false, error: "Code has expired" });
    }

    try {
      await sanity
        .patch(promo._id)
        .setIfMissing({ usageCount: 0 })
        .inc({ usageCount: 1 })
        .commit();
    } catch (err) {
      console.error("Failed to increment usageCount:", err);
    }

    return NextResponse.json({
      ok: true,
      valid: true,
      discountType: promo.discountType,
      value: promo.value,
      source: "sanity",
    });
  } catch (err) {
    console.error("Promo redeem error", err);
    return NextResponse.json(
      { ok: false, error: "Server error redeeming promo code" },
      { status: 500 }
    );
  }
}
