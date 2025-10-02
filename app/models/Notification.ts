import mongoose, { Schema, model, models } from "mongoose";

const NotificationSchema = new Schema(
  {
    userId: { type: String, required: true },
    message: { type: String, required: true },
    type: { type: String, enum: ["success", "info", "error"], default: "info" },
    read: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Notification =
  models.Notification || model("Notification", NotificationSchema);
