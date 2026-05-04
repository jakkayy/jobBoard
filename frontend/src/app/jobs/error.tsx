"use client";

export default function JobsError({ reset }: Readonly<{ reset: () => void }>) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-6 py-10">
      <section className="max-w-md rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <h1 className="text-2xl font-black text-slate-950">Could not load jobs</h1>
        <p className="mt-3 text-slate-600">Please check that the backend API is running and try again.</p>
        <button
          type="button"
          onClick={reset}
          className="mt-6 rounded-full bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
        >
          Try again
        </button>
      </section>
    </main>
  );
}
