"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Upload, Trash2, Plus, Pencil } from "lucide-react";

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
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [mediaType, setMediaType] = useState<"image" | "video">("image");
  const [mediaUrl, setMediaUrl] = useState("");
  const [urlMode, setUrlMode] = useState(false); // false = direct upload, true = paste URL
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
    setUrlMode(false);
    setFormOpen(false);
    setEditingId(null);
  };

  const startEdit = (item: WorkItem) => {
    setEditingId(item._id);
    setTitle(item.title);
    setDescription(item.description || "");
    setMediaType(item.mediaType);
    setMediaUrl(item.mediaUrl);
    setUrlMode(item.mediaUrl.startsWith("http")); // uploaded files are data: URIs, links start with http
    setFormOpen(true);
  };

  const handleFileUpload = async (file: File) => {
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
      toast.error(mediaType === "video" ? "Title and video are required" : "Title and image are required");
      return;
    }
    setSaving(true);
    try {
      const isEditing = !!editingId;
      const res = await fetch(isEditing ? `/api/work/${editingId}` : "/api/work", {
        method: isEditing ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description, mediaType, mediaUrl }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to save");
      }
      toast.success(isEditing ? "Updated" : "Added to Our Work");
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
      const data = await res.json().catch(() => ({}));
      toast.error(data.error ? `Delete failed: ${data.error}` : `Delete failed (status ${res.status})`);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-2xl text-forest-800">Our Work</h1>
        {!formOpen && (
          <button onClick={() => setFormOpen(true)} className="btn-primary flex items-center gap-2">
            <Plus size={16} /> Add Item
          </button>
        )}
      </div>

      {formOpen && (
        <div className="card p-6 space-y-4 mb-8">
          <h2 className="font-medium text-forest-800">{editingId ? "Edit Item" : "New Item"}</h2>

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
              onClick={() => { setMediaType("image"); setMediaUrl(""); setUrlMode(false); }}
              className={`px-4 py-2 rounded-xl border text-sm ${mediaType === "image" ? "border-forest-800 bg-forest-50" : "border-sand-200"}`}
            >
              Image
            </button>
            <button
              onClick={() => { setMediaType("video"); setMediaUrl(""); setUrlMode(false); }}
              className={`px-4 py-2 rounded-xl border text-sm ${mediaType === "video" ? "border-forest-800 bg-forest-50" : "border-sand-200"}`}
            >
              Video
            </button>
          </div>

          {/* Toggle between direct upload and pasting a URL */}
          <div className="flex gap-2 text-sm">
            <button
              onClick={() => { setUrlMode(false); setMediaUrl(""); }}
              className={`px-3 py-1.5 rounded-full ${!urlMode ? "bg-forest-800 text-white" : "bg-sand-100 text-forest-600"}`}
            >
              Upload File
            </button>
            <button
              onClick={() => { setUrlMode(true); setMediaUrl(""); }}
              className={`px-3 py-1.5 rounded-full ${urlMode ? "bg-forest-800 text-white" : "bg-sand-100 text-forest-600"}`}
            >
              Paste URL Instead
            </button>
          </div>

          {!urlMode ? (
            <div>
              <label className="flex items-center gap-3 border border-dashed border-sand-300 rounded-xl px-4 py-4 cursor-pointer hover:bg-sand-50 w-fit">
                <Upload size={16} className="text-forest-400" />
                <span className="text-sm text-forest-500">
                  {uploading
                    ? "Uploading..."
                    : mediaUrl
                    ? `${mediaType === "video" ? "Video" : "Image"} uploaded — click to replace`
                    : `Upload ${mediaType === "video" ? "video (max 3MB, short clips only)" : "image (max 4MB)"}`}
                </span>
                <input
                  type="file"
                  accept={mediaType === "video" ? "video/*" : "image/*"}
                  className="hidden"
                  onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
                />
              </label>

              {mediaUrl && mediaType === "image" && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={mediaUrl} alt="" className="mt-3 w-32 h-32 object-cover rounded-xl" />
              )}
              {mediaUrl && mediaType === "video" && (
                <video src={mediaUrl} controls className="mt-3 w-48 rounded-xl" />
              )}

              {mediaType === "video" && (
                <p className="text-xs text-forest-400 mt-2">
                  Videos must stay under 3MB — keep clips short and compressed. For longer or
                  higher-quality videos, use &quot;Paste URL Instead&quot; with a real direct file
                  link (not a Google Drive share link — those don&apos;t play directly).
                </p>
              )}
            </div>
          ) : (
            <div>
              <input
                placeholder={mediaType === "video" ? "Direct video URL (e.g. a .mp4 link)" : "Image URL"}
                value={mediaUrl}
                onChange={(e) => setMediaUrl(e.target.value)}
                className="w-full border border-sand-200 rounded-xl px-4 py-3 outline-none"
              />
              {mediaType === "video" && (
                <p className="text-xs text-forest-400 mt-2">
                  Must be a direct file link that plays on its own (right-click → "Copy video
                  address" works on most hosts). Google Drive share links won&apos;t work — Drive
                  serves a viewer page, not the raw file.
                </p>
              )}
            </div>
          )}

          <div className="flex gap-3">
            <button onClick={handleSave} disabled={saving} className="btn-primary">
              {saving ? "Saving..." : editingId ? "Save Changes" : "Add Item"}
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
                <div className="flex gap-2 shrink-0">
                  <button onClick={() => startEdit(item)} className="text-forest-500 hover:text-forest-800">
                    <Pencil size={16} />
                  </button>
                  <button onClick={() => handleDelete(item._id)} className="text-red-400 hover:text-red-600">
                    <Trash2 size={16} />
                  </button>
                </div>
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