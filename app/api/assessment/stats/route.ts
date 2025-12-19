import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { connectDB } from "@/lib/mongodb";
import Assessment from "@/app/models/Assessment";

export async function GET(request: NextRequest) {
  try {
    // Optional: Add authentication check
    // const session = await getServerSession(authOptions);
    // if (!session?.user?.isAdmin) {
    //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    // }

    await connectDB();

    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get("days") || "30");

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Total assessments
    const totalAssessments = await Assessment.countDocuments({
      createdAt: { $gte: startDate },
    });

    // Average score
    const avgScoreResult = await Assessment.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      { $group: { _id: null, avgScore: { $avg: "$score" } } },
    ]);
    const averageScore = avgScoreResult[0]?.avgScore || 0;

    // Score distribution
    const scoreDistribution = await Assessment.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      {
        $bucket: {
          groupBy: "$score",
          boundaries: [0, 20, 40, 60, 80, 100],
          default: "100+",
          output: {
            count: { $sum: 1 },
          },
        },
      },
    ]);

    // Category scores
    const categoryScores = await Assessment.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      { $project: { categoryScores: { $objectToArray: "$categoryScores" } } },
      { $unwind: "$categoryScores" },
      {
        $group: {
          _id: "$categoryScores.k",
          avgScore: { $avg: "$categoryScores.v" },
          count: { $sum: 1 },
        },
      },
      { $sort: { avgScore: -1 } },
    ]);

    // Most shared results (highest view counts)
    const topShared = await Assessment.find({
      createdAt: { $gte: startDate },
    })
      .sort({ viewCount: -1 })
      .limit(10)
      .select("shareId score viewCount createdAt");

    // Assessments over time
    const assessmentsOverTime = await Assessment.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
          },
          count: { $sum: 1 },
          avgScore: { $avg: "$score" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Lead capture rate
    const withContact = await Assessment.countDocuments({
      createdAt: { $gte: startDate },
      "userInfo.email": { $exists: true, $ne: "" },
    });
    const leadCaptureRate =
      totalAssessments > 0 ? (withContact / totalAssessments) * 100 : 0;

    // Recent assessments
    const recentAssessments = await Assessment.find({
      createdAt: { $gte: startDate },
    })
      .sort({ createdAt: -1 })
      .limit(20)
      .select("shareId score createdAt userInfo.email userInfo.company");

    return NextResponse.json({
      success: true,
      period: `Last ${days} days`,
      statistics: {
        totalAssessments,
        averageScore: Math.round(averageScore * 10) / 10,
        leadCaptureRate: Math.round(leadCaptureRate * 10) / 10,
        withContactInfo: withContact,
      },
      scoreDistribution,
      categoryScores,
      topShared,
      assessmentsOverTime,
      recentAssessments,
    });
  } catch (error) {
    console.error("Error fetching assessment stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch statistics" },
      { status: 500 }
    );
  }
}
