import { Phone } from "lucide-react";

// Phone comes from the siteSettings document via the layout; the
// defaults below are the exact values shown today.
export default function QuickCallButton({
  phoneTel = "+17863662729",
  phoneDisplay = "(786) 366-2729",
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
