import { JobCard } from "@/components/jobs/job-card";
import { JobSearchForm } from "@/components/jobs/job-search-form";
import { getJobs, type JobSearchParams } from "@/lib/job-api";

function normalizeSearchParams(searchParams: Record<string, string | string[] | undefined>): JobSearchParams {
  return {
    keyword: typeof searchParams.keyword === "string" ? searchParams.keyword : undefined,
    location: typeof searchParams.location === "string" ? searchParams.location : undefined,
    employment_type:
      typeof searchParams.employment_type === "string"
        ? (searchParams.employment_type as JobSearchParams["employment_type"])
        : undefined,
    salary_min: typeof searchParams.salary_min === "string" ? searchParams.salary_min : undefined,
    salary_max: typeof searchParams.salary_max === "string" ? searchParams.salary_max : undefined,
    status: typeof searchParams.status === "string" ? (searchParams.status as JobSearchParams["status"]) : undefined,
    page: typeof searchParams.page === "string" ? searchParams.page : "1",
    limit: typeof searchParams.limit === "string" ? searchParams.limit : "10",
    sort: typeof searchParams.sort === "string" ? (searchParams.sort as JobSearchParams["sort"]) : "newest",
  };
}

function pageHref(page: number, params: JobSearchParams): string {
  const searchParams = new URLSearchParams();
  Object.entries({ ...params, page: String(page) }).forEach(([key, value]) => {
    if (value) {
      searchParams.set(key, value);
    }
  });
  return `/jobs?${searchParams.toString()}`;
}

export default async function JobsPage({
  searchParams,
}: Readonly<{ searchParams: Record<string, string | string[] | undefined> }>) {
  const params = normalizeSearchParams(searchParams);
  const jobs = await getJobs(params);
  const currentPage = jobs.page;
  const totalPages = Math.max(1, Math.ceil(jobs.total / jobs.limit));

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10 lg:px-8">
      <section className="mx-auto max-w-6xl space-y-8">
        <nav className="flex items-center justify-between">
          <a href="/" className="text-xl font-black text-slate-950">
            JobBoard
          </a>
          <a href="/login" className="rounded-full bg-slate-950 px-5 py-2 text-sm font-semibold text-white">
            Sign in
          </a>
        </nav>

        <div className="space-y-3">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-600">Browse jobs</p>
          <h1 className="text-4xl font-black tracking-tight text-slate-950 md:text-5xl">
            Find your next opportunity
          </h1>
          <p className="max-w-2xl text-slate-600">
            Search open roles by keyword, location, work type, and salary range.
          </p>
        </div>

        <JobSearchForm
          keyword={params.keyword}
          location={params.location}
          employmentType={params.employment_type}
        />

        <div className="flex items-center justify-between text-sm text-slate-600">
          <span>{jobs.total} jobs found</span>
          <span>
            Page {currentPage} of {totalPages}
          </span>
        </div>

        {jobs.items.length > 0 ? (
          <div className="space-y-4">
            {jobs.items.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center">
            <h2 className="text-xl font-black text-slate-950">No jobs found</h2>
            <p className="mt-2 text-slate-600">Try adjusting your search filters.</p>
          </div>
        )}

        <div className="flex items-center justify-between">
          <a
            href={pageHref(Math.max(1, currentPage - 1), params)}
            className={`rounded-full px-5 py-2 text-sm font-semibold ${
              currentPage <= 1 ? "pointer-events-none bg-slate-200 text-slate-400" : "bg-white text-slate-900"
            }`}
          >
            Previous
          </a>
          <a
            href={pageHref(Math.min(totalPages, currentPage + 1), params)}
            className={`rounded-full px-5 py-2 text-sm font-semibold ${
              currentPage >= totalPages ? "pointer-events-none bg-slate-200 text-slate-400" : "bg-white text-slate-900"
            }`}
          >
            Next
          </a>
        </div>
      </section>
    </main>
  );
}
