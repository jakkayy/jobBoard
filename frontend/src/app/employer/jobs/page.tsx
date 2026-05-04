import { EmployerJobsList } from "@/components/employer/employer-jobs-list";

export default function EmployerJobsPage() {
  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10 lg:px-8">
      <section className="mx-auto max-w-6xl space-y-8">
        <nav className="flex items-center justify-between">
          <a href="/employer/dashboard" className="text-sm font-bold text-blue-600">← Back to dashboard</a>
          <a href="/employer/jobs/new" className="rounded-full bg-blue-600 px-5 py-2 text-sm font-semibold text-white">Create job</a>
        </nav>
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-600">Employer jobs</p>
          <h1 className="mt-2 text-4xl font-black tracking-tight text-slate-950">Manage jobs</h1>
        </div>
        <EmployerJobsList />
      </section>
    </main>
  );
}
