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

  // === Fetch slug from params ===
  useEffect(() => {
    params.then((p) => setSlug(p.slug));
  }, [params]);

  // === Fetch service details from Sanity ===
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
          questions[]{
            id, label, shortLabel, type, placeholder,
            extraCost,
            options[]{label, extraCost}
          }
        }`,
        { slug }
      );
      setService(data);
      setLoading(false);
    };

    fetchService();
  }, [slug]);

  // === Edit mode handling ===
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

  // === Loading state ===
  if (loading)
    return (
      <section className="section booking">
        <div className="site-container">
          <p>Loading service...</p>
        </div>
      </section>
    );

  // === Not found ===
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

  // === Calculate add-ons and totals ===
  const addOns: AddOn[] =
    service.questions
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

        if (q.type === "text")
          return {
            name: `${q.shortLabel || q.label}: ${value}`,
            price: 0,
          };

        return null;
      })
      .filter(Boolean) as AddOn[]

  const addOnsTotal = (addOns ?? []).reduce((sum, o) => sum + (o.price || 0), 0);
  const subtotal = service.price + addOnsTotal;

  const handleSave = async () => {
    const updatedItem = {
      slug,
      title: service.title,
      basePrice: service.price,
      price: subtotal,
      options: addOns,
    };

    if (isEdit && editId) {
      updateItem(editId, updatedItem);
    } else {
      await addItem(updatedItem);
    }

    router.push("/cart");
  };

  // === Render ===
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
            <div key={q.id} className="option-item extra-option">
              <label className="option-label">{q.label}</label>

              {/* Checkbox */}
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

              {/* Select dropdown */}
              {q.type === "select" && (
                <select
                  value={responses[q.id] || ""}
                  onChange={(e) =>
                    setResponses({ ...responses, [q.id]: e.target.value })
                  }
                  className="option-select"
                >
                  <option value="">Select an option...</option>
                  {q.options?.map((opt) => (
                    <option key={opt.label} value={opt.label}>
                      {opt.label}{" "}
                      {opt.extraCost ? `(+$${opt.extraCost.toFixed(2)})` : ""}
                    </option>
                  ))}
                </select>
              )}

              {/* Text input */}
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
          ))}

          <div className="order-summary">
            <h3>Order Summary</h3>
            <p>Base Price: ${service.price}</p>
            <p>Add-ons: ${addOnsTotal}</p>
            <hr />
            <strong>Total: ${subtotal}</strong>
          </div>

          <button
            type="button"
            onClick={handleSave}
            className="btn btn-primary w-full mt-4"
          >
            {isEdit ? "Save Changes" : "Continue to Cart"}
          </button>
        </form>

        <p className="back-link">
          <Link href={`/services/${slug}`}>← Back to {service.title}</Link>
        </p>
      </div>
    </section>
  );
}
