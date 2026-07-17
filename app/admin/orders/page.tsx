"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";

interface Order {
  _id: string;
  customerName: string;
  phone: string;
  city: string;
  paymentMethod: string;
  total: number;
  status: string;
  createdAt: string;
}

const STATUSES = ["Pending", "Confirmed", "Shipped", "Delivered", "Cancelled"];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

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
                <th className="p-4">Payment</th>
                <th className="p-4">Total</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o._id} className="border-t border-sand-100">
                  <td className="p-4 font-medium text-forest-800">{o.customerName}</td>
                  <td className="p-4">{o.phone}</td>
                  <td className="p-4">{o.city}</td>
                  <td className="p-4">{o.paymentMethod}</td>
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
                </tr>
              ))}
            </tbody>
          </table>
          {orders.length === 0 && (
            <p className="text-center text-forest-400 py-10">No orders yet.</p>
          )}
        </div>
      )}
    </div>
  );
}
