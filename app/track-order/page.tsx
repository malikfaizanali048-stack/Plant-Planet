"use client";

import { useState } from "react";
import Image from "next/image";
import toast from "react-hot-toast";
import { Search, Trash2 } from "lucide-react";

interface OrderData {
  _id: string;
  phone: string;
  items: { name: string; price: number; qty: number; image: string }[];
  total: number;
  status: string;
  paymentMethod: string;
  paymentVerified: boolean;
  createdAt: string;
}

const STATUS_STEPS = ["Pending", "Confirmed", "Shipped", "Delivered"];
const CANCELLABLE_STATUSES = ["Pending", "Confirmed"];

function OrderCard({ order, onDeleted }: { order: OrderData; onDeleted: (id: string) => void }) {
  const [deleting, setDeleting] = useState(false);
  const currentStep = STATUS_STEPS.indexOf(order.status);
  const canCancel = CANCELLABLE_STATUSES.includes(order.status);

  const handleDelete = async () => {
    if (!confirm("Cancel and delete this order? This can't be undone.")) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/orders/${order._id}?phone=${encodeURIComponent(order.phone)}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not delete order");
      toast.success("Order deleted");
      onDeleted(order._id);
    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-6">
        <p className="text-xs text-forest-400 font-mono">{order._id}</p>
        <p className="text-xs text-forest-400">
          {new Date(order.createdAt).toLocaleDateString()}
        </p>
      </div>

      {order.status !== "Cancelled" ? (
        <div className="flex justify-between mb-8">
          {STATUS_STEPS.map((step, i) => (
            <div key={step} className="flex-1 text-center relative">
              <div
                className={`w-8 h-8 rounded-full mx-auto flex items-center justify-center text-xs font-semibold ${
                  i <= currentStep ? "bg-forest-800 text-white" : "bg-sand-200 text-forest-400"
                }`}
              >
                {i + 1}
              </div>
              <p className={`text-xs mt-2 ${i <= currentStep ? "text-forest-800 font-medium" : "text-forest-400"}`}>
                {step}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-red-500 font-medium mb-8">This order was cancelled.</p>
      )}

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

      <div className="flex justify-between font-semibold text-forest-800 border-t border-sand-200 pt-4 mb-4">
        <span>Total</span>
        <span>Rs. {order.total.toLocaleString()}</span>
      </div>

      <p className="text-sm text-forest-500 mb-4">
        Payment: {order.paymentMethod}
        {order.paymentMethod === "Bank Transfer" && (
          <span className={order.paymentVerified ? "text-forest-600" : "text-gold-500"}>
            {" "}— {order.paymentVerified ? "Verified" : "Pending verification"}
          </span>
        )}
      </p>

      {canCancel ? (
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="flex items-center gap-2 text-sm text-red-500 hover:text-red-600 font-medium"
        >
          <Trash2 size={14} /> {deleting ? "Cancelling..." : "Cancel & Delete Order"}
        </button>
      ) : (
        <p className="text-xs text-forest-400">
          This order can no longer be cancelled online — contact us if you need help.
        </p>
      )}
    </div>
  );
}

export default function TrackOrderPage() {
  const [orderId, setOrderId] = useState("");
  const [phone, setPhone] = useState("");
  const [orders, setOrders] = useState<OrderData[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async () => {
    const id = orderId.trim();
    const ph = phone.trim();

    if (!id && !ph) {
      toast.error("Enter your Order ID or phone number");
      return;
    }

    setLoading(true);
    setSearched(true);
    try {
      const params = new URLSearchParams();
      if (id) params.set("id", id);
      if (ph) params.set("phone", ph);

      const res = await fetch(`/api/orders/lookup?${params.toString()}`);
      const data = await res.json();

      if (!res.ok) {
        setOrders(null);
        toast.error(data.error || "Something went wrong");
        return;
      }

      setOrders(data.orders || []);
      if (!data.orders || data.orders.length === 0) {
        toast.error("No matching order found");
      }
    } catch {
      setOrders(null);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleted = (id: string) => {
    setOrders((prev) => (prev ? prev.filter((o) => o._id !== id) : prev));
  };

  return (
    <div className="container-px mx-auto py-16 max-w-2xl">
      <h1 className="font-display text-3xl text-forest-800 mb-2 text-center">Track Your Order</h1>
      <p className="text-forest-500 text-center mb-10">
        Enter your Order ID <span className="font-medium">or</span> the phone number used at
        checkout — you only need one.
      </p>

      <div className="card p-6 flex flex-col sm:flex-row gap-3 mb-10">
        <input
          placeholder="Order ID (optional)"
          value={orderId}
          onChange={(e) => setOrderId(e.target.value)}
          className="flex-1 border border-sand-200 rounded-xl px-4 py-3 outline-none font-mono text-sm"
        />
        <input
          placeholder="Phone Number (optional)"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="flex-1 border border-sand-200 rounded-xl px-4 py-3 outline-none"
        />
        <button onClick={handleSearch} disabled={loading} className="btn-primary flex items-center justify-center gap-2 shrink-0">
          <Search size={16} /> {loading ? "Searching..." : "Track"}
        </button>
      </div>

      <div className="space-y-6">
        {orders?.map((order) => (
          <OrderCard key={order._id} order={order} onDeleted={handleDeleted} />
        ))}
      </div>

      {searched && !loading && orders?.length === 0 && (
        <p className="text-center text-forest-400">No order found. Double-check your Order ID or phone number.</p>
      )}
    </div>
  );
}