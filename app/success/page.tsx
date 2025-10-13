"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useCart } from "@/lib/CartContext";

export default function SuccessPage() {
  const { clearCart } = useCart();

  useEffect(() => {
    clearCart();
  }, [clearCart]);

  return (
    <section className="section success">
      <div className="site-container">
        <div className="success-card">
          <h1 className="success-title">Payment Successful</h1>
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
