import { useState } from "react";
import { AlertTriangle, BadgeCheck, Download, FileSearch, Sparkles, Target } from "lucide-react";

import API from "../api/api";

import ResumeUpload from "../components/ResumeUpload";
import AnalysisCard from "../components/AnalysisCard";

export default function ResumeAnalyzer() {

  const [result, setResult] = useState("");
  const [downloadUrl, setDownloadUrl] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const analyzeResume = async (file) => {
    setError("");
    setResult("");
    setDownloadUrl("");
    setLoading(true);

    try {
      const formData = new FormData();

      formData.append("resume", file);

      const res = await API.post(
        "/resume/analyze/",
        formData
      );

      setResult(res.data.analysis);
      setDownloadUrl(res.data.download_url || "");
    } catch (err) {
      setError(
        err.response?.data?.error ||
        err.response?.data?.detail ||
        "Backend se response nahi mila. Render backend live hai ya nahi aur CORS/VITE_API_BASE_URL check karo."
      );
    } finally {
      setLoading(false);
    }
  };

  const downloadImprovedResume = async () => {
    if (!downloadUrl) {
      return;
    }

    const res = await API.get(downloadUrl.replace("/api", ""), {
      responseType: "blob",
    });
    const url = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement("a");

    link.href = url;
    link.setAttribute("download", "improved_resume.pdf");
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  };

  return (
    <section className="mx-auto max-w-7xl px-5 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
        <div>
          <p className="inline-flex items-center gap-2 rounded-lg border border-teal-300/30 bg-teal-300/10 px-4 py-2 text-sm font-medium text-teal-100">
            <Sparkles size={16} />
            Resume intelligence
          </p>
          <h1 className="mt-5 text-4xl font-black text-white sm:text-5xl">
            Resume Analyzer
          </h1>
          <p className="mt-4 max-w-2xl text-slate-300">
            Get a resume score, missing skills, improvement points, ATS analysis, and role recommendations in one place.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-3 rounded-lg border border-white/10 bg-white/[0.06] p-3">
          <div className="text-center">
            <BadgeCheck className="mx-auto text-emerald-300" size={22} />
            <p className="mt-2 text-xs text-slate-400">Score</p>
          </div>
          <div className="text-center">
            <Target className="mx-auto text-rose-300" size={22} />
            <p className="mt-2 text-xs text-slate-400">Gaps</p>
          </div>
          <div className="text-center">
            <FileSearch className="mx-auto text-amber-300" size={22} />
            <p className="mt-2 text-xs text-slate-400">ATS</p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <ResumeUpload
          onAnalyze={analyzeResume}
          loading={loading}
        />

        <div className="rounded-lg border border-white/10 bg-zinc-950/45 p-6">
          <h2 className="text-2xl font-bold text-white">What you will get</h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {["Resume score", "Skills summary", "Missing skills", "Improvement ideas", "Recommended roles", "ATS analysis", "Improved PDF download", "Saved resume history"].map((item) => (
              <div key={item} className="rounded-lg border border-white/10 bg-white/[0.06] p-4 text-sm font-medium text-slate-200">
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>

      {error && (
        <div className="mt-6 flex items-start gap-3 rounded-lg border border-red-300/20 bg-red-500/10 p-4 text-red-100">
          <AlertTriangle className="mt-0.5 shrink-0" size={20} />
          <p>{error}</p>
        </div>
      )}

      {result && (
        <div className="mt-6">
          {downloadUrl && (
            <button
              type="button"
              onClick={downloadImprovedResume}
              className="mb-5 inline-flex items-center gap-2 rounded-lg bg-emerald-400 px-5 py-3 font-bold text-slate-950 shadow-xl shadow-emerald-500/20 transition hover:bg-emerald-300"
            >
              <Download size={18} />
              Download Improved Resume PDF
            </button>
          )}
          <AnalysisCard result={result} />
        </div>
      )}
    </section>
  );
}
