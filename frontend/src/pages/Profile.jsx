import { useState } from "react";
import { AlertTriangle, BadgeCheck, Mail, Save, UserRound } from "lucide-react";

import { useAuth } from "../context/AuthContext";

export default function Profile() {
  const { user, updateProfile } = useAuth();
  const [formData, setFormData] = useState({
    first_name: user?.first_name || "",
    last_name: user?.last_name || "",
    email: user?.email || "",
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const updateField = (field, value) => {
    setFormData((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setLoading(true);

    try {
      await updateProfile(formData);
      setMessage("Profile updated successfully.");
    } catch {
      setError("Profile update nahi ho paya.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mx-auto max-w-7xl px-5 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <p className="inline-flex items-center gap-2 rounded-lg border border-teal-300/30 bg-teal-300/10 px-4 py-2 text-sm font-medium text-teal-100">
          <UserRound size={16} />
          User profile
        </p>
        <h1 className="mt-5 text-4xl font-black text-white sm:text-5xl">
          My Profile
        </h1>
        <p className="mt-4 max-w-2xl text-slate-300">
          Manage account details used in your resume analyzer workspace.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="rounded-lg border border-white/10 bg-white/[0.07] p-6 shadow-xl shadow-black/10 backdrop-blur">
          <div className="grid h-20 w-20 place-items-center rounded-lg bg-teal-400 text-3xl font-black text-slate-950">
            {(user?.first_name || user?.username || "U").charAt(0).toUpperCase()}
          </div>
          <h2 className="mt-5 text-2xl font-bold text-white">
            {user?.name || user?.username}
          </h2>
          <p className="mt-2 flex items-center gap-2 text-slate-400">
            <Mail size={17} />
            {user?.email}
          </p>
          <div className="mt-6 rounded-lg border border-emerald-300/20 bg-emerald-300/10 p-4 text-emerald-100">
            <BadgeCheck className="mb-2" size={22} />
            Logged in with secure token authentication.
          </div>
        </div>

        <form onSubmit={handleSubmit} className="rounded-lg border border-white/10 bg-zinc-950/45 p-6">
          <h2 className="text-2xl font-bold text-white">Edit details</h2>

          {message && (
            <div className="mt-5 rounded-lg border border-emerald-300/20 bg-emerald-500/10 p-3 text-sm text-emerald-100">
              {message}
            </div>
          )}

          {error && (
            <div className="mt-5 flex items-start gap-3 rounded-lg border border-red-300/20 bg-red-500/10 p-3 text-sm text-red-100">
              <AlertTriangle className="mt-0.5 shrink-0" size={18} />
              {error}
            </div>
          )}

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <label>
              <span className="mb-2 block text-sm font-medium text-slate-300">First name</span>
              <input
                type="text"
                value={formData.first_name}
                onChange={(e) => updateField("first_name", e.target.value)}
                className="h-12 w-full rounded-lg border border-white/10 bg-zinc-950/65 px-4 text-white outline-none placeholder:text-slate-500 focus:border-teal-300/70 focus:ring-4 focus:ring-teal-300/10"
              />
            </label>

            <label>
              <span className="mb-2 block text-sm font-medium text-slate-300">Last name</span>
              <input
                type="text"
                value={formData.last_name}
                onChange={(e) => updateField("last_name", e.target.value)}
                className="h-12 w-full rounded-lg border border-white/10 bg-zinc-950/65 px-4 text-white outline-none placeholder:text-slate-500 focus:border-teal-300/70 focus:ring-4 focus:ring-teal-300/10"
              />
            </label>
          </div>

          <label className="mt-4 block">
            <span className="mb-2 block text-sm font-medium text-slate-300">Email</span>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => updateField("email", e.target.value)}
              className="h-12 w-full rounded-lg border border-white/10 bg-zinc-950/65 px-4 text-white outline-none placeholder:text-slate-500 focus:border-teal-300/70 focus:ring-4 focus:ring-teal-300/10"
            />
          </label>

          <button
            type="submit"
            disabled={loading}
            className="mt-5 inline-flex items-center gap-2 rounded-lg bg-teal-400 px-5 py-3 font-bold text-slate-950 shadow-xl shadow-teal-500/20 transition hover:bg-teal-300 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Save size={18} />
            {loading ? "Saving..." : "Save Profile"}
          </button>
        </form>
      </div>
    </section>
  );
}
