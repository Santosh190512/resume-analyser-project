import { motion } from "framer-motion";
import { ArrowRight, BriefcaseBusiness, FileSearch, ShieldCheck, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from "../assets/hero.png";

export default function Hero() {
  const stats = [
    { label: "Resume score", value: "ATS-ready" },
    { label: "Skill gaps", value: "Instant" },
    { label: "Job search", value: "Targeted" },
  ];

  return (
    <section className="relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `linear-gradient(90deg, rgba(7,10,18,0.92), rgba(7,10,18,0.56)), url(${heroImage})`,
          backgroundPosition: "center",
          backgroundSize: "cover",
        }}
      />

      <div className="relative mx-auto grid min-h-[calc(100svh-88px)] max-w-7xl items-center gap-10 px-5 py-16 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8">
        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: -18 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 inline-flex items-center gap-2 rounded-lg border border-teal-300/30 bg-teal-300/10 px-4 py-2 text-sm font-medium text-teal-100"
          >
            <Sparkles size={16} />
            AI powered resume intelligence
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl text-5xl font-black leading-[1.04] text-white sm:text-6xl lg:text-7xl"
          >
            AI Resume Analyzer & Job Finder
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12 }}
            className="mt-6 max-w-2xl text-lg leading-8 text-slate-300"
          >
            Upload your resume, get a clear AI analysis, spot missing skills, and discover job roles that match your profile.
          </motion.p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              to="/resume-analyzer"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-teal-400 px-5 py-3 font-bold text-slate-950 shadow-xl shadow-teal-500/20 transition hover:bg-teal-300"
            >
              Analyze Resume
              <ArrowRight size={18} />
            </Link>

            <Link
              to="/job-finder"
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/15 bg-white/10 px-5 py-3 font-semibold text-white transition hover:bg-white/15"
            >
              Find Jobs
              <BriefcaseBusiness size={18} />
            </Link>
          </div>

          <div className="mt-10 grid max-w-2xl grid-cols-1 gap-3 sm:grid-cols-3">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-lg border border-white/10 bg-white/[0.07] p-4 backdrop-blur"
              >
                <p className="text-sm text-slate-400">{stat.label}</p>
                <p className="mt-2 text-xl font-bold text-white">{stat.value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-4 lg:justify-end">
          <div className="rounded-lg border border-white/10 bg-white/[0.08] p-5 shadow-2xl shadow-black/30 backdrop-blur-xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <p className="text-sm text-slate-400">Live analysis</p>
                <h2 className="mt-1 text-2xl font-bold text-white">Career Snapshot</h2>
              </div>
              <span className="rounded-lg bg-emerald-400/15 p-3 text-emerald-300">
                <ShieldCheck size={22} />
              </span>
            </div>

            <div className="mt-5 space-y-4">
              <div>
                <div className="mb-2 flex justify-between text-sm">
                  <span className="text-slate-300">ATS strength</span>
                  <span className="font-semibold text-teal-200">86%</span>
                </div>
                <div className="h-3 overflow-hidden rounded-full bg-white/10">
                  <div className="h-full w-[86%] rounded-full bg-teal-400" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg bg-zinc-950/60 p-4">
                  <FileSearch className="text-amber-300" size={22} />
                  <p className="mt-3 text-sm text-slate-400">Missing skills</p>
                  <p className="text-2xl font-bold text-white">4</p>
                </div>
                <div className="rounded-lg bg-zinc-950/60 p-4">
                  <BriefcaseBusiness className="text-rose-300" size={22} />
                  <p className="mt-3 text-sm text-slate-400">Best roles</p>
                  <p className="text-2xl font-bold text-white">12</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
