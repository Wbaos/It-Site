import { NextResponse } from "next/server";
import { sanity } from "@/lib/sanity";

function normalizeCode(code: string): string {
  return String(code || "").trim().toUpperCase();
}

export async function POST(req: Request) {
  try {
    const { code } = (await req.json().catch(() => ({}))) as {
      code?: string;
    };

    const normalized = normalizeCode(code || "");
    if (!normalized) {
      return NextResponse.json(
        { ok: false, error: "No promo code provided" },
        { status: 400 }
      );
    }

    // Sanity promo codes — increment usageCount on redeem
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
