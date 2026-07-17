"use client";

import { usePathname } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLogin = pathname === "/admin/login";

  if (isLogin) return <>{children}</>;

  return (
    <div className="flex">
      <AdminSidebar />
      <div className="flex-1 p-8 bg-sand-50 min-h-screen">{children}</div>
    </div>
  );
}
