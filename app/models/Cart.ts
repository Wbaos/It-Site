import { Schema, model, models } from "mongoose";

const CartOptionSchema = new Schema(
  {
    name: String,
    price: Number,
  },
  { _id: false }
);

const CartItemSchema = new Schema(
  {
    id: { type: String, required: false },
    slug: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String },

    basePrice: { type: Number, required: true },
    price: { type: Number, required: true },
    pricingModel: { type: String, enum: ["flat", "hourly"], required: false },
    hourlyConfig: {
      minimumHours: { type: Number, required: false },
      maximumHours: { type: Number, required: false },
      billingIncrement: { type: Number, required: false },
    },
    options: [CartOptionSchema],
    quantity: { type: Number, default: 1 },
  },
  { _id: false }
);

const CartSchema = new Schema({
  sessionId: { type: String, required: true, unique: true },
  items: [CartItemSchema],

  promo: {
    code: { type: String },
    discountType: { type: String, enum: ["percentage", "flat"], required: false },
    value: { type: Number, required: false },
  },

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
    notes: String,
  },
  schedule: {
    date: String,
    time: String,
  },
});

export const Cart = models.Cart || model("Cart", CartSchema);
