import Link from "next/link";
import { Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-forest-900 text-sand-100 mt-20">
      <div className="container-px mx-auto py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        <div>
          <h3 className="font-display text-xl text-white mb-3">PlantPlanet</h3>
          <p className="text-sm text-sand-300 leading-relaxed">
            By Wah Green Nurseries — bringing greenery, quality plants, and expert
            garden care to homes and businesses across Pakistan.
          </p>
        </div>

        <div>
          <h4 className="font-semibold text-white mb-3">Quick Links</h4>
          <ul className="space-y-2 text-sm text-sand-300">
            <li><Link href="/shop" className="hover:text-white">Shop</Link></li>
            <li><Link href="/hot-deals" className="hover:text-white">Hot Deals</Link></li>
            <li><Link href="/garden-services" className="hover:text-white">Garden Services</Link></li>
            <li><Link href="/our-work" className="hover:text-white">Our Work</Link></li>
            <li><Link href="/about" className="hover:text-white">About Us</Link></li>
            <li><Link href="/track-order" className="hover:text-white">Track Order</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-white mb-3">Categories</h4>
          <ul className="space-y-2 text-sm text-sand-300">
            <li><Link href="/shop?category=Indoor" className="hover:text-white">Indoor Plants</Link></li>
            <li><Link href="/shop?category=Outdoor" className="hover:text-white">Outdoor Plants</Link></li>
            <li><Link href="/shop?category=Fruit%20Trees" className="hover:text-white">Fruit Trees</Link></li>
            <li><Link href="/shop?category=Herbs%20%26%20Seeds" className="hover:text-white">Herbs & Seeds</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-white mb-3">Contact</h4>
          <ul className="space-y-3 text-sm text-sand-300">
            <li className="flex items-start gap-2">
              <MapPin size={16} className="mt-0.5 shrink-0" />
              Opposite to Kohistan Enclave, left side of Chezious Restaurant, Wah Green Nurseries,Wah Cantt.
            </li>
            <li className="flex items-center gap-2">
              <Mail size={16} className="shrink-0" />
              plantplanet29@gmail.com
            </li>
            <li className="flex items-center gap-2">
              <Phone size={16} className="shrink-0" />
              +92 3255271675
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-forest-800 py-4 text-center text-xs text-sand-400">
        © {new Date().getFullYear()} PlantPlanet · Wah Green Nurseries. All rights reserved.
      </div>
    </footer>
  );
}