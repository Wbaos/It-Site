import { Schema, model, models } from "mongoose";

const QuoteRequestSchema = new Schema(
  {
    referenceNumber: { type: String, required: true, unique: true },
    status: { type: String, default: "new" },

    service: {
      category: { type: String },
      group: { type: String },
      service: { type: String },
    },
    urgency: { type: String },
    other: { type: String },

    contact: {
      firstName: { type: String },
      lastName: { type: String },
      email: { type: String },
      phone: { type: String },
    },

    location: {
      streetAddress: { type: String },
      city: { type: String },
      zipCode: { type: String },
    },

    details: {
      projectDetails: { type: String },
      wantsTechnicianVisitFirst: { type: Boolean },
      preferredDate: { type: String },
      preferredTime: { type: String },
      heardAbout: { type: String },
    },
  },
  { timestamps: true }
);

export const QuoteRequest = models.QuoteRequest || model("QuoteRequest", QuoteRequestSchema);
