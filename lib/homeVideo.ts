// Home video asset (Sanity CDN). Plain module (no "use client") so the
// values resolve both in Server Components (the VideoObject schema in
// HomeTemplate) and in the Client Component (the <video> element in
// HomeVideo). Both import from here, so the schema and the player can
// never drift apart.
// The file went live 2026-11-06 (lighter re-encode of the same video).
export const HOME_VIDEO_URL =
  "https://cdn.sanity.io/files/celkrwoq/production/1fed58166a9d6dcd13bcef55421ef6873c9408ae.mp4";
export const HOME_VIDEO_POSTER_URL =
  "https://cdn.sanity.io/images/celkrwoq/production/5839c3116edccd85882b50a97612a27ed68bd9f9-1024x768.jpg?w=640&auto=format&q=50";
export const HOME_VIDEO_UPLOAD_DATE = "2026-11-06";
// Verified with ffprobe 13 Nov 2026: the file is 14.1 s long.
export const HOME_VIDEO_DURATION = "PT14S";
