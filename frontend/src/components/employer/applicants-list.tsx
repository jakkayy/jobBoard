"use client";

import { useEffect, useState } from "react";

import { getStoredToken } from "@/lib/auth-token";
import { getJobApplications, updateApplicationStatus } from "@/lib/employer-api";
import type { Application, ApplicationStatus } from "@/types/candidate";

const statuses: ApplicationStatus[] = ["pending", "reviewing", "accepted", "rejected"];

export function ApplicantsList({ jobId }: Readonly<{ jobId: number }>) {
  const [applications, setApplications] = useState<Application[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = getStoredToken();
    if (!token) {
      setError("Please sign in first.");
      setIsLoading(false);
      return;
    }

    getJobApplications(token, jobId)
      .then((data) => setApplications(data.items))
      .catch(() => setError("Could not load applicants."))
      .finally(() => setIsLoading(false));
  }, [jobId]);

  async function handleStatusChange(applicationId: number, status: ApplicationStatus) {
    const token = getStoredToken();
    if (!token) return;

    try {
      const updated = await updateApplicationStatus(token, applicationId, { status });
      setApplications((current) => current.map((item) => (item.id === applicationId ? updated : item)));
    } catch {
      setError("Could not update application status.");
    }
  }

  if (isLoading) return <p className="text-slate-600">Loading applicants...</p>;

  return (
    <div className="space-y-4">
      {error ? <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{error}</p> : null}
      {applications.map((application) => (
        <article key={application.id} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <div className="text-sm font-bold text-blue-600">Candidate #{application.candidate_id}</div>
              <h2 className="mt-1 text-xl font-black text-slate-950">Application #{application.id}</h2>
              <p className="mt-2 text-sm text-slate-600">{application.cover_letter ?? "No cover letter provided."}</p>
              {application.cv_url ? <a href={application.cv_url} className="mt-3 inline-flex text-sm font-bold text-blue-600">View CV</a> : null}
            </div>
            <select value={application.status} onChange={(event) => handleStatusChange(application.id, event.target.value as ApplicationStatus)} className="rounded-2xl border border-slate-300 px-4 py-3 text-sm font-semibold outline-none focus:border-blue-500">
              {statuses.map((status) => <option key={status} value={status}>{status}</option>)}
            </select>
          </div>
        </article>
      ))}
      {applications.length === 0 ? <p className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-600">No applicants yet.</p> : null}
    </div>
  );
}
