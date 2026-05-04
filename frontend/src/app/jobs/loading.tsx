export default function JobsLoading() {
  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10 lg:px-8">
      <section className="mx-auto max-w-6xl space-y-6">
        <div className="h-10 w-40 animate-pulse rounded-full bg-slate-200" />
        <div className="h-32 animate-pulse rounded-3xl bg-slate-200" />
        <div className="space-y-4">
          {[1, 2, 3].map((item) => (
            <div key={item} className="h-40 animate-pulse rounded-3xl bg-slate-200" />
          ))}
        </div>
      </section>
    </main>
  );
}
