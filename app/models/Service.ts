import { Schema, model, models } from "mongoose";

const ServiceSchema = new Schema({
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    category: { type: String, required: true },
    description: String,
    price: Number,
});

export const Service = models.Service || model("Service", ServiceSchema);
