import type { EmploymentType } from "@/types/job";

const employmentTypes: { label: string; value: EmploymentType }[] = [
  { label: "Full time", value: "full_time" },
  { label: "Part time", value: "part_time" },
  { label: "Contract", value: "contract" },
  { label: "Freelance", value: "freelance" },
  { label: "Internship", value: "internship" },
];

export function JobSearchForm({
  keyword,
  location,
  employmentType,
}: Readonly<{ keyword?: string; location?: string; employmentType?: string }>) {
  return (
    <form action="/jobs" className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="grid gap-4 lg:grid-cols-[1fr_1fr_220px_auto]">
        <input
          name="keyword"
          defaultValue={keyword}
          placeholder="Search title, skill, keyword"
          className="rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
        />
        <input
          name="location"
          defaultValue={location}
          placeholder="Location"
          className="rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
        />
        <select
          name="employment_type"
          defaultValue={employmentType ?? ""}
          className="rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
        >
          <option value="">All types</option>
          {employmentTypes.map((type) => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="rounded-2xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
        >
          Search
        </button>
      </div>
    </form>
  );
}
