// models/Booking.ts
import { Schema, model, models } from "mongoose";

const BookingSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    service: { type: String, required: true },
    slug: { type: String, required: true },
    price: { type: Number, required: true },
    options: [
      {
        name: String,
        price: Number,
      },
    ],
    quantity: { type: Number, default: 1 },
    notes: { type: String },
    status: { type: String, default: "pending" },
  },
  { timestamps: true }
);

export const Booking = models.Booking || model("Booking", BookingSchema);
