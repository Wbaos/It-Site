"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/CartContext";
import { useFormValidation } from "@/lib/useFormValidation";
import CheckoutSteps from "@/components/checkout/CheckoutSteps";

const styles = new Proxy({} as Record<string, string>, {
  get: (_target, prop) => (typeof prop === "string" ? prop : ""),
});
import {
  BadgeCheck,
  Check,
  CheckCircle2,
  Phone,
  ShieldCheck,
} from "lucide-react";
import {
  isTimeSlotAvailableForDate,
} from "@/lib/time-slots";

type User = {
  name?: string;
  email?: string;
  phone?: string;
};

type CartState = {
  contact?: {
    name?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
  };
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zip?: string;
    notes?: string;
  };
  schedule?: { date?: string; time?: string };
};

export default function CheckoutClient() {
  const router = useRouter();
  const { items } = useCart();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  const subtotal = useMemo(() => {
    if (!Array.isArray(items)) return 0;
    return items.reduce((sum, i) => sum + (i.price || 0) * (i.quantity || 1), 0);
  }, [items]);

  const total = subtotal;

  const {
    values: contact,
    setValues: setContact,
    handleChange: handleContactChange,
    validateRequired: validateContactRequired,
    getInputClass: getContactInputClass,
  } = useFormValidation({ firstName: "", lastName: "", email: "", phone: "" });

  const {
    values: address,
    setValues: setAddress,
    handleChange: handleAddressChange,
    validateRequired: validateAddressRequired,
    getInputClass: getAddressInputClass,
  } = useFormValidation(
    { street: "", city: "", state: "", zip: "", notes: "" },
    { requiredKeys: ["street", "city", "state", "zip"] }
  );

  const {
    values: schedule,
    setValues: setSchedule,
    handleChange: handleScheduleChange,
    validateRequired: validateScheduleRequired,
    getInputClass: getScheduleInputClass,
  } = useFormValidation({ date: "", time: "" });

  const timeSlots = useMemo(() => {
    const formatHourLabel = (hour24: number) => {
      const ampm = hour24 >= 12 ? "PM" : "AM";
      const hour12 = ((hour24 + 11) % 12) + 1;
      return `${String(hour12).padStart(2, "0")}:00 ${ampm}`;
    };

    const slots: { label: string; value: string; startHour: number }[] = [];
    for (let hour = 8; hour <= 19; hour++) {
      slots.push({
        label: formatHourLabel(hour),
        value: `${String(hour).padStart(2, "0")}:00`,
        startHour: hour,
      });
    }
    return slots;
  }, []);

  const isTimeSlotAvailable = (startHour: number): boolean => {
    return isTimeSlotAvailableForDate({ dateIso: schedule.date, startHour });
  };

  // Load persisted cart state
  useEffect(() => {
    const loadCartState = async () => {
      try {
        const res = await fetch("/api/cart", { credentials: "include" });
        if (!res.ok) return;
        const data = (await res.json()) as CartState;

        if (data.contact) {
          const fullName = (data.contact.name || "").trim();
          const split = fullName ? fullName.split(/\s+/) : [];
          const fallbackFirst = split.length ? split[0] : "";
          const fallbackLast = split.length > 1 ? split.slice(1).join(" ") : "";

          setContact({
            firstName: data.contact.firstName || fallbackFirst,
            lastName: data.contact.lastName || fallbackLast,
            email: data.contact.email || "",
            phone: data.contact.phone || "",
          });
        }

        if (data.address) {
          setAddress({
            street: data.address.street || "",
            city: data.address.city || "",
            state: data.address.state || "",
            zip: data.address.zip || "",
            notes: data.address.notes || "",
          });
        }

        if (data.schedule) {
          setSchedule({
            date: data.schedule.date || "",
            time: data.schedule.time || "",
          });
        }
      } catch {
        // ignore
      }
    };

    loadCartState();
  }, [setAddress, setContact, setSchedule]);

  // Load session user
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/auth/session", { credentials: "include" });
        if (!res.ok) return;
        const data = await res.json();
        if (!data?.user) return;

        setUser(data.user);
        setContact((prev) => ({
          ...prev,
          email: data.user.email || prev.email,
          firstName:
            data.user.name?.split(/\s+/)?.[0] || prev.firstName,
          lastName:
            data.user.name?.split(/\s+/).slice(1).join(" ") || prev.lastName,
        }));
      } catch {
        // ignore
      }
    };

    fetchUser();
  }, [setContact]);

  // Clear time selection if it becomes invalid when date changes
  useEffect(() => {
    if (schedule.date && schedule.time) {
      const selectedSlot = timeSlots.find((r) => r.value === schedule.time);
      if (selectedSlot && !isTimeSlotAvailable(selectedSlot.startHour)) {
        setSchedule({ ...schedule, time: "" });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [schedule.date]);

  const saveContact = async () => {
    const fullName = `${contact.firstName || ""} ${contact.lastName || ""}`.trim();
    await fetch("/api/cart", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contact: {
          ...contact,
          name: fullName,
        },
      }),
      credentials: "include",
    });
  };

  const saveAddress = async () => {
    await fetch("/api/cart", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ address }),
      credentials: "include",
    });
  };

  const saveSchedule = async () => {
    await fetch("/api/cart", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ schedule }),
      credentials: "include",
    });
  };

  const handleContinue = async () => {
    if (step === 1) {
      if (!validateContactRequired()) {
        alert("Please fill in all required fields before continuing.");
        return;
      }
      if (!user && !/\S+@\S+\.\S+/.test(contact.email)) {
        alert("Please enter a valid email address.");
        return;
      }
      try {
        await saveContact();
      } catch {
        // ignore
      }
      setStep(2);
      return;
    }

    if (step === 2) {
      if (!validateAddressRequired()) {
        alert("Please fill in all address fields before continuing.");
        return;
      }
      try {
        await saveAddress();
      } catch {
        // ignore
      }
      setStep(3);
      return;
    }

    if (step === 3) {
      if (!validateScheduleRequired()) {
        alert("Please select both date and time before continuing.");
        return;
      }
      try {
        await saveSchedule();
      } catch {
        // ignore
      }
      setStep(4);
      return;
    }
  };

  const handleBack = () => {
    setStep((s) => (s > 1 ? ((s - 1) as 1 | 2 | 3 | 4) : s));
  };

  const handleFinish = async () => {
    setLoading(true);
    try {
      await saveSchedule();

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

  if (!items?.length) {
    return (
      <div className="checkoutClient">
        <section className={`checkout ${styles.page}`}>
          <div className={styles.container}>
            <div className={styles.topbar}>
              <p className={styles.backLink}>
                <Link href="/cart">← Back to Cart</Link>
              </p>
              <div className={styles.title}>Checkout</div>
              <div />
            </div>
            <div className={styles.card}>
              <h2>Your cart is empty</h2>
              <p className={styles.subtitle}>
                Add a service before proceeding to checkout.
              </p>
              <button
                className={styles.btnPrimary}
                onClick={() => router.push("/services")}
              >
                Browse Services
              </button>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="checkoutClient">
      <section className={`checkout ${styles.page}`}>
        <div className={styles.container}>
          <div className={styles.topbar}>
            <p className={styles.backLink}>
              <Link href="/cart">← Back to Cart</Link>
            </p>
            <div className={styles.title}>Checkout</div>
            <div />
          </div>

          <CheckoutSteps currentStep={step} />

          <div className={styles.grid}>
            <div className={styles.leftColumn}>
              <div className={styles.card}>
            {step === 1 && (
              <>
                <h2>Contact Information</h2>
                <p className={styles.subtitle}>
                  We’ll use this to confirm your booking
                </p>

                <div className={styles.contactGrid}>
                  <div className={styles.field}>
                    <label className={styles.label}>
                      First Name <span className={styles.req}>*</span>
                    </label>
                    <input
                      name="firstName"
                      placeholder="John"
                      value={contact.firstName}
                      onChange={(e) =>
                        handleContactChange("firstName", e.target.value)
                      }
                      className={`${styles.input} ${getContactInputClass(
                        "firstName"
                      )}`}
                    />
                  </div>

                  <div className={styles.field}>
                    <label className={styles.label}>
                      Last Name <span className={styles.req}>*</span>
                    </label>
                    <input
                      name="lastName"
                      placeholder="Doe"
                      value={contact.lastName}
                      onChange={(e) =>
                        handleContactChange("lastName", e.target.value)
                      }
                      className={`${styles.input} ${getContactInputClass(
                        "lastName"
                      )}`}
                    />
                  </div>

                  <div className={`${styles.field} ${styles.fullRow}`}>
                    <label className={styles.label}>
                      Email Address <span className={styles.req}>*</span>
                    </label>
                    <input
                      name="email"
                      type="email"
                      placeholder="john@example.com"
                      value={contact.email}
                      onChange={(e) => handleContactChange("email", e.target.value)}
                      className={`${styles.input} ${getContactInputClass(
                        "email"
                      )}`}
                      disabled={!!user?.email}
                    />
                  </div>

                  <div className={`${styles.field} ${styles.fullRow}`}>
                    <label className={styles.label}>
                      Phone Number <span className={styles.req}>*</span>
                    </label>
                    <input
                      name="phone"
                      type="tel"
                      placeholder="(555) 123-4567"
                      value={contact.phone}
                      onChange={(e) => handleContactChange("phone", e.target.value)}
                      className={`${styles.input} ${getContactInputClass(
                        "phone"
                      )}`}
                    />
                  </div>
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <h2>Service Location</h2>
                <p className={styles.subtitle}>
                  Where should we provide the service?
                </p>

                <div className={styles.addressGrid}>
                  <div className={`${styles.field} ${styles.fullRow}`}>
                    <label className={styles.label}>
                      Street Address <span className={styles.req}>*</span>
                    </label>
                    <input
                      name="street"
                      type="text"
                      placeholder="123 Main Street, Apt 4B"
                      value={address.street}
                      onChange={(e) => handleAddressChange("street", e.target.value)}
                      className={`${styles.input} ${getAddressInputClass("street")}`}
                    />
                  </div>

                  <div className={styles.field}>
                    <label className={styles.label}>
                      City <span className={styles.req}>*</span>
                    </label>
                    <input
                      name="city"
                      type="text"
                      placeholder="San Francisco"
                      value={address.city}
                      onChange={(e) => handleAddressChange("city", e.target.value)}
                      className={`${styles.input} ${getAddressInputClass("city")}`}
                    />
                  </div>

                  <div className={styles.field}>
                    <label className={styles.label}>
                      State <span className={styles.req}>*</span>
                    </label>
                    <input
                      name="state"
                      type="text"
                      placeholder="CA"
                      value={address.state}
                      onChange={(e) => handleAddressChange("state", e.target.value)}
                      className={`${styles.input} ${getAddressInputClass("state")}`}
                    />
                  </div>

                  <div className={`${styles.field} ${styles.fullRow}`}>
                    <label className={styles.label}>
                      ZIP Code <span className={styles.req}>*</span>
                    </label>
                    <input
                      name="zip"
                      type="text"
                      placeholder="94102"
                      value={address.zip}
                      onChange={(e) => handleAddressChange("zip", e.target.value)}
                      className={`${styles.input} ${getAddressInputClass("zip")}`}
                    />
                  </div>

                  <div className={`${styles.field} ${styles.fullRow}`}>
                    <label className={styles.label}>
                      Additional Notes <span style={{ color: "#94a3b8", fontWeight: 600 }}>(Optional)</span>
                    </label>
                    <textarea
                      name="notes"
                      placeholder="Gate code, parking instructions, etc."
                      value={address.notes}
                      onChange={(e) => handleAddressChange("notes", e.target.value)}
                      className={`${styles.textarea} ${styles.input}`}
                      rows={4}
                    />
                  </div>
                </div>

              </>
            )}

            {step === 3 && (
              <>
                <h2>Schedule Your Service</h2>
                <p className={styles.subtitle}>
                  Pick a date and time for all your services
                </p>

                <div className={styles.scheduleBlock}>
                  <div className={styles.field}>
                    <label className={styles.label}>
                      Select Date <span className={styles.req}>*</span>
                    </label>
                    <input
                      type="date"
                      value={schedule.date}
                      onChange={(e) => handleScheduleChange("date", e.target.value)}
                      onClick={(e) => {
                        try {
                          (e.target as HTMLInputElement).showPicker?.();
                        } catch {
                          // ignore
                        }
                      }}
                      min={new Date().toISOString().split("T")[0]}
                      className={`${styles.input} ${getScheduleInputClass("date")}`}
                    />
                  </div>

                  <div className={styles.field} style={{ marginTop: 14 }}>
                    <label className={styles.label}>
                      Select Time <span className={styles.req}>*</span>
                    </label>

                    <div className={styles.timeSlotsGrid}>
                      {timeSlots.map((slot) => {
                        const isAvailable = isTimeSlotAvailable(slot.startHour);
                        const isSelected = schedule.time === slot.value;
                        return (
                          <button
                            key={slot.value}
                            type="button"
                            className={`${styles.timeSlotBtn} ${
                              isSelected ? styles.timeSlotBtnSelected : ""
                            } ${!isAvailable ? styles.timeSlotBtnDisabled : ""}`}
                            onClick={() =>
                              isAvailable && handleScheduleChange("time", slot.value)
                            }
                            disabled={!isAvailable}
                            title={
                              !isAvailable
                                ? "Not available - must be at least 3 hours from now"
                                : ""
                            }
                          >
                            {slot.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className={styles.scheduleSummary}>
                    {schedule.date && schedule.time ? (
                      <div className={styles.scheduledRow}>
                        <CheckCircle2 size={18} className={styles.scheduledIcon} />
                        <span>
                          <strong>Scheduled:</strong>{" "}
                          {new Date(
                            schedule.date + "T12:00:00"
                          ).toLocaleDateString("en-US", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}{" "}
                          at{" "}
                          <strong>
                            {timeSlots.find((s) => s.value === schedule.time)?.label ||
                              schedule.time}
                          </strong>
                        </span>
                      </div>
                    ) : schedule.date &&
                      timeSlots.every((slot) =>
                        !isTimeSlotAvailable(slot.startHour)
                      ) ? (
                      <span className={styles.schedulePlaceholderError}>
                        No time slots available for this date. Please select a different date.
                      </span>
                    ) : (
                      <span className={styles.schedulePlaceholder}>
                        Select a date and time above
                      </span>
                    )}
                  </div>
                </div>

              </>
            )}

            {step === 4 && (
              <>
                <h2>Review Your Order</h2>

                <div className={styles.reviewWrap}>
                  <div className={styles.reviewLabel}>
                    Services ({items.length})
                  </div>

                  <div className={styles.reviewServiceList}>
                    {items.map((it) => (
                      <div key={it.id} className={styles.reviewServiceRow}>
                        <span className={styles.reviewServiceName}>{it.title}</span>
                        <span className={styles.reviewServicePrice}>
                          ${((it.price || 0) * (it.quantity || 1)).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className={styles.reviewDivider} />

                  <div className={styles.reviewSectionLabel}>Contact Information</div>
                  <div className={styles.reviewBlock}>
                    <div className={styles.reviewStrong}>
                      {[contact.firstName, contact.lastName]
                        .filter(Boolean)
                        .join(" ")}
                    </div>
                    <div className={styles.reviewMuted}>{contact.email}</div>
                    <div className={styles.reviewMuted}>{contact.phone}</div>
                  </div>

                  <div className={styles.reviewDivider} />

                  <div className={styles.reviewSectionLabel}>Service Location</div>
                  <div className={styles.reviewBlock}>
                    <div className={styles.reviewStrong}>{address.street}</div>
                    <div className={styles.reviewMuted}>
                      {address.city}, {address.state} {address.zip}
                    </div>
                    {address.notes ? (
                      <div className={styles.reviewNotes}>Notes: {address.notes}</div>
                    ) : null}
                  </div>

                  <div className={styles.reviewDivider} />

                  <div className={styles.reviewSectionLabel}>Scheduled For</div>
                  <div className={styles.reviewBlock}>
                    <div className={styles.reviewStrong}>
                      {schedule.date
                        ? new Date(schedule.date + "T12:00:00").toLocaleDateString(
                            "en-US",
                            { weekday: "long", month: "long", day: "numeric" }
                          )
                        : ""}
                    </div>
                    <div className={styles.reviewTime}>
                      {timeSlots.find((r) => r.value === schedule.time)?.label ||
                        schedule.time}
                    </div>
                  </div>
                </div>

              </>
            )}
            </div>

            <div className={styles.footer}>
              {step === 1 && (
                <button
                  type="button"
                  className={styles.btnPrimary}
                  onClick={handleContinue}
                >
                  Continue →
                </button>
              )}

              {step === 2 && (
                <div className={styles.footerActions}>
                  <button
                    type="button"
                    className={styles.btnSecondary}
                    onClick={handleBack}
                  >
                    ← Back
                  </button>
                  <button
                    type="button"
                    className={styles.btnPrimary}
                    onClick={handleContinue}
                  >
                    Continue →
                  </button>
                </div>
              )}

              {step === 3 && (
                <div className={styles.footerActions}>
                  <button
                    type="button"
                    className={styles.btnSecondary}
                    onClick={handleBack}
                  >
                    ← Back
                  </button>
                  <button
                    type="button"
                    className={styles.btnPrimary}
                    onClick={handleContinue}
                  >
                    Continue →
                  </button>
                </div>
              )}

              {step === 4 && (
                <div className={styles.footerActions}>
                  <button
                    type="button"
                    className={styles.btnSecondary}
                    onClick={handleBack}
                    disabled={loading}
                  >
                    ← Back
                  </button>
                  <button
                    type="button"
                    className={styles.btnPrimary}
                    onClick={handleFinish}
                    disabled={loading}
                  >
                    {loading ? (
                      "Redirecting..."
                    ) : (
                      <>
                        <Check size={18} />
                        Confirm Booking
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>

          <aside className={styles.sidebar}>
            <div className={styles.summaryCard}>
              <div className={styles.summaryHeaderContainer}>
                <h3 className={styles.summaryHeader}>Order Summary</h3>
              </div>

              <div className={styles.summaryBody}>
                <div className={styles.summaryItems}>
                  {items.map((it) => (
                    <div key={it.id} className={styles.summaryItemRow}>
                      <span className={styles.summaryItemName}>{it.title}</span>
                      <span className={styles.summaryItemPrice}>
                        ${((it.price || 0) * (it.quantity || 1)).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className={styles.summaryDivider} />

                <div className={styles.summaryRow}>
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>

                <div className={styles.summaryTotalRow}>
                  <span>Total</span>
                  <span className={styles.summaryTotalValue}>
                    ${total.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            <div className={styles.perksCard}>
              <div className={styles.perkRow}>
                <ShieldCheck size={18} className={styles.perkIcon} />
                90-Day Warranty
              </div>
              <div className={styles.perkRow}>
                <BadgeCheck size={18} className={styles.perkIcon} />
                Satisfaction Guaranteed
              </div>
              <div className={styles.perkRow}>
                <Check size={18} className={styles.perkIcon} />
                Transparent Pricing
              </div>
            </div>

            <div className={styles.helpBlock}>
              <div className={styles.helpLabel}>Need help?</div>
              <a className={styles.helpPhone} href="tel:+17863662729">
                <Phone size={16} />
                Call (786) 366-2729
              </a>
            </div>
          </aside>
        </div>
      </div>
    </section>
    </div>
  );
}
