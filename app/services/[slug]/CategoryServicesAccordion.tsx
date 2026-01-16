"use client";
import React, { useState } from "react";
import SvgIcon from "@/components/common/SvgIcons";
import Link from "next/link";

interface Service {
  title: string;
  slug: string | { current: string };
  description?: string;
  price?: number;
  showPrice?: boolean;
  popular?: boolean;
}

interface ServiceGroup {
  title: string;
  slug: string | { current: string };
  description?: string;
  services: Service[];
}

interface Props {
  serviceGroups: ServiceGroup[];
}

export default function CategoryServicesAccordion({ serviceGroups }: { serviceGroups: any[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(serviceGroups && serviceGroups.length > 0 ? 0 : null);
  const handleToggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <div className="category-services-list">
      {serviceGroups.map((group, idx) => {
        const groupSlug = typeof group.slug === 'string' ? group.slug : group.slug.current;
        const isOpen = openIndex === idx;
        let displayPrice = null;
        if (group.services && group.services.length > 0) {
          const allPrices = group.services.filter((s: Service) => s.showPrice && typeof s.price === 'number').map((s: Service) => s.price);
          if (allPrices.length > 0) {
            displayPrice = Math.min(...allPrices);
          }
        }
        return (
          <div className="category-service-accordion" key={groupSlug}>
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
                    <span className="category-service-title-row-flex">
                      <span className="category-service-title">{group.title}</span>
                      <span className="category-service-count">({(group.services ?? []).length})</span>
                    </span>
                    {group.description && (
                      <span className="category-service-desc">{group.description}</span>
                    )}
                  </span>
                </span>
              </div>
              <div className="category-service-meta">
                <span className="category-service-price-row">
                  <span className="category-service-price-col">
                    {displayPrice && (
                      <span className="category-service-price green">${displayPrice}</span>
                    )}
                    {displayPrice && (
                      <span className="category-service-price-label">starting price</span>
                    )}
                  </span>
                  <span className="category-service-arrow-wrap">
                    <SvgIcon name="arrow-right-simple" size={18} className={`category-service-arrow${isOpen ? " rotated" : ""}`} />
                  </span>
                </span>
              </div>
            </button>
            {isOpen && (
              <div className="category-service-dropdown">
                {group.services && group.services.length === 1 ? (
                  <div className="single-service-option" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', minHeight: 64 }}>
                    <span className="single-service-title">{group.services[0].title}</span>
                    <div className="single-service-actions" style={{ marginLeft: 'auto' }}>
                      <Link href={`/services/${typeof group.services[0].slug === 'string' ? group.services[0].slug : group.services[0].slug.current}`} className="subservice-card-book-btn">
                        Book Now
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className="dropdown-subservices-cards">
                    {(group.services ?? []).map((service: Service, sidx: number) => {
                      let serviceSlug = typeof service.slug === 'string' ? service.slug : service.slug.current;
                      return (
                        <div key={serviceSlug} className="subservice-card">
                          <div className="subservice-card-header">
                            <div className="subservice-card-title-row">
                              <span className="subservice-card-title">{service.title}</span>
                              {service.popular && (
                                <span className="subservice-card-badge">Popular</span>
                              )}
                            </div>
                            <div className="subservice-card-desc">{service.description}</div>
                          </div>
                          <div className="subservice-card-bottom">
                            {service.showPrice && service.price && (
                              <span className="subservice-card-price">${service.price}</span>
                            )}
                            <Link href={`/services/${serviceSlug}`} className="subservice-card-book-btn">
                              Book
                            </Link>
                          </div>
                        </div>
                      );
                    })}
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
