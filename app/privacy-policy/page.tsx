import { Metadata } from "next";
import Link from "next/link";
import SvgIcon from "@/components/common/SvgIcons";

export const metadata: Metadata = {
  title: "Privacy Policy | CallTechCare",
  description:
    "Learn how CallTechCare collects, uses, and protects your personal information while providing tech support services.",
};

export default function PrivacyPolicyPage() {
  return (
    <section className="legal-wrapper">
      <div className="legal-container">

        <Link href="/" className="legal-back">
          <SvgIcon name="chevron-left" size={18} color="var(--brand-teal)" />
          Back to Home
        </Link>

        <div className="legal-header">
          <SvgIcon
            name="privacy-shield"
            size={80}
            className="legal-header-icon"
          />

          <h1>Privacy Policy</h1>
          <p className="legal-updated">Last Updated: November 10, 2025</p>

          <p className="legal-intro">
            At CallTechCare, we are committed to protecting your privacy and
            ensuring the security of your personal information. This Privacy
            Policy explains how we collect, use, share, and safeguard your
            data.
          </p>
        </div>

        <div className="legal-card">
          <div className="legal-card-header">
            <SvgIcon name="privacy-info-collect" size={38} className="legal-card-icon" />
            <h2>Information We Collect</h2>
          </div>

          <p className="legal-highlight">Personal Information</p>
          <p>
            When you use our services, we may collect your name, email
            address, phone number, billing address, and payment details. This
            information is necessary to provide IT support and communicate
            with you.
          </p>

          <p className="legal-highlight">Technical Information</p>
          <p>
            We automatically collect certain technical details such as your
            IP address, browser type, device information, referring URLs,
            and pages viewed. This helps us improve site performance and
            diagnose issues.
          </p>

          <p className="legal-highlight">Service Data</p>
          <p>
            During IT support sessions, we may access diagnostic logs or
            system data strictly to troubleshoot and resolve technical
            problems.
          </p>
        </div>

        <div className="legal-card">
          <div className="legal-card-header">
            <SvgIcon name="privacy-how-we-use" size={38} className="legal-card-icon" />
            <h2>How We Use Your Information</h2>
          </div>

          <p className="legal-highlight">Service Delivery</p>
          <p>
            We use your information to provide, maintain, and improve our IT
            services, including troubleshooting, system setup, and customer
            support.
          </p>

          <p className="legal-highlight">Communication</p>
          <p>
            We may contact you regarding service updates, scheduling,
            invoices, troubleshooting, or optional newsletters. You may opt
            out of marketing at any time.
          </p>

          <p className="legal-highlight">Analytics & Improvements</p>
          <p>
            We analyze website and service usage to improve performance and
            build better features for our customers.
          </p>

          <p className="legal-highlight">Legal Compliance</p>
          <p>
            Your information may be used to comply with legal requirements,
            enforce agreements, or resolve disputes.
          </p>
        </div>

        <div className="legal-card">
          <div className="legal-card-header">
            <SvgIcon name="privacy-security" size={38} className="legal-card-icon" />
            <h2>Data Security</h2>
          </div>

          <p className="legal-highlight">Security Measures</p>
          <p>
            We implement strong technical safeguards including SSL
            encryption, secure servers, firewalls, and malware protection.
          </p>

          <p className="legal-highlight">Access Controls</p>
          <p>
            Access to personal data is restricted to authorized personnel
            who follow strict confidentiality and security practices.
          </p>

          <p className="legal-highlight">Third-Party Security</p>
          <p>
            We carefully vet all third-party service providers to ensure
            they meet security and privacy standards.
          </p>
        </div>

        <div className="legal-card">
          <div className="legal-card-header">
            <SvgIcon name="privacy-sharing" size={38} className="legal-card-icon" />
            <h2>Information Sharing</h2>
          </div>

          <p className="legal-highlight">Service Providers</p>
          <p>
            We may share necessary information with trusted partners such as
            payment processors, hosting providers, or analytics tools.
          </p>

          <p className="legal-highlight">Legal Requirements</p>
          <p>
            We may disclose your information if required by law, court
            order, or to protect our rights and the safety of users.
          </p>

          <p className="legal-highlight">Business Transfers</p>
          <p>
            If CallTechCare undergoes a merger or acquisition, customer
            information may be transferred as part of the transaction.
          </p>

          <p className="legal-highlight">With Your Consent</p>
          <p>
            We will never share your data with third parties for marketing
            without your explicit permission.
          </p>
        </div>

        <div className="legal-card">
          <div className="legal-card-header">
            <SvgIcon name="privacy-cookies" size={38} className="legal-card-icon" />
            <h2>Cookies & Tracking Technologies</h2>
          </div>

          <p>
            We use cookies to improve your browsing experience, analyze
            performance, and store preferences.
          </p>

          <p className="legal-highlight">Essential Cookies</p>
          <p>Required for site functionality and security.</p>

          <p className="legal-highlight">Analytics Cookies</p>
          <p>Help us understand how visitors use our website.</p>

          <p className="legal-highlight">Marketing Cookies</p>
          <p>Used only with your consent to personalize ads or content.</p>
        </div>

        <div className="legal-card">
        <div className="legal-card-header">
            <SvgIcon name="privacy-children" size={38} className="legal-card-icon" />
            <h2>Children’s Privacy</h2>
        </div>

        <p>
            Our services are not directed to individuals under the age of 18. We do not
            knowingly collect personal information from children. If we become aware that
            we have collected personal information from a child without parental consent,
            we will take immediate steps to delete such information.
        </p>
        </div>


        <div className="legal-card">
        <div className="legal-card-header">
            <SvgIcon name="privacy-changes" size={38} className="legal-card-icon" />
            <h2>Changes to This Privacy Policy</h2>
        </div>

        <p>
            We may update this Privacy Policy from time to time to reflect changes in our
            practices or legal requirements. When we make material changes, we will notify
            you by:
        </p>

        <ul>
            <li>Posting the updated policy on our website</li>
            <li>Updating the “Last Updated” date at the top of this page</li>
            <li>Sending an email notification for significant updates</li>
        </ul>

        <p>
            We encourage you to review this Privacy Policy periodically to stay informed
            about how we protect your information.
        </p>
        </div>


        <div className="legal-card legal-contact-card legal-contact-layout">

        <div className="legal-contact-icon-col">
            <SvgIcon
            name="privacy-questions"
            size={80}
            className="legal-card-icon"
            />
        </div>

        <div className="legal-contact-content-col">
            <h2>Questions About Privacy?</h2>

            <p>
            If you have any questions, concerns, or requests regarding this Privacy
            Policy or our data practices, please don’t hesitate to contact us.
            </p>

            <p><strong>Email:</strong> support@calltechcare.com</p>
            <p><strong>Phone:</strong> (786) 366-2729</p>
            <p><strong>Mail:</strong> Miami, FL</p>


            <Link href="/#contact" className="legal-contact-btn">
            Contact Us
            </Link>
        </div>

        </div>



      </div>
    </section>
  );
}
