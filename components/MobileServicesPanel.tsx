"use client";

import { ChevronLeft } from "lucide-react";
import SvgIcon from "@/components/common/SvgIcons";
import { useState } from "react";
import MobileServiceListPanel from "./MobileServiceListPanel";

export default function MobileServicesPanel({
  categories,
  onClose,
}: {
  categories: any[];
  onClose: () => void;
}) {
  const [activeGroup, setActiveGroup] = useState<{ group: any, cat: any } | null>(null);
  const [isBack, setIsBack] = useState(false);

  return (
    <>
      {!activeGroup && (
        <div className="mobile-services-overlay">
          <div
            className={`mobile-services-panel ${
              isBack ? "mobile-slide-back" : "mobile-slide-forward"
            }`}
          >
            {/* HEADER */}
            <div className="mobile-services-header">
              <button
                className="back-outline-btn mobile-services-back"
                onClick={() => {
                  setIsBack(true);
                  onClose();
                }}
              >
                <ChevronLeft size={18} />
                Back
              </button>

              <h3 className="mobile-services-title">All Services</h3>
            </div>

            <div className="mobile-services-body">
              {categories.map((cat: any) => (
                <div key={cat.category} className="dropdown-category">
                  <div className="dropdown-header">
                    {cat.categorySlug ? (
                      <a
                        href={`/services/${cat.categorySlug}`}
                        className="dropdown-title"
                        onClick={e => {
                          e.preventDefault();
                          onClose();
                          if (typeof window !== 'undefined') {
                            window.location.href = `/services/${cat.categorySlug}`;
                          }
                        }}
                        style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', cursor: 'pointer' }}
                      >
                        {cat.icon?.url ? (
                          <img
                            src={cat.icon.url}
                            alt={cat.icon.alt || cat.category}
                            width={22}
                            height={22}
                          />
                        ) : (
                          <SvgIcon name="tag" size={22} />
                        )}
                        <h4 style={{ marginLeft: 8 }}>{cat.category}</h4>
                      </a>
                    ) : (
                      <div className="dropdown-title" style={{ display: 'flex', alignItems: 'center', opacity: 0.5 }}>
                        {cat.icon?.url ? (
                          <img
                            src={cat.icon.url}
                            alt={cat.icon.alt || cat.category}
                            width={22}
                            height={22}
                          />
                        ) : (
                          <SvgIcon name="tag" size={22} />
                        )}
                        <h4 style={{ marginLeft: 8 }}>{cat.category}</h4>
                      </div>
                    )}
                  </div>
                  <ul>
                    {cat.groups?.map((group: any) => (
                      <li key={group.slug}>
                        <a
                          href="#"
                          className="dropdown-link"
                          onClick={e => {
                            e.preventDefault();
                            setIsBack(false);
                            setActiveGroup({ group, cat });
                          }}
                        >
                          <span className="srv-left">
                            <span className="dot"></span>
                            {group.title}
                          </span>
                          {group.services && (
                            <span className="srv-count">
                              ({group.services.length})
                            </span>
                          )}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeGroup && (
        <MobileServiceListPanel
          group={activeGroup.group}
          cat={activeGroup.cat}
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
