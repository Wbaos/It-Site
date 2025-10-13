"use client";

import Link from "next/link";
import { use, useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { NAV_SERVICES, SERVICES } from "@/lib/serviceCatalog";
import { useCart } from "@/lib/CartContext";

//  validate slug against NAV_SERVICES
function isValidSlug(slug: string) {
  return NAV_SERVICES.some((cat) =>
    cat.items.some(
      (s) => s.slug === slug || s.subItems?.some((sub) => sub.slug === slug)
    )
  );
}

export default function BookingForm({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);

  const { addItem, removeItem } = useCart();
  const router = useRouter();
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

  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const [showCancel, setShowCancel] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // restore previously selected options from cart
  const optionsParam = searchParams.get("options");
  let initialSelectedOptions: string[] = [];

  try {
    if (optionsParam) {
      const parsed = JSON.parse(optionsParam);
      if (Array.isArray(parsed)) {
        initialSelectedOptions = parsed
          .map((o: any) => {
            const match = service.questions?.find(
              (q) => q.label === o.name || (q as any).shortLabel === o.name
            );
            return match?.id;
          })
          .filter(Boolean) as string[];
      }
    }
  } catch (err) {
    console.warn(" Failed to parse optionsParam:", err);
  }

  const [selectedOptions, setSelectedOptions] = useState<string[]>(
    initialSelectedOptions
  );

  useEffect(() => {
    if (searchParams.get("canceled") === "true") setShowCancel(true);
    if (searchParams.get("success") === "true") setShowSuccess(true);
  }, [searchParams]);

  const toggleOption = (id: string) => {
    setSelectedOptions((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  // Subtotal = base + selected add-ons
  const subtotal =
    service.price +
    (service.questions ?? [])
      .filter((q) => selectedOptions.includes(q.id))
      .reduce((sum, q) => sum + (q.extraCost ?? 0), 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const selectedOptionObjects =
        service.questions
          ?.filter((q) => selectedOptions.includes(q.id))
          .map((q) => ({
            name: (q as any).shortLabel || q.label,
            price: q.extraCost ?? 0,
          })) || [];

      const updatedItem = {
        slug,
        title: service.title,
        basePrice: service.price,
        price: subtotal,
        options: selectedOptionObjects,
      };

      const modifying = searchParams.get("options") !== null;
      if (modifying) {
        await removeItem(slug);
      }

      await addItem(updatedItem);
      router.push("/cart");
    } finally {
      setLoading(false);
    }
  };


  return (
    <section className="section booking">
      <div className="site-container">
        <div className="booking-wrapper">
          <h1 className="service-title">Book: {service.title}</h1>
          <p className="price-badge">Base Price: ${service.price}</p>

          <form onSubmit={handleSubmit} className="booking-card">
            {/* Base Price */}
            <div className="base-price">
              <strong>Included:</strong> {service.title} —{" "}
              <span className="price-main">${service.price}</span>
            </div>

            {/* Extra add-ons (checkboxes) */}
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

            <div className="subtotal-row">
              <span>Total</span>
              <span>${subtotal}</span>
            </div>

            <button
              type="submit"
              className={`btn btn-primary w-full flex items-center justify-center gap-2 ${loading ? "is-loading" : ""
                }`}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner"></span>
                  Processing...
                </>
              ) : (
                "🛒 Add to Cart"
              )}
            </button>
          </form>

          <p className="back-link">
            <Link href={`/services/${slug}`}>← Back to {service.title}</Link>
          </p>
        </div>
      </div>

      {showCancel && (
        <div className="modal-overlay">
          <div className="modal-box">
            <span className="modal-icon">❌</span>
            <h2>Payment Canceled</h2>
            <p>Your booking wasn’t charged. Try again anytime.</p>
            <button
              onClick={() => setShowCancel(false)}
              className="btn btn-primary"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {showSuccess && (
        <div className="modal-overlay">
          <div className="modal-box">
            <span className="modal-icon">✅</span>
            <h2>Payment Successful</h2>
            <p>Thank you! Your booking is confirmed.</p>
            <button
              onClick={() => setShowSuccess(false)}
              className="btn btn-primary"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
