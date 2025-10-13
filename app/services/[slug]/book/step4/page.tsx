"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

export default function Step4({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const [slug, setSlug] = useState<string | null>(null);
  const searchParams = useSearchParams();

  useEffect(() => {
    params.then((p) => setSlug(p.slug));
  }, [params]);

  const priceParam = searchParams.get("price");
  const optionsParam = searchParams.get("options");
  const contactParam = searchParams.get("contact");
  const addressParam = searchParams.get("address");
  const scheduleParam = searchParams.get("schedule") || "{}";

  const parsedAddress = addressParam ? JSON.parse(addressParam) : {};

  const [schedule, setSchedule] = useState({ date: "", time: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    try {
      const parsed = JSON.parse(scheduleParam);
      setSchedule({
        date: parsed.date || "",
        time: parsed.time || "",
      });
    } catch {
    }
  }, [scheduleParam]);

  const handleFinish = async () => {
    if (!slug) return;
    setLoading(true);

    try {
      await fetch("/api/cart", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ schedule }),
        credentials: "include",
      });

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
        <h1 className="service-title">Step 4: Availability</h1>

        <form className="booking-card" onSubmit={(e) => e.preventDefault()}>
          <input
            type="date"
            className="input"
            value={schedule.date}
            onChange={(e) => setSchedule({ ...schedule, date: e.target.value })}
            required
          />
          <input
            type="time"
            className="input"
            value={schedule.time}
            onChange={(e) => setSchedule({ ...schedule, time: e.target.value })}
            required
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
              optionsParam || "[]"
            )}&contact=${encodeURIComponent(
              contactParam || "{}"
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
