"use client";

import { useCart } from "@/lib/CartContext";
import { useNav } from "@/lib/NavContext";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CartPage() {
  const { items, removeItem, updateItemQuantity } = useCart();
  const { setDropdownOpen, setOpen } = useNav();
  const router = useRouter();


  const subtotal = Array.isArray(items)
    ? items.reduce((sum, i) => sum + (i.price || 0) * (i.quantity || 1), 0)
    : 0;

  /* ================================
     PROMO CODE LOGIC
  ================================ */
  const [promoCode, setPromoCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState<any>(null);
  const [promoError, setPromoError] = useState("");

  const applyPromo = async () => {
    setPromoError("");

    const res = await fetch("/api/promo/validate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: promoCode }),
    });

    const data = await res.json();

    if (!data.valid) {
      setAppliedPromo(null);
      setPromoError(data.error);
      return;
    }

    setAppliedPromo(data);
  };

  let discountAmount = 0;

  if (appliedPromo) {
    if (appliedPromo.discountType === "percentage") {
      discountAmount = subtotal * (appliedPromo.value / 100);
    } else if (appliedPromo.discountType === "flat") {
      discountAmount = appliedPromo.value;
    }
  }

  const tax = subtotal * 0.07;
  const total = subtotal + tax - discountAmount;


  if (items.length === 0)
    return (
      <section className="cart-page">

        <div className="cart-header">
          <h1 className="cart-title">Shopping Cart</h1>
          <p className="cart-subtitle">Review your items before checkout</p>
        </div>

        <div className="cart-container">
          <div className="cart-left">
            <div className="empty-cart-message">
              <p>Your cart is empty.</p>

              <button
                className="checkout-btn"
                onClick={() => {
                  setDropdownOpen(true);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              >
                Browse Services
              </button>
            </div>
          </div>
        </div>

      </section>
    );

  return (
    <section className="cart-page">

      <div className="cart-header">
        <h1 className="cart-title">Shopping Cart</h1>
        <p className="cart-subtitle">Review your items before checkout</p>
      </div>

      <div className="cart-container">

        <div className="cart-left">
          <ul className="cart-list">
            {items.map((item) => (
              <li key={item.id} className="cart-item card">
                <div className="cart-item-wrapper">

                  <div className="cart-item-left">

                    <h2 className="item-title">{item.title}</h2>

                    {item.description && (
                      <p className="item-description">{item.description}</p>
                    )}

                    {(item.options ?? []).length > 0 && (
                      <ul className="item-options">
                        {(item.options || []).map((opt, i) => (
                          <li key={i} className="item-option-line">
                            {opt.name} —{" "}
                            <span className="item-option-price">${opt.price}</span>
                          </li>
                        ))}
                      </ul>
                    )}

                    <div className="item-actions">
                      <button
                        className="modify-btn"
                        onClick={() =>
                          router.push(
                            `/services/${item.slug}/book/step1?edit=true&id=${item.id}`
                          )
                        }
                      >
                        Modify
                      </button>

                      <button
                        className="remove-btn"
                        onClick={() => removeItem(item.id)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>

                  <div className="cart-item-right">

                    <div className="quantity-control-wrapper">
                      <span className="quantity-label">Quantity:</span>

                      <div className="quantity-control">
                        <button
                          className="quantity-btn"
                          onClick={() =>
                            updateItemQuantity(item.id, Math.max(1, item.quantity - 1))
                          }
                        >
                          –
                        </button>

                        <span className="quantity-number">{item.quantity}</span>

                        <button
                          className="quantity-btn"
                          onClick={() =>
                            updateItemQuantity(item.id, item.quantity + 1)
                          }
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <div className="unit-price">${item.price.toFixed(2)}</div>

                  </div>
                </div>
              </li>
            ))}
          </ul>

          <button
            className="continue-shopping"
            onClick={() => {
              if (window.innerWidth < 900) setOpen(true);
              else setDropdownOpen(true);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          >
            + Continue Shopping
          </button>
        </div>

        <aside className="cart-summary">

          <h2>Order Summary</h2>

          <div className="summary-row">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>

          <div className="summary-row">
            <span>Tax (7%)</span>
            <span>${tax.toFixed(2)}</span>
          </div>

          <div className="promo-section">
            <label className="promo-label">Promo Code</label>

            <div className="promo-input-wrapper">
              <input
                type="text"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                className="promo-input"
                placeholder="Enter code"
              />

              <button className="promo-apply-btn" onClick={applyPromo}>
                Apply
              </button>
            </div>

            {promoError && (
              <p className="promo-error">{promoError}</p>
            )}
          </div>

          {appliedPromo && (
            <div className="summary-row">
              <span>Discount ({promoCode.toUpperCase()})</span>
              <span>- ${discountAmount.toFixed(2)}</span>
            </div>
          )}

          <div className="summary-total">
            <span className="summary-total-text">Total</span>
            <span>${total.toFixed(2)}</span>
          </div>

          <button
            className="checkout-btn"
            onClick={() => {
              const firstItem = items[0];
              if (firstItem) {
                router.push(`/services/${firstItem.slug}/book/step2`);
              }
            }}
          >
            Proceed to Checkout
          </button>

          <div className="summary-icons">
            <div><span>🔒</span> Secure Payment</div>
            <div><span>✔</span> Licensed</div>
            <div><span>⭐</span> Top Rated</div>
          </div>

        </aside>

      </div>
    </section>
  );
}
