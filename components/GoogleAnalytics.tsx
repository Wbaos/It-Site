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

  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} strategy="afterInteractive" />
      <Script id="ga4" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${gaId}', { anonymize_ip: true });
        `}
      </Script>
    </>
  );
}
