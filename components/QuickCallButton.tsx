import SpriteIcon from "@/components/common/SpriteIcon";
import { FALLBACK_SETTINGS } from "@/lib/sanitySettings";

// Phone comes from the siteSettings document via the layout; the
// defaults below are the exact values shown today.
export default function QuickCallButton({
  phoneTel = FALLBACK_SETTINGS.phoneTel,
  phoneDisplay = FALLBACK_SETTINGS.phoneDisplay,
}: {
  phoneTel?: string;
  phoneDisplay?: string;
}) {
  return (
    <a
      href={`tel:${phoneTel}`}
      className="quick-call-button"
      aria-label={`Call CallTechCare at ${phoneDisplay}`}
    >
      <SpriteIcon name="phone-lucide" size={20} ariaHidden />
      <span>{phoneDisplay}</span>
    </a>
  );
}
