import { NavLink, useNavigate } from "react-router-dom";
import {  Bot,BriefcaseBusiness, FileSearch, LayoutDashboard, LogIn, LogOut, Sparkles, UserRound } from "lucide-react";

import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const navigate = useNavigate();
  const { isAuthenticated, logout, user } = useAuth();

  const navItems = [
    { to: "/", label: "Home", icon: Sparkles },
    { to: "/resume-analyzer", label: "Analyzer", icon: FileSearch },
    { to: "/job-finder", label: "Jobs", icon: BriefcaseBusiness },
    { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },

  ];

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#070a12]/80 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">

        <NavLink to="/" className="flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-lg bg-teal-400 text-slate-950 shadow-lg shadow-teal-500/20">
            <Sparkles size={22} />
          </span>
          <span>
            <span className="block text-lg font-semibold text-white">
              AI Resume Portal
            </span>
            <span className="block text-sm text-slate-400">
              Analyze. Improve. Apply.
            </span>
          </span>
        </NavLink>

        <div className="flex flex-wrap items-center gap-2">
          {navItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition ${
                    isActive
                      ? "border-teal-300/40 bg-teal-300/15 text-teal-100 shadow-lg shadow-teal-500/10"
                      : "border-transparent text-slate-300 hover:bg-white/10 hover:text-white"
                  }`
                }
              >
                <Icon size={17} />
                {item.label}
              </NavLink>
            );
          })}

          {isAuthenticated ? (
            <>
              <NavLink
                to="/profile"
                className={({ isActive }) =>
                  `ml-0 flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition lg:ml-2 ${
                    isActive
                      ? "bg-white text-slate-950"
                      : "bg-white/10 text-white hover:bg-white/15"
                  }`
                }
              >
                <UserRound size={17} />
                {user?.first_name || user?.username || "Profile"}
              </NavLink>

              <button
                type="button"
                onClick={handleLogout}
                className="flex items-center gap-2 rounded-lg bg-rose-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-rose-500/20 transition hover:bg-rose-400"
              >
                <LogOut size={17} />
                Logout
              </button>
            </>
          ) : (
            <NavLink
              to="/login"
              className="ml-0 flex items-center gap-2 rounded-lg bg-rose-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-rose-500/20 transition hover:bg-rose-400 lg:ml-2"
            >
              <LogIn size={17} />
              Login
            </NavLink>
          )}
        </div>

      </nav>
    </header>
  );
}
