import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { connectDB } from "@/lib/mongodb";
import { Cart } from "@/app/models/Cart";
import { getSessionId } from "@/lib/sessionId";

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

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "You must be logged in to checkout" },
        { status: 401 }
      );
    }

    const line_items = cart.items.map((item: any) => ({
      price_data: {
        currency: "usd",
        unit_amount: Math.round(item.price * 100),
        product_data: {
          name: item.title,
          description:
            item.options
              ?.map((opt: any) => `${opt.name} (+$${opt.price})`)
              .join(", ") || "Tech service booking",
        },
      },
      quantity: item.quantity || 1,
    }));

    const metadata: Record<string, string> = {
      sessionId,
      items: JSON.stringify(
        cart.items.map((i: any) => ({
          slug: i.slug,
          title: i.title,
          basePrice: i.basePrice ?? i.price,
          price: i.price,
          options: i.options || [],
          quantity: i.quantity || 1,
        }))
      ),
      contact: JSON.stringify(cart.contact || {}),
      address: JSON.stringify(cart.address || {}),
      schedule: JSON.stringify(cart.schedule || {}),
      email: session.user.email,
      ...(session.user.id ? { userId: session.user.id } : {}),
    };

    const stripeSession = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      customer_email: session.user.email,
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
