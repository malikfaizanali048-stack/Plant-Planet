import Link from "next/link";
import Image from "next/image";
import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";
import { ProductGrid } from "@/components/products/ProductGrid";

async function getFeatured() {
  await connectDB();
  const products = await Product.find().sort({ createdAt: -1 }).limit(8).lean();
  return JSON.parse(JSON.stringify(products));
}

const CATEGORIES = [
  { name: "Indoor Plants", image: "https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=400" },
  { name: "Outdoor Plants", image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400" },
  { name: "Fruit Trees", image: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400" },
  { name: "Herbs & Seeds", image: "https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=400" },
];

export default async function HomePage() {
  const featured = await getFeatured();

  return (
    <>
      {/* Hero */}
      <section className="bg-sand-100">
        <div className="container-px mx-auto py-16 md:py-24 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div>
            <h1 className="font-display text-4xl sm:text-5xl text-forest-800 font-semibold leading-tight mb-6">
              Delivering Plants,<br />Delivering{" "}
              <span className="text-gold-500">Happiness</span>
            </h1>
            <p className="text-forest-600 mb-8 max-w-md">
              Shop your favourite plants in your favourite factor — veggies, seeds, citrus,
              fruit trees, herbs and more, from PlantPlanet by Wah Green Nurseries.
            </p>
            <Link href="/shop" className="btn-primary inline-block">
              Shop Now
            </Link>
          </div>

          <div className="relative aspect-square rounded-2xl overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=800"
              alt="Indoor plant in a white pot"
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="container-px mx-auto py-16">
        <h2 className="font-display text-2xl text-forest-800 mb-8">Shop by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.name}
              href={`/shop?category=${encodeURIComponent(cat.name.split(" ")[0])}`}
              className="group relative aspect-[4/5] rounded-2xl overflow-hidden"
            >
              <Image
                src={cat.image}
                alt={cat.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-forest-900/30 flex items-end p-4">
                <span className="text-white font-medium">{cat.name}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured products */}
      <section className="container-px mx-auto py-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-display text-2xl text-forest-800">Featured Plants</h2>
          <Link href="/shop" className="text-forest-600 hover:text-forest-800 text-sm font-medium">
            View all →
          </Link>
        </div>

        {featured.length > 0 ? (
          <ProductGrid products={featured} />
        ) : (
          <p className="text-forest-400 text-center py-12">
            No products yet — add some from the admin dashboard, or run the seed script.
          </p>
        )}
      </section>

      {/* CTA strip */}
      <section className="bg-forest-800 text-sand-50">
        <div className="container-px mx-auto py-14 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="font-display text-2xl mb-2">Need a garden makeover?</h3>
            <p className="text-sand-200">
              Get a free quote for residential, commercial or indoor landscaping.
            </p>
          </div>
          <Link href="/garden-services" className="btn-secondary !border-sand-50 !text-sand-50 hover:!bg-sand-50 hover:!text-forest-800">
            Explore Garden Services
          </Link>
        </div>
      </section>
    </>
  );
}
