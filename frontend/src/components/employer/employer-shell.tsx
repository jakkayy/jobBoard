"use client";

import { useEffect, useState } from "react";

import { getCurrentUser } from "@/lib/auth-api";
import { getStoredToken } from "@/lib/auth-token";
import type { User } from "@/types/auth";

export function EmployerShell() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = getStoredToken();
    if (!token) {
      setIsLoading(false);
      return;
    }

    getCurrentUser(token)
      .then(setUser)
      .catch(() => setUser(null))
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) return <p className="text-slate-600">Loading dashboard...</p>;

  if (!user) {
    return <a href="/login" className="rounded-full bg-blue-600 px-6 py-3 font-semibold text-white">Sign in</a>;
  }

  if (user.role !== "employer") {
    return <p className="rounded-2xl bg-amber-50 px-4 py-3 font-semibold text-amber-800">Employer account required.</p>;
  }

  return (
    <div className="grid gap-4 md:grid-cols-4">
      <a href="/employer/profile" className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md">
        <div className="text-sm font-bold uppercase tracking-[0.2em] text-blue-600">Company</div>
        <div className="mt-3 text-2xl font-black text-slate-950">Edit profile</div>
        <p className="mt-2 text-sm leading-6 text-slate-600">Manage company details and hiring brand.</p>
      </a>
      <a href="/employer/jobs" className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md">
        <div className="text-sm font-bold uppercase tracking-[0.2em] text-blue-600">Jobs</div>
        <div className="mt-3 text-2xl font-black text-slate-950">Manage jobs</div>
        <p className="mt-2 text-sm leading-6 text-slate-600">Create, update, and review job posts.</p>
      </a>
      <a href="/employer/jobs/new" className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md">
        <div className="text-sm font-bold uppercase tracking-[0.2em] text-blue-600">Post</div>
        <div className="mt-3 text-2xl font-black text-slate-950">Create job</div>
        <p className="mt-2 text-sm leading-6 text-slate-600">Publish a new opportunity for candidates.</p>
      </a>
      <a href="/notifications" className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md">
        <div className="text-sm font-bold uppercase tracking-[0.2em] text-blue-600">Activity</div>
        <div className="mt-3 text-2xl font-black text-slate-950">Notifications</div>
        <p className="mt-2 text-sm leading-6 text-slate-600">Track applications and status updates.</p>
      </a>
    </div>
  );
}
