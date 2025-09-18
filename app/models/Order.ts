import mongoose, { Schema, model, models } from "mongoose";

const OptionSchema = new Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
});

const OrderItemSchema = new Schema({
  slug: { type: String, required: true },
  title: { type: String, required: true },
  price: { type: Number, required: true },
  options: [OptionSchema],
  quantity: { type: Number, default: 1 },
});

const OrderSchema = new Schema(
  {
    stripeSessionId: { type: String, required: true },
    email: { type: String },
    items: { type: [OrderItemSchema], required: true },
    total: { type: Number, required: true },
    status: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export const Order = models.Order || model("Order", OrderSchema);
