"use client";

import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { Minus, Plus, Trash2 } from "lucide-react";

export default function CartPage() {
  const { items, removeItem, updateQty, total } = useCart();
  const deliveryCharge = total > 0 && total < 5000 ? 500 : 0;

  if (items.length === 0) {
    return (
      <div className="container-px mx-auto py-24 text-center">
        <h1 className="font-display text-2xl text-forest-800 mb-4">Your cart is empty</h1>
        <Link href="/shop" className="btn-primary inline-block">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="container-px mx-auto py-10 grid grid-cols-1 lg:grid-cols-3 gap-10">
      <div className="lg:col-span-2 space-y-4">
        <h1 className="font-display text-2xl text-forest-800 mb-6">Your Cart</h1>

        {items.map((item) => (
          <div key={item.productId} className="flex items-center gap-4 card p-4">
            <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-sand-100 shrink-0">
              {item.image && <Image src={item.image} alt={item.name} fill className="object-cover" />}
            </div>

            <div className="flex-1">
              <h3 className="font-medium text-forest-800">{item.name}</h3>
              <p className="text-forest-500 text-sm">Rs. {item.price.toLocaleString()}</p>
              {item.qty >= item.stock && (
                <p className="text-xs text-gold-500 mt-1">Max stock reached ({item.stock} available)</p>
              )}
            </div>

            <div className="flex items-center border border-sand-200 rounded-full">
              <button onClick={() => updateQty(item.productId, item.qty - 1)} className="p-2">
                <Minus size={14} />
              </button>
              <span className="w-6 text-center text-sm">{item.qty}</span>
              <button
                onClick={() => updateQty(item.productId, item.qty + 1)}
                disabled={item.qty >= item.stock}
                className="p-2 disabled:opacity-30"
              >
                <Plus size={14} />
              </button>
            </div>

            <button onClick={() => removeItem(item.productId)} className="text-forest-300 hover:text-red-500">
              <Trash2 size={18} />
            </button>
          </div>
        ))}
      </div>

      <div className="card p-6 h-fit">
        <h2 className="font-medium text-forest-800 mb-4">Order Summary</h2>
        <div className="space-y-2 text-sm text-forest-600 mb-4">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>Rs. {total.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span>Delivery</span>
            <span>{deliveryCharge === 0 ? "Free" : `Rs. ${deliveryCharge}`}</span>
          </div>
        </div>
        <div className="flex justify-between font-semibold text-forest-800 border-t border-sand-200 pt-4 mb-6">
          <span>Total</span>
          <span>Rs. {(total + deliveryCharge).toLocaleString()}</span>
        </div>
        <Link href="/checkout" className="btn-primary w-full text-center block">
          Proceed to Checkout
        </Link>
      </div>
    </div>
  );
}