import { NextResponse } from "next/server";
import Stripe from "stripe";
import { connectDB } from "@/lib/mongodb";
import { Order } from "@/app/models/Order";
import { Notification } from "@/app/models/Notification";
import { Cart } from "@/app/models/Cart";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-08-27.basil",
});

export async function POST(req: Request) {
  const sig = req.headers.get("stripe-signature")!;
  const body = await req.text();

  try {
    const event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );

    await connectDB();

    // Handle successful checkout
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;

      const isSubscription = session.mode === "subscription";
      const userId = session.metadata?.userId || null;
      const email =
        session.metadata?.email ||
        session.customer_details?.email ||
        session.customer_email ||
        "unknown";

      // Parse extra metadata if it exists
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

      //Create Order document in MongoDB
      const order = await Order.create({
        stripeSessionId: session.id,
        userId,
        email,
        items: normalizedItems,
        total,
        quantity,
        contact,
        address,
        schedule,
        status: "paid",
        // Add these for subscription tracking
        planName: session.metadata?.planName || null,
        planPrice: session.metadata?.planPrice || null,
        planInterval: session.metadata?.planInterval || null,
      });

      // Empty cart only for one-time purchases
      if (session.metadata?.sessionId && !isSubscription) {
        await Cart.findOneAndUpdate(
          { sessionId: session.metadata.sessionId },
          { items: [] }
        );
      }

      // Notify user
      if (userId) {
        await Notification.create({
          userId,
          message: isSubscription
            ? `Your ${session.metadata?.planName || "subscription"} ($${session.metadata?.planPrice}/${session.metadata?.planInterval || "month"}) has started successfully.`
            : `Your order has been placed for ${normalizedItems.map((i) => i.title).join(", ")}.`,
          type: "success",
          read: false,
        });
      }
    }

    // Handle subscription cancellation
    if (event.type === "customer.subscription.deleted") {
      const sub = event.data.object as Stripe.Subscription;

      let customerEmail = "unknown";
      if (typeof sub.customer === "string") {
        try {
          const customer = await stripe.customers.retrieve(sub.customer);
          if (!customer.deleted && "email" in customer) {
            customerEmail = customer.email || "unknown";
          }
        } catch (e) {
          console.error("Failed to fetch customer email:", e);
        }
      }

      await Notification.create({
        userId: null,
        message: `Your subscription (${customerEmail}) has been canceled.`,
        type: "warning",
        read: false,
      });
    }

    return NextResponse.json({ received: true });
  } catch (err: any) {
    console.error("Webhook error:", err.message);
    return new NextResponse(`Webhook error: ${err.message}`, { status: 400 });
  }
}
