// app/api/checkout/route.ts
import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  try {
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

      const description =
        item.options && item.options.length > 0
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

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      automatic_tax: { enabled: true },
      line_items,
      metadata: {
        items: JSON.stringify(items),
      },
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/cart`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error(" Checkout error:", err.message);
    return NextResponse.json({ error: "Checkout failed" }, { status: 500 });
  }
}
