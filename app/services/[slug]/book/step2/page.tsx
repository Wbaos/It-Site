"use client";

import { use, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useFormValidation } from "@/lib/useFormValidation";

type User = {
  name?: string;
  email?: string;
  phone?: string;
};

export default function Step2({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const router = useRouter();
  const searchParams = useSearchParams();

  const priceParam = searchParams.get("price") || "0";
  const optionsParam = searchParams.get("options") || "[]";
  const contactParam = searchParams.get("contact") || "{}";
  const basePrice = parseFloat(priceParam) || 0;

  const {
    values: contact,
    setValues: setContact,
    handleChange,
    validateRequired,
    getInputClass,
  } = useFormValidation({
    name: "",
    email: "",
    phone: "",
  });

  const [user, setUser] = useState<User | null>(null);

  //  Load user session if logged in
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/auth/session", { credentials: "include" });
        if (res.ok) {
          const data = await res.json();
          if (data?.user) {
            setUser(data.user);
            setContact((prev) => ({
              ...prev,
              email: data.user.email || "",
              name: data.user.name || "",
            }));
          }
        }
      } catch (err) {
        console.warn("No active session found");
      }
    };

    fetchUser();
  }, [setContact]);

  //  Load contact data if returning to this step
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
  }, [contactParam, setContact]);

  //  Continue to next step
  const handleNext = async () => {
    if (!validateRequired()) {
      alert("Please fill in all required fields before continuing.");
      return;
    }

    if (!user && !/\S+@\S+\.\S+/.test(contact.email)) {
      alert("Please enter a valid email address.");
      return;
    }

    try {
      await fetch("/api/cart", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contact }),
        credentials: "include",
      });
    } catch (err) {
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
   <section className="section booking  section-color">
  <div className="site-container booking-wrapper">
    <div className="back-link">
      <Link href={`/services/${slug}/book/step1`}>
        ← Back to Service Options
      </Link>
    </div>

    <h1 className="service-title">Contact Information</h1>

    <form className="booking-card" onSubmit={(e) => e.preventDefault()}>
      <input
        name="name"
        placeholder="Full Name"
        value={contact.name}
        onChange={(e) => handleChange("name", e.target.value)}
        className={getInputClass("name")}
      />

      {!user?.email && (
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={contact.email}
          onChange={(e) => handleChange("email", e.target.value)}
          className={getInputClass("email")}
        />
      )}

      <input
        name="phone"
        type="tel"
        placeholder="Phone Number"
        value={contact.phone}
        onChange={(e) => handleChange("phone", e.target.value)}
        className={getInputClass("phone")}
      />

      <button type="button" onClick={handleNext} className="btn-primary2">
        Next → Address Info
      </button>
    </form>
  </div>
</section>

  );
}
