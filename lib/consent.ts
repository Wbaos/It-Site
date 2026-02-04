export const CONSENT_COOKIE_NAME = "ctc_consent" as const;
export const CONSENT_COOKIE_VERSION = 1 as const;

export type ConsentState = {
  version: number;
  updatedAt: string;
  analytics: boolean;
  marketing: boolean;
  functional: boolean;
};

const DEFAULT_CONSENT: ConsentState = {
  version: CONSENT_COOKIE_VERSION,
  updatedAt: new Date(0).toISOString(),
  analytics: false,
  marketing: false,
  functional: false,
};

function isBrowser() {
  return typeof document !== "undefined";
}

export function readConsentCookie(): ConsentState | null {
  if (!isBrowser()) return null;

  const raw = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${CONSENT_COOKIE_NAME}=`))
    ?.split("=")
    .slice(1)
    .join("=");

  if (!raw) return null;

  try {
    const decoded = decodeURIComponent(raw);
    const parsed = JSON.parse(decoded) as Partial<ConsentState>;

    return {
      ...DEFAULT_CONSENT,
      ...parsed,
      version: typeof parsed.version === "number" ? parsed.version : CONSENT_COOKIE_VERSION,
      updatedAt: typeof parsed.updatedAt === "string" ? parsed.updatedAt : new Date().toISOString(),
      analytics: Boolean(parsed.analytics),
      marketing: Boolean(parsed.marketing),
      functional: Boolean(parsed.functional),
    };
  } catch {
    return null;
  }
}

export function writeConsentCookie(next: Omit<ConsentState, "version" | "updatedAt">) {
  if (!isBrowser()) return;

  const value: ConsentState = {
    version: CONSENT_COOKIE_VERSION,
    updatedAt: new Date().toISOString(),
    analytics: Boolean(next.analytics),
    marketing: Boolean(next.marketing),
    functional: Boolean(next.functional),
  };

  const encoded = encodeURIComponent(JSON.stringify(value));
  const maxAge = 60 * 60 * 24 * 365; // 1 year
  const secure = window.location.protocol === "https:" ? "; Secure" : "";

  document.cookie = `${CONSENT_COOKIE_NAME}=${encoded}; Max-Age=${maxAge}; Path=/; SameSite=Lax${secure}`;

  // Notify client listeners (cookies don’t trigger events by themselves)
  window.dispatchEvent(new Event("ctc_consent_changed"));
}

export function clearConsentCookie() {
  if (!isBrowser()) return;
  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${CONSENT_COOKIE_NAME}=; Max-Age=0; Path=/; SameSite=Lax${secure}`;

  window.dispatchEvent(new Event("ctc_consent_changed"));
}

// Best-effort cleanup (GA cookies are set on the current domain)
export function clearGoogleAnalyticsCookies() {
  if (!isBrowser()) return;

  const cookieNames = document.cookie
    .split("; ")
    .map((c) => c.split("=")[0])
    .filter((name) => name === "_ga" || name.startsWith("_ga_"));

  for (const name of cookieNames) {
    document.cookie = `${name}=; Max-Age=0; Path=/; SameSite=Lax`;
    // Try also with Secure if needed
    document.cookie = `${name}=; Max-Age=0; Path=/; SameSite=Lax; Secure`;
  }
}
