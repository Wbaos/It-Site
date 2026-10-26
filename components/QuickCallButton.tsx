import { Phone } from "lucide-react";

export default function QuickCallButton() {
  return (
    <a
      href="tel:+17863662729"
      className="quick-call-button"
      aria-label="Call CallTechCare at (786) 366-2729"
    >
      <Phone size={20} aria-hidden="true" />
      <span>(786) 366-2729</span>
    </a>
  );
}
