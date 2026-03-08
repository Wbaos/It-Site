"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useCart } from "@/lib/CartContext";
import SvgIcon from "@/components/common/SvgIcons";

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

export default function SuccessPage() {
  const { clearCart } = useCart();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    clearCart();

    // Google Ads conversion tracking
    if (typeof window !== "undefined" && typeof window.gtag === "function") {
      window.gtag("event", "conversion", {
        send_to: "AW-17496959572/YOUR_PURCHASE_LABEL",
        value: 1.0,
        currency: "USD",
        transaction_id: sessionId || undefined
      });
    }

  }, [clearCart, sessionId]);

  return (
    <main className="success-page">
      <div className="site-container">
        <section className="success-card" aria-labelledby="payment-success-title">
          <div className="success-badgeOuter" aria-hidden="true">
            <div className="success-badgeInner">
              <SvgIcon name="verified-check" size={30} color="var(--brand-teal)" />
            </div>
          </div>

          <h1 id="payment-success-title" className="success-title">
            Payment Successful
          </h1>

          <p className="success-message">
            Thank you — your payment went through and your order has been received.
            We’ll email a confirmation shortly. Your cart has been cleared so you can
            start fresh anytime.
          </p>

          <div className="success-panels">
            <div className="success-panel success-panel--next">
              <div className="success-panelTitle">What happens next?</div>

              <div className="success-steps">
                <div className="success-stepRow">
                  <div className="success-stepNum">1</div>
                  <div>
                    <div className="success-stepTitle">Confirmation email</div>
                    <div className="success-stepDesc">
                      Watch for an email confirmation with your purchase details.
                    </div>
                  </div>
                </div>

                <div className="success-stepRow">
                  <div className="success-stepNum">2</div>
                  <div>
                    <div className="success-stepTitle">We start processing</div>
                    <div className="success-stepDesc">
                      Our team begins processing your order and preparing any next steps.
                    </div>
                  </div>
                </div>

                <div className="success-stepRow">
                  <div className="success-stepNum">3</div>
                  <div>
                    <div className="success-stepTitle">Need changes or help?</div>
                    <div className="success-stepDesc">
                      Reach out anytime — we’re happy to help with questions or adjustments.
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="success-panel success-panel--help">
              <div className="success-helpTitle">Need immediate assistance?</div>
              <div className="success-helpRow">
                <div className="success-helpItem">
                  <SvgIcon name="phone" size={16} color="var(--brand-teal)" />
                  <a className="success-helpLink" href="tel:+17863662729">
                    (786) 366-2729
                  </a>
                </div>
                <div className="success-helpItem">
                  <SvgIcon name="mail" size={16} color="var(--brand-teal)" />
                  <a className="success-helpLink" href="mailto:support@calltechcare.com">
                    support@calltechcare.com
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="success-actions">
            <Link href="/" className="success-btn success-btn--primary">
              Back to Home
            </Link>
            <Link href="/services" className="success-btn success-btn--secondary">
              Browse Services
            </Link>
            <Link href="/account" className="success-btn success-btn--secondary">
              Go to Account
            </Link>
          </div>

          <p className="success-footnote">
            If you don’t see the confirmation email within a few minutes, check your spam/junk
            folder — or contact support and we’ll resend it.
          </p>
        </section>
      </div>
    </main>
  );
}