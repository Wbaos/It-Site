"use client";

import { useState } from "react";
import { useCart } from "@/lib/CartContext";
import { useRouter } from "next/navigation";

export default function BookingForm({ service }: { service: any }) {
  const { addItem } = useCart(); // still used at step2
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    date: "",
    time: "",
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // instead of calling addItem again → send PUT to update
    await fetch("/api/cart", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        slug: service.slug,
        contact: {
          name: form.name,
          email: form.email,
          phone: form.phone,
        },
        address: {
          street: form.address,
          city: "",
          state: "",
          zip: "",
        },
        schedule: {
          date: form.date,
          time: form.time,
        },
      }),
    });

    router.push("/checkout");
  }

  return (
    <form onSubmit={handleSubmit} className="booking-form">
      <h2>Booking Details</h2>

      <input
        name="name"
        placeholder="Full Name"
        value={form.name}
        onChange={handleChange}
        required
        className="input"
      />
      <input
        name="email"
        type="email"
        placeholder="Email"
        value={form.email}
        onChange={handleChange}
        required
        className="input"
      />
      <input
        name="phone"
        type="tel"
        placeholder="Phone"
        value={form.phone}
        onChange={handleChange}
        required
        className="input"
      />
      <input
        name="address"
        placeholder="Service Address"
        value={form.address}
        onChange={handleChange}
        required
        className="input"
      />
      <input
        name="date"
        type="date"
        value={form.date}
        onChange={handleChange}
        required
        className="input"
      />
      <input
        name="time"
        type="time"
        value={form.time}
        onChange={handleChange}
        required
        className="input"
      />

      <button type="submit" className="btn btn-primary wide">
        Confirm & Checkout
      </button>
    </form>
  );
}
