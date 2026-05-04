import { formatEmploymentType, formatSalary } from "@/lib/job-format";
import type { Job } from "@/types/job";

export function JobCard({ job }: Readonly<{ job: Job }>) {
  return (
    <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="space-y-3">
          <div className="flex flex-wrap gap-2">
            <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">
              {formatEmploymentType(job.employment_type)}
            </span>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
              {job.status}
            </span>
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-950">{job.title}</h2>
            <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-600">{job.description}</p>
          </div>
          <div className="flex flex-wrap gap-3 text-sm font-medium text-slate-500">
            <span>{job.location ?? "Remote / Flexible"}</span>
            <span>Salary: {formatSalary(job)}</span>
          </div>
        </div>
        <a
          href={`/jobs/${job.id}`}
          className="rounded-full bg-slate-950 px-5 py-2 text-center text-sm font-semibold text-white transition hover:bg-slate-800"
        >
          View details
        </a>
      </div>
    </article>
  );
}
