import { NextResponse } from "next/server";
import Stripe from "stripe";
import { connectDB } from "@/lib/mongodb";
import { Order } from "@/app/models/Order";
import { Notification } from "@/app/models/Notification";
import { Cart } from "@/app/models/Cart";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-08-27.basil",
});

// Utility to get the next payment date safely
function getNextPaymentDate(sub: Stripe.Subscription): string | null {
  const s = sub as any;
  const end = s.current_period_end ?? s.items?.data?.[0]?.current_period_end ?? null;
  return end ? new Date(end * 1000).toISOString() : null;
}

export async function POST(req: Request) {
  const sig = req.headers.get("stripe-signature");
  if (!sig) return new NextResponse("Missing Stripe signature", { status: 400 });

  const body = await req.text();

  try {
    const event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );

    await connectDB();

    // ================================================================
    // CHECKOUT SESSION COMPLETED
    // ================================================================
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const isSubscription = session.mode === "subscription";

      const userId = session.metadata?.userId || null;
      const email =
        session.metadata?.email ||
        session.customer_details?.email ||
        session.customer_email ||
        "unknown";

      const total = (session.amount_total || 0) / 100;

      let orderData: any = {
        stripeSessionId: session.id,
        stripeSubscriptionId: session.subscription || null,
        userId,
        email,
        total,
        quantity: 1,
        status: "paid",
        isSubscription,
      };

      if (isSubscription) {
        // Subscriptions → include plan data
        const planName = session.metadata?.planName || null;
        const planPrice = session.metadata?.planPrice || null;
        const planInterval = session.metadata?.planInterval || null;
        let nextPayment: string | null = null;

        // Try to fetch next payment from Stripe
        if (session.subscription) {
          try {
            const sub = (await stripe.subscriptions.retrieve(
              session.subscription as string
            )) as Stripe.Subscription;
            nextPayment = getNextPaymentDate(sub);
          } catch (err) {
            console.error("⚠️ Could not fetch subscription:", err);
          }
        }

        Object.assign(orderData, {
          planName,
          planPrice,
          planInterval,
          nextPayment,
          items: [],
        });
      } else {
        // Regular service → attach cart items + schedule if any
        const sessionId = session.metadata?.sessionId;
        const cart = sessionId
          ? await Cart.findOne({ sessionId })
          : null;

        Object.assign(orderData, {
          items: cart?.items || [],
          contact: cart?.contact || {},
          address: cart?.address || {},
          schedule: cart?.schedule || {},
          planName: null,
          planPrice: null,
          planInterval: null,
          nextPayment: null,
        });

        if (sessionId) await Cart.findOneAndUpdate({ sessionId }, { items: [] });
      }

      const order = await Order.create(orderData);

      if (userId) {
        await Notification.create({
          userId,
          message: isSubscription
            ? `Your ${order.planName || "subscription"} ($${order.planPrice}/${order.planInterval}) has started successfully.`
            : `Your payment of $${order.total} has been completed successfully.`,
          type: "success",
          read: false,
        });
      }
    }

    // ================================================================
    //  SUBSCRIPTION CREATED
    // ================================================================
    if (event.type === "customer.subscription.created") {
      const sub = event.data.object as Stripe.Subscription;
      const nextPayment = getNextPaymentDate(sub);
      const updated = await Order.findOneAndUpdate(
        { stripeSubscriptionId: sub.id },
        { nextPayment },
        { new: true }
      );

    }

    // ================================================================
    //  INVOICE PAYMENT SUCCEEDED
    // ================================================================
    if (event.type === "invoice.payment_succeeded") {
      const invoice = event.data.object as Stripe.Invoice & { subscription?: string };

      if (invoice.subscription) {
        const sub = (await stripe.subscriptions.retrieve(invoice.subscription, {
          expand: ["items.data.price.product"],
        })) as Stripe.Subscription;

        const nextPayment = getNextPaymentDate(sub);
        const firstItem = sub.items.data[0];
        const priceObj = firstItem?.price;
        const productObj = priceObj?.product as Stripe.Product | undefined;

        const planName = productObj?.name || priceObj?.nickname || "Unknown Plan";
        const planPrice = (priceObj?.unit_amount || 0) / 100;
        const planInterval = priceObj?.recurring?.interval || "month";

        await Order.findOneAndUpdate(
          { stripeSubscriptionId: invoice.subscription },
          {
            nextPayment,
            planName,
            planPrice: planPrice.toString(),
            planInterval,
          },
          { new: true }
        );
      }
    }

    // ================================================================
    //  SUBSCRIPTION UPDATED
    // ================================================================
    if (event.type === "customer.subscription.updated") {
      const sub = event.data.object as Stripe.Subscription;
      const nextPayment = getNextPaymentDate(sub);
      await Order.findOneAndUpdate(
        { stripeSubscriptionId: sub.id },
        { nextPayment, status: sub.status },
        { new: true }
      );
    }

    // ================================================================
    //  SUBSCRIPTION DELETED (CANCELED)
    // ================================================================
    if (event.type === "customer.subscription.deleted") {
      const sub = event.data.object as Stripe.Subscription & { customer?: string };
      const userId = (sub.metadata as any)?.userId || null;
      let email = "unknown";

      if (typeof sub.customer === "string") {
        try {
          const customer = (await stripe.customers.retrieve(sub.customer)) as Stripe.Customer;
          if (!("deleted" in customer) && "email" in customer)
            email = (customer as any).email || "unknown";
        } catch (e) {
          console.error(" Failed to fetch customer email:", e);
        }
      }

      if (userId) {
        await Notification.create({
          userId,
          message: `Your subscription (${email}) has been canceled.`,
          type: "info",
          read: false,
        });

        await Order.findOneAndUpdate(
          { stripeSubscriptionId: sub.id },
          { status: "canceled" }
        );
      }
    }

    return NextResponse.json({ received: true });
  } catch (err: any) {
    console.error(" Webhook error:", err.message);
    return new NextResponse(`Webhook error: ${err.message}`, { status: 400 });
  }
}
