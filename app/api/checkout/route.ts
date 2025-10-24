import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { connectDB } from "@/lib/mongodb";
import { Cart } from "@/app/models/Cart";
import { getSessionId } from "@/lib/sessionId";
import { sanity } from "@/lib/sanity";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-08-27.basil",
});

export async function POST(req: Request) {
  try {
    // =====================================================
    // PARSE BODY
    // =====================================================
    let body: any = {};
    try {
      body = await req.json();
    } catch {
      body = {};
    }

    const { planSlug, interval, returnUrl } = body;

    // =====================================================
    // PLAN SUBSCRIPTION CHECKOUT
    // =====================================================
    if (planSlug) {
      const plan = await sanity.fetch(
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

      // Ensure product exists
      const productId = plan.stripeProductId;
      if (!productId) {
        return NextResponse.json(
          { error: "Missing Stripe product ID for this plan" },
          { status: 400 }
        );
      }

      // Determine billing interval
      const intervalKey = interval === "year" ? "year" : "month";

      // Fetch all prices linked to this product
      const prices = await stripe.prices.list({
        product: productId,
        limit: 100,
      });

      // Find most recent active recurring price for this interval
      const activePrice = prices.data
        .filter((p) => p.active && p.recurring?.interval === intervalKey)
        .sort((a, b) => (b.created ?? 0) - (a.created ?? 0))[0];

      if (!activePrice) {
        console.error(` No active ${intervalKey} price found for product ${productId}`);
        return NextResponse.json(
          { error: `No active ${intervalKey} price found for this product.` },
          { status: 400 }
        );
      }

      console.log(` Using active price ${activePrice.id} for ${plan.title}`);

      // Create Checkout session
      const stripeSession = await stripe.checkout.sessions.create({
        mode: "subscription",
        payment_method_types: ["card"],
        line_items: [{ price: activePrice.id, quantity: 1 }],
        success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success`,
        cancel_url: returnUrl || `${process.env.NEXT_PUBLIC_BASE_URL}/plans`,
        customer_email: sessionAuth?.user?.email || undefined,
        metadata: {
          type: "plan",
          planSlug,
          planName: plan.title,
          planInterval: intervalKey,
          userId: sessionAuth?.user?.id || "",
          email: sessionAuth?.user?.email || "",
        },
        subscription_data: {
          metadata: {
            userId: sessionAuth?.user?.id || "",
            email: sessionAuth?.user?.email || "",
            planSlug,
            planName: plan.title,
            planInterval: intervalKey,
          },
        },
      });

      return NextResponse.json({ url: stripeSession.url });
    }

    // =====================================================
    // CART CHECKOUT (ONE-TIME PAYMENT)
    // =====================================================
    const session = await getServerSession(authOptions);
    await connectDB();
    const sessionId = await getSessionId();

    const cart = await Cart.findOne({ sessionId });
    if (!cart || !cart.items.length) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    const email = session?.user?.email || cart.contact?.email;
    if (!email) {
      return NextResponse.json(
        { error: "Missing email address for checkout" },
        { status: 400 }
      );
    }

    // Refresh item prices from Sanity
    const updatedItems = await Promise.all(
      cart.items.map(async (item: any) => {
        const sanityService = await sanity.fetch(
          `*[_type == "service" && slug.current == $slug][0]{ price }`,
          { slug: item.slug }
        );

        const realBase = sanityService?.price ?? item.basePrice ?? 0;
        const optionsTotal =
          item.options?.reduce(
            (sum: number, opt: { price?: number }) => sum + (opt.price || 0),
            0
          ) ?? 0;

        return {
          slug: item.slug,
          title: item.title,
          basePrice: realBase,
          price: realBase + optionsTotal,
          options: item.options || [],
          quantity: item.quantity || 1,
          id: item.id,
        };
      })
    );

    cart.items = updatedItems;
    await cart.save();

    // Build Stripe line items
    const line_items = updatedItems.map((item: any) => {
      const name =
        typeof item.title === "string" && item.title.trim()
          ? item.title.trim()
          : item.slug || "Tech Service";

      const description =
        item.options?.length
          ? item.options.map((opt: any) => `${opt.name} (+$${opt.price})`).join(", ")
          : "Tech service booking";

      return {
        price_data: {
          currency: "usd",
          unit_amount: Math.round((item.price || 0) * 100),
          product_data: { name, description },
        },
        quantity: item.quantity || 1,
      };
    });

    // Metadata for webhook
    const metadata: Record<string, string> = {
      sessionId,
      items: JSON.stringify(
        updatedItems.map((i) => ({
          slug: i.slug || "unknown",
          title: i.title || "Tech Service",
          basePrice: i.basePrice,
          price: i.price,
          quantity: i.quantity || 1,
          ...(i.options?.length ? { options: i.options } : {}),
        }))
      ),
      contact: JSON.stringify({
        name: cart.contact?.name,
        email: cart.contact?.email,
        phone: cart.contact?.phone,
      }),
      address: JSON.stringify({
        city: cart.address?.city,
        state: cart.address?.state,
      }),
      schedule: JSON.stringify({
        date: cart.schedule?.date,
        time: cart.schedule?.time,
      }),
      email,
      ...(session?.user?.id ? { userId: session.user.id } : {}),
    };

    // Create one-time Checkout session
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
    return NextResponse.json({ error: "Checkout failed" }, { status: 500 });
  }
}
