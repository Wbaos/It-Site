"use client";

import { use, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useFormValidation } from "@/lib/useFormValidation";
import SvgIcon from "@/components/common/SvgIcons";
import BookingSteps from "@/components/BookingSteps";
import { isTimeSlotAvailableForDate, STANDARD_TIME_SLOTS } from "@/lib/time-slots";

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

  const timeRanges = STANDARD_TIME_SLOTS;

  const isTimeSlotAvailable = (startHour: number): boolean => {
    return isTimeSlotAvailableForDate({ dateIso: schedule.date, startHour });
  };

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

  // Clear time selection if it becomes invalid when date changes
  useEffect(() => {
    if (schedule.date && schedule.time) {
      const selectedRange = timeRanges.find(r => r.value === schedule.time);
      if (selectedRange && !isTimeSlotAvailable(selectedRange.startHour)) {
        setSchedule({ ...schedule, time: "" });
      }
    }
  }, [schedule.date]);

  const handleFinish = async () => {
  if (!validateRequired()) {
    alert("Please select both date and time before continuing.");
    return;
  }

  setLoading(true);
  try {
    await fetch("/api/cart", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ schedule }),
    });

    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });

    if (!res.ok) {
      throw new Error(`Checkout failed with status ${res.status}`);
    }

    const { url } = await res.json();
    if (url) router.push(url); 
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
        <BookingSteps currentStep={4} />
        <h1 className="service-title">Select Your Preferred Date & Time</h1>
        <p className="availability-subtitle">Choose when you&apos;d like us to provide the service</p>

        <form className="booking-card availability-form" onSubmit={(e) => e.preventDefault()}>
          <div className="availability-section">
            <label className="availability-label">
              <SvgIcon name="calendar" size={20} className="label-icon" />
              Select Date
            </label>
            <input
              type="date"
              className={`availability-input ${getInputClass("date")}`}
              value={schedule.date}
              onChange={(e) => handleChange("date", e.target.value)}
              onClick={(e) => {
                try {
                  (e.target as HTMLInputElement).showPicker?.();
                } catch (err) {
                }
              }}
              min={new Date().toISOString().split('T')[0]}
            />
          </div>

          <div className="availability-section">
            <label className="availability-label">
              <SvgIcon name="clock" size={20} className="label-icon" />
              Select Time Range
            </label>
            
            <div className="time-slots-grid">
              {timeRanges.map((range) => {
                const isAvailable = isTimeSlotAvailable(range.startHour);
                return (
                  <button
                    key={range.value}
                    type="button"
                    className={`time-slot time-range-slot ${
                      schedule.time === range.value ? "selected" : ""
                    } ${!isAvailable ? "disabled" : ""}`}
                    onClick={() => isAvailable && handleChange("time", range.value)}
                    disabled={!isAvailable}
                    title={!isAvailable ? "Not available - must be at least 3 hours from now" : ""}
                  >
                    {range.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="availability-summary">
            {schedule.date && schedule.time ? (
              <div className="selected-datetime">
                <SvgIcon name="verified-check" size={20} />
                <span>
                  Scheduled for: <strong>{new Date(schedule.date + "T12:00:00").toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</strong> between <strong>{timeRanges.find(r => r.value === schedule.time)?.label || schedule.time}</strong>
                </span>
              </div>
            ) : schedule.date && timeRanges.every(range => !isTimeSlotAvailable(range.startHour)) ? (
              <span className="placeholder-text" style={{ color: "#e53e3e" }}>
                ⚠️ No time slots available for this date. Please select a different date.
              </span>
            ) : (
              <span className="placeholder-text">Select a date and time above</span>
            )}
          </div>

          <button
            type="button"
            onClick={handleFinish}
            className="btn-primary2 availability-submit"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner-small"></span>
                Redirecting...
              </>
            ) : (
              "Confirm & Pay →"
            )}
          </button>
        </form>
      </div>
    </section>
  );
}
