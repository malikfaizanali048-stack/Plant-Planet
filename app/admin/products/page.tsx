"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import ProductForm, { ProductFormValues } from "@/components/admin/ProductForm";
import { Pencil, Trash2, Plus } from "lucide-react";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<ProductFormValues[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<ProductFormValues | null | undefined>(undefined);

  const fetchProducts = async () => {
    setLoading(true);
    const res = await fetch("/api/products");
    const data = await res.json();
    setProducts(data.products || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this product?")) return;
    const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
    if (res.ok) {
      toast.success("Product deleted");
      fetchProducts();
    } else {
      toast.error("Delete failed");
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-2xl text-forest-800">Products</h1>
        {editing === undefined && (
          <button onClick={() => setEditing(null)} className="btn-primary flex items-center gap-2">
            <Plus size={16} /> Add Product
          </button>
        )}
      </div>

      {editing !== undefined && (
        <div className="mb-8">
          <ProductForm
            initial={editing || undefined}
            onSaved={() => {
              setEditing(undefined);
              fetchProducts();
            }}
            onCancel={() => setEditing(undefined)}
          />
        </div>
      )}

      {loading ? (
        <p className="text-forest-400">Loading...</p>
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-sand-100 text-forest-700 text-left">
              <tr>
                <th className="p-4">Name</th>
                <th className="p-4">Category</th>
                <th className="p-4">Price</th>
                <th className="p-4">Discount</th>
                <th className="p-4">Stock</th>
                <th className="p-4">Hot Deal</th>
                <th className="p-4"></th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p._id} className="border-t border-sand-100">
                  <td className="p-4 font-medium text-forest-800">{p.name}</td>
                  <td className="p-4">{p.category}</td>
                  <td className="p-4">Rs. {p.price.toLocaleString()}</td>
                  <td className="p-4">{p.discountPercent}%</td>
                  <td className="p-4">{p.stock}</td>
                  <td className="p-4">{p.isHotDeal ? "Yes" : "No"}</td>
                  <td className="p-4">
                    <div className="flex gap-3">
                      <button onClick={() => setEditing(p)} className="text-forest-500 hover:text-forest-800">
                        <Pencil size={16} />
                      </button>
                      <button onClick={() => handleDelete(p._id!)} className="text-red-400 hover:text-red-600">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {products.length === 0 && (
            <p className="text-center text-forest-400 py-10">No products yet.</p>
          )}
        </div>
      )}
    </div>
  );
}
