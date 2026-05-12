import { useState } from "react";
import { FileUp, Loader2, Sparkles } from "lucide-react";

export default function ResumeUpload({ onAnalyze, loading }) {

  const [file, setFile] = useState(null);

  const handleAnalyze = () => {
    if (!file || loading) {
      return;
    }

    onAnalyze(file);
  };

  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.07] p-6 shadow-2xl shadow-black/20 backdrop-blur-xl">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-teal-200">Resume upload</p>
          <h2 className="mt-2 text-2xl font-bold text-white">Start your AI review</h2>
        </div>
        <span className="rounded-lg bg-teal-400/15 p-3 text-teal-200">
          <FileUp size={24} />
        </span>
      </div>

      <label className="flex cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-white/20 bg-zinc-950/45 px-5 py-10 text-center transition hover:border-teal-300/60 hover:bg-teal-300/5">
        <FileUp className="mb-4 text-slate-300" size={38} />
        <span className="text-base font-semibold text-white">
          {file ? file.name : "Choose PDF or DOCX resume"}
        </span>
        <span className="mt-2 text-sm text-slate-400">
          {file ? "Ready to analyze" : "Upload a clean, text-based file for best results"}
        </span>
        <input
          type="file"
          accept=".pdf,.docx"
          onChange={(e) => setFile(e.target.files[0])}
          className="sr-only"
        />
      </label>

      <button
        type="button"
        onClick={handleAnalyze}
        disabled={!file || loading}
        className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-teal-400 px-5 py-3 font-bold text-slate-950 shadow-xl shadow-teal-500/20 transition hover:bg-teal-300 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? (
          <>
            <Loader2 className="animate-spin" size={18} />
            Analyzing...
          </>
        ) : (
          <>
            <Sparkles size={18} />
            Analyze Resume
          </>
        )}
      </button>
    </div>
  );
}
