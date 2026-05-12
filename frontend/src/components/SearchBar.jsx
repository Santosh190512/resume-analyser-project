import { MapPin, Search } from "lucide-react";

export default function SearchBar({
  skill,
  location,
  setSkill,
  setLocation,
  searchJobs
}) {

  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.07] p-5 shadow-2xl shadow-black/20 backdrop-blur-xl">
      <div className="grid gap-3 lg:grid-cols-[1fr_1fr_auto]">
        <label className="relative">
          <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={19} />
          <input
            type="text"
            placeholder="Skill, role, or keyword"
            value={skill}
            onChange={(e) => setSkill(e.target.value)}
            className="h-13 w-full rounded-lg border border-white/10 bg-zinc-950/65 px-12 text-white outline-none transition placeholder:text-slate-500 focus:border-teal-300/70 focus:ring-4 focus:ring-teal-300/10"
          />
        </label>

        <label className="relative">
          <MapPin className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={19} />
          <input
            type="text"
            placeholder="City or country"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="h-13 w-full rounded-lg border border-white/10 bg-zinc-950/65 px-12 text-white outline-none transition placeholder:text-slate-500 focus:border-teal-300/70 focus:ring-4 focus:ring-teal-300/10"
          />
        </label>

        <button
          type="button"
          onClick={searchJobs}
          className="inline-flex h-13 items-center justify-center gap-2 rounded-lg bg-rose-500 px-6 font-bold text-white shadow-xl shadow-rose-500/20 transition hover:bg-rose-400"
        >
          <Search size={18} />
          Search
        </button>
      </div>
    </div>
  );
}
