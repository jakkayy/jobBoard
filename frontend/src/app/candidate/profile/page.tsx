import { CandidateProfileForm } from "@/components/candidate/profile-form";

export default function CandidateProfilePage() {
  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10 lg:px-8">
      <section className="mx-auto max-w-4xl space-y-8">
        <a href="/candidate/dashboard" className="text-sm font-bold text-blue-600">← Back to dashboard</a>
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-600">Candidate profile</p>
          <h1 className="mt-2 text-4xl font-black tracking-tight text-slate-950">Edit profile</h1>
          <p className="mt-3 text-slate-600">Keep your profile updated so employers can understand your skills and experience.</p>
        </div>
        <CandidateProfileForm />
      </section>
    </main>
  );
}
