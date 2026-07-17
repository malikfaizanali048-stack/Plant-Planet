"use client";

import { useEffect, useState } from "react";

interface ServiceReq {
  _id: string;
  type: string;
  requestKind: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  yearlyPlan: boolean;
  status: string;
  createdAt: string;
}

export default function AdminServicesPage() {
  const [requests, setRequests] = useState<ServiceReq[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/services")
      .then((r) => r.json())
      .then((d) => setRequests(d.requests || []))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h1 className="font-display text-2xl text-forest-800 mb-8">Service Requests</h1>

      {loading ? (
        <p className="text-forest-400">Loading...</p>
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-sand-100 text-forest-700 text-left">
              <tr>
                <th className="p-4">Name</th>
                <th className="p-4">Type</th>
                <th className="p-4">Kind</th>
                <th className="p-4">Phone</th>
                <th className="p-4">Yearly Plan</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((r) => (
                <tr key={r._id} className="border-t border-sand-100">
                  <td className="p-4 font-medium text-forest-800">{r.name}</td>
                  <td className="p-4">{r.type}</td>
                  <td className="p-4">{r.requestKind}</td>
                  <td className="p-4">{r.phone}</td>
                  <td className="p-4">{r.yearlyPlan ? "Yes" : "No"}</td>
                  <td className="p-4">{r.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {requests.length === 0 && (
            <p className="text-center text-forest-400 py-10">No service requests yet.</p>
          )}
        </div>
      )}
    </div>
  );
}
