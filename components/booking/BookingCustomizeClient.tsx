"use client";

import { Fragment, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
  Transition,
} from "@headlessui/react";
import { Check, ChevronDown, Package, ShoppingCart, ShieldCheck, X } from "lucide-react";
import { sanity } from "@/lib/sanity";
import { useCart } from "@/lib/CartContext";

const styles = new Proxy({} as Record<string, string>, {
  get: (_target, prop) => (typeof prop === "string" ? prop : ""),
});

type QuestionOption = {
  label: string;
  extraCost?: number;
};

type Question = {
  id: string;
  label: string;
  shortLabel?: string;
  type?: "checkbox" | "select" | "multi-select" | "text";
  required?: boolean;
  extraCost?: number;
  options?: QuestionOption[];
  placeholder?: string;
  allowOther?: boolean;
  dependsOn?: string;
  optionsByParent?: {
    parentValue: string;
    options: QuestionOption[];
  }[];
};

type AddOn = {
  name: string;
  price: number;
};

type Service = {
  title: string;
  slug: string;
  price: number;
  pricingModel?: "flat" | "hourly";
  hourlyConfig?: {
    minimumHours?: number;
    maximumHours?: number;
    billingIncrement?: number;
  };
  description?: string;
  details?: string[];
  faqs?: { q: string; a: string }[];
  testimonials?: { author: string; quote: string }[];
  image?: { asset: { url: string } };
  questions?: Question[];
};

export default function BookingCustomizeClient({ slug }: { slug: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { items, addItem, updateItem } = useCart();

  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [responses, setResponses] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, boolean>>({});

  const isEdit = searchParams.get("edit") === "true";
  const editId = searchParams.get("id");

  useEffect(() => {
    if (!slug) return;

    const fetchService = async () => {
      setLoading(true);
      const data: Service = await sanity.fetch(
        `*[_type == "service" && slug.current == $slug][0]{
          title,
          "slug": slug.current,
          price,
          pricingModel,
          hourlyConfig{minimumHours, maximumHours, billingIncrement},
          description,
          details,
          faqs,
          testimonials,
          image{asset->{url}},
          questions[] {
            id,
            label,
            shortLabel,
            type,
            required,
            placeholder,
            extraCost,
            allowOther,
            dependsOn,
            options[]{label, extraCost},
            optionsByParent[]{ parentValue, options[]{label, extraCost} }
          }
        }`,
        { slug }
      );

      setService(data);
      setLoading(false);
    };

    fetchService();
  }, [slug]);

  useEffect(() => {
    if (!isEdit || !editId || !service?.questions) return;

    const itemToEdit = items.find((i: any) => i.id === editId);
    if (!itemToEdit) return;

    const prefilled: Record<string, any> = {};

    service.questions.forEach((q) => {
      if (q.type === "multi-select") {
        const selected = itemToEdit.options
          ?.filter((opt: any) =>
            opt.name.startsWith((q.shortLabel || q.label) + ":")
          )
          .map((opt: any) => opt.name.split(": ")[1]);

        if (selected && selected.length > 0) prefilled[q.id] = selected;
        return;
      }

      const match = itemToEdit.options?.find((opt: any) =>
        opt.name.includes(q.shortLabel || q.label)
      );

      if (!match) return;

      if (q.type === "checkbox") prefilled[q.id] = true;
      else if (q.type === "select") prefilled[q.id] = match.name.split(": ")[1];
      else if (q.type === "text") prefilled[q.id] = match.name.split(": ")[1];
    });

    setResponses(prefilled);
  }, [isEdit, editId, items, service]);

  const addOns: AddOn[] = useMemo(() => {
    const list =
      service?.questions
        ?.map((q) => {
          const value = responses[q.id];
          if (!value) return null;

          if (q.type === "checkbox" && value === true)
            return { name: q.shortLabel || q.label, price: q.extraCost ?? 0 };

          if (q.type === "select") {
            const selectedOpt = q.options?.find((o) => o.label === value);
            return {
              name: `${q.shortLabel || q.label}: ${value}`,
              price: selectedOpt?.extraCost ?? 0,
            };
          }

          if (q.type === "multi-select" && Array.isArray(value)) {
            const selectedOptions = q.options?.filter((opt) =>
              value.includes(opt.label)
            );
            return selectedOptions?.map((opt) => ({
              name: `${q.shortLabel || q.label}: ${opt.label}`,
              price: opt.extraCost ?? 0,
            }));
          }

          if (q.type === "text")
            return { name: `${q.shortLabel || q.label}: ${value}`, price: 0 };

          return null;
        })
        .flat()
        .filter(Boolean) as AddOn[];

    return Array.isArray(list) ? list : [];
  }, [responses, service?.questions]);

  const addOnsTotal = useMemo(
    () => addOns.reduce((sum, o) => sum + (o.price || 0), 0),
    [addOns]
  );

  const pricingModel = service?.pricingModel ?? "flat";
  const minimumHours = service?.hourlyConfig?.minimumHours ?? 1;

  const baseAmount = useMemo(() => {
    if (!service) return 0;
    if (pricingModel === "hourly") return service.price * Math.max(1, minimumHours);
    return service.price;
  }, [minimumHours, pricingModel, service]);

  const total = baseAmount + addOnsTotal;

  const validateRequiredQuestions = (): boolean => {
    const newErrors: Record<string, boolean> = {};

    service?.questions?.forEach((q) => {
      if (!q.required) return;

      const value = responses[q.id];

      const isMissing =
        (q.type === "text" && (!value || value.trim() === "")) ||
        (q.type === "select" && (!value || value === "")) ||
        (q.type === "multi-select" && (!value || value.length === 0)) ||
        (q.type === "checkbox" && value !== true);

      if (isMissing) newErrors[q.id] = true;
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      const firstErrorId = Object.keys(newErrors)[0];
      const el = document.getElementById(firstErrorId);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
      return false;
    }

    setErrors({});
    return true;
  };

  const handleAddToCart = async () => {
    if (!service) return;
    if (!validateRequiredQuestions()) return;

    const updatedItem = {
      id: editId || undefined,
      slug,
      title: service.title,
      description: service.description,
      basePrice: baseAmount,
      pricingModel: service.pricingModel,
      hourlyConfig: service.hourlyConfig,
      price: total,
      options: addOns,
      quantity: 1,
    };

    if (isEdit && editId) await updateItem(editId, updatedItem);
    else await addItem(updatedItem);

    router.push("/cart");
  };

  if (loading)
    return (
      <div className="bookingCustomize">
        <section className={`booking ${styles.page}`}>
          <div className={styles.container}>
            <p>Loading service...</p>
          </div>
        </section>
      </div>
    );

  if (!service)
    return (
      <div className="bookingCustomize">
        <section className={`booking ${styles.page}`}>
          <div className={styles.container}>
            <h1>Service not found</h1>
            <Link href="/services" className="btn">
              ← Back to Services
            </Link>
          </div>
        </section>
      </div>
    );

  return (
    <div className="bookingCustomize">
      <section className={`booking ${styles.page}`}>
        <div className={styles.container}>
        <div className={styles.topbar}>
          <p className={styles.backLink}>
            <Link href="/services">← Back to Services</Link>
          </p>
        </div>

        <div className={styles.grid}>
          <div>
            <div className={`${styles.card} ${styles.serviceCard}`}>
                <div className={styles.serviceIcon} aria-hidden>
                  <Package size={20} />
                </div>
              <div className={styles.serviceLeft}>
              
                <div>
                  <h1 className={styles.serviceTitle}>{service.title}</h1>
                  {service.description && (
                    <p className={styles.serviceDesc}>{service.description}</p>
                  )}
                </div>
                 <div className={styles.servicePrice}>
                ${service.price.toFixed(2)}
                {pricingModel === "hourly" ? (
                  <span className={styles.servicePriceSmall}>/hr</span>
                ) : null}
              </div>
              </div>

             
            </div>

            <div className={styles.card}>
              <h2 className={styles.formTitle}>
                {isEdit ? "Modify Your Service" : "Customize Your Service"}
              </h2>
              <p className={styles.formSubtitle}>
                Select any add-ons or provide additional details
              </p>

              <form className={styles.form} onSubmit={(e) => e.preventDefault()}>
                {service.questions?.map((q) => {
                  const isErrored = !!errors[q.id];
                  const requiredPill = q.required ? (
                    <span className={styles.requiredPill}>Required</span>
                  ) : null;

                  if (q.type === "checkbox") {
                    return (
                      <div
                        key={q.id}
                        id={q.id}
                        className={`${styles.checkboxRow} ${
                          isErrored ? styles.errorBorder : ""
                        }`}
                      >
                        <label className={styles.checkboxLabel}>
                          <input
                            type="checkbox"
                            checked={!!responses[q.id]}
                            onChange={(e) => {
                              const value = e.target.checked;
                              setResponses({ ...responses, [q.id]: value });
                              if (isErrored && value === true) {
                                setErrors({ ...errors, [q.id]: false });
                              }
                            }}
                            className={styles.checkbox}
                          />

                          <div className={styles.checkboxText}>
                            <div className={styles.labelRow}>
                              <span className={styles.label}>{q.label}</span>
                              {requiredPill}
                            </div>
                            {q.placeholder ? (
                              <div className={styles.helpText}>{q.placeholder}</div>
                            ) : null}
                          </div>

                          {typeof q.extraCost === "number" && q.extraCost > 0 ? (
                            <span className={styles.priceDelta}>
                              +${q.extraCost.toFixed(2)}
                            </span>
                          ) : null}
                        </label>
                        {isErrored ? (
                          <div className={styles.errorText}>
                            This field is required.
                          </div>
                        ) : null}
                      </div>
                    );
                  }

                  if (q.type === "text") {
                    return (
                      <div key={q.id} id={q.id} className={styles.field}>
                        <div className={styles.labelRow}>
                          <label className={styles.label}>{q.label}</label>
                          {requiredPill}
                        </div>
                        <textarea
                          placeholder={q.placeholder || "Please provide details..."}
                          value={responses[q.id] || ""}
                          onChange={(e) => {
                            const value = e.target.value;
                            setResponses({ ...responses, [q.id]: value });
                            if (isErrored && value.trim() !== "") {
                              setErrors({ ...errors, [q.id]: false });
                            }
                          }}
                          className={`${styles.textarea} ${
                            isErrored ? styles.errorBorder : ""
                          }`}
                        />
                        {isErrored ? (
                          <div className={styles.errorText}>
                            This field is required.
                          </div>
                        ) : null}
                      </div>
                    );
                  }

                  if (q.type === "select") {
                    return (
                      <div key={q.id} id={q.id} className={styles.field}>
                        <div className={styles.labelRow}>
                          <label className={styles.label}>{q.label}</label>
                          {requiredPill}
                        </div>
                        <Listbox
                          value={responses[q.id] || ""}
                          onChange={(selected) => {
                            setResponses({ ...responses, [q.id]: selected });
                            if (isErrored && selected !== "") {
                              setErrors({ ...errors, [q.id]: false });
                            }
                          }}
                        >
                          {({ open }) => (
                            <div className={styles.multiSelectWrapper}>
                              <ListboxButton
                                as="div"
                                className={`${styles.multiSelectButton} ${
                                  isErrored ? styles.errorBorder : ""
                                }`}
                                role="button"
                                tabIndex={0}
                              >
                                {responses[q.id] ? (
                                  <span>{responses[q.id]}</span>
                                ) : (
                                  <span className={styles.multiSelectPlaceholder}>
                                    Select an option...
                                  </span>
                                )}
                                <ChevronDown
                                  className={`${styles.multiSelectIcon} w-4 h-4`}
                                />
                              </ListboxButton>

                              <Transition
                                as={Fragment}
                                show={open}
                                leave="transition ease-in duration-100"
                                leaveFrom="opacity-100"
                                leaveTo="opacity-0"
                              >
                                <ListboxOptions className={styles.multiSelectOptions}>
                                  {q.options?.map((opt) => (
                                    <ListboxOption
                                      key={opt.label}
                                      value={opt.label}
                                      className={({ active, selected }) => {
                                        const classes = [styles.multiSelectOption];
                                        if (active)
                                          classes.push(styles.multiSelectOptionActive);
                                        if (selected)
                                          classes.push(styles.multiSelectOptionSelected);
                                        return classes.join(" ");
                                      }}
                                    >
                                      {({ selected }) => (
                                        <>
                                          <span>{opt.label}</span>
                                          {opt.extraCost ? (
                                            <span className={styles.optionPrice}>
                                              (+${opt.extraCost.toFixed(2)})
                                            </span>
                                          ) : null}
                                          {selected ? (
                                            <span className={styles.checkmark}>
                                              <Check />
                                            </span>
                                          ) : null}
                                        </>
                                      )}
                                    </ListboxOption>
                                  ))}
                                </ListboxOptions>
                              </Transition>
                            </div>
                          )}
                        </Listbox>
                        {isErrored ? (
                          <div className={styles.errorText}>
                            This field is required.
                          </div>
                        ) : null}
                      </div>
                    );
                  }

                  if (q.type === "multi-select") {
                    return (
                      <div key={q.id} id={q.id} className={styles.field}>
                        <div className={styles.labelRow}>
                          <label className={styles.label}>{q.label}</label>
                          {requiredPill}
                        </div>

                        <Listbox
                          value={responses[q.id] || []}
                          onChange={(selected) => {
                            setResponses({ ...responses, [q.id]: selected });
                            if (isErrored && selected.length > 0) {
                              setErrors({ ...errors, [q.id]: false });
                            }
                          }}
                          multiple
                        >
                          {({ open }) => (
                            <div className={styles.multiSelectWrapper}>
                              <ListboxButton
                                as="div"
                                className={`${styles.multiSelectButton} ${
                                  isErrored ? styles.errorBorder : ""
                                }`}
                                role="button"
                                tabIndex={0}
                              >
                                {Array.isArray(responses[q.id]) &&
                                responses[q.id].length > 0 ? (
                                  <div className={styles.multiSelectChips}>
                                    {responses[q.id].map((v: string) => (
                                      <span key={v} className={styles.multiSelectChip}>
                                        {v}
                                        <span
                                          role="button"
                                          tabIndex={0}
                                          className={styles.multiSelectRemove}
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            const updated = responses[q.id].filter(
                                              (x: string) => x !== v
                                            );
                                            setResponses({
                                              ...responses,
                                              [q.id]: updated,
                                            });
                                          }}
                                          onKeyDown={(e) => {
                                            if (e.key === "Enter" || e.key === " ") {
                                              e.stopPropagation();
                                              const updated = responses[q.id].filter(
                                                (x: string) => x !== v
                                              );
                                              setResponses({
                                                ...responses,
                                                [q.id]: updated,
                                              });
                                            }
                                          }}
                                        >
                                          <X className="w-3 h-3" />
                                        </span>
                                      </span>
                                    ))}
                                  </div>
                                ) : (
                                  <span className={styles.multiSelectPlaceholder}>
                                    Select options...
                                  </span>
                                )}
                                <ChevronDown className={`${styles.multiSelectIcon} w-4 h-4`} />
                              </ListboxButton>

                              <Transition
                                as={Fragment}
                                show={open}
                                leave="transition ease-in duration-100"
                                leaveFrom="opacity-100"
                                leaveTo="opacity-0"
                              >
                                <ListboxOptions className={styles.multiSelectOptions}>
                                  {q.options?.map((opt) => (
                                    <ListboxOption
                                      key={opt.label}
                                      value={opt.label}
                                      className={({ active, selected }) => {
                                        const classes = [styles.multiSelectOption];
                                        if (active) classes.push(styles.multiSelectOptionActive);
                                        if (selected) classes.push(styles.multiSelectOptionSelected);
                                        return classes.join(" ");
                                      }}
                                    >
                                      {({ selected }) => (
                                        <>
                                          <span>{opt.label}</span>
                                          {opt.extraCost ? (
                                            <span className={styles.optionPrice}>
                                              (+${opt.extraCost.toFixed(2)})
                                            </span>
                                          ) : null}
                                          {selected ? (
                                            <span className={styles.checkmark}>
                                              <Check />
                                            </span>
                                          ) : null}
                                        </>
                                      )}
                                    </ListboxOption>
                                  ))}
                                </ListboxOptions>
                              </Transition>
                            </div>
                          )}
                        </Listbox>
                        {isErrored ? (
                          <div className={styles.errorText}>
                            This field is required.
                          </div>
                        ) : null}
                      </div>
                    );
                  }

                  return null;
                })}
              </form>
            </div>
          </div>

          <aside className={styles.sidebar}>
            <div className={styles.card}>
              <h2 className={styles.summaryTitle}>Order Summary</h2>
              <div className={styles.summaryDivider} />

              <div className={styles.summaryRow}>
                <span>Base Price</span>
                <span>
                  ${baseAmount.toFixed(2)}
                  {pricingModel === "hourly" ? "/hr" : ""}
                </span>
              </div>

              {addOnsTotal > 0 ? (
                <div className={styles.summaryRow}>
                  <span>Add-ons</span>
                  <span>${addOnsTotal.toFixed(2)}</span>
                </div>
              ) : null}

              <div className={styles.summaryTotal}>
                <span>Total</span>
                <span className={styles.summaryTotalValue}>${total.toFixed(2)}</span>
              </div>

              <button className={styles.addToCartBtn} onClick={handleAddToCart}>
                <ShoppingCart size={18} />
                Add to Cart
              </button>

              <p className={styles.hint} style={{ marginTop: 12 }}>
                You can review and edit this in your cart.
              </p>
            </div>

            <div className={styles.card}>
              <div className={styles.perks}>
                <div className={styles.perkItem}>
                  <ShieldCheck size={18} color="var(--brand-teal)" />
                  90-Day Warranty
                </div>
                <div className={styles.perkItem}>
                  <ShieldCheck size={18} color="var(--brand-teal)" />
                  Certified Technicians
                </div>
                <div className={styles.perkItem}>
                  <ShieldCheck size={18} color="var(--brand-teal)" />
                  Flexible Scheduling
                </div>
              </div>
            </div>

            <Link href="/services" className={styles.browseLink}>
              + Browse more services
            </Link>
          </aside>
        </div>
        </div>
      </section>
    </div>
  );
}
