"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Eye } from "lucide-react";

interface OrderItem {
  productId: string;
  name: string;
  category: string;
  price: number;
  qty: number;
  image: string;
}

interface Order {
  _id: string;
  items: OrderItem[];
  customerName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  paymentMethod: string;
  transactionRefNo?: string;
  paymentSlip?: string;
  paymentVerified: boolean;
  subtotal: number;
  deliveryCharge: number;
  total: number;
  status: string;
  createdAt: string;
}

const STATUSES = ["Pending", "Confirmed", "Shipped", "Delivered", "Cancelled"];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [slipPreview, setSlipPreview] = useState<string | null>(null);
  const [detailOrder, setDetailOrder] = useState<Order | null>(null);

  const fetchOrders = async () => {
    setLoading(true);
    const res = await fetch("/api/orders");
    const data = await res.json();
    setOrders(data.orders || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (id: string, status: string) => {
    const res = await fetch(`/api/orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (res.ok) {
      toast.success("Order updated");
      fetchOrders();
      setDetailOrder((prev) => (prev ? { ...prev, status } : prev));
    } else {
      toast.error("Update failed");
    }
  };

  const togglePaymentVerified = async (id: string, current: boolean) => {
    const res = await fetch(`/api/orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ paymentVerified: !current }),
    });
    if (res.ok) {
      toast.success(!current ? "Payment marked as verified" : "Verification removed");
      fetchOrders();
      setDetailOrder((prev) => (prev ? { ...prev, paymentVerified: !current } : prev));
    } else {
      toast.error("Update failed");
    }
  };

  return (
    <div>
      <h1 className="font-display text-2xl text-forest-800 mb-8">Orders</h1>

      {loading ? (
        <p className="text-forest-400">Loading...</p>
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-sand-100 text-forest-700 text-left">
              <tr>
                <th className="p-4">Customer</th>
                <th className="p-4">Phone</th>
                <th className="p-4">City</th>
                <th className="p-4">Items</th>
                <th className="p-4">Payment</th>
                <th className="p-4">Total</th>
                <th className="p-4">Status</th>
                <th className="p-4"></th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o._id} className="border-t border-sand-100">
                  <td className="p-4 font-medium text-forest-800">{o.customerName}</td>
                  <td className="p-4">{o.phone}</td>
                  <td className="p-4">{o.city}</td>
                  <td className="p-4">{o.items.reduce((sum, i) => sum + i.qty, 0)} pcs</td>
                  <td className="p-4">
                    {o.paymentMethod}
                    {o.paymentMethod === "Bank Transfer" && (
                      <span className={`ml-2 text-xs ${o.paymentVerified ? "text-forest-600" : "text-gold-500"}`}>
                        {o.paymentVerified ? "✓ Verified" : "Pending"}
                      </span>
                    )}
                  </td>
                  <td className="p-4">Rs. {o.total.toLocaleString()}</td>
                  <td className="p-4">
                    <select
                      value={o.status}
                      onChange={(e) => updateStatus(o._id, e.target.value)}
                      className="border border-sand-200 rounded-lg px-2 py-1 text-sm outline-none"
                    >
                      {STATUSES.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </td>
                  <td className="p-4">
                    <button
                      onClick={() => setDetailOrder(o)}
                      className="flex items-center gap-1 text-forest-600 hover:text-forest-800 text-sm font-medium"
                    >
                      <Eye size={16} /> View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {orders.length === 0 && (
            <p className="text-center text-forest-400 py-10">No orders yet.</p>
          )}
        </div>
      )}

      {/* Full order detail modal */}
      {detailOrder && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setDetailOrder(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-xl text-forest-800">Order Details</h2>
              <span className="text-xs font-mono text-forest-400">{detailOrder._id}</span>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
              <div>
                <p className="text-forest-400 text-xs mb-1">Customer</p>
                <p className="text-forest-800 font-medium">{detailOrder.customerName}</p>
              </div>
              <div>
                <p className="text-forest-400 text-xs mb-1">Phone</p>
                <p className="text-forest-800">{detailOrder.phone}</p>
              </div>
              <div>
                <p className="text-forest-400 text-xs mb-1">Email</p>
                <p className="text-forest-800">{detailOrder.email}</p>
              </div>
              <div>
                <p className="text-forest-400 text-xs mb-1">City</p>
                <p className="text-forest-800">{detailOrder.city}</p>
              </div>
              <div className="col-span-2">
                <p className="text-forest-400 text-xs mb-1">Address</p>
                <p className="text-forest-800">{detailOrder.address}</p>
              </div>
            </div>

            <div className="border-t border-sand-200 pt-4 mb-4">
              <p className="text-forest-700 font-medium mb-3">Items ({detailOrder.items.length})</p>
              <div className="space-y-3">
                {detailOrder.items.map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-sand-100 shrink-0">
                      {item.image && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-forest-800">{item.name}</p>
                      <p className="text-xs text-forest-400">{item.category || "—"}</p>
                    </div>
                    <div className="text-sm text-forest-600 text-right">
                      <p>{item.qty} × Rs. {item.price.toLocaleString()}</p>
                      <p className="font-medium text-forest-800">
                        Rs. {(item.qty * item.price).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-sand-200 pt-4 space-y-1 text-sm mb-6">
              <div className="flex justify-between text-forest-600">
                <span>Subtotal</span>
                <span>Rs. {detailOrder.subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-forest-600">
                <span>Delivery</span>
                <span>{detailOrder.deliveryCharge === 0 ? "Free" : `Rs. ${detailOrder.deliveryCharge}`}</span>
              </div>
              <div className="flex justify-between font-semibold text-forest-800 pt-2">
                <span>Total</span>
                <span>Rs. {detailOrder.total.toLocaleString()}</span>
              </div>
            </div>

            <div className="border-t border-sand-200 pt-4">
              <p className="text-forest-700 font-medium mb-2">Payment</p>
              <p className="text-sm text-forest-600 mb-3">
                {detailOrder.paymentMethod}
                {detailOrder.paymentMethod === "Bank Transfer" && ` — Ref: ${detailOrder.transactionRefNo || "—"}`}
              </p>

              {detailOrder.paymentMethod === "Bank Transfer" && detailOrder.paymentSlip && (
                <div className="flex items-center gap-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={detailOrder.paymentSlip}
                    alt="Payment slip"
                    className="w-20 h-20 object-cover rounded-lg cursor-pointer border border-sand-200"
                    onClick={() => setSlipPreview(detailOrder.paymentSlip!)}
                  />
                  <button
                    onClick={() => togglePaymentVerified(detailOrder._id, detailOrder.paymentVerified)}
                    className={`text-xs px-3 py-1.5 rounded-full font-medium ${
                      detailOrder.paymentVerified
                        ? "bg-forest-100 text-forest-700"
                        : "bg-gold-500/20 text-gold-500"
                    }`}
                  >
                    {detailOrder.paymentVerified ? "✓ Verified" : "Verify Payment"}
                  </button>
                </div>
              )}
            </div>

            <button onClick={() => setDetailOrder(null)} className="btn-secondary w-full mt-6">
              Close
            </button>
          </div>
        </div>
      )}

      {slipPreview && (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-[60] p-6"
          onClick={() => setSlipPreview(null)}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={slipPreview} alt="Payment slip full view" className="max-h-[90vh] max-w-full rounded-xl" />
        </div>
      )}
    </div>
  );
}