import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Assessment from "@/app/models/Assessment";
import { getRecommendation } from "@/lib/sanityAssessment";
import { client } from "@/lib/sanity.client";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ shareId: string }> }
) {
  try {
    const { shareId } = await params;

    await connectDB();
    
    // Find assessment and increment view count
    const assessment = await Assessment.findOneAndUpdate(
      { shareId },
      { $inc: { viewCount: 1 } },
      { new: true }
    );

    if (!assessment) {
      return NextResponse.json(
        { error: "Assessment not found" },
        { status: 404 }
      );
    }

    // Fetch the recommendation details from Sanity
    const recommendationQuery = `*[_type == "assessmentRecommendation" && _id == $id][0]{
      _id,
      title,
      scoreRange,
      level,
      summary,
      keyFindings,
      recommendations,
      suggestedServices[]->,
      ctaText,
      ctaLink
    }`;

    const recommendation = await client.fetch(recommendationQuery, {
      id: assessment.recommendation,
    });

    // Fetch assessment config for additional details
    const configQuery = `*[_type == "assessmentConfig" && _id == $id][0]{
      title,
      subtitle,
      categories[]->{
        title
      }
    }`;

    const config = await client.fetch(configQuery, {
      id: assessment.assessmentConfigId,
    });

    return NextResponse.json({
      success: true,
      assessment: {
        score: assessment.score,
        categoryScores: Object.fromEntries(assessment.categoryScores),
        createdAt: assessment.createdAt,
        viewCount: assessment.viewCount,
      },
      recommendation,
      config,
    });
  } catch (error) {
    console.error("Error fetching assessment:", error);
    return NextResponse.json(
      { error: "Failed to fetch assessment" },
      { status: 500 }
    );
  }
}
