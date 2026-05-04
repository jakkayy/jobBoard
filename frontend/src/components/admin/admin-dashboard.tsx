"use client";

import { useEffect, useState } from "react";

import { getCurrentUser } from "@/lib/auth-api";
import { getStoredToken } from "@/lib/auth-token";
import { getAdminApplications, getAdminJobs, getAdminUsers, updateAdminJob, updateAdminUser } from "@/lib/admin-api";
import type { Application } from "@/types/candidate";
import type { User } from "@/types/auth";
import type { Job, JobStatus } from "@/types/job";

const jobStatuses: JobStatus[] = ["draft", "published", "closed"];

export function AdminDashboard() {
  const [users, setUsers] = useState<User[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  async function loadAdminData() {
    const token = getStoredToken();
    if (!token) {
      setError("Please sign in first.");
      setIsLoading(false);
      return;
    }

    try {
      const currentUser = await getCurrentUser(token);
      if (currentUser.role !== "admin") {
        setError("Admin account required.");
        return;
      }
      const [usersData, jobsData, applicationsData] = await Promise.all([
        getAdminUsers(token),
        getAdminJobs(token),
        getAdminApplications(token),
      ]);
      setUsers(usersData.items);
      setJobs(jobsData.items);
      setApplications(applicationsData.items);
    } catch {
      setError("Could not load admin data.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadAdminData();
  }, []);

  async function toggleUserActive(user: User) {
    const token = getStoredToken();
    if (!token) return;
    const updated = await updateAdminUser(token, user.id, { is_active: !user.is_active });
    setUsers((currentUsers) => currentUsers.map((item) => (item.id === user.id ? updated : item)));
  }

  async function updateJobStatus(job: Job, status: JobStatus) {
    const token = getStoredToken();
    if (!token) return;
    const updated = await updateAdminJob(token, job.id, { status });
    setJobs((currentJobs) => currentJobs.map((item) => (item.id === job.id ? updated : item)));
  }

  if (isLoading) return <p className="text-slate-600">Loading admin dashboard...</p>;

  return (
    <div className="space-y-8">
      {error ? <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{error}</p> : null}

      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-3xl bg-white p-6 shadow-sm"><div className="text-3xl font-black text-slate-950">{users.length}</div><p className="text-slate-600">Users</p></div>
        <div className="rounded-3xl bg-white p-6 shadow-sm"><div className="text-3xl font-black text-slate-950">{jobs.length}</div><p className="text-slate-600">Jobs</p></div>
        <div className="rounded-3xl bg-white p-6 shadow-sm"><div className="text-3xl font-black text-slate-950">{applications.length}</div><p className="text-slate-600">Applications</p></div>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-black text-slate-950">Users</h2>
        <div className="mt-4 space-y-3">
          {users.map((user) => (
            <div key={user.id} className="flex flex-col gap-3 rounded-2xl bg-slate-50 p-4 md:flex-row md:items-center md:justify-between">
              <div><p className="font-bold text-slate-950">{user.email}</p><p className="text-sm text-slate-600">{user.role}</p></div>
              <button type="button" onClick={() => toggleUserActive(user)} className="rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white">
                {user.is_active ? "Deactivate" : "Activate"}
              </button>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-black text-slate-950">Jobs</h2>
        <div className="mt-4 space-y-3">
          {jobs.map((job) => (
            <div key={job.id} className="flex flex-col gap-3 rounded-2xl bg-slate-50 p-4 md:flex-row md:items-center md:justify-between">
              <div><p className="font-bold text-slate-950">{job.title}</p><p className="text-sm text-slate-600">Employer #{job.employer_id}</p></div>
              <select value={job.status} onChange={(event) => updateJobStatus(job, event.target.value as JobStatus)} className="rounded-2xl border border-slate-300 px-4 py-2 text-sm font-semibold">
                {jobStatuses.map((status) => <option key={status} value={status}>{status}</option>)}
              </select>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-black text-slate-950">Applications</h2>
        <div className="mt-4 space-y-3">
          {applications.map((application) => (
            <div key={application.id} className="rounded-2xl bg-slate-50 p-4">
              <p className="font-bold text-slate-950">Application #{application.id}</p>
              <p className="text-sm text-slate-600">Job #{application.job_id} · Candidate #{application.candidate_id} · {application.status}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
