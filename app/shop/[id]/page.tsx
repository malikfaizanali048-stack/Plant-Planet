import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";
import { notFound } from "next/navigation";
import Image from "next/image";
import AddToCartButton from "@/components/products/AddToCartButton";

async function getProduct(slug: string) {
  await connectDB();
  const product = await Product.findOne({ slug }).lean();
  return product ? JSON.parse(JSON.stringify(product)) : null;
}

export default async function ProductDetailPage({ params }: { params: { id: string } }) {
  const product = await getProduct(params.id);
  if (!product) notFound();

  const finalPrice = Math.round(product.price * (1 - product.discountPercent / 100));

  return (
    <div className="container-px mx-auto py-10 grid grid-cols-1 md:grid-cols-2 gap-10">
      <div className="relative aspect-square bg-sand-100 rounded-2xl overflow-hidden">
        {product.images[0] ? (
          <Image src={product.images[0]} alt={product.name} fill className="object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-forest-300">
            No image
          </div>
        )}
      </div>

      <div>
        <p className="text-xs uppercase tracking-wide text-forest-400 mb-2">{product.category}</p>
        <h1 className="font-display text-3xl text-forest-800 mb-4">{product.name}</h1>

        <div className="flex items-baseline gap-3 mb-6">
          <span className="text-2xl font-semibold text-forest-800">
            Rs. {finalPrice.toLocaleString()}
          </span>
          {product.discountPercent > 0 && (
            <>
              <span className="text-forest-300 line-through">Rs. {product.price.toLocaleString()}</span>
              <span className="bg-gold-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
                -{product.discountPercent}%
              </span>
            </>
          )}
        </div>

        <p className="text-forest-600 leading-relaxed mb-8">{product.description}</p>

        <AddToCartButton
          productId={product._id}
          name={product.name}
          price={finalPrice}
          image={product.images[0] || ""}
        />

        <p className="text-sm text-forest-400 mt-4">
          {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"} · Free delivery on
          orders above Rs. 5000
        </p>
      </div>
    </div>
  );
}
