import { EmployerProfileForm } from "@/components/employer/employer-profile-form";

export default function EmployerProfilePage() {
  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10 lg:px-8">
      <section className="mx-auto max-w-4xl space-y-8">
        <a href="/employer/dashboard" className="text-sm font-bold text-blue-600">← Back to dashboard</a>
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-600">Company profile</p>
          <h1 className="mt-2 text-4xl font-black tracking-tight text-slate-950">Edit company</h1>
          <p className="mt-3 text-slate-600">Keep your employer profile clear and trustworthy for candidates.</p>
        </div>
        <EmployerProfileForm />
      </section>
    </main>
  );
}
