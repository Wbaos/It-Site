import { NextResponse } from "next/server";
import { sanity } from "@/lib/sanity";

function normalizeCode(code: string): string {
  return String(code || "").trim().toUpperCase();
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
