'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AssessmentResults from '@/components/AssessmentResults';

interface ResultsPageClientProps {
  shareId: string;
}

export default function ResultsPageClient({ shareId }: ResultsPageClientProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await fetch(`/api/assessment/${shareId}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch results');
        }

        const resultData = await response.json();
        setData(resultData);
      } catch (err) {
        console.error('Error fetching results:', err);
        setError('Failed to load assessment results');
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [shareId]);

  if (loading) {
    return (
      <div className="results-client-loading">
        <div className="results-client-loading-content">
          <div className="results-client-spinner"></div>
          <p className="results-client-loading-text">Loading your results...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="results-client-error">
        <div className="results-client-error-content">
          <div className="results-client-error-icon">😕</div>
          <h2 className="results-client-error-title">Results Not Found</h2>
          <p className="results-client-error-message">
            We couldn&apos;t find the assessment results you&apos;re looking for. The link may be invalid or expired.
          </p>
          <button
            onClick={() => router.push('/assessment')}
            className="results-client-error-button"
          >
            Take a New Assessment
          </button>
        </div>
      </div>
    );
  }

  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
  const shareUrl = `${baseUrl}/assessment/results/${shareId}`;

  return (
    <div className="results-client-page">
      <div className="results-client-container">
        <div className="results-client-header">
          <h1 className="results-client-title">
            Your IT Assessment Results
          </h1>
          <p className="results-client-date">
            Completed {new Date(data.assessment.createdAt).toLocaleDateString()}
          </p>
        </div>

        <AssessmentResults
          score={data.assessment.score}
          categoryScores={data.assessment.categoryScores}
          recommendation={data.recommendation}
          shareId={shareId}
          shareUrl={shareUrl}
        />

        {/* Take Another Assessment */}
        <div className="results-client-footer">
          <button
            onClick={() => router.push('/assessment')}
            className="results-client-action-button"
          >
            <svg className="results-client-action-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Take Another Assessment
          </button>
        </div>
      </div>
    </div>
  );
}
