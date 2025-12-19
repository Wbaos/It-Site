import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ResultsPageClient from './page.client';

interface PageProps {
  params: Promise<{
    shareId: string;
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  try {
    const { shareId } = await params;
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/assessment/${shareId}`, {
      cache: 'no-store',
    });

    if (!response.ok) {
      return {
        title: 'Assessment Results',
      };
    }

    const data = await response.json();
    const score = Math.round(data.assessment.score);
    const assessmentType = data.assessment.assessmentType || 'IT Assessment';

    return {
      title: `${assessmentType} Results - ${score}% Score`,
      description: `Check out this ${assessmentType} result: ${score}% maturity score. See detailed recommendations and category breakdown.`,
      openGraph: {
        title: `I scored ${score}% on my ${assessmentType}!`,
        description: data.recommendation?.summary || `Comprehensive ${assessmentType} results`,
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title: `I scored ${score}% on my ${assessmentType}!`,
        description: data.recommendation?.summary || `Comprehensive ${assessmentType} results`,
      },
    };
  } catch (error) {
    return {
      title: 'Assessment Results',
    };
  }
}

export default async function AssessmentResultsPage({ params }: PageProps) {
  const { shareId } = await params;
  return <ResultsPageClient shareId={shareId} />;
}
