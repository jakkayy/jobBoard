"use client";

import { FormEvent, useEffect, useState } from "react";

import { getStoredToken } from "@/lib/auth-token";
import { createCandidateProfile, getCandidateProfile, updateCandidateProfile } from "@/lib/candidate-api";

export function CandidateProfileForm() {
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [bio, setBio] = useState("");
  const [skills, setSkills] = useState("");
  const [cvUrl, setCvUrl] = useState("");
  const [profileExists, setProfileExists] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = getStoredToken();
    if (!token) return;

    getCandidateProfile(token)
      .then((profile) => {
        setProfileExists(true);
        setFullName(profile.full_name);
        setPhone(profile.phone ?? "");
        setBio(profile.bio ?? "");
        setSkills(profile.skills ?? "");
        setCvUrl(profile.cv_url ?? "");
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

    if (!fullName) {
      setError("Full name is required.");
      return;
    }

    const payload = {
      full_name: fullName,
      phone: phone || undefined,
      bio: bio || undefined,
      skills: skills || undefined,
      cv_url: cvUrl || undefined,
    };

    try {
      if (profileExists) {
        await updateCandidateProfile(token, payload);
      } else {
        await createCandidateProfile(token, payload);
        setProfileExists(true);
      }
      setMessage("Profile saved successfully.");
    } catch {
      setError("Could not save profile.");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
      <div className="grid gap-5 md:grid-cols-2">
        <input value={fullName} onChange={(event) => setFullName(event.target.value)} placeholder="Full name" className="rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500" />
        <input value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="Phone" className="rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500" />
      </div>
      <input value={skills} onChange={(event) => setSkills(event.target.value)} placeholder="Skills e.g. React, FastAPI" className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500" />
      <input value={cvUrl} onChange={(event) => setCvUrl(event.target.value)} placeholder="CV URL" className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500" />
      <textarea value={bio} onChange={(event) => setBio(event.target.value)} placeholder="Short bio" rows={5} className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500" />
      {message ? <p className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">{message}</p> : null}
      {error ? <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{error}</p> : null}
      <button type="submit" className="rounded-2xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700">Save profile</button>
    </form>
  );
}
