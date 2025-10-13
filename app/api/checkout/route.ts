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

    const line_items = cart.items.map((item: any) => ({
      price_data: {
        currency: "usd",
        unit_amount: Math.round(item.price * 100),
        product_data: {
          name: item.title,
          description:
            item.options?.map((opt: any) => `${opt.name} (+$${opt.price})`).join(", ") ||
            "Tech service booking",
        },
      },
      quantity: item.quantity || 1,
    }));

    const metadata: Record<string, string> = {
      sessionId,
      items: JSON.stringify(cart.items),
      contact: JSON.stringify(cart.contact || {}),
      address: JSON.stringify(cart.address || {}),
      schedule: JSON.stringify(cart.schedule || {}),
      ...(session?.user?.id ? { userId: session.user.id } : {}),
    };

    const stripeSession = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
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
