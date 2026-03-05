import { Schema, model, models } from "mongoose";

const DiscountLeadSchema = new Schema(
  {
    email: { type: String, required: true },
    emailLower: { type: String, required: true, unique: true, index: true },
    phone: { type: String, default: null },
    consent: { type: Boolean, default: false },
    discountCode: { type: String, required: true, index: true },
    // Back-compat field (older logic assumed percentage-only)
    discountPercent: { type: Number, default: 10 },
    // New fields (Sanity-controlled promo codes)
    discountType: { type: String, enum: ["percentage", "flat"], default: "percentage" },
    discountValue: { type: Number, default: 10 },
    source: { type: String, default: "discount-popup" },
    codeSentAt: { type: Date },
    redeemedAt: { type: Date },
  },
  { timestamps: true }
);

export const DiscountLead =
  models.DiscountLead || model("DiscountLead", DiscountLeadSchema);
