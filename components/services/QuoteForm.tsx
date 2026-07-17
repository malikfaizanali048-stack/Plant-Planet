"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { Upload } from "lucide-react";

const SERVICE_TYPES = ["Residential Landscape", "Commercial Landscape", "Indoor Plant-Scaping"] as const;

export default function QuoteForm() {
  const [form, setForm] = useState({
    type: SERVICE_TYPES[0] as (typeof SERVICE_TYPES)[number],
    requestKind: "Quote" as "Quote" | "Consultant Booking",
    name: "",
    email: "",
    phone: "",
    address: "",
    message: "",
    yearlyPlan: false,
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [suggestion, setSuggestion] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);

  const handleImage = (file: File) => {
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setSuggestion("");
  };

  const analyzeImage = () => {
    // Mock "AI design suggestion" — replace with a real vision model call later.
    setAnalyzing(true);
    setTimeout(() => {
      const ideas = [
        "Add a curved stone pathway lined with lavender and boxwood hedges for texture and structure.",
        "Introduce a vertical garden wall on the boundary fence with pothos and ferns for a lush backdrop.",
        "Create a raised bed herb corner near the kitchen entrance for easy access to fresh herbs.",
        "Add potted palms and warm outdoor lighting to create an evening seating nook.",
      ];
      setSuggestion(ideas[Math.floor(Math.random() * ideas.length)]);
      setAnalyzing(false);
    }, 1500);
  };

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.phone || !form.address) {
      toast.error("Please fill in all required fields");
      return;
    }
    setSubmitting(true);
    try {
      let gardenImage = "";
      if (imageFile) {
        const fd = new FormData();
        fd.append("file", imageFile);
        const uploadRes = await fetch("/api/upload", { method: "POST", body: fd });
        const uploadData = await uploadRes.json();
        gardenImage = uploadData.url || "";
      }

      const res = await fetch("/api/services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, gardenImage }),
      });
      if (!res.ok) throw new Error("Failed to submit request");

      toast.success("Request submitted! We'll contact you within 24 hours.");
      setForm({ ...form, name: "", email: "", phone: "", address: "", message: "" });
      setImageFile(null);
      setImagePreview("");
      setSuggestion("");
    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="card p-6 space-y-5">
      <div className="flex gap-3">
        <button
          onClick={() => setForm({ ...form, requestKind: "Quote" })}
          className={`flex-1 py-2.5 rounded-xl border text-sm font-medium ${form.requestKind === "Quote" ? "border-forest-800 bg-forest-50" : "border-sand-200"}`}
        >
          Get a Quote
        </button>
        <button
          onClick={() => setForm({ ...form, requestKind: "Consultant Booking" })}
          className={`flex-1 py-2.5 rounded-xl border text-sm font-medium ${form.requestKind === "Consultant Booking" ? "border-forest-800 bg-forest-50" : "border-sand-200"}`}
        >
          Book a Consultant
        </button>
      </div>

      <select
        value={form.type}
        onChange={(e) => setForm({ ...form, type: e.target.value as any })}
        className="w-full border border-sand-200 rounded-xl px-4 py-3 outline-none"
      >
        {SERVICE_TYPES.map((t) => (
          <option key={t} value={t}>{t}</option>
        ))}
      </select>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <input placeholder="Full Name *" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="border border-sand-200 rounded-xl px-4 py-3 outline-none" />
        <input placeholder="Phone *" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="border border-sand-200 rounded-xl px-4 py-3 outline-none" />
        <input placeholder="Email *" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="border border-sand-200 rounded-xl px-4 py-3 outline-none sm:col-span-2" />
        <input placeholder="Property Address *" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className="border border-sand-200 rounded-xl px-4 py-3 outline-none sm:col-span-2" />
      </div>

      <textarea
        placeholder="Tell us about your space and what you'd like done..."
        value={form.message}
        onChange={(e) => setForm({ ...form, message: e.target.value })}
        rows={3}
        className="w-full border border-sand-200 rounded-xl px-4 py-3 outline-none resize-none"
      />

      <div>
        <label className="block text-sm font-medium text-forest-700 mb-2">
          Upload a photo of your garden (optional) — get a sample design suggestion
        </label>
        <label className="flex items-center gap-3 border border-dashed border-sand-300 rounded-xl px-4 py-4 cursor-pointer hover:bg-sand-50">
          <Upload size={18} className="text-forest-400" />
          <span className="text-sm text-forest-500">
            {imageFile ? imageFile.name : "Click to upload an image"}
          </span>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && handleImage(e.target.files[0])}
          />
        </label>

        {imagePreview && (
          <div className="mt-4 flex flex-col sm:flex-row gap-4 items-start">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={imagePreview} alt="Uploaded garden" className="w-40 h-40 object-cover rounded-xl" />
            <div className="flex-1">
              <button onClick={analyzeImage} disabled={analyzing} className="btn-secondary text-sm">
                {analyzing ? "Analyzing..." : "Get Sample Design Suggestion"}
              </button>
              {suggestion && (
                <p className="mt-3 text-sm text-forest-600 bg-sand-50 border border-sand-200 rounded-xl p-3">
                  💡 {suggestion}
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      <label className="flex items-center gap-2 text-sm text-forest-600">
        <input
          type="checkbox"
          checked={form.yearlyPlan}
          onChange={(e) => setForm({ ...form, yearlyPlan: e.target.checked })}
        />
        I'm interested in a yearly consultancy & maintenance plan
      </label>

      <button onClick={handleSubmit} disabled={submitting} className="btn-primary w-full">
        {submitting ? "Submitting..." : "Submit Request"}
      </button>
    </div>
  );
}
