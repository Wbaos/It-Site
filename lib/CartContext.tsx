"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

type CartOption = {
  name: string;
  price: number;
};

type CartItem = {
  slug: string;
  title: string;
  price: number;
  options?: CartOption[];
  quantity: number;
};

type CartContextType = {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity">) => Promise<void>;
  removeItem: (slug: string) => Promise<void>;
  updateItemQuantity: (slug: string, quantity: number) => Promise<void>;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  //  Normalize helper
  const normalizeItems = (data: any): CartItem[] =>
    Array.isArray(data?.items) ? data.items : [];

  //  Load cart from backend on mount
  useEffect(() => {
    fetch("/api/cart")
      .then((res) => res.json())
      .then((data) => setItems(normalizeItems(data)))
      .catch(() => setItems([]));
  }, []);

  //  Add item (increment if it already exists)
  const addItem = async (item: Omit<CartItem, "quantity">) => {
    const existing = items.find(
      (i) =>
        i.slug === item.slug &&
        JSON.stringify(i.options || []) === JSON.stringify(item.options || [])
    );

    if (existing) {
      // increment locally
      const updated = items.map((i) =>
        i.slug === item.slug &&
        JSON.stringify(i.options || []) === JSON.stringify(item.options || [])
          ? { ...i, quantity: i.quantity + 1 }
          : i
      );
      setItems(updated);
    } else {
      const newItem = { ...item, quantity: 1 };
      setItems([...items, newItem]);
    }

    // persist to backend
    const res = await fetch("/api/cart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(item),
    });
    const data = await res.json();
    setItems(normalizeItems(data));
  };

  //  Remove item completely
  const removeItem = async (slug: string, options?: CartOption[]) => {
    const res = await fetch("/api/cart", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug, options }),
    });
    const data = await res.json();
    setItems(data.items || []);
  };

  //  Update item quantity
  const updateItemQuantity = async (slug: string, quantity: number) => {
    const res = await fetch("/api/cart", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug, quantity }),
    });
    const data = await res.json();
    setItems(normalizeItems(data));
  };

  return (
    <CartContext.Provider
      value={{ items, addItem, removeItem, updateItemQuantity }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
