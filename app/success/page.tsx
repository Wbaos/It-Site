"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useCart } from "@/lib/CartContext";

export default function SuccessPage() {
  const { items, removeItem } = useCart();

  // Clear the cart when this page mounts
  useEffect(() => {
    async function clearCart() {
      for (const item of items) {
        await removeItem(item.slug);
      }
    }
    if (items.length > 0) {
      clearCart();
    }
  }, [items, removeItem]);

  return (
    <section className="section success">
      <div className="site-container">
        <div className="success-card">
          <div className="success-header">
            <span className="success-icon">✅</span>
            <h1 className="success-title">Payment Successful</h1>
          </div>

          <p className="success-message">
            Thank you! Your order has been received. A confirmation email will
            be sent shortly.
          </p>

          <div className="success-actions">
            <Link href="/" className="btn btn-primary">
              ← Back to Home
            </Link>
            <Link href="/cart" className="btn btn-secondary">
              View Cart
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
