import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";
import { ProductGrid } from "@/components/products/ProductGrid";

async function getHotDeals() {
  await connectDB();
  const products = await (Product as any).find({ isHotDeal: true }).sort({ createdAt: -1 }).lean();
  return JSON.parse(JSON.stringify(products));
}

export default async function HotDealsPage() {
  const products = await getHotDeals();

  return (
    <div className="container-px mx-auto py-10">
      <div className="bg-forest-800 text-sand-50 rounded-2xl p-8 mb-10 text-center">
        <h1 className="font-display text-3xl mb-2">🔥 Hot Deals</h1>
        <p className="text-sand-200">Limited-time discounts on selected plants — while stocks last.</p>
      </div>

      {products.length > 0 ? (
        <ProductGrid products={products} />
      ) : (
        <p className="text-center text-forest-400 py-16">
          No hot deals right now — check back soon, or add some from the admin dashboard.
        </p>
      )}
    </div>
  );
}