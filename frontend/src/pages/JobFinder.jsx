import { useState } from "react";
import { AlertTriangle, BriefcaseBusiness, MapPinned, Radar } from "lucide-react";

import API from "../api/api";

import SearchBar from "../components/SearchBar";
import JobCard from "../components/JobCard";

export default function JobFinder() {

  const [skill, setSkill] = useState("");
  const [location, setLocation] = useState("");
  const [jobs, setJobs] = useState([]);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);

  const searchJobs = async () => {
    setError("");
    setSearched(true);

    try {
      const res = await API.get(
        `/job/jobs/?skill=${encodeURIComponent(skill)}&location=${encodeURIComponent(location)}`
      );

      setJobs(res.data.jobs || res.data.data || []);
    } catch (err) {
      setJobs([]);
      setError(
        err.response?.data?.error ||
        "Jobs load nahi ho paye. Backend aur RapidAPI key check karo."
      );
    }
  };

  return (
    <section className="mx-auto max-w-7xl px-5 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <p className="inline-flex items-center gap-2 rounded-lg border border-rose-300/30 bg-rose-300/10 px-4 py-2 text-sm font-medium text-rose-100">
          <Radar size={16} />
          Smart job discovery
        </p>
        <h1 className="mt-5 text-4xl font-black text-white sm:text-5xl">
          Job Finder
        </h1>
        <p className="mt-4 max-w-2xl text-slate-300">
          Search roles by skill and location, then open the matching opportunities directly.
        </p>
      </div>

      <SearchBar
        skill={skill}
        location={location}
        setSkill={setSkill}
        setLocation={setLocation}
        searchJobs={searchJobs}
      />

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border border-white/10 bg-white/[0.06] p-5">
          <BriefcaseBusiness className="text-teal-300" size={24} />
          <p className="mt-3 text-sm text-slate-400">Role focus</p>
          <p className="mt-1 font-semibold text-white">{skill || "Any skill"}</p>
        </div>
        <div className="rounded-lg border border-white/10 bg-white/[0.06] p-5">
          <MapPinned className="text-amber-300" size={24} />
          <p className="mt-3 text-sm text-slate-400">Location</p>
          <p className="mt-1 font-semibold text-white">{location || "Any location"}</p>
        </div>
        <div className="rounded-lg border border-white/10 bg-white/[0.06] p-5">
          <Radar className="text-rose-300" size={24} />
          <p className="mt-3 text-sm text-slate-400">Matches</p>
          <p className="mt-1 font-semibold text-white">{jobs.length}</p>
        </div>
      </div>

      {error && (
        <div className="mt-6 flex items-start gap-3 rounded-lg border border-red-300/20 bg-red-500/10 p-4 text-red-100">
          <AlertTriangle className="mt-0.5 shrink-0" size={20} />
          <p>{error}</p>
        </div>
      )}

      <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        {jobs.map((job, index) => (
          <JobCard
            key={`${job.job_id || job.job_apply_link || job.url || job.job_title || job.title || "job"}-${index}`}
            job={job}
          />
        ))}
      </div>

      {searched && !error && jobs.length === 0 && (
        <div className="mt-8 rounded-lg border border-white/10 bg-zinc-950/45 p-8 text-center text-slate-300">
          No jobs found yet. Try another skill or location.
        </div>
      )}
    </section>
  );
}
