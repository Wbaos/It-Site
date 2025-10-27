import mongoose, { Schema, model, models } from "mongoose";

const OptionSchema = new Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
});

const OrderItemSchema = new Schema({
  slug: { type: String, required: true },
  title: { type: String, required: true },
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

export const Order = models.Order || model("Order", OrderSchema);
