"use client";

import { Search } from "lucide-react";

const CATEGORIES = ["all", "Indoor", "Outdoor", "Fruit Trees", "Herbs & Seeds", "Pots & Accessories"];

interface Props {
  search: string;
  setSearch: (v: string) => void;
  category: string;
  setCategory: (v: string) => void;
  maxPrice: number;
  setMaxPrice: (v: number) => void;
}

export default function SearchFilterBar({
  search,
  setSearch,
  category,
  setCategory,
  maxPrice,
  setMaxPrice,
}: Props) {
  return (
    <div className="flex flex-col md:flex-row gap-4 md:items-center justify-between mb-8">
      <div className="flex items-center bg-white rounded-full px-4 py-2.5 border border-sand-200 md:w-80">
        <Search size={18} className="text-forest-400 mr-2 shrink-0" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search plants..."
          className="bg-transparent outline-none text-sm w-full"
        />
      </div>

      <div className="flex flex-wrap gap-3 items-center">
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="bg-white border border-sand-200 rounded-full px-4 py-2.5 text-sm outline-none"
        >
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c === "all" ? "All Categories" : c}
            </option>
          ))}
        </select>

        <div className="flex items-center gap-2 text-sm text-forest-600">
          <span>Up to Rs.</span>
          <input
            type="number"
            value={maxPrice || ""}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
            placeholder="10000"
            className="bg-white border border-sand-200 rounded-full px-3 py-2.5 w-28 outline-none"
          />
        </div>
      </div>
    </div>
  );
}
