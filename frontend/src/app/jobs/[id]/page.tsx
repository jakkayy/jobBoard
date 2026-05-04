import { ApplyBox } from "@/components/jobs/apply-box";
import { getJob } from "@/lib/job-api";
import { formatEmploymentType, formatSalary } from "@/lib/job-format";

export default async function JobDetailPage({ params }: Readonly<{ params: { id: string } }>) {
  const job = await getJob(params.id);

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10 lg:px-8">
      <section className="mx-auto max-w-4xl space-y-8">
        <nav className="flex items-center justify-between">
          <a href="/jobs" className="text-sm font-bold text-blue-600">
            ← Back to jobs
          </a>
          <a href="/login" className="rounded-full bg-slate-950 px-5 py-2 text-sm font-semibold text-white">
            Sign in to apply
          </a>
        </nav>

        <header className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="flex flex-wrap gap-2">
            <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">
              {formatEmploymentType(job.employment_type)}
            </span>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
              {job.status}
            </span>
          </div>
          <h1 className="mt-5 text-4xl font-black tracking-tight text-slate-950">{job.title}</h1>
          <div className="mt-5 grid gap-3 text-sm font-semibold text-slate-600 sm:grid-cols-3">
            <div className="rounded-2xl bg-slate-50 p-4">Location: {job.location ?? "Flexible"}</div>
            <div className="rounded-2xl bg-slate-50 p-4">Salary: {formatSalary(job)}</div>
            <div className="rounded-2xl bg-slate-50 p-4">Job ID: #{job.id}</div>
          </div>
        </header>

        <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <h2 className="text-2xl font-black text-slate-950">Job description</h2>
          <p className="mt-4 whitespace-pre-line leading-8 text-slate-700">{job.description}</p>
        </section>

        {job.skills_required ? (
          <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <h2 className="text-2xl font-black text-slate-950">Skills required</h2>
            <p className="mt-4 leading-8 text-slate-700">{job.skills_required}</p>
          </section>
        ) : null}

        <ApplyBox jobId={job.id} />
      </section>
    </main>
  );
}
