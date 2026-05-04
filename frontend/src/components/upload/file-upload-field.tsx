"use client";

import { ChangeEvent, useState } from "react";

import { getStoredToken } from "@/lib/auth-token";
import { uploadFile } from "@/lib/upload-api";
import type { UploadType } from "@/types/upload";

export function FileUploadField({
  label,
  uploadType,
  accept,
  onUploaded,
}: Readonly<{
  label: string;
  uploadType: UploadType;
  accept: string;
  onUploaded: (url: string) => void;
}>) {
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  async function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    const token = getStoredToken();
    if (!token) {
      setError("Please sign in before uploading.");
      return;
    }

    setIsUploading(true);
    setMessage(null);
    setError(null);

    try {
      const uploaded = await uploadFile(token, uploadType, file);
      onUploaded(uploaded.url);
      setMessage("Upload completed.");
    } catch {
      setError("Upload failed. Check file type and size.");
    } finally {
      setIsUploading(false);
      event.target.value = "";
    }
  }

  return (
    <div className="space-y-2 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4">
      <label className="block text-sm font-semibold text-slate-700">{label}</label>
      <input type="file" accept={accept} onChange={handleChange} className="text-sm text-slate-600" />
      {isUploading ? <p className="text-sm font-semibold text-blue-600">Uploading...</p> : null}
      {message ? <p className="text-sm font-semibold text-emerald-700">{message}</p> : null}
      {error ? <p className="text-sm font-semibold text-red-700">{error}</p> : null}
    </div>
  );
}
