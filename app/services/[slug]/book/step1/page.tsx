"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useCart } from "@/lib/CartContext";
import { sanity } from "@/lib/sanity";

// ==== TYPES ====
type QuestionOption = {
  label: string;
  extraCost?: number;
};

type Question = {
  id: string;
  label: string;
  shortLabel?: string;
  type?: "checkbox" | "select" | "text";
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
            placeholder,
            extraCost,
            allowOther,
            dependsOn,
            options[]{label, extraCost},
            optionsByParent[]{
              parentValue,
              options[]{label, extraCost}
            }
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
      if (itemToEdit && Array.isArray(itemToEdit.options) && service.questions) {
        const prefilled: Record<string, any> = {};
        service.questions.forEach((q) => {
          const match = itemToEdit.options?.find((opt: any) =>
            opt.name.includes(q.shortLabel || q.label)
          );
          if (match) {
            if (q.type === "checkbox") prefilled[q.id] = true;
            else if (q.type === "select")
              prefilled[q.id] = match.name.split(": ")[1];
            else if (q.type === "text")
              prefilled[q.id] = match.name.split(": ")[1];
          }
        });
        setResponses(prefilled);
      }
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

        if (q.type === "text")
          return { name: `${q.shortLabel || q.label}: ${value}`, price: 0 };

        return null;
      })
      .filter(Boolean) as AddOn[] || [];

  const addOnsTotal = addOns.reduce((sum, o) => sum + (o.price || 0), 0);
  const subtotal = service ? service.price + addOnsTotal : 0;

  // --- Save to cart and go to Step 2
  const handleNext = async () => {
    if (!service) return;

    const updatedItem = {
      slug,
      title: service.title,
      basePrice: service.price,
      price: subtotal,
      options: addOns,
    };

    if (isEdit && editId) updateItem(editId, updatedItem);
    else await addItem(updatedItem);

    // Go to Step 2 to collect contact info
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
              className={`option-item extra-option ${q.type === "text" ? "text-field" : ""
                }`}
            >
              <div className="option-left">
                <label className="option-label">{q.label}</label>

                {q.type === "text" && (
                  <input
                    type="text"
                    placeholder={q.placeholder || "Enter your answer"}
                    value={responses[q.id] || ""}
                    onChange={(e) =>
                      setResponses({ ...responses, [q.id]: e.target.value })
                    }
                    className="option-input"
                  />
                )}
              </div>

              {q.type === "checkbox" && (
                <div className="option-control">
                  <input
                    type="checkbox"
                    checked={!!responses[q.id]}
                    onChange={(e) =>
                      setResponses({
                        ...responses,
                        [q.id]: e.target.checked,
                      })
                    }
                    className="option-checkbox"
                  />
                  {q.extraCost && (
                    <span className="option-extra">
                      +${q.extraCost.toFixed(2)}
                    </span>
                  )}
                </div>
              )}

              {q.type === "select" && (
                <div className="option-control">
                  {/* CASE 1: Camera Model changes to text input if brand = Other */}
                  {q.id === "cameraModel" && responses["cameraBrand"] === "Other" ? (
                    <div className="option-input-wrapper">
                      <input
                        type="text"
                        placeholder="Enter your camera model..."
                        value={responses[q.id] || ""}
                        onChange={(e) =>
                          setResponses({ ...responses, [q.id]: e.target.value })
                        }
                        className="option-input"
                      />
                      <button
                        type="button"
                        className={`option-clear ${responses[q.id] ? "visible" : "hidden"
                          }`}
                        onClick={() => setResponses({ ...responses, [q.id]: "" })}
                        aria-label="Clear camera model"
                      >
                        ✕
                      </button>
                    </div>
                  ) : q.id in customInputs ? (
                    // CASE 2: “Other” custom input for any field
                    <div className="option-input-wrapper">
                      <input
                        type="text"
                        value={customInputs[q.id]}
                        onChange={(e) =>
                          setCustomInputs({
                            ...customInputs,
                            [q.id]: e.target.value,
                          })
                        }
                        placeholder="Enter your option..."
                        className="option-input"
                        autoFocus
                      />
                      <button
                        type="button"
                        className="option-clear"
                        onClick={() => {
                          const updated = { ...customInputs };
                          delete updated[q.id];
                          setCustomInputs(updated);
                          setResponses({ ...responses, [q.id]: "" });
                        }}
                        aria-label="Cancel custom option"
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <select
                      value={responses[q.id] || ""}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val === "Other") {
                          setCustomInputs({ ...customInputs, [q.id]: "" });
                          setResponses({ ...responses, [q.id]: "Other" });
                        } else {
                          if (q.id === "cameraBrand") {
                            setResponses((prev) => ({
                              ...prev,
                              [q.id]: val,
                              cameraModel: "",
                            }));
                          } else {
                            setResponses({ ...responses, [q.id]: val });
                          }
                        }
                      }}
                      className="option-input"
                      disabled={Boolean(q.dependsOn && !responses[q.dependsOn])}
                    >
                      <option value="">Select an option...</option>

                      {q.dependsOn
                        ? (() => {
                          const parentVal = responses[q.dependsOn];
                          if (!parentVal || parentVal === "Other") return null;
                          const parentMatch = q.optionsByParent?.find(
                            (p) => p.parentValue === parentVal
                          );
                          return parentMatch?.options?.map((opt) => (
                            <option key={opt.label} value={opt.label}>
                              {opt.label}
                              {opt.extraCost
                                ? ` (+$${opt.extraCost.toFixed(2)})`
                                : ""}
                            </option>
                          ));
                        })()
                        : q.options?.map((opt) => (
                          <option key={opt.label} value={opt.label}>
                            {opt.label}
                            {opt.extraCost
                              ? ` (+$${opt.extraCost.toFixed(2)})`
                              : ""}
                          </option>
                        ))}

                      {q.allowOther && <option value="Other">Other</option>}
                    </select>
                  )}
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
            onClick={handleNext}
            className="btn btn-primary w-full mt-4"
          >
            Continue → Contact Info
          </button>
        </form>
      </div>
    </section>
  );
}
