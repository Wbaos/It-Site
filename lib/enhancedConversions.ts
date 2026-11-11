// Manual Enhanced Conversions for Google Ads (user_data).
//
// Google's automatic enhanced conversions are already on (the gtag
// config in GoogleAnalytics.tsx), but Ads still reports setup issues
// because no page code passes the user's own data with the conversion.
// These helpers send ONLY what the user typed into the form being
// submitted, right before the conversion event fires.
//
// Google hashes the values on its side — we never hash, log, store, or
// send them anywhere else (no localStorage, no global state, no other
// endpoint). When a field is missing or cannot be normalized to a
// plausible value, it is simply omitted (better to send nothing than a
// bad value).

export function normalizeEmail(
  value: string | undefined | null
): string | null {
  if (!value) return null;
  const email = value.trim().toLowerCase();
  return email ? email : null;
}

// Normalize a US phone number to E.164 (+1 + 10 digits).
// - Strips everything that is not a digit, except a leading "+".
// - 10 digits -> prepend +1.
// - 11 digits starting with 1 -> prepend +.
// - Already starts with + -> leave it.
// Returns null when the result is not a plausible E.164 value
// (7-15 digits after the +).
export function normalizePhoneE164(
  value: string | undefined | null
): string | null {
  if (!value) return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  const hasPlus = trimmed.startsWith("+");
  const digits = trimmed.replace(/\D/g, "");
  if (!digits) return null;
  let e164: string;
  if (hasPlus) {
    e164 = `+${digits}`;
  } else if (digits.length === 11 && digits.startsWith("1")) {
    e164 = `+${digits}`;
  } else if (digits.length === 10) {
    e164 = `+1${digits}`;
  } else {
    return null;
  }
  const totalDigits = e164.length - 1;
  if (totalDigits < 7 || totalDigits > 15) return null;
  return e164;
}

// Set the Ads user_data from the values the user just entered, only
// with the fields that are present and normalized. No-ops when gtag is
// not loaded or when there is nothing usable to send.
export function setAdsUserData(input: {
  email?: string | null;
  phone?: string | null;
}): void {
  if (typeof window === "undefined") return;
  const gtag = (
    window as unknown as { gtag?: (...args: unknown[]) => void }
  ).gtag;
  if (typeof gtag !== "function") return;
  const user_data: { email?: string; phone_number?: string } = {};
  const email = normalizeEmail(input.email ?? undefined);
  if (email) user_data.email = email;
  const phone_number = normalizePhoneE164(input.phone ?? undefined);
  if (phone_number) user_data.phone_number = phone_number;
  if (Object.keys(user_data).length === 0) return;
  gtag("set", "user_data", user_data);
}
