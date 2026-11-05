import { Phone } from "lucide-react";
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
      <Phone size={20} aria-hidden="true" />
      <span>{phoneDisplay}</span>
    </a>
  );
}
