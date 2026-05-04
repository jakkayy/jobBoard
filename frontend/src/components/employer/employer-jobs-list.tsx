"use client";

import { useEffect, useState } from "react";

import { getStoredToken } from "@/lib/auth-token";
import { deleteJob, getJobs } from "@/lib/job-api";
import type { Job } from "@/types/job";

export function EmployerJobsList() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  async function loadJobs() {
    setIsLoading(true);
    try {
      const data = await getJobs({ limit: "50" });
      setJobs(data.items);
    } catch {
      setError("Could not load jobs.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadJobs();
  }, []);

  async function handleDelete(jobId: number) {
    const token = getStoredToken();
    if (!token) {
      setError("Please sign in first.");
      return;
    }

    try {
      await deleteJob(token, jobId);
      setJobs((currentJobs) => currentJobs.filter((job) => job.id !== jobId));
    } catch {
      setError("Could not delete job. Make sure this job belongs to your account.");
    }
  }

  if (isLoading) return <p className="text-slate-600">Loading jobs...</p>;

  return (
    <div className="space-y-4">
      {error ? <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{error}</p> : null}
      {jobs.map((job) => (
        <article key={job.id} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="text-sm font-bold text-blue-600">{job.status}</div>
              <h2 className="mt-1 text-2xl font-black text-slate-950">{job.title}</h2>
              <p className="mt-2 text-sm text-slate-600">{job.location ?? "Flexible"}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <a href={`/employer/jobs/${job.id}/applicants`} className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-900 ring-1 ring-slate-300">Applicants</a>
              <a href={`/employer/jobs/${job.id}/edit`} className="rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white">Edit</a>
              <button type="button" onClick={() => handleDelete(job.id)} className="rounded-full bg-red-50 px-4 py-2 text-sm font-semibold text-red-700">Delete</button>
            </div>
          </div>
        </article>
      ))}
      {jobs.length === 0 ? <p className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-600">No jobs found.</p> : null}
    </div>
  );
}
