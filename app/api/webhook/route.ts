import { NextResponse } from "next/server";
import Stripe from "stripe";
import { connectDB } from "@/lib/mongodb";
import { Order } from "@/app/models/Order";
import { Notification } from "@/app/models/Notification";
import { Cart } from "@/app/models/Cart";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  const sig = req.headers.get("stripe-signature")!;
  const body = await req.text();

  try {
    const event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      await connectDB();

      let items: any[] = [];
      let contact: any = {};
      let address: any = {};
      let schedule: any = {};

      try {
        if (session.metadata?.items)
          items = JSON.parse(session.metadata.items);
        if (session.metadata?.contact)
          contact = JSON.parse(session.metadata.contact);
        if (session.metadata?.address)
          address = JSON.parse(session.metadata.address);
        if (session.metadata?.schedule)
          schedule = JSON.parse(session.metadata.schedule);
      } catch (err) {
        console.error("Metadata parse error:", err);
      }

      const email =
        session.metadata?.email ||
        session.customer_details?.email ||
        session.customer_email ||
        "unknown";


      const normalizedItems = items.map((i: any) => ({
        slug: i.slug,
        title: i.title,
        basePrice: i.basePrice ?? i.price,
        price: i.price,
        options: i.options || [],
        quantity: i.quantity || 1,
      }));

      const total = (session.amount_total || 0) / 100;
      const quantity = normalizedItems.reduce(
        (sum, i) => sum + (i.quantity || 1),
        0
      );

      const order = await Order.create({
        stripeSessionId: session.id,
        email,
        items: normalizedItems,
        total,
        quantity,
        contact,
        address,
        schedule,
        status: "paid",
      });

      if (session.metadata?.sessionId) {
        await Cart.findOneAndUpdate(
          { sessionId: session.metadata.sessionId },
          { items: [] }
        );
      }

      if (session.metadata?.userId) {
        await Notification.create({
          userId: session.metadata.userId,
          message: `Your order has been placed for ${normalizedItems
            .map((i) => i.title)
            .join(", ")}`,
          type: "success",
          read: false,
        });
      }
    }

    return NextResponse.json({ received: true });
  } catch (err: any) {
    console.error("Webhook error:", err.message);
    return new NextResponse(`Webhook error: ${err.message}`, { status: 400 });
  }
}
