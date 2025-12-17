"use client";

import { useState, useEffect, Fragment } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Listbox, ListboxButton, ListboxOption, ListboxOptions, Transition } from "@headlessui/react";
import { Check, ChevronDown, X } from "lucide-react";
import { useCart } from "@/lib/CartContext";
import { sanity } from "@/lib/sanity";
import BookingSteps from "@/components/BookingSteps";

// ==== TYPES ====
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
  description?: string;
  details?: string[];
  faqs?: { q: string; a: string }[];
  testimonials?: { author: string; quote: string }[];
  image?: { asset: { url: string } };
  questions?: Question[];
};

export default function Step1({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { items, addItem, updateItem } = useCart();

  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [slug, setSlug] = useState("");
  const [responses, setResponses] = useState<Record<string, any>>({});
  const [customInputs, setCustomInputs] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, boolean>>({});


  // --- Get slug from params
  useEffect(() => {
    params.then((p) => setSlug(p.slug));
  }, [params]);

  // --- Fetch service info
  useEffect(() => {
    if (!slug) return;

    const fetchService = async () => {
      setLoading(true);
      const data: Service = await sanity.fetch(
        `*[_type == "service" && slug.current == $slug][0]{
          title,
          "slug": slug.current,
          price,
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

  // --- Edit mode (prefill)
  const isEdit = searchParams.get("edit") === "true";
  const editId = searchParams.get("id");

  useEffect(() => {
    if (isEdit && editId && service) {
      const itemToEdit = items.find((i: any) => i.id === editId);
      if (!itemToEdit || !service.questions) return;

      const prefilled: Record<string, any> = {};

      service.questions.forEach((q) => {
        if (q.type === "multi-select") {
          const selected = itemToEdit.options
            ?.filter((opt: any) =>
              opt.name.startsWith((q.shortLabel || q.label) + ":")
            )
            .map((opt: any) => opt.name.split(": ")[1]);

          if (selected && selected.length > 0) {
            prefilled[q.id] = selected;
          }
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
    }
  }, [isEdit, editId, items, service]);


  // --- Compute Add-ons and totals
  const addOns: AddOn[] =
    service?.questions
      ?.map((q) => {
        const value =
          q.id in customInputs && customInputs[q.id].trim()
            ? customInputs[q.id]
            : responses[q.id];
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
      .filter(Boolean) as AddOn[] || [];

    const addOnsTotal = addOns.reduce((sum, o) => sum + (o.price || 0), 0);
    const subtotal = service ? service.price + addOnsTotal : 0;
    
    const handleAddToCart = () => {
      if (!service) return;

    const newErrors: Record<string, boolean> = {};

      service.questions?.forEach((q) => {
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
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "center" });
        }

        return;
      }

      setErrors({});


    const updatedItem = {
      id: editId || undefined,
      slug,
      title: service.title,
      description: service.description,
      basePrice: service.price,
      price: subtotal,
      options: addOns,
      quantity: 1,
    };

    if (isEdit && editId) updateItem(editId, updatedItem);
    else addItem(updatedItem);

    router.push("/cart");
  };

  const handleNext = async () => {
    if (!service) return;

    const updatedItem = {
      slug,
      title: service.title,
      description: service.description,
      basePrice: service.price,
      price: subtotal,
      options: addOns,
    };

    if (isEdit && editId) updateItem(editId, updatedItem);
    else await addItem(updatedItem);

    router.push(`/services/${slug}/book/step2?price=${subtotal}`);
  };

  // --- Loading UI
  if (loading)
    return (
      <section className="section booking">
        <div className="site-container">
          <p>Loading service...</p>
        </div>
      </section>
    );

  if (!service)
    return (
      <section className="section booking">
        <div className="site-container">
          <h1>Service not found</h1>
          <Link href="/services" className="btn">
            ← Back to Services
          </Link>
        </div>
      </section>
    );

  // --- Render UI
  return (
    <section className="section booking">
      <div className="site-container booking-wrapper">
        <BookingSteps currentStep={1} />

        <h1 className="service-title">
          {isEdit ? "Modify Service" : "Customize"}: {service.title}
        </h1>

        <form className="booking-card" onSubmit={(e) => e.preventDefault()}>
          <div className="base-price">
            <strong>Included:</strong> {service.title} —{" "}
            <span className="price-main">${service.price}</span>
          </div>

          {service.questions?.map((q) => (
            <div
              key={q.id}
              id={q.id}
              className={`option-item extra-option ${errors[q.id] ? "error" : ""}`}
            >
              {q.type === "checkbox" && (
                <label className="option-control checkbox-inline">
                  <input
                    type="checkbox"
                    checked={!!responses[q.id]}
                    onChange={(e) => {
                      const value = e.target.checked;
                      setResponses({ ...responses, [q.id]: value });

                      if (errors[q.id] && value === true) {
                        setErrors({ ...errors, [q.id]: false });
                      }
                    }}
                    className="option-checkbox"
                  />

                  <span className="option-label">
                    {q.label}
                    {q.required && <span className="required-marker">*</span>}
                    {q.extraCost && (
                      <span className="option-extra"> (+${q.extraCost.toFixed(2)})</span>
                    )}
                  </span>

                  {errors[q.id] && <p className="error-text">This field is required.</p>}
                </label>
              )}


              {q.type === "text" && (
                <div className="option-left">
                  <label className="option-label">
                    {q.label}
                    {q.required && <span className="required-marker">*</span>}
                  </label>
                  <input
                    type="text"
                    placeholder={q.placeholder || "Enter your answer"}
                    value={responses[q.id] || ""}
                    onChange={(e) => {
                      const value = e.target.value;
                      setResponses({ ...responses, [q.id]: value });

                      if (errors[q.id] && value.trim() !== "") {
                        setErrors({ ...errors, [q.id]: false });
                      }
                    }}

                    className="option-input"
                  />
                  {errors[q.id] && <p className="error-text">This field is required.</p>}
                </div>
              )}

              {q.type === "select" && (
                <div className="option-left">
                  <label className="option-label">
                  {q.label}
                  {q.required && <span className="required-marker">*</span>}
                </label>

                  <select
                    value={responses[q.id] || ""}
                    onChange={(e) => {
                      const value = e.target.value;
                      setResponses({ ...responses, [q.id]: value });

                      if (errors[q.id] && value !== "") {
                        setErrors({ ...errors, [q.id]: false });
                      }
                    }}
                    className="option-input option-select"
                  >
                    <option value="">Select an option...</option>
                    {q.options?.map((opt) => (
                      <option key={opt.label} value={opt.label}>
                        {opt.label}
                        {opt.extraCost ? ` (+$${opt.extraCost.toFixed(2)})` : ""}
                      </option>
                    ))}
                  </select>
                  {errors[q.id] && <p className="error-text">This field is required.</p>}
                </div>
              )}

              {q.type === "multi-select" && (
                <div className="option-left">
                  <label className="option-label">
                  {q.label}
                  {q.required && <span className="required-marker">*</span>}
                </label>
                 <Listbox
              value={responses[q.id] || []}
              onChange={(selected) => {
                setResponses({ ...responses, [q.id]: selected });

                if (errors[q.id] && selected.length > 0) {
                  setErrors({ ...errors, [q.id]: false });
                }
              }}
              multiple
            >
              {({ open }) => (
                <div className="multi-select-wrapper">
                  <ListboxButton  as="div" className="multi-select-button" role="button" tabIndex={0}>
                    {Array.isArray(responses[q.id]) && responses[q.id].length > 0 ? (
                      <div className="multi-select-chips">
                        {responses[q.id].map((v: string) => (
                          <span key={v} className="multi-select-chip">
                            {v}
                            <span
                              role="button"
                              tabIndex={0}
                              className="multi-select-remove"
                              onClick={(e) => {
                                e.stopPropagation();
                                const updated = responses[q.id].filter((x: string) => x !== v);
                                setResponses({ ...responses, [q.id]: updated });
                              }}
                              onKeyDown={(e) => {
                                if (e.key === "Enter" || e.key === " ") {
                                  e.stopPropagation();
                                  const updated = responses[q.id].filter((x: string) => x !== v);
                                  setResponses({ ...responses, [q.id]: updated });
                                }
                              }}
                            >
                              <X className="w-3 h-3" />
                            </span>
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="multi-select-placeholder">Select options...</span>
                    )}
                    <ChevronDown className="multi-select-icon w-4 h-4" />
                  </ListboxButton >

                  <Transition
                    as={Fragment}
                    show={open}
                    leave="transition ease-in duration-100"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <ListboxOptions  className="multi-select-options">
                      {q.options?.map((opt) => (
                        <ListboxOption
                          key={opt.label}
                          value={opt.label}
                          className={({ active, selected }) =>
                            `multi-select-option${active ? " active" : ""}${selected ? " selected" : ""}`
                          }
                        >
                          {({ selected }) => (
                            <>
                              <span>{opt.label}</span>
                              {opt.extraCost && (
                                <span className="option-price">
                                  (+${opt.extraCost.toFixed(2)})
                                </span>
                              )}
                              {selected && (
                                <span className="checkmark">
                                  <Check  />
                                </span>
                              )}
                            </>
                          )}
                        </ListboxOption>
                      ))}
                    </ListboxOptions >
                  </Transition>
                </div>
              )}
            </Listbox>
              {errors[q.id] && <p className="error-text">This field is required.</p>}

                </div>
              )}
            </div>
          ))}

          <div className="order-summary">
            <h3>Order Summary</h3>
            <p>Base Price: ${service.price}</p>
            {addOnsTotal > 0 && <p>Add-ons: ${addOnsTotal}</p>}
            <hr />
            <strong>Total: ${subtotal}</strong>
          </div>

          <button
            type="button"
            onClick={handleAddToCart}
            className="btn-primary2"
          >
            Add to Cart
          </button>

        </form>
      </div>
    </section>
  );
}
