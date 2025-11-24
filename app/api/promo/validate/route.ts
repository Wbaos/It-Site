import { NextResponse } from "next/server";
import { sanity } from "@/lib/sanity";

export async function POST(req: Request) {
  try {
    const { code } = await req.json();

    if (!code) {
      return NextResponse.json(
        { error: "No promo code provided" },
        { status: 400 }
      );
    }

    const promo = await sanity.fetch(
      `*[_type == "promoCode" && code == $code][0]`,
      { code: code.toUpperCase() }
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
      valid: true,
      discountType: promo.discountType,
      value: promo.value,
    });
  } catch (err) {
    console.error("Promo validation error", err);
    return NextResponse.json(
      { error: "Server error validating promo code" },
      { status: 500 }
    );
  }
}
