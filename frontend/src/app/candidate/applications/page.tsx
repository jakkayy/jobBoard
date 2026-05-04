import { ApplicationsList } from "@/components/candidate/applications-list";

export default function CandidateApplicationsPage() {
  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10 lg:px-8">
      <section className="mx-auto max-w-4xl space-y-8">
        <a href="/candidate/dashboard" className="text-sm font-bold text-blue-600">← Back to dashboard</a>
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-600">Applications</p>
          <h1 className="mt-2 text-4xl font-black tracking-tight text-slate-950">My applications</h1>
          <p className="mt-3 text-slate-600">Track every job application and its current status.</p>
        </div>
        <ApplicationsList />
      </section>
    </main>
  );
}
