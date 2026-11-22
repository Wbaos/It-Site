// Home video asset (Sanity CDN). Plain module (no "use client") so the
// values resolve both in Server Components (the VideoObject schema in
// HomeTemplate) and in the Client Component (the <video> element in
// HeroVideo). Both import from here, so the schema and the player can
// never drift apart.
// Re-encoded 2026-11-22 for smooth playback: 720p, constant 30 fps,
// faststart, no audio — 3.5 MB (was 5.4 MB). The source played choppy /
// robotic on phones; the re-encode keeps the same 14.1 s and near-identical
// quality (CRF 32, viewed frame by frame). Under 1 MB was not reachable
// without visible quality loss on this footage (dense foliage + water
// mist + continuous pan), so size was traded for smoothness + quality.
export const HOME_VIDEO_URL =
  "https://cdn.sanity.io/files/celkrwoq/production/88e624ed8e517c5ae0949430df2ad5a47f8d2070.mp4";
export const HOME_VIDEO_POSTER_URL =
  "https://cdn.sanity.io/images/celkrwoq/production/5839c3116edccd85882b50a97612a27ed68bd9f9-1024x768.jpg?w=640&auto=format&q=50";
// Google requires uploadDate as a full ISO 8601 datetime WITH timezone;
// a bare date ("2026-11-06") is flagged invalid / missing timezone.
// 22 Nov is EST (-05:00).
export const HOME_VIDEO_UPLOAD_DATE = "2026-11-22T18:18:00-05:00";
// Verified with ffprobe 22 Nov 2026: the file is 14.1 s long.
export const HOME_VIDEO_DURATION = "PT14S";
