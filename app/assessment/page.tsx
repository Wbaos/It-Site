import Link from 'next/link';
import { client as sanityClient } from '@/lib/sanity.client';
import SvgIcon from '@/components/common/SvgIcons';

interface AssessmentOption {
  _id: string;
  title: string;
  description: string;
  slug: string;
  icon: string;
  estimatedTime: number;
  benefits: string[];
  isActive: boolean;
}

async function getActiveAssessments(): Promise<AssessmentOption[]> {
  const query = `*[_type == "assessmentConfig" && isActive == true] | order(order asc) {
    _id,
    title,
    description,
    "slug": slug.current,
    icon,
    estimatedTime,
    benefits,
    isActive
  }`;
  
  try {
    const assessments = await sanityClient.fetch<AssessmentOption[]>(query);
    return assessments || [];
  } catch (error) {
    console.error('Error fetching assessments:', error);
    return [];
  }
}

export default async function AssessmentsPage() {
  const assessments = await getActiveAssessments();

  return (
    <div className="assessment-landing-page">
      <div className="assessment-landing-container">
        {/* Hero Section */}
        <div className="assessment-landing-hero">
          <div className="assessment-landing-badge">FREE ASSESSMENTS</div>
          <h1 className="assessment-landing-title">
            Discover What Your Tech Setup Needs
          </h1>
          <p className="assessment-landing-subtitle">
            Take a quick assessment to get personalized recommendations and pricing for your specific needs. 
            All assessments are 100% free with no obligation.
          </p>
        </div>

        {/* Assessments Grid */}
        {assessments.length === 0 ? (
          <div className="assessment-landing-empty">
            <p>No assessments are currently available. Please check back later.</p>
          </div>
        ) : (
          <div className="assessment-landing-grid">
            {assessments.map((assessment) => (
              <Link
                key={assessment._id}
                href={`/assessment/${assessment.slug}`}
                className="assessment-landing-card">
                {/* Icon */}
                <div className="assessment-landing-card-icon">
                  <SvgIcon 
                    name={assessment.icon as any || 'clipboard'} 
                    size={32} 
                    color="currentColor" 
                  />
                </div>

                {/* Content */}
                <div className="assessment-landing-card-content">
                  <h3 className="assessment-landing-card-title">{assessment.title}</h3>
                  <p className="assessment-landing-card-description">{assessment.description}</p>
                  
                  {/* Benefits */}
                  {assessment.benefits && assessment.benefits.length > 0 && (
                    <ul className="assessment-landing-card-benefits">
                      {assessment.benefits.slice(0, 3).map((benefit, index) => (
                        <li key={index} className="assessment-landing-card-benefit">
                          <SvgIcon name="check" size={16} color="currentColor" />
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  )}

                  {/* Time Estimate */}
                  <div className="assessment-landing-card-footer">
                    <span className="assessment-landing-card-time">
                      <SvgIcon name="time-clock" size={16} color="currentColor" />
                      {assessment.estimatedTime} minutes
                    </span>
                    <span className="assessment-landing-card-arrow">
                      Start Assessment →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Why Take Assessment Section */}
        <div className="assessment-landing-why">
          <h2 className="assessment-landing-why-title">Why Take an Assessment?</h2>
          <div className="assessment-landing-why-grid">
            <div className="assessment-landing-why-card">
              <div className="assessment-landing-why-icon">
                <SvgIcon name="checkmark-circle" size={24} color="currentColor" />
              </div>
              <h3 className="assessment-landing-why-card-title">Personalized Recommendations</h3>
              <p className="assessment-landing-why-card-text">Get tailored advice based on your specific needs and current setup</p>
            </div>
            
            <div className="assessment-landing-why-card">
              <div className="assessment-landing-why-icon">
                <SvgIcon name="dollar-circle" size={24} color="currentColor" />
              </div>
              <h3 className="assessment-landing-why-card-title">Accurate Pricing</h3>
              <p className="assessment-landing-why-card-text">Receive realistic cost estimates for the services you actually need</p>
            </div>
            
            <div className="assessment-landing-why-card">
              <div className="assessment-landing-why-icon">
                <SvgIcon name="lightning" size={24} color="currentColor" />
              </div>
              <h3 className="assessment-landing-why-card-title">Quick & Easy</h3>
              <p className="assessment-landing-why-card-text">Most assessments take less than 10 minutes to complete</p>
            </div>
            
            <div className="assessment-landing-why-card">
              <div className="assessment-landing-why-icon">
                <SvgIcon name="lock" size={24} color="currentColor" />
              </div>
              <h3 className="assessment-landing-why-card-title">No Obligation</h3>
              <p className="assessment-landing-why-card-text">100% free with no commitment required. Just information to help you decide</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
