import { NextResponse } from "next/server";
import Stripe from "stripe";
import { connectDB } from "@/lib/mongodb";
import { Order } from "@/app/models/Order";
import { Notification } from "@/app/models/Notification";
import { Cart } from "@/app/models/Cart";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-08-27.basil",
});

// ================================================================
// Utility — safely get next payment date from subscription
// ================================================================
function getNextPaymentDate(sub: Stripe.Subscription): string | null {
  const s = sub as any;
  const end =
    s.current_period_end ??
    s.items?.data?.[0]?.current_period_end ??
    null;
  return end ? new Date(end * 1000).toISOString() : null;
}

// ================================================================
// Main Webhook Handler
// ================================================================
export async function POST(req: Request) {
  const sig = req.headers.get("stripe-signature");
  if (!sig)
    return new NextResponse("Missing Stripe signature", { status: 400 });

  const body = await req.text();

  try {
    const event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );

    await connectDB();

    // ================================================================
    // CHECKOUT SESSION COMPLETED (one-time payments only)
    // ================================================================
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;

      if (session.mode === "subscription") {
        return NextResponse.json({ received: true });
      }

      const existingOrder = await Order.findOne({
        stripeSessionId: session.id,
      });
      if (existingOrder) {
        return NextResponse.json({ received: true });
      }

      const userId = session.metadata?.userId || null;
      const email =
        session.metadata?.email ||
        session.customer_details?.email ||
        session.customer_email ||
        "unknown";

      const total = (session.amount_total || 0) / 100;
      const sessionId = session.metadata?.sessionId;
      const cart = sessionId ? await Cart.findOne({ sessionId }) : null;

      const order = await Order.create({
        stripeSessionId: session.id,
        userId,
        email,
        total,
        quantity: 1,
        status: "paid",
        isSubscription: false,
        items: cart?.items || [],
        contact: cart?.contact || {},
        address: cart?.address || {},
        schedule: cart?.schedule || {},
      });

      if (sessionId)
        await Cart.findOneAndUpdate({ sessionId }, { items: [] });

      if (userId) {
        await Notification.create({
          userId,
          message: `Your payment of $${order.total} has been completed successfully.`,
          type: "success",
          read: false,
        });
      }

      return NextResponse.json({ received: true });
    }

    // ================================================================
    // SUBSCRIPTION CREATED (fires immediately after checkout)
    // ================================================================
    if (event.type === "customer.subscription.created") {
      const sub = event.data.object as Stripe.Subscription;

      const nextPayment = getNextPaymentDate(sub);
      const firstItem = sub.items.data[0];
      const priceObj = firstItem?.price;
      const productObj = priceObj?.product as Stripe.Product | undefined;

      //  Pull plan name from product, price nickname, or checkout metadata fallback
      const planName =
        productObj?.name ||
        priceObj?.nickname ||
        (sub.metadata?.planName ?? "Unknown Plan");

      const planPrice = (priceObj?.unit_amount || 0) / 100;
      const planInterval = priceObj?.recurring?.interval || "month";
      const userId = (sub.metadata as any)?.userId || null;
      const email = (sub.metadata as any)?.email || "unknown";

      const existingOrder = await Order.findOne({
        stripeSubscriptionId: sub.id,
      });
      if (existingOrder) {
        return NextResponse.json({ received: true });
      }

      await Order.create({
        stripeSubscriptionId: sub.id,
        userId,
        email,
        total: planPrice,
        quantity: 1,
        status: sub.status,
        isSubscription: true,
        planName,
        planPrice,
        planInterval,
        nextPayment,
      });

      if (userId) {
        await Notification.create({
          userId,
          message: `Your ${planName} subscription ($${planPrice}/${planInterval}) has been created.`,
          type: "success",
          read: false,
        });
      }

      return NextResponse.json({ received: true });
    }

    // ================================================================
    // INVOICE PAYMENT SUCCEEDED (initial + renewals)
    // ================================================================
    if (event.type === "invoice.payment_succeeded") {
      const invoice = event.data.object as Stripe.Invoice & {
        subscription?: string;
      };

      if (!invoice.subscription) {
        return NextResponse.json({ received: true });
      }

      if (invoice.billing_reason === "subscription_create") {
        //  first subscription payment
        const sub = await stripe.subscriptions.retrieve(
          invoice.subscription,
          { expand: ["items.data.price.product"] }
        );

        const nextPayment = getNextPaymentDate(sub);
        const firstItem = sub.items.data[0];
        const priceObj = firstItem?.price;
        const productObj = priceObj?.product as Stripe.Product | undefined;

        const planName =
          productObj?.name ||
          priceObj?.nickname ||
          (sub.metadata?.planName ?? "Unknown Plan");

        const planPrice = (priceObj?.unit_amount || 0) / 100;
        const planInterval = priceObj?.recurring?.interval || "month";
        const email = invoice.customer_email || "unknown";
        const userId = (invoice.metadata as any)?.userId || null;

        const existingOrder = await Order.findOne({
          stripeSubscriptionId: sub.id,
        });
        if (existingOrder) {

          return NextResponse.json({ received: true });
        }

        await Order.create({
          stripeSubscriptionId: sub.id,
          userId,
          email,
          total: planPrice,
          quantity: 1,
          status: "paid",
          isSubscription: true,
          planName,
          planPrice,
          planInterval,
          nextPayment,
        });

        if (userId) {
          await Notification.create({
            userId,
            message: `Your ${planName} subscription ($${planPrice}/${planInterval}) has started successfully.`,
            type: "success",
            read: false,
          });
        }
      } else {
        //  renewal payment — update nextPayment only
        const sub = await stripe.subscriptions.retrieve(
          invoice.subscription
        );
        const nextPayment = getNextPaymentDate(sub);

        await Order.findOneAndUpdate(
          { stripeSubscriptionId: invoice.subscription },
          { nextPayment },
          { new: true }
        );

      }

      return NextResponse.json({ received: true });
    }

    // ================================================================
    // SUBSCRIPTION UPDATED (plan switch, interval change, etc.)
    // ================================================================
    if (event.type === "customer.subscription.updated") {
      const sub = event.data.object as Stripe.Subscription;
      const nextPayment = getNextPaymentDate(sub);

      await Order.findOneAndUpdate(
        { stripeSubscriptionId: sub.id },
        { nextPayment, status: sub.status },
        { new: true }
      );

      return NextResponse.json({ received: true });
    }

    // ================================================================
    // SUBSCRIPTION CANCELED / DELETED
    // ================================================================
    if (event.type === "customer.subscription.deleted") {
      const sub = event.data.object as Stripe.Subscription & {
        customer?: string;
      };
      const userId = (sub.metadata as any)?.userId || null;
      let email = "unknown";

      if (typeof sub.customer === "string") {
        try {
          const customer = (await stripe.customers.retrieve(
            sub.customer
          )) as Stripe.Customer;
          if (!("deleted" in customer) && "email" in customer) {
            email = (customer as any).email || "unknown";
          }
        } catch (e) {
          console.error("⚠️ Failed to fetch customer email:", e);
        }
      }

      await Order.findOneAndUpdate(
        { stripeSubscriptionId: sub.id },
        { status: "canceled" }
      );

      if (userId) {
        await Notification.create({
          userId,
          message: `Your subscription (${email}) has been canceled.`,
          type: "info",
          read: false,
        });
      }

      return NextResponse.json({ received: true });
    }

    // ================================================================
    // Catch-all: log other event types
    // ================================================================
    return NextResponse.json({ received: true });
  } catch (err: any) {
    console.error(" Webhook error:", err.message);
    return new NextResponse(`Webhook error: ${err.message}`, {
      status: 400,
    });
  }
}
