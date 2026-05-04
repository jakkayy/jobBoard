"use client";

import { FormEvent, useEffect, useState } from "react";

import { getStoredToken } from "@/lib/auth-token";
import { createEmployerProfile, getEmployerProfile, updateEmployerProfile } from "@/lib/employer-api";
import { FileUploadField } from "@/components/upload/file-upload-field";

export function EmployerProfileForm() {
  const [companyName, setCompanyName] = useState("");
  const [companyWebsite, setCompanyWebsite] = useState("");
  const [companyDescription, setCompanyDescription] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [profileExists, setProfileExists] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = getStoredToken();
    if (!token) return;

    getEmployerProfile(token)
      .then((profile) => {
        setProfileExists(true);
        setCompanyName(profile.company_name);
        setCompanyWebsite(profile.company_website ?? "");
        setCompanyDescription(profile.company_description ?? "");
        setLogoUrl(profile.logo_url ?? "");
      })
      .catch(() => setProfileExists(false));
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);
    setError(null);

    const token = getStoredToken();
    if (!token) {
      setError("Please sign in first.");
      return;
    }

    if (!companyName) {
      setError("Company name is required.");
      return;
    }

    const payload = {
      company_name: companyName,
      company_website: companyWebsite || undefined,
      company_description: companyDescription || undefined,
      logo_url: logoUrl || undefined,
    };

    try {
      if (profileExists) await updateEmployerProfile(token, payload);
      else {
        await createEmployerProfile(token, payload);
        setProfileExists(true);
      }
      setMessage("Company profile saved.");
    } catch {
      setError("Could not save company profile.");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
      <input value={companyName} onChange={(event) => setCompanyName(event.target.value)} placeholder="Company name" className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500" />
      <input value={companyWebsite} onChange={(event) => setCompanyWebsite(event.target.value)} placeholder="Company website" className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500" />
      <input value={logoUrl} onChange={(event) => setLogoUrl(event.target.value)} placeholder="Logo URL" className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500" />
      <FileUploadField label="Upload company logo" uploadType="company-logo" accept="image/jpeg,image/png,image/webp" onUploaded={setLogoUrl} />
      <textarea value={companyDescription} onChange={(event) => setCompanyDescription(event.target.value)} placeholder="Company description" rows={6} className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500" />
      {message ? <p className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">{message}</p> : null}
      {error ? <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{error}</p> : null}
      <button type="submit" className="rounded-2xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700">Save company profile</button>
    </form>
  );
}
