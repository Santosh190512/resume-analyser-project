import { ArrowUpRight, Building2, MapPin } from "lucide-react";

export default function JobCard({ job }) {
  const title = job.job_title || job.title || job.position || "Untitled role";
  const company = job.employer_name || job.company || job.companyName || "Company not listed";
  const locationParts = [
    job.job_city,
    job.job_state,
    job.job_country,
  ].filter(Boolean);
  const location =
    job.job_location ||
    job.location ||
    job.jobLocation ||
    locationParts.join(", ") ||
    "Location not listed";
  const url =
    job.job_apply_link ||
    job.job_google_link ||
    job.url ||
    job.jobUrl ||
    job.applyUrl ||
    "#";

  return (
    <div className="group flex h-full flex-col rounded-lg border border-white/10 bg-white/[0.07] p-5 shadow-xl shadow-black/10 backdrop-blur transition hover:-translate-y-1 hover:border-teal-300/40 hover:bg-white/[0.1]">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div className="rounded-lg bg-teal-400/15 p-3 text-teal-200">
          <Building2 size={22} />
        </div>
        <span className="rounded-lg bg-amber-300/15 px-3 py-1 text-xs font-semibold text-amber-200">
          New match
        </span>
      </div>

      <h2 className="text-xl font-bold leading-7 text-white">
        {title}
      </h2>

      <p className="mt-3 flex items-center gap-2 text-sm text-slate-300">
        <Building2 size={16} />
        {company}
      </p>

      <p className="mt-2 flex items-center gap-2 text-sm text-slate-400">
        <MapPin size={16} />
        {location}
      </p>

      <a
        href={url}
        target="_blank"
        rel="noreferrer"
        className="mt-6 inline-flex items-center justify-center gap-2 rounded-lg bg-teal-400 px-4 py-2.5 text-sm font-bold text-slate-950 shadow-lg shadow-teal-500/20 transition hover:bg-teal-300"
      >
        Apply Now
        <ArrowUpRight size={17} />
      </a>
    </div>
  );
}
