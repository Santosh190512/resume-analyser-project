import { useEffect, useState } from "react";
import { BadgeCheck, Download, FileText, History, TrendingUp } from "lucide-react";

import API from "../api/api";

export default function Dashboard() {
  const [history, setHistory] = useState({
    total: 0,
    latest_score: null,
    resumes: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const res = await API.get("/resume/history/");
        setHistory(res.data);
      } catch {
        setHistory({ total: 0, latest_score: null, resumes: [] });
      } finally {
        setLoading(false);
      }
    };

    loadHistory();
  }, []);

  const downloadResume = async (resume) => {
    const res = await API.get(resume.download_url.replace("/api", ""), {
      responseType: "blob",
    });
    const url = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement("a");

    link.href = url;
    link.setAttribute("download", `improved_${resume.file_name}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  };

  const metrics = [
    { label: "Saved Resumes", value: history.total, icon: FileText, color: "text-teal-300" },
    { label: "Latest Score", value: history.latest_score ? `${history.latest_score}%` : "N/A", icon: BadgeCheck, color: "text-emerald-300" },
    { label: "Private History", value: "JWT", icon: History, color: "text-rose-300" },
  ];

  return (
    <section className="mx-auto max-w-7xl px-5 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <p className="inline-flex items-center gap-2 rounded-lg border border-emerald-300/30 bg-emerald-300/10 px-4 py-2 text-sm font-medium text-emerald-100">
          <TrendingUp size={16} />
          Secure user dashboard
        </p>
        <h1 className="mt-5 text-4xl font-black text-white sm:text-5xl">
          Dashboard
        </h1>
        <p className="mt-4 max-w-2xl text-slate-300">
          Your saved resumes, AI scores, and improved PDF downloads are visible only to your logged-in account.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        {metrics.map((metric) => {
          const Icon = metric.icon;

          return (
            <div
              key={metric.label}
              className="rounded-lg border border-white/10 bg-white/[0.07] p-6 shadow-xl shadow-black/10 backdrop-blur"
            >
              <Icon className={metric.color} size={28} />
              <p className="mt-5 text-sm text-slate-400">{metric.label}</p>
              <p className="mt-2 text-4xl font-black text-white">{metric.value}</p>
            </div>
          );
        })}
      </div>

      <div className="mt-6 rounded-lg border border-white/10 bg-zinc-950/45 p-6">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-2xl font-bold text-white">Saved resume history</h2>
            <p className="mt-2 text-sm text-slate-400">
              These uploads are filtered by your JWT-authenticated user account.
            </p>
          </div>
        </div>

        {loading ? (
          <div className="mt-6 rounded-lg border border-white/10 bg-white/[0.05] p-5 text-slate-300">
            Loading saved resumes...
          </div>
        ) : history.resumes.length === 0 ? (
          <div className="mt-6 rounded-lg border border-white/10 bg-white/[0.05] p-5 text-slate-300">
            No saved resumes yet. Upload and analyze a resume first.
          </div>
        ) : (
          <div className="mt-6 grid gap-4">
            {history.resumes.map((resume) => (
              <div
                key={resume.id}
                className="flex flex-col justify-between gap-4 rounded-lg border border-white/10 bg-white/[0.06] p-5 sm:flex-row sm:items-center"
              >
                <div>
                  <p className="text-lg font-bold text-white">{resume.file_name}</p>
                  <p className="mt-1 text-sm text-slate-400">
                    Uploaded: {new Date(resume.uploaded_at).toLocaleString()}
                  </p>
                  <p className="mt-2 text-sm font-semibold text-emerald-200">
                    Score: {resume.score ? `${resume.score}%` : "Not detected"}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => downloadResume(resume)}
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-400 px-4 py-2.5 text-sm font-bold text-slate-950 transition hover:bg-emerald-300"
                >
                  <Download size={17} />
                  Improved PDF
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
