export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import Stripe from "stripe";
import { connectDB } from "@/lib/mongodb";
import { Order } from "@/app/models/Order";
import { Notification } from "@/app/models/Notification";
import { Cart } from "@/app/models/Cart";
import { User } from "@/app/models/User"; // ⭐ REQUIRED
import { logger } from "@/lib/logger";
import { syncCustomerToMailchimp } from "@/lib/mailchimp";

function getMailchimpEnabled(): boolean {
  return Boolean(
    process.env.MAILCHIMP_API_KEY &&
      process.env.MAILCHIMP_SERVER_PREFIX &&
      process.env.MAILCHIMP_AUDIENCE_ID
  );
}

function splitName(fullName?: string | null): {
  firstName?: string;
  lastName?: string;
} {
  const name = String(fullName ?? "").trim();
  if (!name) return {};
  const parts = name.split(/\s+/);
  return {
    firstName: parts[0] || undefined,
    lastName: parts.length > 1 ? parts.slice(1).join(" ") : undefined,
  };
}

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
    // CHECKOUT SESSION COMPLETED (one-time payments)
    // ================================================================
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;

      // Ignore subscriptions here — handled separately
      if (session.mode === "subscription") {
        return NextResponse.json({ received: true });
      }

      // Skip if order already exists
      const existingOrder = await Order.findOne({ stripeSessionId: session.id });
      if (existingOrder) return NextResponse.json({ received: true });

      const userId = session.metadata?.userId || null;
      const email =
        session.metadata?.email ||
        session.customer_details?.email ||
        session.customer_email ||
        "unknown";

      const total = (session.amount_total || 0) / 100;
      const sessionId = session.metadata?.sessionId;
      const cart = sessionId ? await Cart.findOne({ sessionId }) : null;

      // Create order

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

      // Clear cart
      if (sessionId) {
        await Cart.findOneAndUpdate({ sessionId }, { items: [] });
      }

      // Notification
      if (userId) {
        await Notification.create({
          userId,
          message: `Your payment of $${order.total} has been completed.`,
          type: "success",
          read: false,
        });
      }

      // Best-effort Mailchimp sync (do not fail webhook on marketing sync)
      try {
        if (getMailchimpEnabled() && email && email !== "unknown") {
          const contactName = session.metadata?.contactName || cart?.contact?.name;
          const { firstName, lastName } = splitName(contactName);
          const phone = session.metadata?.contactPhone || cart?.contact?.phone;
          const serviceType =
            (cart?.items?.[0] as any)?.title ||
            session.metadata?.itemSlugs?.split(",")?.[0] ||
            undefined;

          await syncCustomerToMailchimp({
            email,
            firstName,
            lastName,
            phone: phone ? String(phone) : undefined,
            serviceType: serviceType ? String(serviceType) : undefined,
          });
        }
      } catch (err) {
        logger.error("Mailchimp sync failed during checkout webhook", err, {
          email,
          source: "webhook.checkout.session.completed",
          stripeSessionId: session.id,
        });
      }

      return NextResponse.json({ received: true });
    }

   // ================================================================
    // SUBSCRIPTION CREATED
    // ================================================================
    if (event.type === "customer.subscription.created") {
      const sub = event.data.object as Stripe.Subscription;

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
      const userId = (sub.metadata as any)?.userId || null;
      const email = (sub.metadata as any)?.email || "unknown";

      /*  SAVE STRIPE CUSTOMER ID TO USER  */
      if (sub.customer && userId) {
        try {
          await User.findByIdAndUpdate(
            userId,
            { stripeCustomerId: sub.customer as string },
            { new: true }
          );
          logger.info("Saved stripeCustomerId to user", { customerId: sub.customer });
        } catch (err) {
          logger.error("Failed to save stripeCustomerId", err);
        }
      }

      // Skip duplicates
      const existingOrder = await Order.findOne({
        stripeSubscriptionId: sub.id,
      });
      if (existingOrder) return NextResponse.json({ received: true });

      // Create order
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
          message: `Your ${planName} subscription ($${planPrice}/${planInterval}) has started.`,
          type: "success",
          read: false,
        });
      }

      // Best-effort Mailchimp sync for subscriptions
      try {
        if (getMailchimpEnabled() && email && email !== "unknown") {
          await syncCustomerToMailchimp({
            email,
            serviceType: planName,
          });
        }
      } catch (err) {
        logger.error("Mailchimp sync failed during subscription webhook", err, {
          email,
          source: "webhook.customer.subscription.created",
          stripeSubscriptionId: sub.id,
        });
      }

      return NextResponse.json({ received: true });
    }

    // ================================================================
    // INVOICE PAYMENT SUCCEEDED (renewals)
    // ================================================================
    if (event.type === "invoice.payment_succeeded") {
      const invoice = event.data.object as Stripe.Invoice & {
        subscription?: string;
      };

      if (!invoice.subscription)
        return NextResponse.json({ received: true });

      // If new subscription invoice
      if (invoice.billing_reason === "subscription_create") {
        const sub = await stripe.subscriptions.retrieve(invoice.subscription, {
          expand: ["items.data.price.product"],
        });

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

        /*  SAVE CUSTOMER ID IN CREATION INVOICE TOO  */
        if (sub.customer && userId) {
          try {
            await User.findByIdAndUpdate(
              userId,
              { stripeCustomerId: sub.customer as string },
              { new: true }
            );
            logger.info("Saved stripeCustomerId from invoice to user", { customerId: sub.customer });
          } catch (err) {
            logger.error("Failed to save stripeCustomerId from invoice", err);
          }
        }

        const existingOrder = await Order.findOne({
          stripeSubscriptionId: sub.id,
        });
        if (existingOrder) return NextResponse.json({ received: true });

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
            message: `Your ${planName} subscription has started.`,
            type: "success",
            read: false,
          });
        }
      } else {
        const sub = await stripe.subscriptions.retrieve(invoice.subscription);
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
    // SUBSCRIPTION UPDATED
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
          if (!("deleted" in customer)) {
            email = (customer as any).email || "unknown";
          }
        } catch {
          logger.warn("Could not fetch customer email for deleted subscription");
        }
      }

      await Order.findOneAndUpdate(
        { stripeSubscriptionId: sub.id },
        { status: "canceled" }
      );

      if (userId) {
        await Notification.create({
          userId,
          message: `Your subscription has been canceled.`,
          type: "info",
          read: false,
        });
      }

      return NextResponse.json({ received: true });
    }

    // ================================================================
    // Catch-all
    // ================================================================
    return NextResponse.json({ received: true });
  } catch (err: any) {
    logger.error("Webhook error", err);
    return new NextResponse(`Webhook error: ${err.message}`, {
      status: 400,
    });
  }
}
