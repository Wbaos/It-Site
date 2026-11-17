// Tiny <svg><use href="#ctc-…" /></svg> renderer for the Lucide icons
// that used to be imported from lucide-react (symbol definitions live in
// IconSprite, rendered once by the root layout). It keeps the exact props
// the call sites used: size (default 24, the Lucide default), strokeWidth
// (default 2), className and aria-hidden. fill="none" and
// stroke="currentColor" are the Lucide defaults, so the icon renders
// exactly as before — only the repeated path data is gone.
export type SpriteIconName =
  | "map-pin-lucide"
  | "arrow-up-right"
  | "check-circle-2"
  | "phone-lucide"
  | "star-lucide"
  | "arrow-right-lucide";

export default function SpriteIcon({
  name,
  size = 24,
  strokeWidth = 2,
  className,
  ariaHidden,
}: {
  name: SpriteIconName;
  size?: number;
  strokeWidth?: number;
  className?: string;
  ariaHidden?: boolean;
}) {
  return (
    <svg
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden={ariaHidden}
    >
      <use href={`#ctc-${name}`} />
    </svg>
  );
}
