"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { Upload, X } from "lucide-react";

const CATEGORIES = ["Indoor", "Outdoor", "Fruit Trees", "Herbs & Seeds", "Pots & Accessories"];

export interface ProductFormValues {
  _id?: string;
  name: string;
  description: string;
  price: number;
  discountPercent: number;
  category: string;
  images: string[];
  stock: number;
  isHotDeal: boolean;
}

export default function ProductForm({
  initial,
  onSaved,
  onCancel,
}: {
  initial?: ProductFormValues;
  onSaved: () => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState<ProductFormValues>(
    initial || {
      name: "",
      description: "",
      price: 0,
      discountPercent: 0,
      category: CATEGORIES[0],
      images: [],
      stock: 50,
      isHotDeal: false,
    }
  );
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleUpload = async (file: File) => {
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (data.url) setForm((f) => ({ ...f, images: [...f.images, data.url] }));
    } catch {
      toast.error("Image upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!form.name || !form.description || form.price <= 0) {
      toast.error("Name, description and a valid price are required");
      return;
    }
    setSaving(true);
    try {
      const url = form._id ? `/api/products/${form._id}` : "/api/products";
      const method = form._id ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Save failed");
      toast.success("Product saved");
      onSaved();
    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="card p-6 space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <input
          placeholder="Product name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="border border-sand-200 rounded-xl px-4 py-3 outline-none sm:col-span-2"
        />
        <select
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
          className="border border-sand-200 rounded-xl px-4 py-3 outline-none"
        >
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <input
          type="number"
          placeholder="Stock"
          value={form.stock}
          onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })}
          className="border border-sand-200 rounded-xl px-4 py-3 outline-none"
        />
        <input
          type="number"
          placeholder="Price (Rs.)"
          value={form.price || ""}
          onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
          className="border border-sand-200 rounded-xl px-4 py-3 outline-none"
        />
        <input
          type="number"
          placeholder="Discount %"
          value={form.discountPercent || ""}
          onChange={(e) => setForm({ ...form, discountPercent: Number(e.target.value) })}
          className="border border-sand-200 rounded-xl px-4 py-3 outline-none"
        />
      </div>

      <textarea
        placeholder="Description"
        value={form.description}
        onChange={(e) => setForm({ ...form, description: e.target.value })}
        rows={3}
        className="w-full border border-sand-200 rounded-xl px-4 py-3 outline-none resize-none"
      />

      <label className="flex items-center gap-2 text-sm text-forest-600">
        <input
          type="checkbox"
          checked={form.isHotDeal}
          onChange={(e) => setForm({ ...form, isHotDeal: e.target.checked })}
        />
        Mark as Hot Deal
      </label>

      <div>
        <label className="flex items-center gap-3 border border-dashed border-sand-300 rounded-xl px-4 py-3 cursor-pointer hover:bg-sand-50 w-fit">
          <Upload size={16} className="text-forest-400" />
          <span className="text-sm text-forest-500">{uploading ? "Uploading..." : "Add image"}</span>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0])}
          />
        </label>

        {form.images.length > 0 && (
          <div className="flex gap-3 mt-3 flex-wrap">
            {form.images.map((img, i) => (
              <div key={i} className="relative w-20 h-20">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img} alt="" className="w-20 h-20 object-cover rounded-lg" />
                <button
                  onClick={() => setForm((f) => ({ ...f, images: f.images.filter((_, idx) => idx !== i) }))}
                  className="absolute -top-2 -right-2 bg-white rounded-full shadow p-1"
                >
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex gap-3">
        <button onClick={handleSave} disabled={saving} className="btn-primary">
          {saving ? "Saving..." : "Save Product"}
        </button>
        <button onClick={onCancel} className="btn-secondary">
          Cancel
        </button>
      </div>
    </div>
  );
}
