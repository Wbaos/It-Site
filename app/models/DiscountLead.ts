import { Schema, model, models } from "mongoose";

const DiscountLeadSchema = new Schema(
  {
    email: { type: String, required: true },
    emailLower: { type: String, required: true, unique: true, index: true },
    phone: { type: String, required: true },
    consent: { type: Boolean, required: true },
    discountCode: { type: String, required: true, index: true },
    discountPercent: { type: Number, default: 10 },
    source: { type: String, default: "discount-popup" },
    codeSentAt: { type: Date },
    redeemedAt: { type: Date },
  },
  { timestamps: true }
);

export const DiscountLead =
  models.DiscountLead || model("DiscountLead", DiscountLeadSchema);
