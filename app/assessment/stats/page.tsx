'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

export default function AssessmentStatsPage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [period, setPeriod] = useState(30);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/assessment/stats?days=${period}`);
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [period]);

  if (loading) {
    return (
      <div className="stats-loading">
        <div className="stats-loading-content">
          <div className="stats-spinner"></div>
          <p className="stats-loading-text">Loading statistics...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="stats-loading">
        <p className="stats-loading-text">Failed to load statistics</p>
      </div>
    );
  }

  return (
    <div className="stats-page">
      <div className="stats-container">
        {/* Header */}
        <div className="stats-header">
          <h1 className="stats-title">
            Assessment Statistics
          </h1>
          <div className="stats-period-buttons">
            <button
              onClick={() => setPeriod(7)}
              className={`stats-period-button ${
                period === 7 ? 'active' : 'inactive'
              }`}
            >
              Last 7 Days
            </button>
            <button
              onClick={() => setPeriod(30)}
              className={`stats-period-button ${
                period === 30 ? 'active' : 'inactive'
              }`}
            >
              Last 30 Days
            </button>
            <button
              onClick={() => setPeriod(90)}
              className={`stats-period-button ${
                period === 90 ? 'active' : 'inactive'
              }`}
            >
              Last 90 Days
            </button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="stats-metrics-grid">
          <div className="stats-metric-card">
            <h3 className="stats-metric-label">
              Total Assessments
            </h3>
            <p className="stats-metric-value">
              {data.statistics.totalAssessments}
            </p>
          </div>

          <div className="stats-metric-card">
            <h3 className="stats-metric-label">
              Average Score
            </h3>
            <p className="stats-metric-value">
              {data.statistics.averageScore}%
            </p>
          </div>

          <div className="stats-metric-card">
            <h3 className="stats-metric-label">
              Lead Capture Rate
            </h3>
            <p className="stats-metric-value">
              {data.statistics.leadCaptureRate}%
            </p>
          </div>

          <div className="stats-metric-card">
            <h3 className="stats-metric-label">
              With Contact Info
            </h3>
            <p className="stats-metric-value">
              {data.statistics.withContactInfo}
            </p>
          </div>
        </div>

        {/* Score Distribution */}
        <div className="stats-section-card">
          <h3 className="stats-section-title">
            Score Distribution
          </h3>
          <div className="stats-list">
            {data.scoreDistribution.map((bucket: any, idx: number) => {
              const ranges = ['0-20%', '21-40%', '41-60%', '61-80%', '81-100%'];
              return (
                <div key={idx}>
                  <div className="stats-distribution-item">
                    <span className="stats-distribution-label">
                      {ranges[idx]}
                    </span>
                    <span className="stats-distribution-value">
                      {bucket.count} assessments
                    </span>
                  </div>
                  <div className="stats-progress-bar">
                    <div
                      className="stats-score-bar"
                      style={{
                        width: `${
                          (bucket.count / data.statistics.totalAssessments) * 100
                        }%`,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Category Performance */}
        <div className="stats-section-card">
          <h3 className="stats-section-title">
            Category Performance
          </h3>
          <div className="stats-list">
            {data.categoryScores.map((cat: any) => (
              <div key={cat._id}>
                <div className="stats-distribution-item">
                  <span className="stats-distribution-label">
                    {cat._id}
                  </span>
                  <span className="stats-distribution-value">
                    {Math.round(cat.avgScore)}% avg
                  </span>
                </div>
                <div className="stats-progress-bar">
                  <div
                    className="stats-category-bar"
                    style={{ width: `${cat.avgScore}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Shared Results */}
        <div className="stats-section-card">
          <h3 className="stats-section-title">
            Most Shared Results
          </h3>
          <div className="stats-table-wrapper">
            <table className="stats-table">
              <thead>
                <tr>
                  <th>
                    Share ID
                  </th>
                  <th>
                    Score
                  </th>
                  <th>
                    Views
                  </th>
                  <th>
                    Date
                  </th>
                  <th>
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.topShared.map((item: any) => (
                  <tr key={item.shareId}>
                    <td className="stats-table-text-primary">
                      {item.shareId}
                    </td>
                    <td className="stats-table-text-secondary">
                      {Math.round(item.score)}%
                    </td>
                    <td className="stats-table-text-secondary">
                      {item.viewCount}
                    </td>
                    <td className="stats-table-text-secondary">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </td>
                    <td>
                      <Link
                        href={`/assessment/results/${item.shareId}`}
                        className="stats-table-link"
                        target="_blank"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Assessments */}
        <div className="stats-section-card">
          <h3 className="stats-section-title">
            Recent Assessments
          </h3>
          <div className="stats-table-wrapper">
            <table className="stats-table">
              <thead>
                <tr>
                  <th>
                    Date
                  </th>
                  <th>
                    Score
                  </th>
                  <th>
                    Email
                  </th>
                  <th>
                    Company
                  </th>
                  <th>
                    View
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.recentAssessments.map((item: any) => (
                  <tr key={item.shareId}>
                    <td className="stats-table-text-secondary">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </td>
                    <td className="stats-table-text-primary">
                      {Math.round(item.score)}%
                    </td>
                    <td className="stats-table-text-secondary">
                      {item.userInfo?.email || '-'}
                    </td>
                    <td className="stats-table-text-secondary">
                      {item.userInfo?.company || '-'}
                    </td>
                    <td>
                      <Link
                        href={`/assessment/results/${item.shareId}`}
                        className="stats-table-link"
                        target="_blank"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
