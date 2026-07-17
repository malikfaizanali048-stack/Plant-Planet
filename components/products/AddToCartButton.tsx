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
}: {
  productId: string;
  name: string;
  price: number;
  image: string;
}) {
  const [qty, setQty] = useState(1);
  const { addItem } = useCart();

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center border border-sand-200 rounded-full">
        <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="p-3">
          <Minus size={14} />
        </button>
        <span className="w-8 text-center">{qty}</span>
        <button onClick={() => setQty((q) => q + 1)} className="p-3">
          <Plus size={14} />
        </button>
      </div>

      <button
        onClick={() => {
          addItem({ productId, name, price, image, qty });
          toast.success(`${name} added to cart`);
        }}
        className="btn-primary"
      >
        Add to Cart
      </button>
    </div>
  );
}
