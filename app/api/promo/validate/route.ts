import { NextResponse } from "next/server";
import { sanity } from "@/lib/sanity";
import { connectDB } from "@/lib/mongodb";
import { Order } from "@/app/models/Order";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

function normalizeCode(code: string): string {
  return String(code || "").trim().toUpperCase();
}

function normalizeEmail(email: string): string {
  return String(email || "").trim().toLowerCase();
}

export async function POST(req: Request) {
  try {
    const body = (await req.json().catch(() => ({}))) as { code?: unknown; email?: unknown };
    const code = String(body?.code ?? "");
    const emailFromBody = String(body?.email ?? "").trim();

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

    // One-time-per-customer guard (only when we can identify the customer)
    try {
      const session = await getServerSession(authOptions);
      const userId = String(session?.user?.id || "").trim();
      const emailLower = normalizeEmail(session?.user?.email || emailFromBody || "");

      if (userId || emailLower) {
        await connectDB();
        const queryBase = {
          promoCode: normalized,
          isSubscription: false,
          deleted: { $ne: true },
          status: { $in: ["paid", "refunded"] },
        } as const;

        const alreadyUsed = userId
          ? Boolean(await Order.exists({ ...queryBase, userId }))
          : Boolean(await Order.exists({ ...queryBase, emailLower }));

        if (alreadyUsed) {
          return NextResponse.json({
            valid: false,
            code: "PROMO_ALREADY_USED",
            error: "This promo code has already been used and can’t be applied again.",
          });
        }
      }
    } catch {
      // If session/DB lookup fails, fall back to just validating the code.
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
