"use client";

import { useState, use, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { NAV_SERVICES, SERVICES } from "@/lib/serviceCatalog";

function isValidSlug(slug: string) {
  return NAV_SERVICES.some((cat) =>
    cat.items.some(
      (s) => s.slug === slug || s.subItems?.some((sub) => sub.slug === slug)
    )
  );
}

export default function Step2({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const service = SERVICES[slug];
  const router = useRouter();
  const searchParams = useSearchParams();

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

  const priceParam = searchParams.get("price") || String(service.price);
  const optionsParam = searchParams.get("options") || "[]";
  const contactParam = searchParams.get("contact") || "{}";

  const basePrice = parseFloat(priceParam) || 0;

  const [contact, setContact] = useState({
    name: "",
    email: "",
    phone: "",
  });

  useEffect(() => {
    try {
      const parsed = JSON.parse(contactParam);
      setContact({
        name: parsed.name || "",
        email: parsed.email || "",
        phone: parsed.phone || "",
      });
    } catch {
      setContact({ name: "", email: "", phone: "" });
    }
  }, [contactParam]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setContact({ ...contact, [e.target.name]: e.target.value });
  };

  const handleNext = async () => {
    try {
      await fetch("/api/cart", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contact }),
        credentials: "include",
      });
    } catch (err) {
      console.error("Failed to save contact info:", err);
    }

    const query = new URLSearchParams({
      slug,
      price: String(basePrice),
      options: optionsParam,
      contact: JSON.stringify(contact),
      address: searchParams.get("address") || "{}",
      schedule: searchParams.get("schedule") || "{}",
    }).toString();

    router.push(`/services/${slug}/book/step3?${query}`);
  };


  return (
    <section className="section booking">
      <div className="site-container booking-wrapper">
        <h1 className="service-title">Contact Information</h1>

        <form className="booking-card" onSubmit={(e) => e.preventDefault()}>
          <input
            name="name"
            placeholder="Full Name"
            value={contact.name}
            onChange={handleChange}
            required
            className="input"
          />
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={contact.email}
            onChange={handleChange}
            required
            className="input"
          />
          <input
            name="phone"
            type="tel"
            placeholder="Phone"
            value={contact.phone}
            onChange={handleChange}
            required
            className="input"
          />

          <button
            type="button"
            onClick={handleNext}
            className="btn btn-primary w-full mt-4"
          >
            Next → Address Info
          </button>
        </form>

        <p className="back-link">
          <Link href={`/services/${slug}/book/step1`}>
            ← Back to Service Options
          </Link>
        </p>
      </div>
    </section>
  );
}
