import mongoose from "mongoose";

const AssessmentSchema = new mongoose.Schema(
  {
    assessmentId: {
      type: String,
      required: true,
      index: true,
    },
    assessmentSlug: {
      type: String,
      required: true,
      index: true,
    },
    assessmentType: {
      type: String,
      required: true,
      index: true,
    },
    shareId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    assessmentConfigId: {
      type: String,
      required: true,
    },
    answers: {
      type: Map,
      of: mongoose.Schema.Types.Mixed,
      required: true,
    },
    score: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    recommendation: {
      type: String,
      required: true,
    },
    categoryScores: {
      type: Map,
      of: Number,
    },
    userInfo: {
      name: String,
      email: String,
      company: String,
      phone: String,
    },
    metadata: {
      userAgent: String,
      ipAddress: String,
      referrer: String,
    },
    viewCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Create indexes for performance
AssessmentSchema.index({ createdAt: -1 });
AssessmentSchema.index({ score: -1 });

export default mongoose.models.Assessment || 
  mongoose.model("Assessment", AssessmentSchema);
