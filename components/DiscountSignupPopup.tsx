"use client";

import { useSession } from "next-auth/react";
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

export default function DiscountSignupPopup() {
  const { data: session, status } = useSession();
  const pathname = usePathname();

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
    if (status === "loading") return;
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
  }, [hydrated, pathname, session, signedUp, status]);

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
          setFormStatus("This email is already signed up.");
        } else {
          setFormStatus((prev) => (prev === "This email is already signed up." ? null : prev));
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
  }, [email, hydrated, signedUp]);

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
      setFormStatus("Please enter your email.");
      return;
    }

    if (!isValidEmail(trimmedEmail)) {
      setFormStatus("Please enter a valid email.");
      return;
    }

    if (!trimmedPhone) {
      setFormStatus("Please enter your phone number.");
      return;
    }

    if (!consent) {
      setFormStatus("Please agree to receive marketing communications.");
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
          setFormStatus("This email is already signed up.");
          return;
        }
        if (data?.code === "ALREADY_USED") {
          setEmailTaken(true);
          setFormStatus("This email has already used the one-time discount.");
          return;
        }
        setFormStatus(String(data?.error || "Something went wrong"));
        return;
      }

      if (data?.discountCode) setIssuedCode(String(data.discountCode));
      if (typeof data?.discountPercent === "number") setIssuedPercent(data.discountPercent);

      setCookie(DISCOUNT_POPUP_SIGNED_UP_COOKIE, "1", 365);
      setSignedUp(true);
      try {
        markSeenNow();
        localStorage.removeItem(DISCOUNT_POPUP_MINIMIZED_KEY);
      } catch {
        // ignore
      }

      if (typeof window !== "undefined" && (window as any).gtag) {
        (window as any).gtag("event", "generate_lead", {
          event_category: "Discount Popup",
          event_label: "10% Signup",
        });
      }

      setStep("success");
    } catch (err: unknown) {
      const anyErr = err as { name?: unknown };
      if (anyErr?.name === "AbortError") {
        setFormStatus("Request timed out. Please try again.");
      } else {
        setFormStatus("Network error. Please try again.");
      }
    } finally {
      setBusy(false);
    }
  }

  const isBlockedRoute = Boolean(
    pathname?.startsWith("/signup") || pathname?.startsWith("/login")
  );

  const canShowUI = hydrated && status !== "loading" && !session && !isBlockedRoute && (!signedUp || open);
  if (!canShowUI) return null;

  return (
    <>
      {minimized && !open ? (
        <div
          className="discount-popup__teaser"
          role="button"
          tabIndex={0}
          aria-label="Open discount popup"
          onClick={openPopup}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") openPopup();
          }}
        >
          <button
            type="button"
            className="discount-popup__teaserDismiss"
            aria-label="Dismiss discount teaser"
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
              <div className="discount-popup__teaserTitle">Get 10% OFF</div>
              <div className="discount-popup__teaserSub">Claim your discount →</div>
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
        <aside className="discount-popup" role="dialog" aria-label="Discount" aria-live="polite" aria-modal="true">
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
                <div className="discount-popup__leftSmall">Your First Service</div>
              </div>
            )}

            <div className="discount-popup__right">
              <button type="button" className="discount-popup__close" onClick={() => close("dismiss")} aria-label="Close">
                ×
              </button>

          {step === "form" && (
            <>
              <div className="discount-popup__header">
                <h3 className="discount-popup__title">Unlock Your Discount</h3>
                <p className="discount-popup__subtitle">Join our list and get exclusive offers</p>
              </div>

              <form className="discount-popup__form" onSubmit={handleSubmit}>
                <div className="discount-popup__field">
                  <label className="discount-popup__label" htmlFor="discount_email">
                    EMAIL ADDRESS
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
                    PHONE NUMBER
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
                    I agree to receive marketing communications including promotions, discounts, and service updates via email and SMS. I can unsubscribe at any time.
                    View our <a className="discount-popup__link" href="/privacy-policy">Privacy Policy</a>.
                  </span>
                </label>

                <button type="submit" className="discount-popup__cta" disabled={busy || emailTaken || emailCheckBusy}>
                  {busy ? "Sending..." : "Get My 10% Off"}
                  <span className="discount-popup__ctaArrow" aria-hidden="true">→</span>
                </button>

                <button type="button" className="discount-popup__decline" onClick={() => close("dismiss")}>
                  No thanks, maybe later
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

              <h3 className="discount-popup__successTitle">You&apos;re All Set!</h3>
              <p className="discount-popup__successSubtitle">
                Your discount code has been sent to your email:
              </p>

              <div className="discount-popup__codeCard">
                <div className="discount-popup__codeLabel">YOUR CODE</div>
                <div className="discount-popup__codeValue">{issuedCode}</div>
              </div>

              <p className="discount-popup__successHint">
                Use this code at checkout for {issuedPercent}% off your first service
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
