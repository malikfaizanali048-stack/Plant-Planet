import ProductCard, { ProductCardData } from "./ProductCard";

export function ProductGrid({ products }: { products: ProductCardData[] }) {
  if (products.length === 0) {
    return (
      <div className="text-center py-16 text-forest-400">
        No plants found. Try a different search or filter.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
      {products.map((p) => (
        <ProductCard key={p._id} product={p} />
      ))}
    </div>
  );
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className="aspect-square bg-sand-200 rounded-2xl mb-3" />
          <div className="h-3 bg-sand-200 rounded w-1/2 mb-2" />
          <div className="h-4 bg-sand-200 rounded w-3/4" />
        </div>
      ))}
    </div>
  );
}
