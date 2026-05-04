import { CandidateShell } from "@/components/candidate/candidate-shell";

export default function CandidateDashboardPage() {
  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10 lg:px-8">
      <section className="mx-auto max-w-6xl space-y-8">
        <nav className="flex items-center justify-between">
          <a href="/" className="text-xl font-black text-slate-950">JobBoard</a>
          <a href="/jobs" className="rounded-full bg-slate-950 px-5 py-2 text-sm font-semibold text-white">Browse jobs</a>
        </nav>
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-600">Candidate</p>
          <h1 className="mt-2 text-4xl font-black tracking-tight text-slate-950">Dashboard</h1>
          <p className="mt-3 max-w-2xl text-slate-600">Manage your profile, applications, and job search from one place.</p>
        </div>
        <CandidateShell />
      </section>
    </main>
  );
}
