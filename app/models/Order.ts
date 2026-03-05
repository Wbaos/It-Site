import mongoose, { Schema, model, models } from "mongoose";

const OptionSchema = new Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
});

const OrderItemSchema = new Schema({
  slug: { type: String, required: true },
  title: { type: String, required: true },
  navDescription: { type: String, default: null },
  basePrice: { type: Number, required: true },
  price: { type: Number, required: true },
  options: [OptionSchema],
  quantity: { type: Number, default: 1 },
  contact: {
    name: String,
    email: String,
    phone: String,
  },
  address: {
    street: String,
    city: String,
    state: String,
    zip: String,
  },
  schedule: {
    date: String,
    time: String,
  },
});

const OrderSchema = new Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    stripeSessionId: { type: String },
    stripeSubscriptionId: { type: String, default: null },
    email: { type: String },
    orderNumber: { type: String, default: null },
    confirmationEmailSentAt: { type: Date, default: null },
    technicianName: { type: String, default: null },
    technicianPhone: { type: String, default: null },
    serviceDescription: { type: String, default: null },
    notes: { type: String, default: null },
    paymentLast4: { type: String, default: null },
    warrantyText: { type: String, default: null },
    items: { type: [OrderItemSchema], default: [] },
    total: { type: Number, required: true },
    quantity: { type: Number, required: true },
    isSubscription: { type: Boolean, default: false },
    status: {
      type: String,
      enum: [
        "pending",
        "paid",
        "failed",
        "active",
        "trialing",
        "past_due",
        "incomplete",
        "incomplete_expired",
        "unpaid",
        "canceled",
        "refunded",
      ],
      default: "pending",
    },
    refunded: { type: Boolean, default: false },
    deleted: { type: Boolean, default: false },
    planName: { type: String, default: null },
    planPrice: { type: Number, default: null },
    planInterval: { type: String, default: null },
    nextPayment: { type: String, default: null },
    contact: {
      name: String,
      email: String,
      phone: String,
    },
    address: {
      street: String,
      city: String,
      state: String,
      zip: String,
    },
    schedule: {
      date: String,
      time: String,
    },
  },
  { timestamps: true }
);

OrderSchema.pre("save", function (next) {
  const doc = this as any;
  if (!doc.orderNumber) {
    const id = String(doc._id || "");
    doc.orderNumber = id ? id.slice(-6).toUpperCase() : null;
  }
  next();
});

export const Order = models.Order || model("Order", OrderSchema);
