"use client";

import { ChevronLeft } from "lucide-react";
import ServiceGroupList from "./ServiceGroupList";
import { useState } from "react";
import MobileSubservicesPanel from "./MobileSubServicesPanel";

export default function MobileServiceListPanel({
  service,
  onBack,
  onClose,
}: {
  service: any;
  onBack: () => void;
  onClose: () => void;
}) {
  const [activeGroup, setActiveGroup] = useState<{
    title: string;
    items: any[];
  } | null>(null);

  const [isBack, setIsBack] = useState(false);

  const installSubs = service.subservices.filter(
    (s: any) => s.serviceType === "installation"
  );
  const supportSubs = service.subservices.filter(
    (s: any) => s.serviceType === "support"
  );

  const groups = [
    installSubs.length > 0 && {
      title: "Installation & Setup",
      items: installSubs,
    },
    supportSubs.length > 0 && {
      title: "Support",
      items: supportSubs,
    },
  ].filter(Boolean) as { title: string; items: any[] }[];

  return (
    <>
      {!activeGroup && (
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

              <h3 className="mobile-services-title">{service.title}</h3>
            </div>

            {/* BODY */}
            <div className="mobile-services-body">
              {groups.map((group) => (
                <div key={group.title}>
                  <ServiceGroupList
                    title={group.title}
                    items={group.items}
                    onSelect={(srv) => {
                      if (!srv) return;

                      const hasSubs = srv.subservices && srv.subservices.length > 0;

                      if (!hasSubs) {
                        onClose();
                        window.location.href = `/services/${srv.slug}`;
                        return;
                      }

                      setIsBack(false);
                      setActiveGroup({
                        title: srv.title,
                        items: srv.subservices
                      });
                    }}

                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeGroup && (
        <MobileSubservicesPanel
          group={activeGroup}
          serviceTitle={service.title}
          onBack={() => {
            setIsBack(true); 
            setActiveGroup(null);
          }}
          onClose={onClose}
        />
      )}
    </>
  );
}
