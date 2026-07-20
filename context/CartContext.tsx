"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import toast from "react-hot-toast";

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  image: string;
  qty: number;
  stock: number;
  category: string;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (productId: string) => void;
  updateQty: (productId: string, qty: number) => void;
  clearCart: () => void;
  total: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const addItem = (item: CartItem) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.productId === item.productId);
      const stock = item.stock ?? Infinity;

      if (existing) {
        const desiredQty = existing.qty + item.qty;
        const clampedQty = Math.min(desiredQty, stock);
        if (desiredQty > stock) {
          toast.error(`Only ${stock} in stock — cart capped at ${clampedQty}`);
        }
        return prev.map((i) =>
          i.productId === item.productId ? { ...i, qty: clampedQty, stock } : i
        );
      }

      const clampedQty = Math.min(item.qty, stock);
      if (item.qty > stock) {
        toast.error(`Only ${stock} in stock — added ${clampedQty} instead`);
      }
      return [...prev, { ...item, qty: clampedQty }];
    });
  };

  const removeItem = (productId: string) => {
    setItems((prev) => prev.filter((i) => i.productId !== productId));
  };

  const updateQty = (productId: string, qty: number) => {
    setItems((prev) =>
      prev.map((i) => {
        if (i.productId !== productId) return i;
        const stock = i.stock ?? Infinity;
        const clamped = Math.max(1, Math.min(qty, stock));
        if (qty > stock) {
          toast.error(`Only ${stock} in stock`);
        }
        return { ...i, qty: clamped };
      })
    );
  };

  const clearCart = () => setItems([]);

  const total = items.reduce((sum, i) => sum + i.price * i.qty, 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQty, clearCart, total }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}