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
    const { code } = await req.json();

    const normalized = normalizeCode(code);

    if (!normalized) {
      return NextResponse.json(
        { error: "No promo code provided" },
        { status: 400 }
      );
    }

    // 1) Shared popup code (validated at checkout by email)
    const popupCode = getDiscountPopupCode();
    if (normalized === popupCode) {
      // Best-effort: ensure at least one lead exists for this code.
      try {
        await connectDB();
        const exists = await DiscountLead.exists({ discountCode: popupCode });
        if (!exists) {
          return NextResponse.json({
            valid: false,
            error: "Invalid code",
          });
        }
      } catch {
        // If DB lookup fails, still allow cart to proceed; checkout will validate again.
      }

      return NextResponse.json({
        valid: true,
        discountType: "percentage",
        value: getDiscountPopupPercent(),
        source: "discount-lead",
      });
    }

    const promo = await sanity.fetch(
      `*[_type == "promoCode" && code == $code][0]`,
      { code: normalized }
    );

    if (!promo) {
      return NextResponse.json({ valid: false, error: "Invalid code" });
    }

    if (!promo.active) {
      return NextResponse.json({ valid: false, error: "Code is not active" });
    }

    if (promo.expires && new Date(promo.expires) < new Date()) {
      return NextResponse.json({ valid: false, error: "Code has expired" });
    }

    return NextResponse.json({
      valid: true,
      discountType: promo.discountType,
      value: promo.value,
      source: "sanity",
    });
  } catch (err) {
    console.error("Promo validation error", err);
    return NextResponse.json(
      { error: "Server error validating promo code" },
      { status: 500 }
    );
  }
}
