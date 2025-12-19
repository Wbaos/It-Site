'use client';

import React, { useState } from 'react';
import { AssessmentConfig, AssessmentCategory, AssessmentQuestion } from '@/lib/sanityAssessment';
import { motion, AnimatePresence } from 'framer-motion';

interface AssessmentFormProps {
  assessment: AssessmentConfig;
  onSubmit: (answers: Record<string, any>, userInfo?: any) => void;
  isLoading?: boolean;
}

export default function AssessmentForm({ assessment, onSubmit, isLoading }: AssessmentFormProps) {
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [showUserInfo, setShowUserInfo] = useState(false);
  const [userInfo, setUserInfo] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
  });

  const sortedCategories = [...assessment.categories].sort((a, b) => a.order - b.order);
  const currentCategory = sortedCategories[currentCategoryIndex];
  const currentQuestion = currentCategory?.questions[currentQuestionIndex];
  const totalQuestions = sortedCategories.reduce((sum, cat) => sum + cat.questions.length, 0);
  const answeredQuestions = Object.keys(answers).length;
  const progress = (answeredQuestions / totalQuestions) * 100;
  
  // Calculate current question number based on position, not answers
  const currentQuestionNumber = sortedCategories
    .slice(0, currentCategoryIndex)
    .reduce((sum, cat) => sum + cat.questions.length, 0) + currentQuestionIndex + 1;

  const handleAnswer = (questionId: string, value: any) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const goToNext = () => {
    if (currentQuestionIndex < currentCategory.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else if (currentCategoryIndex < sortedCategories.length - 1) {
      setCurrentCategoryIndex(currentCategoryIndex + 1);
      setCurrentQuestionIndex(0);
    } else {
      setShowUserInfo(true);
    }
  };

  const goToPrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    } else if (currentCategoryIndex > 0) {
      setCurrentCategoryIndex(currentCategoryIndex - 1);
      setCurrentQuestionIndex(sortedCategories[currentCategoryIndex - 1].questions.length - 1);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(answers, userInfo);
  };

  const canProceed = answers[currentQuestion?._id] !== undefined;

  if (showUserInfo) {
    return (
      <div className="assessment-userinfo-card">
        <div className="assessment-userinfo-header">
          <div className="assessment-userinfo-icon">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="assessment-userinfo-title">Almost Done!</h2>
          <p className="assessment-userinfo-description">
            Get your personalized IT assessment results. Optionally provide your contact information
            to receive a detailed report and consultation offer.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="assessment-form">
          <div className="assessment-form-group">
            <label className="assessment-form-label">
              Name (Optional)
            </label>
            <input
              type="text"
              value={userInfo.name}
              onChange={(e) => setUserInfo({ ...userInfo, name: e.target.value })}
              className="assessment-form-input"
              placeholder="John Doe"
            />
          </div>

          <div className="assessment-form-group">
            <label className="assessment-form-label">
              Email (Optional)
            </label>
            <input
              type="email"
              value={userInfo.email}
              onChange={(e) => setUserInfo({ ...userInfo, email: e.target.value })}
              className="assessment-form-input"
              placeholder="john@company.com"
            />
          </div>

          <div className="assessment-form-group">
            <label className="assessment-form-label">
              Company (Optional)
            </label>
            <input
              type="text"
              value={userInfo.company}
              onChange={(e) => setUserInfo({ ...userInfo, company: e.target.value })}
              className="assessment-form-input"
              placeholder="Company Name"
            />
          </div>

          <div className="assessment-form-group">
            <label className="assessment-form-label">
              Phone (Optional)
            </label>
            <input
              type="tel"
              value={userInfo.phone}
              onChange={(e) => setUserInfo({ ...userInfo, phone: e.target.value })}
              className="assessment-form-input"
              placeholder="+1 (555) 123-4567"
            />
          </div>

          <div className="assessment-button-group">
            <button
              type="button"
              onClick={() => setShowUserInfo(false)}
              className="assessment-button-secondary"
              disabled={isLoading}
            >
              ← Back
            </button>
            <button
              type="submit"
              className="assessment-button-primary"
              disabled={isLoading}
            >
              {isLoading ? '⏳ Processing...' : 'Get Results'}
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="assessment-form-container">
      {/* Progress Bar */}
      <div className="assessment-progress-card">
        <div className="assessment-progress-header">
          <span className="assessment-progress-label">
            Question {currentQuestionNumber} of {totalQuestions}
          </span>
          <span className="assessment-progress-percentage">
            {Math.round(progress)}% Complete
          </span>
        </div>
        <div className="assessment-progress-bar-container">
          <motion.div
            className="assessment-progress-bar"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Category Progress */}
      <div className="assessment-categories">
        <div className="assessment-categories-list">
          {sortedCategories.map((cat, idx) => {
            // Check if all questions in this category are answered
            const allQuestionsAnswered = cat.questions.every(q => answers[q._id] !== undefined);
            const isCompleted = idx < currentCategoryIndex || (idx === currentCategoryIndex && allQuestionsAnswered);
            const isActive = idx === currentCategoryIndex && !allQuestionsAnswered;
            
            return (
              <div
                key={cat._id}
                className={`assessment-category-pill ${
                  isCompleted
                    ? 'completed'
                    : isActive
                    ? 'active'
                    : 'inactive'
                }`}
              >
                {isCompleted && '✓ '}{cat.title}
              </div>
            );
          })}
        </div>
      </div>

      {/* Question Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`${currentCategoryIndex}-${currentQuestionIndex}`}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="assessment-question-card"
        >
          <h3 className="assessment-question-title">{currentQuestion?.question}</h3>

          {currentQuestion?.helpText && (
            <p className="assessment-question-help">{currentQuestion.helpText}</p>
          )}

          <div className="assessment-options">
            {currentQuestion?.questionType === 'multiple' && currentQuestion.options?.map((option, idx) => (
              <button
                key={idx}
                onClick={() => handleAnswer(currentQuestion._id, idx)}
                className={`assessment-option-button ${
                  answers[currentQuestion._id] === idx ? 'selected' : ''
                }`}
              >
                {option.text}
              </button>
            ))}

            {currentQuestion?.questionType === 'boolean' && (
              <div className="assessment-boolean-options">
                <button
                  onClick={() => handleAnswer(currentQuestion._id, 0)}
                  className={`assessment-boolean-button yes ${
                    answers[currentQuestion._id] === 0 ? 'selected' : ''
                  }`}
                >
                  ✓ Yes
                </button>
                <button
                  onClick={() => handleAnswer(currentQuestion._id, 1)}
                  className={`assessment-boolean-button no ${
                    answers[currentQuestion._id] === 1 ? 'selected' : ''
                  }`}
                >
                  ✗ No
                </button>
              </div>
            )}

            {currentQuestion?.questionType === 'scale' && (
              <div className="assessment-scale-container">
                <div className="assessment-scale-labels">
                  <span>😟 Strongly Disagree</span>
                  <span>😊 Strongly Agree</span>
                </div>
                <div className="assessment-scale-buttons">
                  {[1, 2, 3, 4, 5].map(value => (
                    <button
                      key={value}
                      onClick={() => handleAnswer(currentQuestion._id, value)}
                      className={`assessment-scale-button ${
                        answers[currentQuestion._id] === value ? 'selected' : ''
                      }`}
                    >
                      {value}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {currentQuestion?.questionType === 'scale10' && (
              <div className="assessment-scale-container">
                <div className="assessment-scale-labels">
                  <span>😞 Poor</span>
                  <span>🌟 Excellent</span>
                </div>
                <div className="assessment-scale10-buttons">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(value => (
                    <button
                      key={value}
                      onClick={() => handleAnswer(currentQuestion._id, value)}
                      className={`assessment-scale10-button ${
                        answers[currentQuestion._id] === value ? 'selected' : ''
                      }`}
                    >
                      {value}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="assessment-navigation">
        <button
          onClick={goToPrevious}
          disabled={currentCategoryIndex === 0 && currentQuestionIndex === 0}
          className="assessment-nav-previous"
        >
          ← Previous
        </button>
        <button
          onClick={goToNext}
          disabled={!canProceed}
          className="assessment-nav-next"
        >
          {currentCategoryIndex === sortedCategories.length - 1 &&
          currentQuestionIndex === currentCategory.questions.length - 1
            ? 'Continue to Results →'
            : 'Next →'}
        </button>
      </div>
    </div>
  );
}
