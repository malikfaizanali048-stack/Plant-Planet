"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import SearchFilterBar from "@/components/products/SearchFilterBar";
import { ProductGrid, ProductGridSkeleton } from "@/components/products/ProductGrid";
import { ProductCardData } from "@/components/products/ProductCard";

function ShopContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") || "all";

  const [products, setProducts] = useState<ProductCardData[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState(initialCategory);
  const [maxPrice, setMaxPrice] = useState(0);

  // Keep in sync if the ?category= link changes while already on /shop
  useEffect(() => {
    setCategory(searchParams.get("category") || "all");
  }, [searchParams]);

  useEffect(() => {
    const controller = new AbortController();
    const timeout = setTimeout(async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (search) params.set("search", search);
        if (category !== "all") params.set("category", category);
        if (maxPrice > 0) params.set("maxPrice", String(maxPrice));

        const res = await fetch(`/api/products?${params.toString()}`, { signal: controller.signal });
        const data = await res.json();
        setProducts(data.products || []);
      } catch (err) {
        if ((err as any).name !== "AbortError") console.error(err);
      } finally {
        setLoading(false);
      }
    }, 300); // debounce search

    return () => {
      clearTimeout(timeout);
      controller.abort();
    };
  }, [search, category, maxPrice]);

  return (
    <div className="container-px mx-auto py-10">
      <h1 className="font-display text-3xl text-forest-800 mb-2">Shop Plants</h1>
      <p className="text-forest-500 mb-8">
        Browse indoor plants, outdoor plants, fruit trees, herbs and more.
      </p>

      <SearchFilterBar
        search={search}
        setSearch={setSearch}
        category={category}
        setCategory={setCategory}
        maxPrice={maxPrice}
        setMaxPrice={setMaxPrice}
      />

      {loading ? <ProductGridSkeleton /> : <ProductGrid products={products} />}
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="container-px mx-auto py-10"><ProductGridSkeleton /></div>}>
      <ShopContent />
    </Suspense>
  );
}