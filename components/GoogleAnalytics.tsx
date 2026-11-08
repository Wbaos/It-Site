"use client";

import Script from "next/script";
import { useEffect, useState } from "react";
import { readConsentCookie } from "@/lib/consent";

export default function GoogleAnalytics() {
  const gaId = process.env.NEXT_PUBLIC_GA_ID;
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (!gaId) return;

    const consent = readConsentCookie();
    setEnabled(Boolean(consent?.analytics));

    const refresh = () => {
      const next = readConsentCookie();
      setEnabled(Boolean(next?.analytics));
    };

    // Cookie changes don’t emit events; we’ll re-check on focus + hash change.
    window.addEventListener("focus", refresh);
    window.addEventListener("hashchange", refresh);
    window.addEventListener("ctc_consent_changed", refresh);
    return () => {
      window.removeEventListener("focus", refresh);
      window.removeEventListener("hashchange", refresh);
      window.removeEventListener("ctc_consent_changed", refresh);
    };
  }, [gaId]);

  if (!gaId || !enabled) return null;

  // GA4 itself is loaded by the Google tag inside Google Tag Manager
  // (GTM-NTDHKLLQ, tag for G-R1HZ7W3YL9, fires on every page load), so
  // this component must NOT load gtag.js or configure the GA4 property
  // again — that second config double-counted page views for consented
  // visitors. What lives here is only the Google Ads setup: the AW
  // config and the phone-click conversion, which GTM does not provide.
  // Commands queue in dataLayer and run once GTM's gtag.js loads.
  return (
    <>
      <Script id="google-ads" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

          // Google Ads conversion tracking
          gtag('config', 'AW-17496959572');

          // Track phone clicks automatically
          document.addEventListener('click', function(e) {
            const link = e.target.closest('a[href^="tel:"]');
            if (!link) return;

            if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
              window.gtag('event', 'conversion', {
                send_to: 'AW-17496959572/UHy5CJ-MkbEdENTUmZdB'
              });
            }
          });
        `}
      </Script>
    </>
  );
}
