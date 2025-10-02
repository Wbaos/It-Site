"use client";

import { useCart } from "@/lib/CartContext";
import { useNav } from "@/lib/NavContext";
import { useState } from "react";
import Link from "next/link";

export default function CartPage() {
  const { items, removeItem, updateItemQuantity } = useCart();
  const { setDropdownOpen, setOpen } = useNav();
  const [checkingOut, setCheckingOut] = useState(false);

  const clearCart = async () => {
    for (const item of items) {
      await removeItem(item.slug);
    }
  };

  const handleCheckout = async () => {
    try {
      setCheckingOut(true);
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items }),
        credentials: "include",
      });

      if (!res.ok) {
        const err = await res.json();
        alert(`Checkout failed: ${err.error}`);
        return;
      }

      const { url } = await res.json();
      if (url) window.location.href = url;
    } catch (err) {
      console.error("Checkout error:", err);
      alert("Something went wrong with checkout.");
    } finally {
      setCheckingOut(false);
    }
  };

  // subtotal = base + add-ons × quantity
  const subtotal = Array.isArray(items)
    ? items.reduce((sum, i) => {
        const optionsTotal = i.options?.reduce((s, o) => s + o.price, 0) || 0;
        return sum + (i.price + optionsTotal) * (i.quantity || 1);
      }, 0)
    : 0;

  return (
    <section className="section cart">
      {items.length === 0 ? (
        <div className="empty-cart-wrapper">
          <div className="cart-items">
            <h1 className="cart-title">Your Cart</h1>
            <div className="empty-cart">
              <p>Your cart is empty.</p>
              <button
                className="btn btn-primary"
                onClick={() => {
                  setDropdownOpen(true); // open dropdown
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              >
                Browse Services
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="site-container cart-grid">
          {/* Left side: Cart items */}
          <div className="cart-items">
            <h1 className="cart-title">Your Cart</h1>

            <ul className="cart-list">
              {items.map((item, i) => (
                <li key={i} className="cart-item">
                  <div className="cart-info">
                    <h2 className="item-title">{item.title}</h2>

                    {/* Show breakdown */}
                    <ul className="item-options">
                      <li>
                        Base Price —{" "}
                        <span className="option-price">${item.price}</span>
                      </li>
                      {item.options?.map((opt, j) => (
                        <li key={j}>
                          {opt.name} —{" "}
                          <span className="option-price">${opt.price}</span>
                        </li>
                      ))}
                    </ul>

                    {/* Modify + Remove */}
                    <div className="item-actions">
                      <Link
                        href={{
                          pathname: `/services/${item.slug}/book`,
                          query: {
                            slug: item.slug,
                            title: item.title,
                            price: item.price.toString(),
                            options: JSON.stringify(item.options || []),
                            quantity: (item.quantity || 1).toString(),
                          },
                        }}
                        className="modify-btn"
                      >
                        Modify
                      </Link>

                      <button
                        className="remove-btn"
                        onClick={() => removeItem(item.slug)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>

                  {/* Quantity Controls */}
                  <div className="item-price">
                    <div className="quantity-control">
                      <button
                        className="quantity-btn"
                        onClick={() =>
                          updateItemQuantity(
                            item.slug,
                            (item.quantity || 1) - 1
                          )
                        }
                      >
                        -
                      </button>
                      <span className="quantity-number">
                        {item.quantity || 1}
                      </span>
                      <button
                        className="quantity-btn"
                        onClick={() =>
                          updateItemQuantity(
                            item.slug,
                            (item.quantity || 1) + 1
                          )
                        }
                      >
                        +
                      </button>
                    </div>
                    <div className="unit-price">
                      $
                      {item.price +
                        (item.options?.reduce((s, o) => s + o.price, 0) ||
                          0)}{" "}
                      each
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <div className="cart-footer">
              <button className="clear-btn" onClick={clearCart}>
                Clear Cart
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => {
                  if (window.innerWidth < 900) {
                    setOpen(true);
                  } else {
                    setDropdownOpen(true);
                  }
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              >
                + Add More Services
              </button>
            </div>
          </div>

          {/* Right side: Order summary */}
          <aside className="order-summary">
            <h2>Order Summary</h2>
            <div className="summary-row">
              <span>Subtotal</span>
              <span>${subtotal}</span>
            </div>
            <div className="summary-row total">
              <span>Total</span>
              <span>${subtotal}</span>
            </div>
            <button
              className="btn btn-primary w-full"
              onClick={handleCheckout}
              disabled={checkingOut}
            >
              {checkingOut ? "Redirecting..." : "Proceed to Checkout"}
            </button>
          </aside>
        </div>
      )}
    </section>
  );
}
