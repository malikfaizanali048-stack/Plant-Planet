"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { LayoutDashboard, Package, ShoppingBag, ClipboardList, Images, LogOut } from "lucide-react";

const LINKS = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/orders", label: "Orders", icon: ShoppingBag },
  { href: "/admin/services", label: "Service Requests", icon: ClipboardList },
  { href: "/admin/work", label: "Our Work", icon: Images },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-56 shrink-0 bg-forest-900 text-sand-100 min-h-screen p-6 flex flex-col">
      <div className="font-display text-xl text-white mb-10">PlantPlanet Admin</div>
      <nav className="flex-1 space-y-1">
        {LINKS.map((link) => {
          const active = pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm ${
                active ? "bg-forest-700 text-white" : "text-sand-300 hover:bg-forest-800"
              }`}
            >
              <link.icon size={16} />
              {link.label}
            </Link>
          );
        })}
      </nav>
      <button
        onClick={() => signOut({ callbackUrl: "/admin/login" })}
        className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-sand-300 hover:bg-forest-800"
      >
        <LogOut size={16} /> Sign Out
      </button>
    </aside>
  );
}