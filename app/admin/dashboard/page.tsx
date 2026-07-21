import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";
import Order from "@/models/Order";
import ServiceRequest from "@/models/ServiceRequest";
import Link from "next/link";

export const dynamic = "force-dynamic";

async function getStats() {
  await connectDB();
  const [productCount, orderCount, pendingOrders, serviceCount] = await Promise.all([
    Product.countDocuments(),
    Order.countDocuments(),
    Order.countDocuments({ status: "Pending" }),
    ServiceRequest.countDocuments(),
  ]);
  return { productCount, orderCount, pendingOrders, serviceCount };
}

export default async function AdminDashboardPage() {
  const stats = await getStats();

  const cards = [
    { label: "Total Products", value: stats.productCount, href: "/admin/products" },
    { label: "Total Orders", value: stats.orderCount, href: "/admin/orders" },
    { label: "Pending Orders", value: stats.pendingOrders, href: "/admin/orders" },
    { label: "Service Requests", value: stats.serviceCount, href: "/admin/services" },
  ];

  return (
    <div>
      <h1 className="font-display text-2xl text-forest-800 mb-8">Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((c) => (
          <Link key={c.label} href={c.href} className="card p-6 hover:shadow-lg">
            <p className="text-sm text-forest-500 mb-2">{c.label}</p>
            <p className="text-3xl font-semibold text-forest-800">{c.value}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}