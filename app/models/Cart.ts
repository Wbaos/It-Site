// models/Cart.ts
import mongoose, { Schema, model, models } from "mongoose";

const OptionSchema = new Schema({
  name: { type: String, required: true },
  price: { type: Number, default: 0 },
});

const CartItemSchema = new Schema({
  slug: { type: String, required: true },
  title: { type: String, required: true },
  price: { type: Number, required: true },
  options: { type: [OptionSchema], default: [] },
  quantity: { type: Number, default: 1 },
});

const CartSchema = new Schema(
  {
    sessionId: { type: String, required: true },
    userId: { type: String },
    items: [CartItemSchema],
  },
  { timestamps: true }
);

export const Cart = models.Cart || model("Cart", CartSchema);
