"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { CheckCircle } from "lucide-react";

interface OrderData {
  _id: string;
  items: { name: string; price: number; qty: number; image: string }[];
  total: number;
  status: string;
  paymentMethod: string;
  paymentVerified: boolean;
}

function OrderConfirmationContent() {
  const params = useSearchParams();
  const orderId = params.get("id");
  const phone = params.get("phone");

  const [order, setOrder] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orderId || !phone) {
      setLoading(false);
      return;
    }
    fetch(`/api/orders/${orderId}?phone=${encodeURIComponent(phone)}`)
      .then((r) => r.json())
      .then((d) => setOrder(d.order || null))
      .finally(() => setLoading(false));
  }, [orderId, phone]);

  return (
    <div className="container-px mx-auto py-20 max-w-lg">
      <div className="text-center mb-10">
        <CheckCircle className="mx-auto text-forest-600 mb-6" size={56} />
        <h1 className="font-display text-3xl text-forest-800 mb-4">Order Placed!</h1>
        <p className="text-forest-600 mb-2">
          Thank you — your order has been received and is being processed.
        </p>
        {orderId && (
          <p className="text-sm text-forest-400">
            Order reference: <span className="font-mono">{orderId}</span>
          </p>
        )}
      </div>

      {loading && <p className="text-center text-forest-400">Loading order summary...</p>}

      {order && (
        <div className="card p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-medium text-forest-800">Order Summary</h2>
            <span className="text-xs font-medium bg-forest-50 text-forest-700 px-3 py-1 rounded-full">
              {order.status}
            </span>
          </div>

          <div className="space-y-3 mb-4">
            {order.items.map((item, i) => (
              <div key={i} className="flex items-center gap-3 text-sm">
                <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-sand-100 shrink-0">
                  {item.image && <Image src={item.image} alt={item.name} fill className="object-cover" />}
                </div>
                <span className="flex-1 text-forest-700">{item.name} × {item.qty}</span>
                <span className="text-forest-600">Rs. {(item.price * item.qty).toLocaleString()}</span>
              </div>
            ))}
          </div>

          <div className="flex justify-between font-semibold text-forest-800 border-t border-sand-200 pt-4">
            <span>Total</span>
            <span>Rs. {order.total.toLocaleString()}</span>
          </div>

          <p className="text-sm text-forest-500 mt-4">
            Payment: {order.paymentMethod}
            {order.paymentMethod === "Bank Transfer" && (
              <span className={order.paymentVerified ? "text-forest-600" : "text-gold-500"}>
                {" "}— {order.paymentVerified ? "Verified" : "Pending verification"}
              </span>
            )}
          </p>
        </div>
      )}

      <div className="text-center space-y-3">
        <Link href="/shop" className="btn-primary inline-block">
          Continue Shopping
        </Link>
        <p className="text-sm text-forest-400">
          You can check this order&apos;s status anytime on the{" "}
          <Link href="/track-order" className="underline hover:text-forest-600">
            Track Order
          </Link>{" "}
          page.
        </p>
      </div>
    </div>
  );
}

export default function OrderConfirmationPage() {
  return (
    <Suspense fallback={null}>
      <OrderConfirmationContent />
    </Suspense>
  );
}