import type { ReactNode } from "react";

export function AuthCard({
  title,
  description,
  children,
}: Readonly<{ title: string; description: string; children: ReactNode }>) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-6 py-12">
      <section className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-xl shadow-slate-200/70">
        <a href="/" className="text-sm font-bold text-blue-600">
          JobBoard
        </a>
        <div className="mt-8 space-y-2">
          <h1 className="text-3xl font-black tracking-tight text-slate-950">{title}</h1>
          <p className="text-sm leading-6 text-slate-600">{description}</p>
        </div>
        <div className="mt-8">{children}</div>
      </section>
    </main>
  );
}
