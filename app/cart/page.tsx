"use client";

import { useCart } from "@/lib/CartContext";
import { useNav } from "@/lib/NavContext";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const { items, removeItem, updateItemQuantity, clearCart } = useCart();
  const { setDropdownOpen, setOpen } = useNav();
  const router = useRouter();

  const subtotal = Array.isArray(items)
    ? items.reduce((sum, i) => sum + (i.price || 0) * (i.quantity || 1), 0)
    : 0;

  if (items.length === 0)
    return (
      <section className="section cart">
        <div className="empty-cart-wrapper">
          <div className="cart-items">
            <h1 className="cart-title">Your Cart</h1>
            <div className="empty-cart">
              <p>Your cart is empty.</p>
              <button
                className="btn btn-primary"
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
    <section className="section cart">
      <div className="site-container cart-grid">
        <div className="cart-items">
          <h1 className="cart-title">Your Cart</h1>

          <ul className="cart-list">
            {items.map((item, i) => (
              <li key={i} className="cart-item">
                <div className="cart-info">
                  <h2 className="item-title">
                    {item.title} —{" "}
                    <span className="option-price">${item.basePrice}</span>
                  </h2>

                  {item.options?.length ? (
                    <ul className="item-options nested-options">
                      {item.options.map((opt, j) => (
                        <li key={j}>
                          {opt.name} — <span className="option-price">${opt.price}</span>
                        </li>
                      ))}
                    </ul>
                  ) : null}


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

                <div className="item-price">
                  <div className="quantity-control">
                    <button
                      className="quantity-btn"
                      onClick={() =>
                        updateItemQuantity(item.id, (item.quantity || 1) - 1)
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
                        updateItemQuantity(item.id, (item.quantity || 1) + 1)
                      }
                    >
                      +
                    </button>
                  </div>
                  <div className="unit-price">${item.price} each</div>
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
            className="btn btn-primary w-full mt-4"
            onClick={() => {
              const firstItem = items[0];
              if (firstItem) {
                router.push(`/services/${firstItem.slug}/book/step2`);
              }
            }}
          >
            Proceed to Checkout
          </button>
        </aside>
      </div>
    </section>
  );
}
