import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { connectDB } from "@/lib/mongodb";
import { Cart } from "@/app/models/Cart";
import { getSessionId } from "@/lib/sessionId";
import { sanity } from "@/lib/sanity";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  try {
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

    const metadata: Record<string, string> = {
      sessionId,
      items: JSON.stringify(
        updatedItems.map((i) => ({
          slug: i.slug || "unknown",
          title: i.title || "Tech Service",
          basePrice: i.basePrice,
          price: i.price, quantity: i.quantity || 1,
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
