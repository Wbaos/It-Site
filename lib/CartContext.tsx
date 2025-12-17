"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";
import { logger } from "./logger";

type CartOption = {
  name: string;
  price: number;
};

type CartItem = {
  id: string;
  slug: string;
  title: string;
  description?: string; 
  basePrice: number;
  price: number;
  options?: CartOption[];
  quantity: number;
  contact?: {
    name: string;
    email: string;
    phone: string;
  };
  address?: {
    street: string;
    city: string;
    state: string;
    zip: string;
  };
  schedule?: {
    date: string;
    time: string;
  };
};

type CartContextType = {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity" | "id">) => Promise<void>;
  removeItem: (id: string) => Promise<void>;
  updateItemQuantity: (id: string, quantity: number) => Promise<void>;
  updateItem: (id: string, updates: Partial<CartItem>) => void; 
  clearCart: () => Promise<void>;
  clearCartFrontend: () => void;
  setItems: React.Dispatch<React.SetStateAction<CartItem[]>>;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const normalizeItems = (data: { items?: CartItem[] }): CartItem[] =>
    Array.isArray(data?.items) ? data.items : [];

  useEffect(() => {
    fetch("/api/cart", { credentials: "include" })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load cart");
        return res.json();
      })
      .then((data) => setItems(normalizeItems(data)))
      .catch(() => setItems([]));
  }, []);

  const addItem = useCallback(
    async (item: Omit<CartItem, "quantity" | "id">) => {
      try {
        const uniqueId = `${item.slug}-${Date.now()}-${Math.random()
          .toString(36)
          .substring(2, 8)}`;

        const res = await fetch("/api/cart", {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...item, id: uniqueId }),
        });

        const data = await res.json();
        setItems(normalizeItems(data));
      } catch (err) {
        logger.error("Error adding item to cart", err);
      }
    },
    []
  );

  const removeItem = useCallback(async (id: string) => {
    const res = await fetch("/api/cart", {
      method: "DELETE",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    const data = await res.json();
    setItems(data.items || []);
  }, []);

  const updateItemQuantity = useCallback(
    async (id: string, quantity: number) => {
      const res = await fetch("/api/cart", {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, quantity }),
      });
      const data = await res.json();
      setItems(normalizeItems(data));
    },
    []
  );

  const updateItem = useCallback(async (id: string, updates: Partial<CartItem>) => {
    try {
      const res = await fetch("/api/cart", {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...updates }),
      });

      if (!res.ok) throw new Error("Failed to update cart item");
      const data = await res.json();
      setItems(normalizeItems(data));
    } catch (err) {
      logger.error("Error updating cart item", err);
    }
  }, []);


  const clearCart = useCallback(async () => {
    const res = await fetch("/api/cart", {
      method: "DELETE",
      credentials: "include",
    });
    if (res.ok) {
      const data = await res.json();
      setItems(normalizeItems(data));
    } else {
      setItems([]);
    }
  }, []);

  const clearCartFrontend = useCallback(() => {
    setItems([]);
  }, []);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateItemQuantity,
        updateItem,
        clearCart,
        clearCartFrontend,
        setItems,
      }}
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
