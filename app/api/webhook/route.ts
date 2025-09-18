// app/api/webhook/route.ts
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { connectDB } from "@/lib/mongodb";
import { Order } from "@/app/models/Order";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  const sig = req.headers.get("stripe-signature")!;
  const body = await req.text();

  try {
    console.log("🔥 Webhook hit");

    const event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );

    console.log("👉 Event type:", event.type);

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      console.log("✅ Checkout session completed:", session.id);

      await connectDB();

      let items: any[] = [];
      if (session.metadata?.items) {
        try {
          items = JSON.parse(session.metadata.items);
          console.log("🛒 Parsed items:", items);
        } catch (err) {
          console.error(" Failed to parse metadata.items:", err);
        }
      }

      const email =
        session.customer_details?.email || session.customer_email || "unknown";

      const order = await Order.create({
        stripeSessionId: session.id,
        email,
        items,
        total: (session.amount_total || 0) / 100,
        quantity: items.reduce((sum, i) => sum + (i.quantity || 1), 0),
        status: session.payment_status || "paid",
      });

      console.log("✅ Order saved to Mongo:", order._id);
    }

    return NextResponse.json({ received: true });
  } catch (err: any) {
    console.error(" Webhook error:", err.message);
    return new NextResponse(`Webhook error: ${err.message}`, { status: 400 });
  }
}
