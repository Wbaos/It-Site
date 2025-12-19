import { NextRequest, NextResponse } from "next/server";
import { nanoid } from "nanoid";
import { connectDB } from "@/lib/mongodb";
import Assessment from "@/app/models/Assessment";
import {
  getAssessmentBySlug,
  calculateScore,
  getRecommendation,
} from "@/lib/sanityAssessment";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { assessmentSlug, answers, userInfo } = body;

    if (!assessmentSlug || !answers) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Fetch assessment config from Sanity
    const assessment = await getAssessmentBySlug(assessmentSlug);
    if (!assessment) {
      return NextResponse.json(
        { error: "Assessment not found" },
        { status: 404 }
      );
    }

    // Calculate score
    const score = calculateScore(answers, assessment);

    // Get recommendation
    const recommendation = getRecommendation(score, assessment.recommendations);
    if (!recommendation) {
      return NextResponse.json(
        { error: "No recommendation found for score" },
        { status: 500 }
      );
    }

    // Calculate category scores
    const categoryScores: Record<string, number> = {};
    assessment.categories.forEach(category => {
      let catScore = 0;
      let catWeight = 0;

      category.questions.forEach(question => {
        const answer = answers[question._id];
        if (answer !== undefined && answer !== null) {
          let qScore = 0;

          if (question.questionType === 'multiple' || question.questionType === 'boolean') {
            const selectedOption = question.options?.[answer];
            qScore = selectedOption?.score ?? 0;
          } else if (question.questionType === 'scale') {
            qScore = ((answer - 1) / 4) * 100;
          } else if (question.questionType === 'scale10') {
            qScore = ((answer - 1) / 9) * 100;
          }

          catScore += qScore * question.weight;
          catWeight += question.weight;
        }
      });

      categoryScores[category.title] = catWeight > 0 ? catScore / catWeight : 0;
    });

    // Generate unique share ID
    const shareId = nanoid(10);

    // Store in MongoDB
    await connectDB();
    const assessmentDoc = new Assessment({
      assessmentId: assessment._id,
      assessmentSlug: assessmentSlug,
      assessmentType: assessment.title,
      shareId,
      assessmentConfigId: assessment._id,
      answers,
      score,
      recommendation: recommendation._id,
      categoryScores,
      userInfo: userInfo || {},
      metadata: {
        userAgent: request.headers.get("user-agent") || "",
        referrer: request.headers.get("referer") || "",
      },
    });

    await assessmentDoc.save();

    return NextResponse.json({
      success: true,
      shareId,
      score,
      recommendation: {
        title: recommendation.title,
        level: recommendation.level,
        summary: recommendation.summary,
        keyFindings: recommendation.keyFindings,
        recommendations: recommendation.recommendations,
        suggestedServices: recommendation.suggestedServices,
        ctaText: recommendation.ctaText,
        ctaLink: recommendation.ctaLink,
      },
      categoryScores,
    });
  } catch (error) {
    console.error("Error submitting assessment:", error);
    return NextResponse.json(
      { error: "Failed to submit assessment" },
      { status: 500 }
    );
  }
}
