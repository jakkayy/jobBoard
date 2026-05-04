"use client";

import { useEffect, useState } from "react";

import { getCurrentUser } from "@/lib/auth-api";
import { getStoredToken } from "@/lib/auth-token";
import type { User } from "@/types/auth";

export function CandidateShell() {
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

  if (isLoading) {
    return <p className="text-slate-600">Loading dashboard...</p>;
  }

  if (!user) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <h2 className="text-2xl font-black text-slate-950">Sign in required</h2>
        <p className="mt-3 text-slate-600">Please sign in as a candidate to access your dashboard.</p>
        <a href="/login" className="mt-6 inline-flex rounded-full bg-blue-600 px-6 py-3 font-semibold text-white">
          Sign in
        </a>
      </div>
    );
  }

  if (user.role !== "candidate") {
    return (
      <div className="rounded-3xl border border-amber-200 bg-amber-50 p-8">
        <h2 className="text-2xl font-black text-amber-950">Candidate account required</h2>
        <p className="mt-3 text-amber-800">This dashboard is available for candidate accounts only.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <a href="/candidate/profile" className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md">
        <div className="text-sm font-bold uppercase tracking-[0.2em] text-blue-600">Profile</div>
        <div className="mt-3 text-2xl font-black text-slate-950">Edit your profile</div>
        <p className="mt-2 text-sm leading-6 text-slate-600">Manage your personal details, skills, and CV link.</p>
      </a>
      <a href="/candidate/applications" className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md">
        <div className="text-sm font-bold uppercase tracking-[0.2em] text-blue-600">Applications</div>
        <div className="mt-3 text-2xl font-black text-slate-950">Track applications</div>
        <p className="mt-2 text-sm leading-6 text-slate-600">Review submitted applications and their statuses.</p>
      </a>
      <a href="/jobs" className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md">
        <div className="text-sm font-bold uppercase tracking-[0.2em] text-blue-600">Jobs</div>
        <div className="mt-3 text-2xl font-black text-slate-950">Browse jobs</div>
        <p className="mt-2 text-sm leading-6 text-slate-600">Find new roles and submit an application.</p>
      </a>
    </div>
  );
}
