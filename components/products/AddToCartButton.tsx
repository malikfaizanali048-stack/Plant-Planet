"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";
import toast from "react-hot-toast";
import { Minus, Plus } from "lucide-react";

export default function AddToCartButton({
  productId,
  name,
  price,
  image,
  stock,
  category,
}: {
  productId: string;
  name: string;
  price: number;
  image: string;
  stock: number;
  category: string;
}) {
  const { items, addItem } = useCart();
  const alreadyInCart = items.find((i) => i.productId === productId)?.qty || 0;
  const remaining = Math.max(0, stock - alreadyInCart);

  const [qty, setQty] = useState(1);

  const clampedQty = Math.min(qty, Math.max(remaining, 1));

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center border border-sand-200 rounded-full">
        <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="p-3">
          <Minus size={14} />
        </button>
        <span className="w-8 text-center">{clampedQty}</span>
        <button
          onClick={() =>
            setQty((q) => {
              if (q + 1 > remaining) {
                toast.error(`Only ${remaining} more available (you already have ${alreadyInCart} in cart)`);
                return q;
              }
              return q + 1;
            })
          }
          className="p-3"
        >
          <Plus size={14} />
        </button>
      </div>

      <button
        onClick={() => {
          if (remaining <= 0) {
            toast.error("Out of stock");
            return;
          }
          addItem({ productId, name, price, image, qty: clampedQty, stock, category });
          toast.success(`${name} added to cart`);
          setQty(1);
        }}
        disabled={remaining <= 0}
        className="btn-primary disabled:opacity-50"
      >
        {remaining <= 0 ? "Out of Stock" : "Add to Cart"}
      </button>
    </div>
  );
}