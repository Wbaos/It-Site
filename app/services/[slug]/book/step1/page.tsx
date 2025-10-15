"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useCart } from "@/lib/CartContext";
import { sanity } from "@/lib/sanity";

type Question = {
  id: string;
  label: string;
  shortLabel?: string;
  extraCost?: number;
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

export default function Step1({ params }: { params: Promise<{ slug: string }> }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { items, addItem, updateItem } = useCart();

  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [slug, setSlug] = useState("");

  useEffect(() => {
    params.then((p) => setSlug(p.slug));
  }, [params]);

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
          questions[]{id, label, shortLabel, extraCost}
        }`,
        { slug }
      );
      setService(data);
      setLoading(false);
    };

    fetchService();
  }, [slug]);

  const isEdit = searchParams.get("edit") === "true";
  const editId = searchParams.get("id");

  useEffect(() => {
    if (isEdit && editId && service) {
      const itemToEdit = items.find((i: any) => i.id === editId);
      if (itemToEdit?.options?.length && service.questions) {
        const matchedIds = service.questions
          .filter((q) =>
            itemToEdit.options?.some(
              (opt: any) => opt.name === (q.shortLabel || q.label)
            )
          )
          .map((q) => q.id);
        setSelectedOptions(matchedIds || []);
      }
    }
  }, [isEdit, editId, items, service]);

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

  const toggleOption = (id: string) => {
    setSelectedOptions((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const addOns: AddOn[] =
    (service.questions ?? [])
      .filter((q) => selectedOptions.includes(q.id))
      .map((q) => ({
        name: q.shortLabel || q.label,
        price: q.extraCost ?? 0,
      })) || [];

  const addOnsTotal = addOns.reduce(
    (sum: number, o: AddOn) => sum + (o.price || 0),
    0
  );
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
