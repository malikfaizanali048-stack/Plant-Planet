"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { Upload } from "lucide-react";

interface Props {
  refNo: string;
  setRefNo: (v: string) => void;
  slipUrl: string;
  setSlipUrl: (v: string) => void;
}

// Edit these with your real bank details before launch.
const BANK_DETAILS = {
  bankName: "Askari Bank",
  accountTitle: "MAARIJ  ALI",
  accountNumber: "02130900003384",
  iban: "PK57ASCM0002130900003384",
};

export default function BankTransferForm({ refNo, setRefNo, slipUrl, setSlipUrl }: Props) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState("");

  const handleUpload = async (file: File) => {
    setPreview(URL.createObjectURL(file));
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (data.url) setSlipUrl(data.url);
      else throw new Error(data.error || "Upload failed");
    } catch (err: any) {
      toast.error(err.message || "Could not upload slip");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-sand-50 border border-sand-200 rounded-xl p-4 text-sm text-forest-700">
        <p className="font-medium mb-2">Transfer to:</p>
        <p>Bank: {BANK_DETAILS.bankName}</p>
        <p>Account Title: {BANK_DETAILS.accountTitle}</p>
        <p>Account Number: {BANK_DETAILS.accountNumber}</p>
        <p>IBAN: {BANK_DETAILS.iban}</p>
      </div>

      <input
        placeholder="Transaction Reference Number *"
        value={refNo}
        onChange={(e) => setRefNo(e.target.value)}
        className="w-full border border-sand-200 rounded-xl px-4 py-3 outline-none"
      />

      <div>
        <label className="flex items-center gap-3 border border-dashed border-sand-300 rounded-xl px-4 py-4 cursor-pointer hover:bg-sand-50">
          <Upload size={18} className="text-forest-400" />
          <span className="text-sm text-forest-500">
            {uploading ? "Uploading..." : slipUrl ? "Slip uploaded — click to replace" : "Upload payment slip screenshot *"}
          </span>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0])}
          />
        </label>

        {preview && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={preview} alt="Payment slip preview" className="mt-3 w-40 rounded-xl border border-sand-200" />
        )}
      </div>

      <p className="text-xs text-forest-400">
        Your order will be marked as pending until our team verifies the transfer against your slip and reference number.
      </p>
    </div>
  );
}