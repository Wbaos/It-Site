"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const DISCOUNT_POPUP_SEEN_KEY = "ctc_discount_popup_seen";
const DISCOUNT_POPUP_MINIMIZED_KEY = "ctc_discount_popup_minimized";
const DISCOUNT_POPUP_TEASER_DISMISSED_KEY = "ctc_discount_popup_teaser_dismissed";
const DISCOUNT_POPUP_SIGNED_UP_COOKIE = "ctc_discount_popup_signed_up";
const DISCOUNT_POPUP_SEEN_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days
const OPEN_DELAY_MS = 6000;
const API_TIMEOUT_MS = 8000;
const DISCOUNT_LEAD_API = "/api/discount-signup";
const SUCCESS_AUTO_CLOSE_MS = 5000;
const FALLBACK_CODE = "MYFIRSTSERVICE#-10";

type DiscountType = "percentage" | "flat";
type GtagFn = (...args: unknown[]) => void;

function formatUsd(amount: number): string {
  const safe = Number(amount);
  if (!Number.isFinite(safe)) return "$0";
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: Number.isInteger(safe) ? 0 : 2,
    }).format(safe);
  } catch {
    return `$${safe}`;
  }
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function getCookieValue(name: string): string | null {
  if (typeof document === "undefined") return null;
  const cookies = document.cookie ? document.cookie.split(";") : [];
  for (const raw of cookies) {
    const cookie = raw.trim();
    if (!cookie) continue;
    if (cookie.startsWith(`${name}=`)) {
      return decodeURIComponent(cookie.slice(name.length + 1));
    }
  }
  return null;
}

function setCookie(name: string, value: string, days: number) {
  if (typeof document === "undefined") return;
  const expires = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toUTCString();
  const secure = window.location?.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${name}=${encodeURIComponent(value)}; Expires=${expires}; Path=/; SameSite=Lax${secure}`;
}

function hasRecentSeenFlag(): boolean {
  try {
    const raw = localStorage.getItem(DISCOUNT_POPUP_SEEN_KEY);
    if (!raw) return false;

    // Migration: older versions stored "1".
    if (raw === "1") {
      localStorage.setItem(DISCOUNT_POPUP_SEEN_KEY, String(Date.now()));
      return true;
    }

    const seenAt = Number(raw);
    if (!Number.isFinite(seenAt) || seenAt <= 0) {
      localStorage.removeItem(DISCOUNT_POPUP_SEEN_KEY);
      return false;
    }

    const isRecent = Date.now() - seenAt < DISCOUNT_POPUP_SEEN_TTL_MS;
    if (!isRecent) localStorage.removeItem(DISCOUNT_POPUP_SEEN_KEY);
    return isRecent;
  } catch {
    return false;
  }
}

function markSeenNow() {
  try {
    localStorage.setItem(DISCOUNT_POPUP_SEEN_KEY, String(Date.now()));
  } catch {
    // ignore
  }
}

type PopupCopy = {
  teaserTitle: string;
  teaserSub: string;
  teaserOpenLabel: string;
  teaserDismissLabel: string;
  leftSmall: string;
  dialogLabel: string;
  closeLabel: string;
  title: string;
  subtitle: string;
  emailLabel: string;
  phoneLabel: string;
  consent: string;
  consentViewOur: string;
  privacyPolicy: string;
  privacyHref: string;
  cta: string;
  sending: string;
  decline: string;
  successTitle: string;
  successSubtitle: string;
  codeLabel: string;
  successHintFlat: (value: string) => string;
  successHintPercent: (percent: number) => string;
  alreadySignedUp: string;
  alreadyUsed: string;
  enterEmail: string;
  validEmail: string;
  enterPhone: string;
  agreeMarketing: string;
  timedOut: string;
  networkError: string;
};

// Interface copy lives in code (not Sanity): English on EN pages, Spanish
// on /es/* pages. Same popup, same structure — only the text changes.
const POPUP_COPY: Record<"en" | "es", PopupCopy> = {
  en: {
    teaserTitle: "Get 10% OFF",
    teaserSub: "Claim your discount →",
    teaserOpenLabel: "Open discount popup",
    teaserDismissLabel: "Dismiss discount teaser",
    leftSmall: "Your First Service",
    dialogLabel: "Discount",
    closeLabel: "Close",
    title: "Unlock Your Discount",
    subtitle: "Join our list and get exclusive offers",
    emailLabel: "EMAIL ADDRESS",
    phoneLabel: "PHONE NUMBER",
    consent:
      "I agree to receive marketing communications including promotions, discounts, and service updates via email and SMS. I can unsubscribe at any time.",
    consentViewOur: "View our",
    privacyPolicy: "Privacy Policy",
    privacyHref: "/privacy-policy",
    cta: "Get My 10% Off",
    sending: "Sending...",
    decline: "No thanks, maybe later",
    successTitle: "You're All Set!",
    successSubtitle: "Your discount code has been sent to your email:",
    codeLabel: "YOUR CODE",
    successHintFlat: (value) => `Use this code for ${value} off your first service`,
    successHintPercent: (percent) => `Use this code for ${percent}% off your first service`,
    alreadySignedUp: "This email is already signed up.",
    alreadyUsed: "This email has already used the one-time discount.",
    enterEmail: "Please enter your email.",
    validEmail: "Please enter a valid email.",
    enterPhone: "Please enter your phone number.",
    agreeMarketing: "Please agree to receive marketing communications.",
    timedOut: "Request timed out. Please try again.",
    networkError: "Network error. Please try again.",
  },
  es: {
    teaserTitle: "Obtén 10% DE DESCUENTO",
    teaserSub: "Reclama tu descuento →",
    teaserOpenLabel: "Abrir el popup de descuento",
    teaserDismissLabel: "Descartar el aviso de descuento",
    leftSmall: "Tu primer servicio",
    dialogLabel: "Descuento",
    closeLabel: "Cerrar",
    title: "Desbloquea tu descuento",
    subtitle: "Únete a nuestra lista y recibe ofertas exclusivas",
    emailLabel: "CORREO ELECTRÓNICO",
    phoneLabel: "NÚMERO DE TELÉFONO",
    consent:
      "Acepto recibir comunicaciones de marketing, incluyendo promociones, descuentos y novedades del servicio por correo electrónico y SMS. Puedo cancelar en cualquier momento.",
    consentViewOur: "Ver nuestra",
    privacyPolicy: "Política de Privacidad",
    privacyHref: "/es/politica-de-privacidad",
    cta: "Obtener mi 10% de descuento",
    sending: "Enviando...",
    decline: "No gracias, quizás más tarde",
    successTitle: "¡Todo listo!",
    successSubtitle: "Tu código de descuento fue enviado a tu correo:",
    codeLabel: "TU CÓDIGO",
    successHintFlat: (value) => `Usa este código para ${value} de descuento en tu primer servicio`,
    successHintPercent: (percent) => `Usa este código para ${percent}% de descuento en tu primer servicio`,
    alreadySignedUp: "Este correo ya está registrado.",
    alreadyUsed: "Este correo ya usó el descuento único.",
    enterEmail: "Ingresa tu correo electrónico.",
    validEmail: "Ingresa un correo electrónico válido.",
    enterPhone: "Ingresa tu número de teléfono.",
    agreeMarketing: "Acepta recibir comunicaciones de marketing.",
    timedOut: "La solicitud tardó demasiado. Inténtalo de nuevo.",
    networkError: "Error de red. Inténtalo de nuevo.",
  },
};

export default function DiscountSignupPopup() {
  const session = null;
  const status = "unauthenticated" as const;
  const pathname = usePathname();
  const isSpanish = pathname?.startsWith("/es") ?? false;
  const t = POPUP_COPY[isSpanish ? "es" : "en"];

  const [hydrated, setHydrated] = useState(false);
  const [signedUp, setSignedUp] = useState(false);
  const [open, setOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [teaserDismissed, setTeaserDismissed] = useState(false);

  const [step, setStep] = useState<"form" | "success">("form");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [consent, setConsent] = useState(false);

  const [busy, setBusy] = useState(false);
  const [formStatus, setFormStatus] = useState<string | null>(null);
  const [issuedCode, setIssuedCode] = useState(FALLBACK_CODE);
  const [issuedPercent, setIssuedPercent] = useState(10);
  const [issuedDiscountType, setIssuedDiscountType] = useState<DiscountType>("percentage");
  const [issuedDiscountValue, setIssuedDiscountValue] = useState(10);

  const [emailCheckBusy, setEmailCheckBusy] = useState(false);
  const [emailTaken, setEmailTaken] = useState(false);

  useEffect(() => {
    setHydrated(true);

    try {
      if (getCookieValue(DISCOUNT_POPUP_SIGNED_UP_COOKIE) === "1") {
        setSignedUp(true);
      }

      if (localStorage.getItem(DISCOUNT_POPUP_TEASER_DISMISSED_KEY) === "1") {
        setTeaserDismissed(true);
      }
      if (localStorage.getItem(DISCOUNT_POPUP_MINIMIZED_KEY) === "1") {
        setMinimized(true);
      }
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    if (session) return;
    if (signedUp) return;

    if (pathname?.startsWith("/signup") || pathname?.startsWith("/login")) return;

    if (hasRecentSeenFlag()) return;

    const timer = window.setTimeout(() => {
      setOpen(true);
      setStep("form");
      setFormStatus(null);
      setMinimized(false);

      try {
        localStorage.removeItem(DISCOUNT_POPUP_MINIMIZED_KEY);
      } catch {
        // ignore
      }

      try {
        markSeenNow();
      } catch {
        // ignore storage errors
      }
    }, OPEN_DELAY_MS);

    return () => window.clearTimeout(timer);
  }, [hydrated, pathname, session, signedUp]);

  function close(reason: "dismiss" | "success") {
    setOpen(false);

    // If they dismiss without submitting, keep a floating teaser.
    if (reason === "dismiss" && step === "form") {
      if (!teaserDismissed) setMinimized(true);
      try {
        localStorage.setItem(DISCOUNT_POPUP_MINIMIZED_KEY, "1");
      } catch {
        // ignore
      }
    } else {
      setMinimized(false);
      try {
        localStorage.removeItem(DISCOUNT_POPUP_MINIMIZED_KEY);
      } catch {
        // ignore
      }
    }
  }

  function dismissTeaser() {
    setMinimized(false);
    setTeaserDismissed(true);
    try {
      localStorage.setItem(DISCOUNT_POPUP_TEASER_DISMISSED_KEY, "1");
      localStorage.removeItem(DISCOUNT_POPUP_MINIMIZED_KEY);
    } catch {
      // ignore
    }
  }

  function openPopup() {
    setOpen(true);
    setStep("form");
    setFormStatus(null);
    setMinimized(false);
    try {
      localStorage.removeItem(DISCOUNT_POPUP_MINIMIZED_KEY);
      markSeenNow();
    } catch {
      // ignore
    }
  }

  useEffect(() => {
    if (!hydrated) return;
    if (signedUp) return;

    const trimmed = email.trim();
    if (!trimmed || !isValidEmail(trimmed)) {
      setEmailTaken(false);
      setEmailCheckBusy(false);
      return;
    }

    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      setEmailCheckBusy(true);
      try {
        const res = await fetch(
          `${DISCOUNT_LEAD_API}?email=${encodeURIComponent(trimmed)}`,
          { signal: controller.signal }
        );
        const data = await res.json().catch(() => ({}));
        const exists = Boolean(data?.exists);
        setEmailTaken(exists);

        if (exists) {
          setFormStatus(t.alreadySignedUp);
        } else {
          setFormStatus((prev) => (prev === t.alreadySignedUp ? null : prev));
        }
      } catch {
        // ignore check errors
      } finally {
        setEmailCheckBusy(false);
      }
    }, 450);

    return () => {
      controller.abort();
      window.clearTimeout(timer);
    };
  }, [email, hydrated, signedUp, t]);

  useEffect(() => {
    if (!open) return;
    if (step !== "success") return;

    const timer = window.setTimeout(() => {
      close("success");
    }, SUCCESS_AUTO_CLOSE_MS);

    return () => window.clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, step]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const trimmedEmail = email.trim();
    const trimmedPhone = phone.trim();

    if (!trimmedEmail) {
      setFormStatus(t.enterEmail);
      return;
    }

    if (!isValidEmail(trimmedEmail)) {
      setFormStatus(t.validEmail);
      return;
    }

    if (!trimmedPhone) {
      setFormStatus(t.enterPhone);
      return;
    }

    if (!consent) {
      setFormStatus(t.agreeMarketing);
      return;
    }

    setBusy(true);
    setFormStatus(null);

    try {
      const controller = new AbortController();
      const timeoutId = window.setTimeout(() => controller.abort(), API_TIMEOUT_MS);

      const res = await fetch(
        DISCOUNT_LEAD_API,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: trimmedEmail,
            phone: trimmedPhone,
            consent: true,
          }),
          signal: controller.signal,
        }
      );

      window.clearTimeout(timeoutId);

      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data?.ok) {
        if (data?.code === "EMAIL_EXISTS") {
          setEmailTaken(true);
          setFormStatus(t.alreadySignedUp);
          return;
        }
        if (data?.code === "ALREADY_USED") {
          setEmailTaken(true);
          setFormStatus(t.alreadyUsed);
          return;
        }
        setFormStatus(String(data?.error || "Something went wrong"));
        return;
      }

      if (data?.discountCode) setIssuedCode(String(data.discountCode));
      if (data?.discountType === "flat" || data?.discountType === "percentage") {
        setIssuedDiscountType(data.discountType);
      }
      if (typeof data?.value === "number" && Number.isFinite(data.value) && data.value > 0) {
        setIssuedDiscountValue(data.value);
        if (data?.discountType === "percentage") {
          setIssuedPercent(data.value);
        }
      }
      // Backward compatibility (older API shape)
      if (typeof data?.discountPercent === "number" && Number.isFinite(data.discountPercent)) {
        setIssuedDiscountType("percentage");
        setIssuedDiscountValue(data.discountPercent);
        setIssuedPercent(data.discountPercent);
      }

      setCookie(DISCOUNT_POPUP_SIGNED_UP_COOKIE, "1", 365);
      setSignedUp(true);
      try {
        markSeenNow();
        localStorage.removeItem(DISCOUNT_POPUP_MINIMIZED_KEY);
      } catch {
        // ignore
      }

      if (typeof window !== "undefined") {
        const gtag = (window as unknown as { gtag?: GtagFn })?.gtag;
        if (gtag) {
          gtag("event", "generate_lead", {
            event_category: "Discount Popup",
            event_label: "10% Signup",
          });
        }
      }

      setStep("success");
    } catch (err: unknown) {
      const anyErr = err as { name?: unknown };
      if (anyErr?.name === "AbortError") {
        setFormStatus(t.timedOut);
      } else {
        setFormStatus(t.networkError);
      }
    } finally {
      setBusy(false);
    }
  }

  const isBlockedRoute = Boolean(
    pathname?.startsWith("/signup") || pathname?.startsWith("/login")
  );

  const canShowUI = hydrated && !session && !isBlockedRoute && (!signedUp || open);
  if (!canShowUI) return null;

  return (
    <>
      {minimized && !open ? (
        <div
          className="discount-popup__teaser"
          role="button"
          tabIndex={0}
          aria-label={t.teaserOpenLabel}
          onClick={openPopup}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") openPopup();
          }}
        >
          <button
            type="button"
            className="discount-popup__teaserDismiss"
            aria-label={t.teaserDismissLabel}
            onClick={(e) => {
              e.stopPropagation();
              dismissTeaser();
            }}
          >
            ×
          </button>

          <div className="discount-popup__teaserInner">
            <div className="discount-popup__teaserIcon" aria-hidden="true">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M20 12v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-8"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <path d="M4 12h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <path d="M12 22V7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <path
                  d="M12 7H7.5a2.5 2.5 0 1 1 0-5C10 2 12 7 12 7Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinejoin="round"
                />
                <path
                  d="M12 7h4.5a2.5 2.5 0 1 0 0-5C14 2 12 7 12 7Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            <div className="discount-popup__teaserText">
              <div className="discount-popup__teaserTitle">{t.teaserTitle}</div>
              <div className="discount-popup__teaserSub">{t.teaserSub}</div>
            </div>

            <div className="discount-popup__teaserChevron" aria-hidden="true">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M6 14l6-6 6 6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
        </div>
      ) : null}

      {open ? (
        <aside className="discount-popup" role="dialog" aria-label={t.dialogLabel} aria-live="polite" aria-modal="true">
          <div className="discount-popup__backdrop" />

          <div className={`discount-popup__panel ${step === "success" ? "discount-popup__panel--success" : ""}`}>
            {step === "form" && (
              <div className="discount-popup__left" aria-hidden="true">
                <div className="discount-popup__leftIcon">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M20 12v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-8"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                    <path
                      d="M4 12h16"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                    <path
                      d="M12 22V7"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                    <path
                      d="M12 7H7.5a2.5 2.5 0 1 1 0-5C10 2 12 7 12 7Z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M12 7h4.5a2.5 2.5 0 1 0 0-5C14 2 12 7 12 7Z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <div className="discount-popup__leftBig">10% OFF</div>
                {/* <div className="discount-popup__leftOff">OFF</div> */}
                <div className="discount-popup__leftSmall">{t.leftSmall}</div>
              </div>
            )}

            <div className="discount-popup__right">
              <button type="button" className="discount-popup__close" onClick={() => close("dismiss")} aria-label={t.closeLabel}>
                ×
              </button>

          {step === "form" && (
            <>
              <div className="discount-popup__header">
                <h3 className="discount-popup__title">{t.title}</h3>
                <p className="discount-popup__subtitle">{t.subtitle}</p>
              </div>

              <form className="discount-popup__form" onSubmit={handleSubmit}>
                <div className="discount-popup__field">
                  <label className="discount-popup__label" htmlFor="discount_email">
                    {t.emailLabel}
                  </label>
                  <div className="discount-popup__inputWrap">
                    <span className="discount-popup__inputIcon" aria-hidden="true">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M4 6h16v12H4V6Z"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M4 7l8 6 8-6"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                    <input
                      id="discount_email"
                      name="email"
                      type="email"
                      className="discount-popup__input"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="discount-popup__field">
                  <label className="discount-popup__label" htmlFor="discount_phone">
                    {t.phoneLabel}
                  </label>
                  <div className="discount-popup__inputWrap">
                    <span className="discount-popup__inputIcon" aria-hidden="true">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M22 16.9v3a2 2 0 0 1-2.2 2A19.8 19.8 0 0 1 3 5.2 2 2 0 0 1 5 3h3a2 2 0 0 1 2 1.7c.1.8.3 1.6.6 2.3a2 2 0 0 1-.5 2.1L9.1 10a16 16 0 0 0 5 5l.9-1a2 2 0 0 1 2.1-.5c.8.3 1.5.5 2.3.6A2 2 0 0 1 22 16.9Z"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                    <input
                      id="discount_phone"
                      name="phone"
                      type="tel"
                      className="discount-popup__input"
                      placeholder="(555) 123-4567"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <label className="discount-popup__consent">
                  <input
                    type="checkbox"
                    checked={consent}
                    onChange={(e) => setConsent(e.target.checked)}
                    required
                  />
                  <span>
                    {t.consent}
                    {" "}{t.consentViewOur}{" "}<a className="discount-popup__link" href={t.privacyHref}>{t.privacyPolicy}</a>.
                  </span>
                </label>

                <button type="submit" className="discount-popup__cta" disabled={busy || emailTaken || emailCheckBusy}>
                  {busy ? t.sending : t.cta}
                  <span className="discount-popup__ctaArrow" aria-hidden="true">→</span>
                </button>

                <button type="button" className="discount-popup__decline" onClick={() => close("dismiss")}>
                  {t.decline}
                </button>
              </form>
            </>
          )}

          {step === "success" && (
            <div className="discount-popup__success">
              <div className="discount-popup__successIcon" aria-hidden="true">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M20 6L9 17l-5-5"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>

              <h3 className="discount-popup__successTitle">{t.successTitle}</h3>
              <p className="discount-popup__successSubtitle">
                {t.successSubtitle}
              </p>

              <div className="discount-popup__codeCard">
                <div className="discount-popup__codeLabel">{t.codeLabel}</div>
                <div className="discount-popup__codeValue">{issuedCode}</div>
              </div>

              <p className="discount-popup__successHint">
                {issuedDiscountType === "flat"
                  ? t.successHintFlat(formatUsd(issuedDiscountValue))
                  : t.successHintPercent(issuedPercent)}
              </p>
            </div>
          )}

          {formStatus && <p className="discount-popup__status">{formStatus}</p>}
            </div>
          </div>
        </aside>
      ) : null}
    </>
  );
}
