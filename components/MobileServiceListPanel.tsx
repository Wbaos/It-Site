"use client";

import { ChevronLeft } from "lucide-react";
import ServiceGroupList from "./ServiceGroupList";
import { groupTitleEs } from "@/lib/groupTitlesEs";
import { useState } from "react";

export default function MobileServiceListPanel({
  group,
  cat,
  onBack,
  onClose,
  locale = "en",
}: {
  group: any;
  cat: any;
  onBack: () => void;
  onClose: () => void;
  locale?: "en" | "es";
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
            {locale === "es" ? "Volver" : "Back"}
          </button>

          <h3 className="mobile-services-title">
            {locale === "es"
              ? groupTitleEs(group.slug, group.title)
              : group.title}
          </h3>
        </div>

        {/* BODY */}
        <div className="mobile-services-body">
          <ServiceGroupList
            title={
              locale === "es"
                ? groupTitleEs(group.slug, group.title)
                : group.title
            }
            locale={locale}
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
