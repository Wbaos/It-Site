import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { connectDB } from "@/lib/mongodb";
import { Cart } from "@/app/models/Cart";
import { getSessionId } from "@/lib/sessionId";
import { sanity } from "@/lib/sanity";
import { DiscountLead } from "@/app/models/DiscountLead";

/* -------------------------------------------
   TYPES
------------------------------------------- */
type CheckoutBody = {
  planSlug?: string;
  interval?: "month" | "year";
  returnUrl?: string;
};

type CartOption = {
  name?: string;
  price?: number;
};

type CartItem = {
  id: string;
  slug: string;
  title: string;
  basePrice?: number;
  price?: number;
  options?: CartOption[];
  quantity?: number;
};

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-08-27.basil",
});

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

async function validatePromoCode(params: { code: string; email?: string }) {
  const normalized = normalizeCode(params.code);
  const emailLower = String(params.email || "").trim().toLowerCase();

  // 1) Shared popup one-time-per-customer code (validated by email)
  const popupCode = getDiscountPopupCode();
  if (normalized === popupCode) {
    if (!emailLower) return { ok: false as const, error: "Missing email" };

    const lead = await DiscountLead.findOne({
      emailLower,
      discountCode: popupCode,
    })
      .select({ redeemedAt: 1 })
      .lean();

    if (!lead) return { ok: false as const, error: "Promo code requires signup" };
    if ((lead as any).redeemedAt) return { ok: false as const, error: "This code has already been used" };

    return {
      ok: true as const,
      discountType: "percentage" as const,
      value: getDiscountPopupPercent(),
      source: "discount-lead" as const,
    };
  }

  // 2) Sanity promo codes (validate only; usageCount increments in webhook)
  const promo = await sanity.fetch(
    `*[_type == "promoCode" && code == $code][0]`,
    { code: normalized }
  );

  if (!promo) return { ok: false as const, error: "Invalid code" };
  if (!promo.active) return { ok: false as const, error: "Code is not active" };
  if (promo.expires && new Date(promo.expires) < new Date()) {
    return { ok: false as const, error: "Code has expired" };
  }

  return {
    ok: true as const,
    discountType: promo.discountType as "percentage" | "flat",
    value: promo.value as number,
    source: "sanity" as const,
  };
}

/* -------------------------------------------
   POST /api/checkout
------------------------------------------- */
export async function POST(req: Request) {
  try {
    /* -------------------------------------------
       PARSE BODY (SAFE)
    ------------------------------------------- */
    let body: CheckoutBody = {};
    try {
      body = (await req.json()) as CheckoutBody;
    } catch {
      body = {};
    }

    const { planSlug, interval, returnUrl } = body;

    /* -------------------------------------------
       PLAN SUBSCRIPTION CHECKOUT
    ------------------------------------------- */
    if (planSlug) {
      const plan = await sanity.fetch<{
        title: string;
        price?: number;
        annualPrice?: number;
        stripeProductId?: string;
      }>(
        `*[_type == "pricingPlan" && slug.current == $slug][0]{
          title,
          price,
          annualPrice,
          stripeProductId
        }`,
        { slug: planSlug }
      );

      if (!plan) {
        return NextResponse.json({ error: "Plan not found" }, { status: 404 });
      }

      const sessionAuth = await getServerSession(authOptions);
      const productId = plan.stripeProductId;

      if (!productId) {
        return NextResponse.json(
          { error: "Missing Stripe product ID for this plan" },
          { status: 400 }
        );
      }

      const intervalKey: "month" | "year" =
        interval === "year" ? "year" : "month";

      const prices = await stripe.prices.list({
        product: productId,
        limit: 100,
      });

      const activePrice = prices.data
        .filter(
          (p) => p.active && p.recurring?.interval === intervalKey
        )
        .sort((a, b) => (b.created ?? 0) - (a.created ?? 0))[0];

      if (!activePrice) {
        return NextResponse.json(
          { error: `No active ${intervalKey} price found.` },
          { status: 400 }
        );
      }

      const stripeSession = await stripe.checkout.sessions.create({
        mode: "subscription",
        payment_method_types: ["card"],
        line_items: [{ price: activePrice.id, quantity: 1 }],
        success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success`,
        cancel_url:
          returnUrl || `${process.env.NEXT_PUBLIC_BASE_URL}/plans`,
        customer_email: sessionAuth?.user?.email ?? undefined,
        metadata: {
          type: "plan",
          planSlug,
          planName: plan.title,
          planInterval: intervalKey,
          userId: sessionAuth?.user?.id ?? "",
          email: sessionAuth?.user?.email ?? "",
        },
        subscription_data: {
          metadata: {
            userId: sessionAuth?.user?.id ?? "",
            email: sessionAuth?.user?.email ?? "",
            planSlug,
            planName: plan.title,
            planInterval: intervalKey,
          },
        },
      });

      return NextResponse.json({ url: stripeSession.url });
    }

    /* -------------------------------------------
       CART CHECKOUT (ONE-TIME)
    ------------------------------------------- */
    const session = await getServerSession(authOptions);
    await connectDB();
    const sessionId = await getSessionId();

    const cart = await Cart.findOne({ sessionId });
    if (!cart || !cart.items.length) {
      return NextResponse.json(
        { error: "Cart is empty" },
        { status: 400 }
      );
    }

    const email = session?.user?.email || cart.contact?.email;
    if (!email) {
      return NextResponse.json(
        { error: "Missing email address for checkout" },
        { status: 400 }
      );
    }

    /* -------------------------------------------
       PROMO (REDEEM ON CHECKOUT)
    ------------------------------------------- */
    let stripeDiscounts:
      | Stripe.Checkout.SessionCreateParams.Discount[]
      | undefined;
    let appliedPromo: { code: string; discountType: "percentage" | "flat"; value: number } | null = null;

    const promoCode = normalizeCode(String((cart as any)?.promo?.code || ""));
    if (promoCode) {
      const validated = await validatePromoCode({ code: promoCode, email });
      if (!validated.ok) {
        return NextResponse.json(
          { error: validated.error || "Promo code is invalid" },
          { status: 400 }
        );
      }

      appliedPromo = {
        code: promoCode,
        discountType: validated.discountType,
        value: validated.value,
      };

      const coupon =
        validated.discountType === "flat"
          ? await stripe.coupons.create({
              amount_off: Math.max(0, Math.round((validated.value || 0) * 100)),
              currency: "usd",
              duration: "once",
            })
          : await stripe.coupons.create({
              percent_off: Math.min(100, Math.max(0, validated.value || 0)),
              duration: "once",
            });

      stripeDiscounts = [{ coupon: coupon.id }];
    }

    /* -------------------------------------------
       REFRESH PRICES FROM SANITY
    ------------------------------------------- */
    const updatedItems: CartItem[] = await Promise.all(
      cart.items.map(async (item: CartItem) => {
        const sanityService = await sanity.fetch<{ price?: number }>(
          `*[_type == "service" && slug.current == $slug][0]{ price }`,
          { slug: item.slug }
        );

        const realBase = sanityService?.price ?? item.basePrice ?? 0;
        const optionsTotal =
          item.options?.reduce(
            (sum, opt) => sum + (opt.price ?? 0),
            0
          ) ?? 0;

        return {
          id: item.id,
          slug: item.slug,
          title: item.title,
          basePrice: realBase,
          price: realBase + optionsTotal,
          options: item.options ?? [],
          quantity: item.quantity ?? 1,
        };
      })
    );

    cart.items = updatedItems;
    await cart.save();

    /* -------------------------------------------
       STRIPE LINE ITEMS
    ------------------------------------------- */
    const getPaidAddons = (options: CartOption[] | undefined) => {
      const paidAddons: { name: string; price: number }[] = [];

      for (const opt of options ?? []) {
        const name = (opt.name ?? "").trim();
        if (!name) continue;

        const price = typeof opt.price === "number" ? opt.price : 0;
        if (price > 0) paidAddons.push({ name, price });
      }

      return paidAddons;
    };

    const line_items = updatedItems.flatMap((item) => {
      const serviceName = item.title?.trim() || item.slug || "Tech Service";
      const quantity = item.quantity ?? 1;

      const paidAddons = getPaidAddons(item.options);

      const baseUnitAmount = Math.round(
        ((item.basePrice ?? item.price ?? 0) as number) * 100
      );

      const baseLineItem = {
        price_data: {
          currency: "usd",
          unit_amount: baseUnitAmount,
          product_data: {
            name: serviceName,
          },
        },
        quantity,
      };

      const addonLineItems = paidAddons.map((addon) => ({
        price_data: {
          currency: "usd",
          unit_amount: Math.round(addon.price * 100),
          product_data: {
            name: `• ${addon.name}`,
          },
        },
        quantity,
      }));

      return [baseLineItem, ...addonLineItems];
    });

    const metadata: Record<string, string> = {
      sessionId,
      itemSlugs: updatedItems.map((i) => i.slug).join(","),
      itemCount: updatedItems.length.toString(),
      contactName: cart.contact?.name ?? "",
      contactEmail: cart.contact?.email ?? "",
      contactPhone: cart.contact?.phone ?? "",
      city: cart.address?.city ?? "",
      state: cart.address?.state ?? "",
      date: cart.schedule?.date ?? "",
      time: cart.schedule?.time ?? "",
      email,
      ...(session?.user?.id ? { userId: session.user.id } : {}),
    };

    if (appliedPromo) {
      metadata.promoCode = appliedPromo.code;
      metadata.promoType = appliedPromo.discountType;
      metadata.promoValue = String(appliedPromo.value);
      metadata.promoSource = promoCode === getDiscountPopupCode() ? "discount-lead" : "sanity";
    }

    const stripeSession = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      customer_email: email,
      line_items,
      ...(stripeDiscounts ? { discounts: stripeDiscounts } : {}),
      metadata,
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/cart`,
    });

    return NextResponse.json({ url: stripeSession.url });
  } catch (err) {
    console.error("Checkout error:", err);
    return NextResponse.json(
      { error: "Checkout failed" },
      { status: 500 }
    );
  }
}
