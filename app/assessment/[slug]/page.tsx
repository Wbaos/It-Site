import { Metadata } from 'next';
import { getAssessmentBySlug } from '@/lib/sanityAssessment';
import AssessmentPageClient from './page.client';
import { notFound } from 'next/navigation';

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const assessment = await getAssessmentBySlug(slug);

  if (!assessment) {
    return {
      title: 'IT Assessment',
    };
  }

  return {
    title: assessment.seo?.metaTitle || assessment.title,
    description: assessment.seo?.metaDescription || assessment.subtitle || 'Assess your IT infrastructure maturity',
    keywords: assessment.seo?.keywords,
    openGraph: {
      title: assessment.socialSharing?.shareTitle || assessment.title,
      description: assessment.socialSharing?.shareDescription || assessment.subtitle || '',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: assessment.socialSharing?.shareTitle || assessment.title,
      description: assessment.socialSharing?.shareDescription || assessment.subtitle || '',
    },
  };
}

export default async function AssessmentPage({ params }: PageProps) {
  const { slug } = await params;
  const assessment = await getAssessmentBySlug(slug);

  if (!assessment) {
    notFound();
  }

  return <AssessmentPageClient assessment={assessment} assessmentSlug={slug} />;
}
