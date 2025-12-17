"use client";

import { use, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useFormValidation } from "@/lib/useFormValidation";
import BookingSteps from "@/components/BookingSteps";

export default function Step3({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const router = useRouter();
  const searchParams = useSearchParams();

  const priceParam = searchParams.get("price") || "0";
  const optionsParam = searchParams.get("options") || "[]";
  const contact = searchParams.get("contact") || "{}";
  const addressParam = searchParams.get("address") || "{}";
  const basePrice = parseFloat(priceParam) || 0;

  // use the shared validation hook
  const {
    values: address,
    setValues: setAddress,
    handleChange,
    validateRequired,
    getInputClass,
  } = useFormValidation({
    street: "",
    city: "",
    state: "",
    zip: "",
  });

  // Prefill from query param if returning
  useEffect(() => {
    try {
      const parsed = JSON.parse(addressParam);
      setAddress({
        street: parsed.street || "",
        city: parsed.city || "",
        state: parsed.state || "",
        zip: parsed.zip || "",
      });
    } catch {
      setAddress({ street: "", city: "", state: "", zip: "" });
    }
  }, [addressParam, setAddress]);

  // Continue to next step
  const handleNext = async () => {
    if (!validateRequired()) {
      alert("Please fill in all address fields before continuing.");
      return;
    }

    try {
      await fetch("/api/cart", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address }),
        credentials: "include",
      });
    } catch (err) {
      console.error("Failed to save address info:", err);
    }

    const query = new URLSearchParams({
      slug,
      price: String(basePrice),
      options: optionsParam,
      contact,
      address: JSON.stringify(address),
      schedule: searchParams.get("schedule") || "{}",
    }).toString();

    router.push(`/services/${slug}/book/step4?${query}`);
  };

  return (
    <section className="section booking">
      <div className="site-container booking-wrapper">
        <p className="back-link">
          <Link
            href={`/services/${slug}/book/step2?slug=${slug}&price=${basePrice}&options=${encodeURIComponent(
              optionsParam
            )}&contact=${encodeURIComponent(contact)}&address=${encodeURIComponent(
              JSON.stringify(address)
            )}&schedule=${encodeURIComponent(
              searchParams.get("schedule") || "{}"
            )}`}
          >
            ← Back to Contact Info
          </Link>
        </p>
        <BookingSteps currentStep={3} />
        <h1 className="service-title">Address Information</h1>

        <form className="booking-card" onSubmit={(e) => e.preventDefault()}>
          <input
            type="text"
            className={getInputClass("street")}
            placeholder="Street Address"
            value={address.street}
            onChange={(e) => handleChange("street", e.target.value)}
          />
          <input
            type="text"
            className={getInputClass("city")}
            placeholder="City"
            value={address.city}
            onChange={(e) => handleChange("city", e.target.value)}
          />
          <input
            type="text"
            className={getInputClass("state")}
            placeholder="State"
            value={address.state}
            onChange={(e) => handleChange("state", e.target.value)}
          />
          <input
            type="text"
            className={getInputClass("zip")}
            placeholder="ZIP Code"
            value={address.zip}
            onChange={(e) => handleChange("zip", e.target.value)}
          />

          <button
            type="button"
            onClick={handleNext}
            className="btn-primary2"
          >
            Next → Availability
          </button>
        </form>
      </div>
    </section>
  );
}
