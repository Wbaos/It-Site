// app/models/User.ts
import mongoose, { Schema, models, model } from "mongoose";

const UserSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // hashed
  },
  { timestamps: true }
);

export const User = models.User || model("User", UserSchema);
