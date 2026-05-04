import { JobForm } from "@/components/employer/job-form";
import { getJob } from "@/lib/job-api";

export default async function EditEmployerJobPage({ params }: Readonly<{ params: { id: string } }>) {
  const job = await getJob(params.id);

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10 lg:px-8">
      <section className="mx-auto max-w-4xl space-y-8">
        <a href="/employer/jobs" className="text-sm font-bold text-blue-600">← Back to jobs</a>
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-600">Edit job</p>
          <h1 className="mt-2 text-4xl font-black tracking-tight text-slate-950">{job.title}</h1>
        </div>
        <JobForm job={job} />
      </section>
    </main>
  );
}
