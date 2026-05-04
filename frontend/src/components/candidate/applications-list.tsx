"use client";

import { useEffect, useState } from "react";

import { getStoredToken } from "@/lib/auth-token";
import { getMyApplications } from "@/lib/candidate-api";
import type { Application } from "@/types/candidate";

export function ApplicationsList() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = getStoredToken();
    if (!token) {
      setError("Please sign in first.");
      setIsLoading(false);
      return;
    }

    getMyApplications(token)
      .then(setApplications)
      .catch(() => setError("Could not load applications."))
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return <p className="text-slate-600">Loading applications...</p>;
  }

  if (error) {
    return <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{error}</p>;
  }

  if (applications.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center">
        <h2 className="text-xl font-black text-slate-950">No applications yet</h2>
        <p className="mt-2 text-slate-600">Browse jobs and submit your first application.</p>
        <a href="/jobs" className="mt-6 inline-flex rounded-full bg-blue-600 px-6 py-3 font-semibold text-white">Browse jobs</a>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {applications.map((application) => (
        <article key={application.id} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="text-sm font-bold text-blue-600">Job #{application.job_id}</div>
              <div className="mt-1 text-xl font-black text-slate-950">Application #{application.id}</div>
              <p className="mt-2 text-sm text-slate-600">Submitted: {new Date(application.created_at).toLocaleDateString()}</p>
            </div>
            <span className="rounded-full bg-slate-100 px-4 py-2 text-sm font-bold text-slate-700">{application.status}</span>
          </div>
        </article>
      ))}
    </div>
  );
}
