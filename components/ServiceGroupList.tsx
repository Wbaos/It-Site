"use client";

import Link from "next/link";

export default function ServiceGroupList({
  title,
  items,
  onSelect,
}: {
  title: string;
  items: any[];
  onSelect?: (service?: any) => void;
}) {
  return (
    <div className="svc-list submenu-left-column">
      {items.map((s, i) => {
        const subs = s.subservices ?? [];
        const hasSubs = subs.length > 0;
        const key =
          typeof s.slug === "object" ? s.slug.current : s.slug || i;

        const isHourly = s?.pricingModel === "hourly";
        const hasNumericPrice = typeof s?.price === "number";

        return (
          <Link
            key={key}
            href="#"
            className={`svc-card ${s.popular ? "popular-service" : ""}`}
            onClick={(e) => {
              const isMobile = window.innerWidth < 900;

              e.preventDefault();

              // Mobile: always select
              if (isMobile) {
                onSelect?.(s);
                return;
              }

              // Desktop: expand if has subservices
              if (hasSubs) {
                onSelect?.(s);
                return;
              }

              // Desktop: navigate if no subservices
              window.location.href = `/services/${s.slug}`;
            }}
          >
            <div className="svc-left">
              <div className="svc-check">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <path
                    d="M20 6 9 17l-5-5"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
            <div className="svc-mid-container">

            <div className="svc-mid">
              <span className="svc-title">
                {s.title}
                {hasSubs && (
                  <span className="srv-count">({subs.length})</span>
                )}
              </span>

              {s.navDescription && (
                <p className="svc-desc">{s.navDescription}</p>
              )}
            </div>
             <div className="svc-right">
              {s.popular && (
                <span className="svc-badge">Popular</span>
              )}
            </div>
 </div>
            {s.showPrice && hasNumericPrice && (
              <span className="svc-price">
                ${s.price}
                {isHourly ? "/hr" : ""}
              </span>
            )}

           
          </Link>
        );
      })}
    </div>
  );
}
