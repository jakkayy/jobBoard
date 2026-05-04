import { AdminDashboard } from "@/components/admin/admin-dashboard";

export default function AdminPage() {
  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10 lg:px-8">
      <section className="mx-auto max-w-6xl space-y-8">
        <nav className="flex items-center justify-between">
          <a href="/" className="text-xl font-black text-slate-950">JobBoard</a>
          <a href="/notifications" className="rounded-full bg-slate-950 px-5 py-2 text-sm font-semibold text-white">Notifications</a>
        </nav>
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-600">Admin</p>
          <h1 className="mt-2 text-4xl font-black tracking-tight text-slate-950">Moderation dashboard</h1>
          <p className="mt-3 max-w-2xl text-slate-600">Review users, jobs, and applications from one place.</p>
        </div>
        <AdminDashboard />
      </section>
    </main>
  );
}
