"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Upload, Trash2, Plus } from "lucide-react";

interface WorkItem {
  _id: string;
  title: string;
  description?: string;
  mediaType: "image" | "video";
  mediaUrl: string;
  createdAt: string;
}

export default function AdminWorkPage() {
  const [items, setItems] = useState<WorkItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [mediaType, setMediaType] = useState<"image" | "video">("image");
  const [mediaUrl, setMediaUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  const fetchItems = async () => {
    setLoading(true);
    const res = await fetch("/api/work");
    const data = await res.json();
    setItems(data.items || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setMediaType("image");
    setMediaUrl("");
    setAdding(false);
  };

  const handleImageUpload = async (file: File) => {
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (data.url) setMediaUrl(data.url);
      else throw new Error(data.error || "Upload failed");
    } catch (err: any) {
      toast.error(err.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!title.trim() || !mediaUrl.trim()) {
      toast.error(mediaType === "video" ? "Title and video URL are required" : "Title and image are required");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/work", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description, mediaType, mediaUrl }),
      });
      if (!res.ok) throw new Error("Failed to save");
      toast.success("Added to Our Work");
      resetForm();
      fetchItems();
    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this item?")) return;
    const res = await fetch(`/api/work/${id}`, { method: "DELETE" });
    if (res.ok) {
      toast.success("Deleted");
      fetchItems();
    } else {
      toast.error("Delete failed");
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-2xl text-forest-800">Our Work</h1>
        {!adding && (
          <button onClick={() => setAdding(true)} className="btn-primary flex items-center gap-2">
            <Plus size={16} /> Add Item
          </button>
        )}
      </div>

      {adding && (
        <div className="card p-6 space-y-4 mb-8">
          <input
            placeholder="Title (e.g. 'Residential Garden Makeover — DHA Lahore')"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border border-sand-200 rounded-xl px-4 py-3 outline-none"
          />
          <textarea
            placeholder="Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            className="w-full border border-sand-200 rounded-xl px-4 py-3 outline-none resize-none"
          />

          <div className="flex gap-3">
            <button
              onClick={() => { setMediaType("image"); setMediaUrl(""); }}
              className={`px-4 py-2 rounded-xl border text-sm ${mediaType === "image" ? "border-forest-800 bg-forest-50" : "border-sand-200"}`}
            >
              Image
            </button>
            <button
              onClick={() => { setMediaType("video"); setMediaUrl(""); }}
              className={`px-4 py-2 rounded-xl border text-sm ${mediaType === "video" ? "border-forest-800 bg-forest-50" : "border-sand-200"}`}
            >
              Video
            </button>
          </div>

          {mediaType === "image" ? (
            <div>
              <label className="flex items-center gap-3 border border-dashed border-sand-300 rounded-xl px-4 py-4 cursor-pointer hover:bg-sand-50 w-fit">
                <Upload size={16} className="text-forest-400" />
                <span className="text-sm text-forest-500">
                  {uploading ? "Uploading..." : mediaUrl ? "Image uploaded — click to replace" : "Upload image"}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0])}
                />
              </label>
              {mediaUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={mediaUrl} alt="" className="mt-3 w-32 h-32 object-cover rounded-xl" />
              )}
            </div>
          ) : (
            <div>
              <input
                placeholder="Video URL (e.g. a direct .mp4 link)"
                value={mediaUrl}
                onChange={(e) => setMediaUrl(e.target.value)}
                className="w-full border border-sand-200 rounded-xl px-4 py-3 outline-none"
              />
              <p className="text-xs text-forest-400 mt-2">
                Paste a direct video link. Large video files should be hosted elsewhere (e.g.
                YouTube unlisted + direct file, or a cloud storage link) rather than uploaded
                here — this form doesn&apos;t support uploading video files directly.
              </p>
            </div>
          )}

          <div className="flex gap-3">
            <button onClick={handleSave} disabled={saving} className="btn-primary">
              {saving ? "Saving..." : "Save"}
            </button>
            <button onClick={resetForm} className="btn-secondary">
              Cancel
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <p className="text-forest-400">Loading...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <div key={item._id} className="card overflow-hidden">
              <div className="relative aspect-video bg-sand-100">
                {item.mediaType === "video" ? (
                  <video src={item.mediaUrl} controls className="w-full h-full object-cover" preload="metadata" />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={item.mediaUrl} alt={item.title} className="w-full h-full object-cover" />
                )}
              </div>
              <div className="p-4 flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-medium text-forest-800 text-sm">{item.title}</h3>
                  <span className="text-xs text-forest-400 capitalize">{item.mediaType}</span>
                </div>
                <button onClick={() => handleDelete(item._id)} className="text-red-400 hover:text-red-600 shrink-0">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
          {items.length === 0 && (
            <p className="text-center text-forest-400 py-10 col-span-full">No items yet.</p>
          )}
        </div>
      )}
    </div>
  );
}