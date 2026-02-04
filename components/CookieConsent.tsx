"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  clearGoogleAnalyticsCookies,
  readConsentCookie,
  writeConsentCookie,
  type ConsentState,
} from "@/lib/consent";

type ConsentDraft = Pick<ConsentState, "analytics" | "marketing" | "functional">;

const DEFAULT_DRAFT: ConsentDraft = {
  analytics: false,
  marketing: false,
  functional: false,
};

function toDraft(consent: ConsentState | null): ConsentDraft {
  if (!consent) return { ...DEFAULT_DRAFT };
  return {
    analytics: Boolean(consent.analytics),
    marketing: Boolean(consent.marketing),
    functional: Boolean(consent.functional),
  };
}

type PrefTab = "privacy" | "necessary" | "performance" | "ads";

export default function CookieConsent() {
  const [hydrated, setHydrated] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [showBanner, setShowBanner] = useState(false);
  const [draft, setDraft] = useState<ConsentDraft>({ ...DEFAULT_DRAFT });
  const [activeTab, setActiveTab] = useState<PrefTab>("privacy");

  useEffect(() => {
    setHydrated(true);
    const existing = readConsentCookie();
    setShowBanner(existing === null);
    setDraft(toDraft(existing));

    const onHash = () => {
      setIsOpen(window.location.hash === "#cookie-settings");
    };

    onHash();
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  useEffect(() => {
    if (!hydrated) return;

    // Block scrolling & signal a UI gate while the banner is visible.
    if (showBanner) {
      const prevOverflow = document.documentElement.style.overflow;
      document.documentElement.style.overflow = "hidden";
      document.documentElement.dataset.consentGate = "1";

      return () => {
        document.documentElement.style.overflow = prevOverflow;
        delete document.documentElement.dataset.consentGate;
      };
    }

    // Ensure cleanup when banner goes away.
    document.documentElement.style.overflow = "";
    delete document.documentElement.dataset.consentGate;
  }, [hydrated, showBanner]);

  function closeModal() {
    setIsOpen(false);
    // If we opened via hash, clear it so refresh doesn't reopen.
    if (window.location.hash === "#cookie-settings") {
      window.history.replaceState(null, "", window.location.pathname + window.location.search);
    }
  }

  function acceptAll() {
    writeConsentCookie({ analytics: true, marketing: true, functional: true });
    setShowBanner(false);
    closeModal();
  }

  function rejectNonEssential() {
    writeConsentCookie({ analytics: false, marketing: false, functional: false });
    clearGoogleAnalyticsCookies();
    setShowBanner(false);
    closeModal();
  }

  function savePreferences() {
    writeConsentCookie({ ...draft });
    if (!draft.analytics) {
      clearGoogleAnalyticsCookies();
    }
    setShowBanner(false);
    closeModal();
  }

  // Don’t render anything until hydrated (avoids mismatch)
  if (!hydrated) return null;

  return (
    <>
      {showBanner && <div className="cookie-gate" aria-hidden="true" />}
      {showBanner && (
        <div className="cookie-banner" role="dialog" aria-live="polite" aria-label="Cookie consent">
          <div className="cookie-banner__inner">
            <div className="cookie-banner__text">
              <p className="cookie-banner__title">We use cookies</p>
              <p className="cookie-banner__desc">
                We use cookies to operate the site and, with your permission, measure performance using Google Analytics.
                You can accept all cookies, accept only necessary cookies, or manage your preferences.
              </p>
              <p className="cookie-banner__links">
                <Link href="/privacy-policy">Privacy Policy</Link>
              </p>
            </div>

            <div className="cookie-banner__actions">
              <button type="button" className="cookie-btn cookie-btn--ghost" onClick={() => setIsOpen(true)}>
                Cookie settings
              </button>
              <button type="button" className="cookie-btn cookie-btn--ghost" onClick={rejectNonEssential}>
                Accept only necessary
              </button>
              <button type="button" className="cookie-btn cookie-btn--primary" onClick={acceptAll}>
                Accept all
              </button>
            </div>
          </div>
        </div>
      )}

      {isOpen && (
        <div className="cookie-modal" role="dialog" aria-modal="true" aria-label="Cookie settings">
          <div className="cookie-modal__backdrop" onClick={closeModal} />
          <div className="cookie-modal__panel">
            <div className="cookie-modal__header">
              <h2>Privacy Preference Center</h2>
              <button type="button" className="cookie-close" onClick={closeModal} aria-label="Close">
                ×
              </button>
            </div>

            <div className="cookie-pref">
              <div className="cookie-pref__nav" aria-label="Preference sections">
                <button
                  type="button"
                  className={`cookie-pref__navItem ${activeTab === "privacy" ? "is-active" : ""}`}
                  onClick={() => setActiveTab("privacy")}
                >
                  Your Privacy
                </button>
                <button
                  type="button"
                  className={`cookie-pref__navItem ${activeTab === "necessary" ? "is-active" : ""}`}
                  onClick={() => setActiveTab("necessary")}
                >
                  Strictly Necessary Cookies
                </button>
                <button
                  type="button"
                  className={`cookie-pref__navItem ${activeTab === "ads" ? "is-active" : ""}`}
                  onClick={() => setActiveTab("ads")}
                >
                  Targeted Advertising
                </button>
                <button
                  type="button"
                  className={`cookie-pref__navItem ${activeTab === "performance" ? "is-active" : ""}`}
                  onClick={() => setActiveTab("performance")}
                >
                  Performance Cookies
                </button>
              </div>

              <div className="cookie-pref__content">
                {activeTab === "privacy" && (
                  <div>
                    <h3 className="cookie-pref__title">Your Privacy</h3>
                    <p className="cookie-pref__text">
                      When you visit this website, we may store or retrieve information on your browser (mostly in the
                      form of cookies). Some cookies are strictly necessary to make the site work. Others help us measure
                      performance so we can improve the experience.
                    </p>
                    <p className="cookie-pref__text">
                      You can change your choices at any time by opening Cookie Settings.
                    </p>
                  </div>
                )}

                {activeTab === "necessary" && (
                  <div>
                    <div className="cookie-pref__titleRow">
                      <h3 className="cookie-pref__title">Strictly Necessary Cookies</h3>
                      <span className="cookie-pref__always">Always Active</span>
                    </div>
                    <p className="cookie-pref__text">
                      These cookies are required for the website to function and cannot be switched off. They are usually
                      only set in response to actions made by you which amount to a request for services.
                    </p>
                  </div>
                )}

                {activeTab === "performance" && (
                  <div>
                    <div className="cookie-pref__titleRow">
                      <h3 className="cookie-pref__title">Performance Cookies</h3>
                      <label className="cookie-switch" aria-label="Toggle performance cookies">
                        <input
                          type="checkbox"
                          checked={draft.analytics}
                          onChange={(e) => setDraft((d) => ({ ...d, analytics: e.target.checked }))}
                        />
                        <span aria-hidden="true" />
                      </label>
                    </div>
                    <p className="cookie-pref__text">
                      These cookies allow us to count visits and traffic sources so we can measure and improve the
                      performance of our site. If you do not allow these cookies, we will not know when you have visited
                      the site.
                    </p>
                    <p className="cookie-pref__text">
                      Vendor: Google Analytics (GA4).
                    </p>
                  </div>
                )}

                {activeTab === "ads" && (
                  <div>
                    <div className="cookie-pref__titleRow">
                      <h3 className="cookie-pref__title">Targeted Advertising</h3>
                      <label className="cookie-switch" aria-label="Toggle targeted advertising cookies">
                        <input
                          type="checkbox"
                          checked={draft.marketing}
                          onChange={(e) => setDraft((d) => ({ ...d, marketing: e.target.checked }))}
                        />
                        <span aria-hidden="true" />
                      </label>
                    </div>
                    <p className="cookie-pref__text">
                      These cookies may be set through our site by advertising partners to build a profile of your
                      interests. We do not enable advertising partners unless you opt in.
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="cookie-modal__footer">
              <button type="button" className="cookie-btn cookie-btn--ghost" onClick={savePreferences}>
                Confirm my choices
              </button>
              <button type="button" className="cookie-btn cookie-btn--ghost" onClick={rejectNonEssential}>
                Accept only technical cookies
              </button>
              <button type="button" className="cookie-btn cookie-btn--primary" onClick={acceptAll}>
                Allow all
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
