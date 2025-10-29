"use client";

import { use, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useFormValidation } from "@/lib/useFormValidation";

export default function Step4({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const router = useRouter();
  const { slug } = use(params);
  const searchParams = useSearchParams();

  const priceParam = searchParams.get("price") || "0";
  const optionsParam = searchParams.get("options") || "[]";
  const contactParam = searchParams.get("contact") || "{}";
  const addressParam = searchParams.get("address") || "{}";
  const scheduleParam = searchParams.get("schedule") || "{}";

  const basePrice = parseFloat(priceParam) || 0;

  const parsedAddress = (() => {
    try {
      return JSON.parse(addressParam);
    } catch {
      return {};
    }
  })();

  // use the shared form validation hook
  const {
    values: schedule,
    setValues: setSchedule,
    handleChange,
    validateRequired,
    getInputClass,
  } = useFormValidation({
    date: "",
    time: "",
  });

  const [loading, setLoading] = useState(false);

  // Prefill if user navigates back
  useEffect(() => {
    try {
      const parsed = JSON.parse(scheduleParam);
      setSchedule({
        date: parsed.date || "",
        time: parsed.time || "",
      });
    } catch {
      setSchedule({ date: "", time: "" });
    }
  }, [scheduleParam, setSchedule]);

  const handleFinish = async () => {
    if (!validateRequired()) {
      alert("Please select both date and time before continuing.");
      return;
    }

    setLoading(true);
    try {
      // save schedule in cart
      await fetch("/api/cart", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ schedule }),
        credentials: "include",
      });

      // start checkout
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      const { url } = await res.json();
      if (url) window.location.href = url;
    } catch (err) {
      console.error("Checkout error:", err);
      alert("Something went wrong with checkout.");
    } finally {
      setLoading(false);
    }
  };

  if (!slug) return null;

  return (
    <section className="section booking">
      <div className="site-container booking-wrapper">
        <h1 className="service-title">Availability</h1>

        <form className="booking-card" onSubmit={(e) => e.preventDefault()}>
          <input
            type="date"
            className={getInputClass("date")}
            value={schedule.date}
            onChange={(e) => handleChange("date", e.target.value)}
          />

          <input
            type="time"
            className={getInputClass("time")}
            value={schedule.time}
            onChange={(e) => handleChange("time", e.target.value)}
          />

          <button
            type="button"
            onClick={handleFinish}
            className="btn btn-primary w-full mt-2"
            disabled={loading}
          >
            {loading ? "Redirecting..." : "Confirm & Pay →"}
          </button>
        </form>

        <p className="back-link">
          <Link
            href={`/services/${slug}/book/step3?slug=${slug}&price=${priceParam}&options=${encodeURIComponent(
              optionsParam
            )}&contact=${encodeURIComponent(
              contactParam
            )}&address=${encodeURIComponent(
              JSON.stringify(parsedAddress)
            )}&schedule=${encodeURIComponent(JSON.stringify(schedule))}`}
          >
            ← Back to Address Info
          </Link>
        </p>
      </div>
    </section>
  );
}
