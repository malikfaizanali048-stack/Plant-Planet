import type { Metadata } from "next";
import { Inter, Fraunces } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { Toaster } from "react-hot-toast";
import AuthProvider from "@/components/AuthProvider";
import SiteChrome from "@/components/SiteChrome";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const fraunces = Fraunces({ subsets: ["latin"], variable: "--font-fraunces" });

export const metadata: Metadata = {
  title: "PlantPlanet | Wah Green Nurseries — Plants, Landscaping & Garden Services",
  description:
    "Shop indoor & outdoor plants, get garden design consultations, and enjoy fast delivery across Pakistan with PlantPlanet, by Wah Green Nurseries.",
  keywords: ["plants Pakistan", "nursery Lahore", "garden services", "PlantPlanet", "Wah Green Nurseries"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${fraunces.variable} font-sans antialiased`}>
        <AuthProvider>
          <CartProvider>
            <SiteChrome>{children}</SiteChrome>
            <Toaster position="top-right" />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
