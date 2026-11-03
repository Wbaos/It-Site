"use client";

import type { RefObject } from "react";
import SvgIcon from "@/components/common/SvgIcons";
import type { ApiCategory } from "@/lib/request-quote-data";

import type {
  SelectableService,
  SelectedService,
  UrgencyOption,
  UrgencyOptionId,
} from "@/components/request-quote/types";

export default function Step1ServiceSelection(props: {
  categories: ApiCategory[];
  activeTab: string;
  setTab: (tab: string) => void;
  searchQuery: string;
  setSearchQuery: (v: string) => void;
  tabContainerRef: RefObject<HTMLDivElement | null>;
  onTabsScroll: () => void;
  activeCategoryTitle: string;
  activeServices: SelectableService[];
  selectedService: SelectedService | null;
  setSelectedService: (v: SelectedService | null) => void;
  needSomethingElse: boolean;
  setNeedSomethingElse: (v: boolean) => void;
  otherServiceText: string;
  setOtherServiceText: (v: string) => void;
  urgencyOptions: readonly UrgencyOption[];
  urgencyId: UrgencyOptionId | "";
  setUrgencyId: (v: UrgencyOptionId) => void;
  canContinue: boolean;
  onContinue: () => void;
}) {
  const isGroupedView = props.activeTab === "all" || props.activeTab === "popular";

  const categoryTitleBySlug = new Map(
    props.categories.map((c) => [c.categorySlug, c.category] as const)
  );

  const servicesByCategorySlug = (() => {
    const map = new Map<string, SelectableService[]>();
    for (const srv of props.activeServices) {
      const arr = map.get(srv.categorySlug);
      if (arr) arr.push(srv);
      else map.set(srv.categorySlug, [srv]);
    }
    return map;
  })();

  const orderedCategorySlugs = props.categories
    .map((c) => c.categorySlug)
    .filter((slug) => servicesByCategorySlug.has(slug));

  const renderServiceCard = (srv: SelectableService) => {
    const isSelected =
      props.selectedService?.serviceSlug === srv.serviceSlug &&
      props.selectedService?.groupSlug === srv.groupSlug;

    return (
      <button
        key={`${srv.groupSlug}:${srv.serviceSlug}`}
        type="button"
        onClick={() => {
          props.setSelectedService({
            categorySlug: srv.categorySlug,
            groupSlug: srv.groupSlug,
            serviceSlug: srv.serviceSlug,
            title: srv.title,
          });
        }}
        className={
          isSelected
            ? "rq-step1__serviceCard rq-step1__serviceCard--selected"
            : "rq-step1__serviceCard rq-step1__serviceCard--default"
        }
      >
        <div className="rq-step1__serviceCardRow">
          <div className="rq-step1__serviceIconBox">
            {srv.icon?.asset?.url ? (
              <img
                src={srv.icon.asset.url}
                alt={srv.icon.alt || srv.title}
                className="rq-step1__serviceIconImg"
                loading="lazy"
              />
            ) : (
              <SvgIcon name="tag" size={18} color="#94a3b8" />
            )}
          </div>
          <div className="rq-step1__serviceText">
            <div className="rq-step1__serviceTitle">
              {srv.title}
            </div>
          </div>

          {isSelected && (
            <span className="rq-step1__serviceSelected" aria-hidden="true">
              <SvgIcon name="checkmark-circle" size={20} color="#34d399" />
            </span>
          )}
        </div>
      </button>
    );
  };

  return (
    <div className="rq-step1">
      <h2 className="rq-step1__title">¿Qué servicio necesitas?</h2>
      <p className="rq-step1__subtitle">Explora y selecciona entre nuestros servicios</p>

      {/* Search */}
      <div className="rq-step1__searchSection">
        <div className="rq-step1__searchWrap">
          <span className="rq-step1__searchIcon" aria-hidden="true">
            <SvgIcon name="search" size={18} color="currentColor" />
          </span>
          <input
            value={props.searchQuery}
            onChange={(e) => props.setSearchQuery(e.target.value)}
            placeholder="Buscar servicios..."
            className="rq-step1__searchInput"
          />
        </div>
      </div>

      {/* Tabs */}
      <div
        ref={props.tabContainerRef}
        onScroll={props.onTabsScroll}
        className="rq-step1__tabs rq-scrollbar rq-scrollbar-x"
      >
        <button
          type="button"
          onClick={() => props.setTab("all")}
          className={
            props.activeTab === "all"
              ? "rq-step1__tab rq-step1__tab--active"
              : "rq-step1__tab rq-step1__tab--inactive"
          }
        >
          Todos los servicios
        </button>
        <button
          type="button"
          onClick={() => props.setTab("popular")}
          className={
            props.activeTab === "popular"
              ? "rq-step1__tab rq-step1__tab--active"
              : "rq-step1__tab rq-step1__tab--inactive"
          }
        >
          Servicios populares
        </button>
        {props.categories.map((c) => (
          <button
            key={c.categorySlug}
            type="button"
            onClick={() => props.setTab(c.categorySlug)}
            className={
              props.activeTab === c.categorySlug
                ? "rq-step1__tab rq-step1__tab--active"
                : "rq-step1__tab rq-step1__tab--inactive"
            }
          >
            {c.category}
          </button>
        ))}
      </div>

      {/* Results header */}
      {!isGroupedView && (
        <div className="rq-step1__resultsHeader">
          {props.activeCategoryTitle.toUpperCase()} ({props.activeServices.length})
        </div>
      )}

      {/* Services grid */}
      <div className="rq-step1__services rq-scrollbar">
        {props.activeServices.length === 0 ? (
          <div className="rq-step1__empty">
            <div className="rq-step1__emptyIcon">
              <SvgIcon name="search" size={28} color="#64748b" />
            </div>
            <div className="rq-step1__emptyText">
              {props.searchQuery.trim()
                ? `No se encontraron servicios que coincidan con "${props.searchQuery.trim()}"`
                : "No se encontraron servicios"}
            </div>
          </div>
        ) : isGroupedView ? (
          <div className="rq-step1__groups">
            {orderedCategorySlugs.map((catSlug) => {
              const list = servicesByCategorySlug.get(catSlug) ?? [];
              if (!list.length) return null;
              const title = categoryTitleBySlug.get(catSlug) || "Servicios";

              return (
                <div key={catSlug} className="rq-step1__group">
                  <div className="rq-step1__groupHeader">
                    {title.toUpperCase()} ({list.length})
                  </div>
                  <div className="rq-step1__grid">
                    {list.map(renderServiceCard)}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="rq-step1__grid">
            {props.activeServices.map(renderServiceCard)}
          </div>
        )}
      </div>

      {/* Selected banner */}
      {props.selectedService && (
        <div className="rq-step1__selected">
          <div className="rq-step1__selectedLeft">
            <SvgIcon name="verified-check" size={18} color="#34d399" />
            <span>
              Seleccionado: <strong>{props.selectedService.title}</strong>
            </span>
          </div>
          <button
            type="button"
            onClick={() => props.setSelectedService(null)}
            className="rq-step1__clearBtn"
            aria-label="Quitar servicio seleccionado"
            title="Quitar"
          >
            <SvgIcon name="x" size={18} color="currentColor" />
          </button>
        </div>
      )}

      {/* Necesitas algo más */}
      <button
        type="button"
        onClick={() => props.setNeedSomethingElse(!props.needSomethingElse)}
        className="rq-step1__otherToggle"
      >
        <div className="rq-step1__otherRow">
          <input
            type="checkbox"
            checked={props.needSomethingElse}
            onChange={(e) => props.setNeedSomethingElse(e.target.checked)}
            className="rq-step1__otherCheckbox"
            aria-label="Necesitas algo más"
          />
          <div>
            <div className="rq-step1__otherTitle">¿Necesitas algo más?</div>
            <div className="rq-step1__otherDesc">
              ¿No ves lo que buscas? Describe lo que necesitas abajo.
            </div>
          </div>
        </div>
      </button>

      {props.needSomethingElse && (
        <div className="rq-step1__otherInputWrap">
          <input
            value={props.otherServiceText}
            onChange={(e) => props.setOtherServiceText(e.target.value)}
            placeholder="Describe el servicio que necesitas..."
            className="rq-step1__otherInput"
          />
        </div>
      )}

      <div className="rq-step1__urgency">
        <div className="rq-step1__urgencyTitle">¿Qué tan urgente es tu solicitud?</div>
        <div className="rq-step1__urgencyGrid">
          {props.urgencyOptions.map((opt) => {
            const selected = opt.id === props.urgencyId;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => props.setUrgencyId(opt.id)}
                className={
                  selected
                    ? "rq-step1__urgencyBtn rq-step1__urgencyBtn--active"
                    : "rq-step1__urgencyBtn rq-step1__urgencyBtn--inactive"
                }
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>

      <button
        type="button"
        onClick={props.onContinue}
        disabled={!props.canContinue}
        className={
          props.canContinue
            ? "rq-step1__continue rq-step1__continue--enabled"
            : "rq-step1__continue rq-step1__continue--disabled"
        }
      >
        Continuar
      </button>
    </div>
  );
}
