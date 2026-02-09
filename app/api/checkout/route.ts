import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { connectDB } from "@/lib/mongodb";
import { Cart } from "@/app/models/Cart";
import { getSessionId } from "@/lib/sessionId";
import { sanity } from "@/lib/sanity";

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

    const stripeSession = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      customer_email: email,
      line_items,
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
