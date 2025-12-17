import { Schema, model, models } from "mongoose";

const IssueSchema = new Schema(
  {
    service: String,
    issue: String,
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const Issue = models.Issue || model("Issue", IssueSchema);
