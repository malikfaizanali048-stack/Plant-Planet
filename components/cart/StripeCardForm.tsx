"use client";

import { useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import toast from "react-hot-toast";

export default function StripeCardForm({
  amount,
  onPaid,
}: {
  amount: number;
  onPaid: (paymentIntentId: string) => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);

  const handlePay = async () => {
    if (!stripe || !elements) return;
    setLoading(true);

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount }),
      });
      const { clientSecret, error } = await res.json();
      if (error) throw new Error(error);

      const cardElement = elements.getElement(CardElement);
      if (!cardElement) throw new Error("Card details not found");

      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: { card: cardElement },
      });

      if (stripeError) throw new Error(stripeError.message);
      if (paymentIntent?.status === "succeeded") {
        onPaid(paymentIntent.id);
      }
    } catch (err: any) {
      toast.error(err.message || "Payment failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="border border-sand-200 rounded-xl p-4 bg-white">
        <CardElement options={{ style: { base: { fontSize: "16px" } } }} />
      </div>
      <button onClick={handlePay} disabled={!stripe || loading} className="btn-primary w-full">
        {loading ? "Processing..." : `Pay Rs. ${amount.toLocaleString()}`}
      </button>
    </div>
  );
}
