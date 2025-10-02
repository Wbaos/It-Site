// app/api/checkout/route.ts
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  try {
    // Try to get user session (may be null if guest)
    const session = await getServerSession(authOptions);

    const { items } = await req.json();

    if (!items || !Array.isArray(items)) {
      return NextResponse.json(
        { error: "Invalid cart items" },
        { status: 400 }
      );
    }

    const line_items = items.map((item: any) => {
      const optionsTotal =
        item.options?.reduce(
          (sum: number, opt: any) => sum + (opt.price || 0),
          0
        ) || 0;

      const unitAmount = Math.round((item.price + optionsTotal) * 100);

      const description = item.options?.length
        ? item.options
            .map((opt: any) => `${opt.name} (+$${opt.price})`)
            .join(", ")
        : undefined;

      return {
        price_data: {
          currency: "usd",
          unit_amount: unitAmount,
          product_data: {
            name: item.title,
            ...(description ? { description } : {}),
          },
        },
        quantity: item.quantity || 1,
      };
    });

    // Only include userId in metadata if user is logged in
    const stripeSession = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      automatic_tax: { enabled: true },
      line_items,
      metadata: {
        items: JSON.stringify(items),
        ...(session?.user?.id ? { userId: session.user.id } : {}),
      },
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/cart`,
    });

    return NextResponse.json({ url: stripeSession.url });
  } catch (err: any) {
    console.error("Checkout error:", err.message);
    return NextResponse.json({ error: "Checkout failed" }, { status: 500 });
  }
}
