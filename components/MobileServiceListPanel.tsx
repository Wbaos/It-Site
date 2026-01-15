"use client";

import { ChevronLeft } from "lucide-react";
import ServiceGroupList from "./ServiceGroupList";
import { useState } from "react";

export default function MobileServiceListPanel({
  group,
  cat,
  onBack,
  onClose,
}: {
  group: any;
  cat: any;
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

          <h3 className="mobile-services-title">{group.title}</h3>
        </div>

        {/* BODY */}
        <div className="mobile-services-body">
          <ServiceGroupList
            title={group.title}
            items={group.services}
            onSelect={(srv) => {
              if (!srv) return;
              onClose();
              window.location.href = `/services/${srv.slug}`;
            }}
          />
        </div>
      </div>
    </div>
  );
}
