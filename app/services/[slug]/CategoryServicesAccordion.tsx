"use client";

import React, { useState } from "react";
import SvgIcon from "@/components/common/SvgIcons";
import Link from "next/link";
import Image from "next/image";

interface Service {
  title: string;
  slug: string | { current: string };
  price?: number;
  serviceType?: string;
  showPrice?: boolean;
  popular?: boolean;
  description?: string;
  subservices?: any[];
}

interface Props {
  services: Service[];
}

export default function CategoryServicesAccordion({ services }: Props) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const handleToggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <div className="category-services-list">
      {services.map((s: Service, idx: number) => {
          const slug = typeof s.slug === 'string' ? s.slug : s.slug.current;
          const isOpen = openIndex === idx;
          const subs = s.subservices || [];
          const install = subs.filter((ss) => ss.serviceType === "installation");
          const support = subs.filter((ss) => ss.serviceType === "support");
          // Option 2: Use lowest subservice price if no price on main service
          let displayPrice = s.showPrice && s.price ? s.price : null;
          if (!displayPrice && subs.length > 0) {
            const allPrices = subs.map(ss => ss.price).filter(p => typeof p === 'number');
            if (allPrices.length > 0) {
              displayPrice = Math.min(...allPrices);
            }
          }
          return (
            <div className="category-service-accordion" key={slug}>
              <button
                className={`category-service-item${isOpen ? " open" : ""}`}
                onClick={() => handleToggle(idx)}
                aria-expanded={isOpen}
                type="button"
              >
                <div className="category-service-info">
                  <span className="category-service-title-row">
                    <SvgIcon name="checkmark-circle" size={40} color="#34d399" className="category-service-check" />
                    <span className="category-service-title-block">
                      <span className="category-service-title">{s.title}</span>
                      {s.description && (
                        <span className="category-service-desc">{s.description}</span>
                      )}
                    </span>
                  </span>
                  {/* Description now inside .category-service-title-block for alignment */}
                </div>
                <div className="category-service-meta">
                  {s.popular && (
                    <span className="category-service-badge">Popular</span>
                  )}
                  <span className="category-service-price-row">
                    <span className="category-service-price-col">
                      {displayPrice && (
                        <span className="category-service-price green">${displayPrice}</span>
                      )}
                      <span className="category-service-price-label">starting price</span>
                    </span>
                      <span className="category-service-arrow-wrap">
                        <SvgIcon name="arrow-right-simple" size={18} className={`category-service-arrow${isOpen ? " rotated" : ""}`} />
                      </span>
                  </span>
                </div>
              </button>
              {isOpen && (
                <div className="category-service-dropdown">
                  {subs.length > 0 ? (
                    <>
                      {install.length > 0 && (
                        <>
                          <div className="dropdown-group-title">Installation & Setup</div>
                          <div className="dropdown-subservices-cards">
                            {install.map((sub) => (
                              <div key={sub.slug} className="subservice-card">
                                <div className="subservice-card-header">
                                  <div className="subservice-card-title-row">
                                    <span className="subservice-card-title">{sub.title}</span>
                                    {sub.popular && (
                                      <span className="subservice-card-badge">Popular</span>
                                    )}
                                  </div>
                                  <div className="subservice-card-desc">{sub.description}</div>
                                </div>
                                <div className="subservice-card-bottom">
                                  {sub.showPrice && sub.price && (
                                    <span className="subservice-card-price">${sub.price}</span>
                                  )}
                                  <Link href={`/services/${sub.slug}`} className="subservice-card-book-btn">
                                    Book
                                  </Link>
                                </div>
                              </div>
                            ))}
                          </div>
                        </>
                      )}
                      {support.length > 0 && (
                        <>
                          <div className="dropdown-group-title">Support</div>
                          <div className="dropdown-subservices-cards">
                            {support.map((sub) => (
                              <div key={sub.slug} className="subservice-card">
                                <div className="subservice-card-header">
                                  <div className="subservice-card-title-row">
                                    <span className="subservice-card-title">{sub.title}</span>
                                    {sub.popular && (
                                      <span className="subservice-card-badge">Popular</span>
                                    )}
                                  </div>
                                  <div className="subservice-card-desc">{sub.description}</div>
                                </div>
                                <div className="subservice-card-bottom">
                                  {sub.showPrice && sub.price && (
                                    <span className="subservice-card-price">${sub.price}</span>
                                  )}
                                  <Link href={`/services/${sub.slug}/book/step1`} className="subservice-card-book-btn">
                                    Book
                                  </Link>
                                </div>
                              </div>
                            ))}
                          </div>
                        </>
                      )}
                    </>
                  ) : (
                    <div className="dropdown-subservices-cards">
                      <div className="subservice-card">
                        <div className="subservice-card-header">
                          <div className="subservice-card-title-row">
                            <span className="subservice-card-title">{s.title}</span>
                            {s.popular && (
                              <span className="subservice-card-badge">Popular</span>
                            )}
                          </div>
                          <div className="subservice-card-desc">{s.description}</div>
                        </div>
                        <div className="subservice-card-bottom">
                          {s.showPrice && s.price && (
                            <span className="subservice-card-price">${s.price}</span>
                          )}
                          <Link href={`/services/${slug}`} className="subservice-card-book-btn">
                            Book
                          </Link>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
    </div>
  );
}