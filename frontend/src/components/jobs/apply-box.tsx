"use client";

import { FormEvent, useState } from "react";

import { getStoredToken } from "@/lib/auth-token";
import { applyToJob } from "@/lib/candidate-api";

export function ApplyBox({ jobId }: Readonly<{ jobId: number }>) {
  const [coverLetter, setCoverLetter] = useState("");
  const [cvUrl, setCvUrl] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);
    setError(null);

    const token = getStoredToken();
    if (!token) {
      setError("Please sign in as a candidate before applying.");
      return;
    }

    setIsSubmitting(true);
    try {
      await applyToJob(token, jobId, {
        cover_letter: coverLetter || undefined,
        cv_url: cvUrl || undefined,
      });
      setMessage("Application submitted successfully.");
      setCoverLetter("");
      setCvUrl("");
    } catch {
      setError("Could not submit application. You may have already applied or this job is not open.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="rounded-3xl bg-slate-950 p-8 text-white shadow-xl shadow-slate-300">
      <h2 className="text-2xl font-black">Ready to apply?</h2>
      <p className="mt-3 text-slate-300">Submit a short cover letter and optional CV link.</p>
      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <textarea
          value={coverLetter}
          onChange={(event) => setCoverLetter(event.target.value)}
          rows={5}
          placeholder="Cover letter"
          className="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-white outline-none placeholder:text-slate-400 focus:border-blue-400"
        />
        <input
          value={cvUrl}
          onChange={(event) => setCvUrl(event.target.value)}
          placeholder="CV URL"
          className="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-white outline-none placeholder:text-slate-400 focus:border-blue-400"
        />
        {message ? <p className="rounded-2xl bg-emerald-500/10 px-4 py-3 text-sm font-semibold text-emerald-200">{message}</p> : null}
        {error ? <p className="rounded-2xl bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-200">{error}</p> : null}
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-full bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-500"
        >
          {isSubmitting ? "Submitting..." : "Apply now"}
        </button>
      </form>
    </section>
  );
}
