"use client";

import Link from "next/link";
import { Search, ShoppingCart, User } from "lucide-react";
import { useCart } from "@/context/CartContext";

export default function Header() {
  const { items } = useCart();
  const itemCount = items.reduce((sum, i) => sum + i.qty, 0);

  return (
    <header className="sticky top-0 z-40 bg-sand-50/95 backdrop-blur border-b border-sand-200">
      <div className="container-px mx-auto flex items-center justify-between h-16 gap-4">
        <Link href="/" className="flex flex-col leading-none shrink-0">
          <span className="font-display text-2xl text-forest-800 font-semibold">
            PlantPlanet
          </span>
          <span className="text-[10px] tracking-wide text-forest-500 uppercase">
            Wah Green Nurseries
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-forest-800">
          <Link href="/shop" className="hover:text-forest-500">Shop</Link>
          <Link href="/hot-deals" className="hover:text-forest-500">Hot Deals</Link>
          <Link href="/garden-services" className="hover:text-forest-500">Garden Services</Link>
          <Link href="/about" className="hover:text-forest-500">About Us</Link>
        </nav>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center bg-white rounded-full px-3 py-1.5 border border-sand-200 w-56">
            <Search size={16} className="text-forest-400 mr-2" />
            <input
              type="text"
              placeholder="Search plants..."
              className="bg-transparent outline-none text-sm w-full placeholder:text-forest-300"
            />
          </div>

          <Link href="/cart" className="relative">
            <ShoppingCart size={22} className="text-forest-800" />
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-gold-500 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </Link>

          <Link href="/admin/login">
            <User size={22} className="text-forest-800" />
          </Link>
        </div>
      </div>
    </header>
  );
}
