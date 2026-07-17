"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import toast from "react-hot-toast";
import { ShoppingCart } from "lucide-react";

export interface ProductCardData {
  _id: string;
  name: string;
  slug: string;
  price: number;
  discountPercent: number;
  images: string[];
  category: string;
  isHotDeal?: boolean;
}

export default function ProductCard({ product }: { product: ProductCardData }) {
  const { addItem } = useCart();
  const finalPrice = Math.round(product.price * (1 - product.discountPercent / 100));

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem({
      productId: product._id,
      name: product.name,
      price: finalPrice,
      image: product.images[0] || "",
      qty: 1,
    });
    toast.success(`${product.name} added to cart`);
  };

  return (
    <Link href={`/shop/${product.slug}`} className="card group block overflow-hidden">
      <div className="relative aspect-square bg-sand-100">
        {product.images[0] ? (
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-forest-300">
            No image
          </div>
        )}

        {product.discountPercent > 0 && (
          <span className="absolute top-3 left-3 bg-gold-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
            -{product.discountPercent}%
          </span>
        )}
      </div>

      <div className="p-4">
        <p className="text-xs text-forest-400 uppercase tracking-wide mb-1">{product.category}</p>
        <h3 className="font-medium text-forest-800 mb-2 line-clamp-1">{product.name}</h3>

        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="font-semibold text-forest-800">Rs. {finalPrice.toLocaleString()}</span>
            {product.discountPercent > 0 && (
              <span className="text-xs text-forest-300 line-through">
                Rs. {product.price.toLocaleString()}
              </span>
            )}
          </div>

          <button
            onClick={handleAdd}
            className="p-2 rounded-full bg-forest-800 text-white hover:bg-forest-700 transition-colors"
            aria-label="Add to cart"
          >
            <ShoppingCart size={16} />
          </button>
        </div>
      </div>
    </Link>
  );
}
