"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
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
  const pathname = usePathname();
  const isSpanish = pathname === "/es" || (pathname ?? "").startsWith("/es/");
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
      {showBanner && (
        <div className="cookie-banner" role="dialog" aria-live="polite" aria-label={isSpanish ? "Consentimiento de cookies" : "Cookie consent"}>
          <div className="cookie-banner__inner">
            <div className="cookie-banner__text">
              <p className="cookie-banner__title">{isSpanish ? "Usamos cookies" : "We use cookies"}</p>
              <p className="cookie-banner__desc">
                {isSpanish
                  ? "Usamos cookies para que el sitio funcione y, con tu permiso, para medir el rendimiento con Google Analytics. Puedes aceptar todas las cookies, aceptar solo las necesarias o gestionar tus preferencias."
                  : "We use cookies to operate the site and, with your permission, measure performance using Google Analytics. You can accept all cookies, accept only necessary cookies, or manage your preferences."}
              </p>
              <p className="cookie-banner__links">
                <Link href={isSpanish ? "/es/politica-de-privacidad" : "/privacy-policy"}>{isSpanish ? "Política de Privacidad" : "Privacy Policy"}</Link>
              </p>
            </div>

            <div className="cookie-banner__actions">
              <button type="button" className="cookie-btn cookie-btn--ghost" onClick={() => setIsOpen(true)}>
                {isSpanish ? "Configuración de cookies" : "Cookie settings"}
              </button>
              <button type="button" className="cookie-btn cookie-btn--ghost" onClick={rejectNonEssential}>
                {isSpanish ? "Aceptar solo las necesarias" : "Accept only necessary"}
              </button>
              <button type="button" className="cookie-btn cookie-btn--primary" onClick={acceptAll}>
                {isSpanish ? "Aceptar todas" : "Accept all"}
              </button>
            </div>
          </div>
        </div>
      )}

      {isOpen && (
        <div className="cookie-modal" role="dialog" aria-modal="true" aria-label={isSpanish ? "Configuración de cookies" : "Cookie settings"}>
          <div className="cookie-modal__backdrop" onClick={closeModal} />
          <div className="cookie-modal__panel">
            <div className="cookie-modal__header">
              <h2>{isSpanish ? "Centro de Preferencias de Privacidad" : "Privacy Preference Center"}</h2>
              <button type="button" className="cookie-close" onClick={closeModal} aria-label={isSpanish ? "Cerrar" : "Close"}>
                ×
              </button>
            </div>

            <div className="cookie-pref">
              <div className="cookie-pref__nav" aria-label={isSpanish ? "Secciones de preferencias" : "Preference sections"}>
                <button
                  type="button"
                  className={`cookie-pref__navItem ${activeTab === "privacy" ? "is-active" : ""}`}
                  onClick={() => setActiveTab("privacy")}
                >
                  {isSpanish ? "Tu Privacidad" : "Your Privacy"}
                </button>
                <button
                  type="button"
                  className={`cookie-pref__navItem ${activeTab === "necessary" ? "is-active" : ""}`}
                  onClick={() => setActiveTab("necessary")}
                >
                  {isSpanish ? "Cookies Estrictamente Necesarias" : "Strictly Necessary Cookies"}
                </button>
                <button
                  type="button"
                  className={`cookie-pref__navItem ${activeTab === "ads" ? "is-active" : ""}`}
                  onClick={() => setActiveTab("ads")}
                >
                  {isSpanish ? "Publicidad Dirigida" : "Targeted Advertising"}
                </button>
                <button
                  type="button"
                  className={`cookie-pref__navItem ${activeTab === "performance" ? "is-active" : ""}`}
                  onClick={() => setActiveTab("performance")}
                >
                  {isSpanish ? "Cookies de Rendimiento" : "Performance Cookies"}
                </button>
              </div>

              <div className="cookie-pref__content">
                {activeTab === "privacy" && (
                  <div>
                    <h3 className="cookie-pref__title">{isSpanish ? "Tu Privacidad" : "Your Privacy"}</h3>
                    <p className="cookie-pref__text">
                      {isSpanish
                        ? "Cuando visitas este sitio web, podemos almacenar o recuperar información en tu navegador (principalmente en forma de cookies). Algunas cookies son estrictamente necesarias para que el sitio funcione. Otras nos ayudan a medir el rendimiento para mejorar la experiencia."
                        : "When you visit this website, we may store or retrieve information on your browser (mostly in the form of cookies). Some cookies are strictly necessary to make the site work. Others help us measure performance so we can improve the experience."}
                    </p>
                    <p className="cookie-pref__text">
                      {isSpanish
                        ? "Puedes cambiar tus opciones en cualquier momento abriendo la Configuración de Cookies."
                        : "You can change your choices at any time by opening Cookie Settings."}
                    </p>
                  </div>
                )}

                {activeTab === "necessary" && (
                  <div>
                    <div className="cookie-pref__titleRow">
                      <h3 className="cookie-pref__title">{isSpanish ? "Cookies Estrictamente Necesarias" : "Strictly Necessary Cookies"}</h3>
                      <span className="cookie-pref__always">{isSpanish ? "Siempre Activas" : "Always Active"}</span>
                    </div>
                    <p className="cookie-pref__text">
                      {isSpanish
                        ? "Estas cookies son necesarias para que el sitio web funcione y no se pueden desactivar. Por lo general, solo se establecen en respuesta a acciones que realizas y que equivalen a una solicitud de servicios."
                        : "These cookies are required for the website to function and cannot be switched off. They are usually only set in response to actions made by you which amount to a request for services."}
                    </p>
                  </div>
                )}

                {activeTab === "performance" && (
                  <div>
                    <div className="cookie-pref__titleRow">
                      <h3 className="cookie-pref__title">{isSpanish ? "Cookies de Rendimiento" : "Performance Cookies"}</h3>
                      <label className="cookie-switch" aria-label={isSpanish ? "Activar o desactivar las cookies de rendimiento" : "Toggle performance cookies"}>
                        <input
                          type="checkbox"
                          checked={draft.analytics}
                          onChange={(e) => setDraft((d) => ({ ...d, analytics: e.target.checked }))}
                        />
                        <span aria-hidden="true" />
                      </label>
                    </div>
                    <p className="cookie-pref__text">
                      {isSpanish
                        ? "Estas cookies nos permiten contar las visitas y las fuentes de tráfico para medir y mejorar el rendimiento de nuestro sitio. Si no permites estas cookies, no sabremos cuándo has visitado el sitio."
                        : "These cookies allow us to count visits and traffic sources so we can measure and improve the performance of our site. If you do not allow these cookies, we will not know when you have visited the site."}
                    </p>
                    <p className="cookie-pref__text">
                      {isSpanish ? "Proveedor: Google Analytics (GA4)." : "Vendor: Google Analytics (GA4)."}
                    </p>
                  </div>
                )}

                {activeTab === "ads" && (
                  <div>
                    <div className="cookie-pref__titleRow">
                      <h3 className="cookie-pref__title">{isSpanish ? "Publicidad Dirigida" : "Targeted Advertising"}</h3>
                      <label className="cookie-switch" aria-label={isSpanish ? "Activar o desactivar las cookies de publicidad dirigida" : "Toggle targeted advertising cookies"}>
                        <input
                          type="checkbox"
                          checked={draft.marketing}
                          onChange={(e) => setDraft((d) => ({ ...d, marketing: e.target.checked }))}
                        />
                        <span aria-hidden="true" />
                      </label>
                    </div>
                    <p className="cookie-pref__text">
                      {isSpanish
                        ? "Estas cookies pueden ser establecidas a través de nuestro sitio por socios publicitarios para crear un perfil de tus intereses. No habilitamos socios publicitarios a menos que lo aceptes."
                        : "These cookies may be set through our site by advertising partners to build a profile of your interests. We do not enable advertising partners unless you opt in."}
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="cookie-modal__footer">
              <button type="button" className="cookie-btn cookie-btn--ghost" onClick={savePreferences}>
                {isSpanish ? "Confirmar mis opciones" : "Confirm my choices"}
              </button>
              <button type="button" className="cookie-btn cookie-btn--ghost" onClick={rejectNonEssential}>
                {isSpanish ? "Aceptar solo cookies técnicas" : "Accept only technical cookies"}
              </button>
              <button type="button" className="cookie-btn cookie-btn--primary" onClick={acceptAll}>
                {isSpanish ? "Permitir todas" : "Allow all"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
