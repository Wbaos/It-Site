import { client } from "./sanity.client";

export interface AssessmentQuestion {
  _id: string;
  question: string;
  questionType: 'multiple' | 'boolean' | 'scale' | 'scale10';
  options?: Array<{
    text: string;
    score: number;
  }>;
  weight: number;
  helpText?: string;
}

export interface AssessmentCategory {
  _id: string;
  title: string;
  slug: { current: string };
  description?: string;
  icon?: string;
  order: number;
  questions: AssessmentQuestion[];
}

export interface AssessmentRecommendation {
  _id: string;
  title: string;
  scoreRange: {
    min: number;
    max: number;
  };
  level: 'critical' | 'low' | 'medium' | 'high' | 'excellent';
  summary: string;
  keyFindings?: string[];
  recommendations?: Array<{
    title: string;
    description?: string;
    priority?: string;
    estimatedImpact?: string;
  }>;
  suggestedServices?: any[];
  ctaText?: string;
  ctaLink?: string;
}

export interface AssessmentConfig {
  _id: string;
  title: string;
  slug: { current: string };
  subtitle?: string;
  isActive: boolean;
  heroImage?: any;
  estimatedTime?: number;
  categories: AssessmentCategory[];
  recommendations: AssessmentRecommendation[];
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string[];
  };
  socialSharing?: {
    shareTitle?: string;
    shareDescription?: string;
    shareImage?: any;
  };
}

export async function getActiveAssessment(): Promise<AssessmentConfig | null> {
  const query = `*[_type == "assessmentConfig" && isActive == true][0]{
    _id,
    title,
    slug,
    subtitle,
    isActive,
    heroImage,
    estimatedTime,
    categories[]->{
      _id,
      title,
      slug,
      description,
      icon,
      order,
      questions[]->{
        _id,
        question,
        questionType,
        options,
        weight,
        helpText
      }
    },
    recommendations[]->{
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
    },
    seo,
    socialSharing
  }`;

  try {
    const assessment = await client.fetch(query);
    return assessment;
  } catch (error) {
    console.error("Error fetching assessment:", error);
    return null;
  }
}

export async function getAssessmentBySlug(slug: string): Promise<AssessmentConfig | null> {
  const query = `*[_type == "assessmentConfig" && slug.current == $slug][0]{
    _id,
    title,
    slug,
    subtitle,
    isActive,
    heroImage,
    estimatedTime,
    categories[]->{
      _id,
      title,
      slug,
      description,
      icon,
      order,
      questions[]->{
        _id,
        question,
        questionType,
        options,
        weight,
        helpText
      }
    },
    recommendations[]->{
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
    },
    seo,
    socialSharing
  }`;

  try {
    const assessment = await client.fetch(query, { slug });
    return assessment;
  } catch (error) {
    console.error("Error fetching assessment by slug:", error);
    return null;
  }
}

export function calculateScore(
  answers: Record<string, any>,
  assessment: AssessmentConfig
): number {
  let totalScore = 0;
  let totalWeight = 0;

  assessment.categories.forEach(category => {
    category.questions.forEach(question => {
      const answer = answers[question._id];
      if (answer !== undefined && answer !== null) {
        let score = 0;

        if (question.questionType === 'multiple' || question.questionType === 'boolean') {
          // For multiple choice and boolean, answer is the index or the score directly
          const selectedOption = question.options?.[answer];
          score = selectedOption?.score ?? 0;
        } else if (question.questionType === 'scale') {
          // Scale 1-5, normalize to 0-100
          score = ((answer - 1) / 4) * 100;
        } else if (question.questionType === 'scale10') {
          // Scale 1-10, normalize to 0-100
          score = ((answer - 1) / 9) * 100;
        }

        totalScore += score * question.weight;
        totalWeight += question.weight;
      }
    });
  });

  return totalWeight > 0 ? (totalScore / totalWeight) : 0;
}

export function getRecommendation(
  score: number,
  recommendations: AssessmentRecommendation[]
): AssessmentRecommendation | null {
  return recommendations.find(
    rec => score >= rec.scoreRange.min && score <= rec.scoreRange.max
  ) ?? null;
}
