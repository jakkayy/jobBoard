"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import { getStoredToken } from "@/lib/auth-token";
import { createJob, updateJob } from "@/lib/job-api";
import type { EmploymentType, Job, JobStatus } from "@/types/job";

export function JobForm({ job }: Readonly<{ job?: Job }>) {
  const router = useRouter();
  const [title, setTitle] = useState(job?.title ?? "");
  const [description, setDescription] = useState(job?.description ?? "");
  const [location, setLocation] = useState(job?.location ?? "");
  const [employmentType, setEmploymentType] = useState<EmploymentType>(job?.employment_type ?? "full_time");
  const [status, setStatus] = useState<JobStatus>(job?.status ?? "draft");
  const [salaryMin, setSalaryMin] = useState(job?.salary_min?.toString() ?? "");
  const [salaryMax, setSalaryMax] = useState(job?.salary_max?.toString() ?? "");
  const [skillsRequired, setSkillsRequired] = useState(job?.skills_required ?? "");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    const token = getStoredToken();
    if (!token) {
      setError("Please sign in first.");
      return;
    }
    if (!title || !description) {
      setError("Title and description are required.");
      return;
    }

    const payload = {
      title,
      description,
      location: location || undefined,
      employment_type: employmentType,
      salary_min: salaryMin ? Number(salaryMin) : undefined,
      salary_max: salaryMax ? Number(salaryMax) : undefined,
      skills_required: skillsRequired || undefined,
      status,
    };

    try {
      if (job) await updateJob(token, job.id, payload);
      else await createJob(token, payload);
      router.push("/employer/jobs");
    } catch {
      setError("Could not save job.");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
      <input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Job title" className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500" />
      <textarea value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Job description" rows={8} className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500" />
      <div className="grid gap-5 md:grid-cols-2">
        <input value={location} onChange={(event) => setLocation(event.target.value)} placeholder="Location" className="rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500" />
        <select value={employmentType} onChange={(event) => setEmploymentType(event.target.value as EmploymentType)} className="rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500">
          <option value="full_time">Full time</option>
          <option value="part_time">Part time</option>
          <option value="contract">Contract</option>
          <option value="freelance">Freelance</option>
          <option value="internship">Internship</option>
        </select>
      </div>
      <div className="grid gap-5 md:grid-cols-3">
        <input value={salaryMin} onChange={(event) => setSalaryMin(event.target.value)} placeholder="Salary min" type="number" className="rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500" />
        <input value={salaryMax} onChange={(event) => setSalaryMax(event.target.value)} placeholder="Salary max" type="number" className="rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500" />
        <select value={status} onChange={(event) => setStatus(event.target.value as JobStatus)} className="rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500">
          <option value="draft">Draft</option>
          <option value="published">Published</option>
          <option value="closed">Closed</option>
        </select>
      </div>
      <input value={skillsRequired} onChange={(event) => setSkillsRequired(event.target.value)} placeholder="Skills required" className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500" />
      {error ? <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{error}</p> : null}
      <button type="submit" className="rounded-2xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700">Save job</button>
    </form>
  );
}
