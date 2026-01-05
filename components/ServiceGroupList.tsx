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
    <>
      <h2 className="svc-group-heading">{title}</h2>

      <div className="svc-list">
        {items.map((s, i) => {
          const subs = s.subservices ?? [];
          const hasSubs = subs.length > 0;

          const key = typeof s.slug === "object" ? s.slug.current : s.slug || i;
          return (
            <Link
              key={key}
              href="#"
              className={`svc-card ${s.popular ? "popular-service" : ""}`}
              onClick={(e) => {
                const isMobile = window.innerWidth < 900;
                const subs = s.subservices ?? [];
                const hasSubs = subs.length > 0;

                e.preventDefault();

                if (isMobile && hasSubs) {
                  onSelect?.(s);
                  return;
                }

                if (isMobile && !hasSubs) {
                  onSelect?.(s);
                  return;
                }

                if (!isMobile && hasSubs) {
                  onSelect?.(s);
                  return;
                }

                if (!isMobile && !hasSubs) {
                  window.location.href = `/services/${s.slug}`;
                  return;
                }
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

              <div className="svc-mid">
                <span className="svc-title">{s.title}</span>

                {s.description && <p className="svc-desc">{s.description}</p>}

                {s.showPrice && (
                  <span className="svc-price">
                    ${s.price}
                    {title === "Support"}
                  </span>
                )}
              </div>

              <div className="svc-right">
                {s.popular && <span className="svc-badge">Popular</span>}
              </div>
            </Link>
          );
        })}
      </div>
    </>
  );
}
