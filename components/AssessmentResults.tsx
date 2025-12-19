'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

interface AssessmentResultsProps {
  score: number;
  categoryScores: Record<string, number>;
  recommendation: {
    title: string;
    level: string;
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
  };
  shareId: string;
  shareUrl: string;
}



export default function AssessmentResults({
  score,
  categoryScores,
  recommendation,
  shareId,
  shareUrl,
}: AssessmentResultsProps) {
  const handleShare = async (platform: string) => {
    const text = `I just completed an IT Assessment and scored ${Math.round(score)}%! Check out my results:`;
    const url = shareUrl;

    switch (platform) {
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'linkedin':
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'copy':
        await navigator.clipboard.writeText(url);
        alert('Link copied to clipboard!');
        break;
    }
  };

  return (
    <div className="assessment-results">
      {/* Score Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={`results-score-card ${recommendation.level}`}
      >
        <div>
          <div className="results-badge">
            ✨ Assessment Complete
          </div>
        </div>
        <h2 className={`results-title ${recommendation.level}`}>Your IT Maturity Score</h2>
        <div className="results-score-display">
          <div className="results-score-number">
            {Math.round(score)}%
          </div>
        </div>
        <div className={`results-level-badge ${recommendation.level}`}>
          {recommendation.title}
        </div>
      </motion.div>

      {/* Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, type: 'spring' }}
        className="results-section"
      >
        <div className="results-section-header">
          <div className="results-section-icon blue">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="results-section-title">Summary</h3>
        </div>
        <p className="results-section-text">{recommendation.summary}</p>
      </motion.div>

      {/* Category Breakdown */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, type: 'spring' }}
        className="results-section"
      >
        <div className="results-section-header">
          <div className="results-section-icon green">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h3 className="results-section-title">Category Breakdown</h3>
        </div>
        <div className="results-categories">
          {Object.entries(categoryScores).map(([category, score], idx) => (
            <div key={category}>
              <div className="results-category-item">
                <span className="results-category-name">{category}</span>
                <span className="results-category-score">{Math.round(score)}%</span>
              </div>
              <div className="results-category-bar-container">
                <motion.div
                  className="results-category-bar"
                  initial={{ width: 0 }}
                  animate={{ width: `${score}%` }}
                  transition={{ duration: 0.5, delay: 0.3 + idx * 0.1, type: 'spring' }}
                />
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Key Findings */}
      {recommendation.keyFindings && recommendation.keyFindings.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, type: 'spring' }}
          className="results-section"
        >
          <div className="results-section-header">
            <div className="results-section-icon indigo">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
            <h3 className="results-section-title">Key Findings</h3>
          </div>
          <ul className="results-findings-list">
            {recommendation.keyFindings.map((finding, idx) => (
              <motion.li 
                key={idx} 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + idx * 0.05 }}
                className="results-finding-item"
              >
                <span className="results-finding-check">✓</span>
                <span className="results-finding-text">{finding}</span>
              </motion.li>
            ))}
          </ul>
        </motion.div>
      )}

      {/* Recommendations */}
      {recommendation.recommendations && recommendation.recommendations.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, type: 'spring' }}
          className="results-section"
        >
          <div className="results-section-header">
            <div className="results-section-icon purple">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
            </div>
            <h3 className="results-section-title">Recommended Actions</h3>
          </div>
          <div className="results-recommendations-list">
            {recommendation.recommendations.map((rec, idx) => (
              <motion.div 
                key={idx} 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + idx * 0.1 }}
                className="results-recommendation-item"
              >
                <div className="results-recommendation-header">
                  <h4 className="results-recommendation-title">{rec.title}</h4>
                  {rec.priority && (
                    <span className={`results-priority-badge ${rec.priority.toLowerCase()}`}>
                      {rec.priority} Priority
                    </span>
                  )}
                </div>
                {rec.description && (
                  <p className="results-recommendation-description">{rec.description}</p>
                )}
                {rec.estimatedImpact && (
                  <p className="results-recommendation-impact">
                    <strong>Expected Impact:</strong> {rec.estimatedImpact}
                  </p>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Share Section */}
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ delay: 0.5, type: 'spring' }}
        className="results-share-section"
      >
        <div className="results-share-pattern">
          <div style={{backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '30px 30px'}}></div>
        </div>
        <div className="results-share-content">
          <div className="results-share-header">
            <div className="results-share-icon">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
            </div>
            <h3 className="results-share-title">🎉 Share Your Results</h3>
            <p className="results-share-description">
              Inspire others to assess their IT infrastructure too!
            </p>
          </div>
          <div className="results-share-buttons">
            <button
              onClick={() => handleShare('twitter')}
              className="results-share-button"
            >
              <svg fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
              Twitter
            </button>
            <button
              onClick={() => handleShare('linkedin')}
              className="results-share-button"
            >
              <svg fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
              LinkedIn
            </button>
            <button
              onClick={() => handleShare('facebook')}
              className="results-share-button"
            >
              <svg fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              Facebook
            </button>
            <button
              onClick={() => handleShare('copy')}
              className="results-share-button results-share-button-copy"
            >
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
              Copy Link
            </button>
          </div>
        </div>
      </motion.div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ delay: 0.6, type: 'spring' }}
        className="results-cta-section"
      >
        <div className="results-cta-pattern"></div>
        <div className="results-cta-content">
          <div className="results-cta-icon">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h3 className="results-cta-title">Ready to Improve Your IT Infrastructure?</h3>
          <p className="results-cta-description">
            Let's discuss how we can help you implement these recommendations and optimize your IT operations.
          </p>
          <Link
            href={recommendation.ctaLink || '/contact'}
            className="results-cta-button"
          >
            {recommendation.ctaText || '🚀 Get a Free Consultation'}
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
