'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import AssessmentForm from '@/components/AssessmentForm';
import { AssessmentConfig } from '@/lib/sanityAssessment';

interface AssessmentPageClientProps {
  assessment: AssessmentConfig;
  assessmentSlug: string;
}

export default function AssessmentPageClient({ assessment, assessmentSlug }: AssessmentPageClientProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (answers: Record<string, any>, userInfo?: any) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/assessment/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          assessmentSlug: assessmentSlug,
          answers,
          userInfo,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit assessment');
      }

      const data = await response.json();
      
      if (data.success && data.shareId) {
        router.push(`/assessment/results/${data.shareId}`);
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (err) {
      console.error('Error submitting assessment:', err);
      setError('Failed to submit assessment. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="assessment-page">
      <div className="assessment-container">
        {/* Hero Section */}
        <div className="assessment-hero">
          
          <div>
            <span className="assessment-badge">
              ✨ Free Assessment
            </span>
          </div>
          
          <h1 className="assessment-title">
            {assessment.title}
          </h1>
          {assessment.subtitle && (
            <p className="assessment-subtitle">
              {assessment.subtitle}
            </p>
          )}
          {assessment.estimatedTime && (
            <div className="assessment-time-badge">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Takes about {assessment.estimatedTime} minutes</span>
            </div>
          )}
        </div>

        {/* Error Display */}
        {error && (
          <div className="assessment-error">
            <div className="assessment-error-content">
              <svg className="assessment-error-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="assessment-error-text">{error}</p>
            </div>
          </div>
        )}

        {/* Assessment Form */}
        <AssessmentForm
          assessment={assessment}
          onSubmit={handleSubmit}
          isLoading={isSubmitting}
        />
      </div>
    </div>
  );
}
