"use client";

import { useState, use, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useCart } from "@/lib/CartContext";
import { NAV_SERVICES, SERVICES } from "@/lib/serviceCatalog";

function isValidSlug(slug: string) {
  return NAV_SERVICES.some((cat) =>
    cat.items.some(
      (s) => s.slug === slug || s.subItems?.some((sub) => sub.slug === slug)
    )
  );
}

export default function Step1({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const router = useRouter();
  const { items, addItem, updateItem } = useCart();
  const searchParams = useSearchParams();

  const service = SERVICES[slug];
  if (!service || !isValidSlug(slug)) {
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
  }

  const isEdit = searchParams.get("edit") === "true";
  const editId = searchParams.get("id");

  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

  useEffect(() => {
    if (isEdit && editId) {
      const itemToEdit = items.find((i) => i.id === editId);
      if (itemToEdit?.options?.length) {
        const matchedIds = service.questions
          ?.filter((q) =>
            itemToEdit.options?.some((opt) => opt.name === (q.shortLabel || q.label))
          )
          .map((q) => q.id);


        setSelectedOptions(matchedIds || []);
      }
    }
  }, [isEdit, editId, items, service.questions]);

  const toggleOption = (id: string) => {
    setSelectedOptions((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const addOns =
    (service.questions ?? [])
      .filter((q) => selectedOptions.includes(q.id))
      .map((q) => ({
        name: (q as any).shortLabel || q.label,
        price: q.extraCost ?? 0,
      })) || [];

  const addOnsTotal = addOns.reduce((sum, o) => sum + (o.price || 0), 0);
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
            <label key={q.id} className="option-item extra-option">
              <div className="option-left">
                <span className="option-label">{q.label}</span>
                {q.extraCost && (
                  <span className="option-extra">+${q.extraCost}</span>
                )}
              </div>
              <input
                type="checkbox"
                checked={selectedOptions.includes(q.id)}
                onChange={() => toggleOption(q.id)}
                className="option-checkbox"
              />
            </label>
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
