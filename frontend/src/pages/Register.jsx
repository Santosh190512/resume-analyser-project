import { useState } from "react";
import { AlertTriangle, Lock, Mail, UserRound, UserPlus } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../context/useAuth";

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const updateField = (field, value) => {
    setFormData((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await register(formData);
      navigate("/profile");
    } catch (err) {
      const data = err.response?.data;
      const message = data
        ? Object.values(data).flat().join(" ")
        : "Backend server se connect nahi ho pa raha. API URL, Render backend status, aur CORS settings check karo.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mx-auto grid min-h-[calc(100svh-88px)] max-w-7xl items-center px-5 py-10 sm:px-6 lg:px-8">
      <form onSubmit={handleSubmit} className="mx-auto w-full max-w-md rounded-lg border border-white/10 bg-white/[0.08] p-7 shadow-2xl shadow-black/30 backdrop-blur-xl">
        <div className="mb-7 text-center">
          <span className="mx-auto grid h-14 w-14 place-items-center rounded-lg bg-rose-400/15 text-rose-200">
            <UserPlus size={28} />
          </span>
          <h1 className="mt-5 text-4xl font-black text-white">
            Create account
          </h1>
          <p className="mt-2 text-slate-400">
            Save analysis history and job search progress.
          </p>
        </div>

        {error && (
          <div className="mb-5 flex items-start gap-3 rounded-lg border border-red-300/20 bg-red-500/10 p-3 text-sm text-red-100">
            <AlertTriangle className="mt-0.5 shrink-0" size={18} />
            {error}
          </div>
        )}

        <label className="mb-4 block">
          <span className="mb-2 block text-sm font-medium text-slate-300">Name</span>
          <span className="relative block">
            <UserRound className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input
              type="text"
              value={formData.name}
              onChange={(e) => updateField("name", e.target.value)}
              placeholder="Your name"
              className="h-12 w-full rounded-lg border border-white/10 bg-zinc-950/65 px-11 text-white outline-none placeholder:text-slate-500 focus:border-rose-300/70 focus:ring-4 focus:ring-rose-300/10"
              required
            />
          </span>
        </label>

        <label className="mb-4 block">
          <span className="mb-2 block text-sm font-medium text-slate-300">Username</span>
          <span className="relative block">
            <UserRound className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input
              type="text"
              value={formData.username}
              onChange={(e) => updateField("username", e.target.value)}
              placeholder="santosh"
              className="h-12 w-full rounded-lg border border-white/10 bg-zinc-950/65 px-11 text-white outline-none placeholder:text-slate-500 focus:border-rose-300/70 focus:ring-4 focus:ring-rose-300/10"
              required
            />
          </span>
        </label>

        <label className="mb-4 block">
          <span className="mb-2 block text-sm font-medium text-slate-300">Email</span>
          <span className="relative block">
            <Mail className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input
              type="email"
              value={formData.email}
              onChange={(e) => updateField("email", e.target.value)}
              placeholder="you@example.com"
              className="h-12 w-full rounded-lg border border-white/10 bg-zinc-950/65 px-11 text-white outline-none placeholder:text-slate-500 focus:border-rose-300/70 focus:ring-4 focus:ring-rose-300/10"
              required
            />
          </span>
        </label>

        <label className="mb-5 block">
          <span className="mb-2 block text-sm font-medium text-slate-300">Password</span>
          <span className="relative block">
            <Lock className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input
              type="password"
              value={formData.password}
              onChange={(e) => updateField("password", e.target.value)}
              placeholder="Create password"
              className="h-12 w-full rounded-lg border border-white/10 bg-zinc-950/65 px-11 text-white outline-none placeholder:text-slate-500 focus:border-rose-300/70 focus:ring-4 focus:ring-rose-300/10"
              required
              minLength={6}
            />
          </span>
        </label>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-rose-500 px-5 py-3 font-bold text-white shadow-xl shadow-rose-500/20 transition hover:bg-rose-400 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Creating account..." : "Create Account"}
        </button>

        <p className="mt-5 text-center text-sm text-slate-400">
          Already have account? <Link to="/login" className="font-semibold text-rose-200">Login</Link>
        </p>
      </form>
    </section>
  );
}
