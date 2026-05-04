const stats = [
  { label: "Open roles", value: "1,200+" },
  { label: "Companies", value: "350+" },
  { label: "Candidates", value: "8k+" },
];

const features = [
  "Search jobs by skill, location, and work type",
  "Candidate profiles with CV uploads",
  "Employer dashboards for managing applicants",
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <section className="mx-auto flex max-w-6xl flex-col gap-12 px-6 py-10 lg:px-8 lg:py-16">
        <nav className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white/80 px-5 py-4 shadow-sm backdrop-blur">
          <div className="text-xl font-bold tracking-tight text-slate-950">JobBoard</div>
          <div className="hidden items-center gap-6 text-sm font-medium text-slate-600 md:flex">
            <a href="#features">Features</a>
            <a href="#jobs">Jobs</a>
            <a href="#contact">Contact</a>
          </div>
          <a
            href="/login"
            className="rounded-full bg-slate-950 px-5 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Sign in
          </a>
        </nav>

        <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-8">
            <div className="inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700">
              Job Board / Freelance Platform
            </div>
            <div className="space-y-5">
              <h1 className="max-w-3xl text-5xl font-black tracking-tight text-slate-950 md:text-6xl">
                Find the right work, or hire the right talent.
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-slate-600">
                A modern platform for candidates and employers, powered by Next.js, FastAPI,
                PostgreSQL, and Redis.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <a
                href="/jobs"
                className="rounded-full bg-blue-600 px-6 py-3 text-center font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700"
              >
                Browse jobs
              </a>
              <a
                href="/register"
                className="rounded-full border border-slate-300 bg-white px-6 py-3 text-center font-semibold text-slate-900 transition hover:border-slate-400"
              >
                Create account
              </a>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/70">
            <div className="rounded-2xl bg-slate-950 p-6 text-white">
              <div className="text-sm font-medium text-blue-200">Featured role</div>
              <div className="mt-4 text-2xl font-bold">Senior Full Stack Developer</div>
              <div className="mt-3 text-slate-300">Remote · Full-time · FastAPI · Next.js</div>
              <div className="mt-6 rounded-2xl bg-white/10 p-4 text-sm leading-6 text-slate-200">
                Build scalable products with a modern stack and collaborate with distributed teams.
              </div>
            </div>
            <div className="mt-6 grid grid-cols-3 gap-3">
              {stats.map((stat) => (
                <div key={stat.label} className="rounded-2xl bg-slate-50 p-4 text-center">
                  <div className="text-xl font-black text-slate-950">{stat.value}</div>
                  <div className="mt-1 text-xs font-medium text-slate-500">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <section id="features" className="grid gap-4 md:grid-cols-3">
          {features.map((feature) => (
            <div key={feature} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-4 h-2 w-12 rounded-full bg-blue-600" />
              <p className="font-semibold leading-7 text-slate-800">{feature}</p>
            </div>
          ))}
        </section>
      </section>
    </main>
  );
}
