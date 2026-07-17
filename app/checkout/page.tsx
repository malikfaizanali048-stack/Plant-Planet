"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { useCart } from "@/context/CartContext";
import StripeCardForm from "@/components/cart/StripeCardForm";
import toast from "react-hot-toast";

const stripePromise = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
  ? loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
  : null;

export default function CheckoutPage() {
  const { items, total, clearCart } = useCart();
  const router = useRouter();
  const deliveryCharge = total < 5000 ? 500 : 0;
  const grandTotal = total + deliveryCharge;

  const [form, setForm] = useState({
    customerName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
  });
  const [paymentMethod, setPaymentMethod] = useState<"COD" | "Card">("COD");
  const [submitting, setSubmitting] = useState(false);

  const formValid = Object.values(form).every((v) => v.trim().length > 0);

  const placeOrder = async (stripePaymentIntentId?: string) => {
    setSubmitting(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items,
          ...form,
          paymentMethod,
          stripePaymentIntentId,
        }),
      });
      if (!res.ok) throw new Error("Failed to place order");
      const { order } = await res.json();
      clearCart();
      router.push(`/order-confirmation?id=${order._id}`);
    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="container-px mx-auto py-24 text-center text-forest-500">
        Your cart is empty.
      </div>
    );
  }

  return (
    <div className="container-px mx-auto py-10 grid grid-cols-1 lg:grid-cols-3 gap-10">
      <div className="lg:col-span-2 space-y-6">
        <h1 className="font-display text-2xl text-forest-800">Checkout</h1>

        <div className="card p-6 space-y-4">
          <h2 className="font-medium text-forest-800">Delivery Details</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              placeholder="Full Name"
              value={form.customerName}
              onChange={(e) => setForm({ ...form, customerName: e.target.value })}
              className="border border-sand-200 rounded-xl px-4 py-3 outline-none"
            />
            <input
              placeholder="Phone"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="border border-sand-200 rounded-xl px-4 py-3 outline-none"
            />
            <input
              placeholder="Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="border border-sand-200 rounded-xl px-4 py-3 outline-none sm:col-span-2"
            />
            <input
              placeholder="City"
              value={form.city}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
              className="border border-sand-200 rounded-xl px-4 py-3 outline-none"
            />
            <input
              placeholder="Full Address"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              className="border border-sand-200 rounded-xl px-4 py-3 outline-none"
            />
          </div>
        </div>

        <div className="card p-6 space-y-4">
          <h2 className="font-medium text-forest-800">Payment Method</h2>
          <div className="flex gap-4">
            <button
              onClick={() => setPaymentMethod("COD")}
              className={`px-5 py-3 rounded-xl border ${paymentMethod === "COD" ? "border-forest-800 bg-forest-50" : "border-sand-200"}`}
            >
              Cash on Delivery
            </button>
            <button
              onClick={() => setPaymentMethod("Card")}
              className={`px-5 py-3 rounded-xl border ${paymentMethod === "Card" ? "border-forest-800 bg-forest-50" : "border-sand-200"}`}
            >
              Pay by Card
            </button>
          </div>

          {paymentMethod === "Card" && stripePromise && formValid && (
            <div className="pt-2">
              <Elements stripe={stripePromise}>
                <StripeCardForm amount={grandTotal} onPaid={(id) => placeOrder(id)} />
              </Elements>
            </div>
          )}
          {paymentMethod === "Card" && !stripePromise && (
            <p className="text-sm text-red-500">
              Card payments aren&apos;t configured yet — add your Stripe keys to .env.local, or choose
              Cash on Delivery.
            </p>
          )}
        </div>
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
          <span>Rs. {grandTotal.toLocaleString()}</span>
        </div>

        {paymentMethod === "COD" && (
          <button
            onClick={() => placeOrder()}
            disabled={!formValid || submitting}
            className="btn-primary w-full disabled:opacity-50"
          >
            {submitting ? "Placing order..." : "Place Order (COD)"}
          </button>
        )}
      </div>
    </div>
  );
}
