"use client";

import { ChevronLeft } from "lucide-react";
import ServiceGroupList from "./ServiceGroupList";
import { useState } from "react";

export default function MobileSubservicesPanel({
  group,
  serviceTitle,
  onBack,
  onClose,
}: {
  group: { title: string; items: any[] };
  serviceTitle: string;
  onBack: () => void;
  onClose: () => void;
}) {
  const [isBack, setIsBack] = useState(false);

  return (
    <div className="mobile-services-overlay">
      <div
        className={`mobile-services-panel ${
          isBack ? "mobile-slide-back" : "mobile-slide-forward"
        }`}
      >
        <div className="mobile-services-header">
          <button
            className="back-outline-btn"
            onClick={() => {
              setIsBack(true); 
              onBack();
            }}
          >
            <ChevronLeft size={18} />
            Back
          </button>

          <h3 className="mobile-services-title">{serviceTitle}</h3>
        </div>

        <div className="mobile-services-body">
          <ServiceGroupList
            title={group.title}
            items={group.items}
            onSelect={(srv) => {
              onClose();
              window.location.href = `/services/${srv.slug}`;
            }}
          />
        </div>
      </div>
    </div>
  );
}
