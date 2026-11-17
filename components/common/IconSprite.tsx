// SVG sprite: every symbol below is defined ONCE here and referenced with')
// <svg><use href="#ctc-…" /></svg> everywhere else (see SvgIcon and
// SpriteIcon). Pages used to ship the same star / check / map-pin paths
// 150+ times inline (~50 KB of repeated SVG per page); the sprite cuts
// that to one definition plus a ~25-byte <use> per instance. The sprite
// itself is rendered once, first thing in <body>, by the root layout.
//
// Visual contract: each symbol contains ONLY the inner paths/shapes of
// the original icon, with no fill/stroke of its own — those are inherited
// from the <svg> that references it, exactly as the inline versions got
// them from their own <svg> attributes. So colors, sizes and stroke
// widths render identically; only the bytes change.
export default function IconSprite() {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      width="0"
      height="0"
      style={{ position: "absolute" }}
      xmlns="http://www.w3.org/2000/svg"
    >
      <symbol id="ctc-star" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" className="star-shape" /></symbol>
      <symbol id="ctc-verified-check" viewBox="0 0 24 24"><path d="M12 2a10 10 0 1 0 10 10A10.011 10.011 0 0 0 12 2zm-1.2 14.1-4.2-4.2 1.4-1.4 2.8 2.8 5.8-5.8 1.4 1.4Z" /></symbol>
      <symbol id="ctc-checkmark-circle" viewBox="0 0 50 50"><path d="M 25 2 C 12.317 2 2 12.317 2 25 C 2 37.683 12.317 48 25 48 C 37.683 48 48 37.683 48 25 C 48 20.44 46.660281 16.189328 44.363281 12.611328 L 42.994141 14.228516 C 44.889141 17.382516 46 21.06 46 25 C 46 36.579 36.579 46 25 46 C 13.421 46 4 36.579 4 25 C 4 13.421 13.421 4 25 4 C 30.443 4 35.393906 6.0997656 39.128906 9.5097656 L 40.4375 7.9648438 C 36.3525 4.2598437 30.935 2 25 2 z M 43.236328 7.7539062 L 23.914062 30.554688 L 15.78125 22.96875 L 14.417969 24.431641 L 24.083984 33.447266 L 44.763672 9.046875 L 43.236328 7.7539062 z" /></symbol>
      <symbol id="ctc-check" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"></polyline></symbol>
      <symbol id="ctc-map-pin" viewBox="0 0 24 24"><path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0Z" /> <circle cx="12" cy="10" r="3" /></symbol>
      <symbol id="ctc-chevron-left" viewBox="0 0 24 24"><path d="M19 12H5" /> <path d="M11 19l-7-7 7-7" /></symbol>
      <symbol id="ctc-chevron-right" viewBox="0 0 24 24"><path d="M5 12h14" /> <path d="M13 5l7 7-7 7" /></symbol>
      <symbol id="ctc-chevron-down" viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9" /></symbol>
      <symbol id="ctc-arrow-right-simple" viewBox="0 0 24 24"><polyline points="8 5 16 12 8 19" /></symbol>
      <symbol id="ctc-phone" viewBox="0 0 24 24"><path d="M22 16.92V21a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 5.18 2 2 0 0 1 4.11 3h4.08a2 2 0 0 1 2 1.72c.12.86.31 1.7.57 2.5a2 2 0 0 1-.45 2.11L8.09 11.91a16 16 0 0 0 6 6l2.58-2.22a2 2 0 0 1 2.11-.45c.8.26 1.64.45 2.5.57A2 2 0 0 1 22 16.92z" /></symbol>
      <symbol id="ctc-mail" viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2" /> <path d="M3 7l9 6 9-6" /></symbol>
      <symbol id="ctc-search" viewBox="0 0 24 24"><path d="M21 21L16.65 16.65" /> <path d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z" /></symbol>
      <symbol id="ctc-tag" viewBox="0 0 24 24"><path d="M20.59 13.41L11 3H3v8l9.59 9.59c.78.78 2.05.78 2.83 0l5.17-5.17c.78-.78.78-2.05 0-2.83z" /> <circle cx="7.5" cy="7.5" r="1.5" /></symbol>
      <symbol id="ctc-calendar" viewBox="0 0 24 24"><path d="M8 7V3m8 4V3" /> <rect x="3" y="5" width="18" height="16" rx="2" /> <path d="M3 11h18" /></symbol>
      <symbol id="ctc-document" viewBox="0 0 24 24"><rect x="5" y="3" width="14" height="18" rx="2" strokeWidth="1.5" /> <path d="M9 7h6M9 11h6M9 15h3" strokeWidth="1.5" strokeLinecap="round" /></symbol>
      <symbol id="ctc-map-pin-lucide" viewBox="0 0 24 24"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" /> <circle cx="12" cy="10" r="3" /></symbol>
      <symbol id="ctc-arrow-up-right" viewBox="0 0 24 24"><path d="M7 7h10v10" /> <path d="M7 17 17 7" /></symbol>
      <symbol id="ctc-check-circle-2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /> <path d="m9 12 2 2 4-4" /></symbol>
      <symbol id="ctc-phone-lucide" viewBox="0 0 24 24"><path d="M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384" /></symbol>
      <symbol id="ctc-star-lucide" viewBox="0 0 24 24"><path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z" /></symbol>
      <symbol id="ctc-arrow-right-lucide" viewBox="0 0 24 24"><path d="M5 12h14" /> <path d="m12 5 7 7-7 7" /></symbol>
    </svg>
  );
}

