"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import BankTransferForm from "@/components/cart/BankTransfer";
import toast from "react-hot-toast";

export default function CheckoutPage() {
  const { items, total, clearCart } = useCart();
  const router = useRouter();
  const deliveryCharge = total > 0 && total < 5000 ? 500 : 0;
  const grandTotal = total + deliveryCharge;

  const [form, setForm] = useState({
    customerName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
  });
  const [paymentMethod, setPaymentMethod] = useState<"COD" | "Bank Transfer">("COD");
  const [refNo, setRefNo] = useState("");
  const [slipUrl, setSlipUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const formValid = Object.values(form).every((v) => v.trim().length > 0);
  const bankDetailsValid = paymentMethod === "COD" || (refNo.trim().length > 0 && slipUrl.length > 0);

  const placeOrder = async () => {
    setSubmitting(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items,
          ...form,
          paymentMethod,
          transactionRefNo: paymentMethod === "Bank Transfer" ? refNo : undefined,
          paymentSlip: paymentMethod === "Bank Transfer" ? slipUrl : undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to place order");
      const { order } = data;
      clearCart();
      router.push(`/order-confirmation?id=${order._id}&phone=${encodeURIComponent(form.phone)}`);
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
              onClick={() => setPaymentMethod("Bank Transfer")}
              className={`px-5 py-3 rounded-xl border ${paymentMethod === "Bank Transfer" ? "border-forest-800 bg-forest-50" : "border-sand-200"}`}
            >
              Bank Transfer
            </button>
          </div>

          {paymentMethod === "Bank Transfer" && (
            <BankTransferForm refNo={refNo} setRefNo={setRefNo} slipUrl={slipUrl} setSlipUrl={setSlipUrl} />
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

        <button
          onClick={placeOrder}
          disabled={!formValid || !bankDetailsValid || submitting}
          className="btn-primary w-full disabled:opacity-50"
        >
          {submitting ? "Placing order..." : `Place Order (${paymentMethod})`}
        </button>
      </div>
    </div>
  );
}