"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle } from "lucide-react";
import { Suspense } from "react";

function OrderConfirmationContent() {
  const params = useSearchParams();
  const orderId = params.get("id");

  return (
    <div className="container-px mx-auto py-24 text-center max-w-lg">
      <CheckCircle className="mx-auto text-forest-600 mb-6" size={56} />
      <h1 className="font-display text-3xl text-forest-800 mb-4">Order Placed!</h1>
      <p className="text-forest-600 mb-2">
        Thank you — your order has been received and is being processed.
      </p>
      {orderId && (
        <p className="text-sm text-forest-400 mb-8">
          Order reference: <span className="font-mono">{orderId}</span>
        </p>
      )}
      <Link href="/shop" className="btn-primary inline-block">
        Continue Shopping
      </Link>
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
