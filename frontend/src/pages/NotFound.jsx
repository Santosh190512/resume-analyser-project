import { Home } from "lucide-react";
import { Link } from "react-router-dom";

export default function NotFound() {

  return (
    <section className="mx-auto grid min-h-[calc(100svh-88px)] max-w-7xl place-items-center px-5 py-10 text-center sm:px-6 lg:px-8">
      <div>
        <p className="text-lg font-semibold text-rose-200">404</p>
        <h1 className="mt-3 text-5xl font-black text-white">
          Page Not Found
        </h1>
        <p className="mt-4 max-w-md text-slate-400">
          The page you are looking for is not available.
        </p>
        <Link
          to="/"
          className="mt-7 inline-flex items-center gap-2 rounded-lg bg-white px-5 py-3 font-bold text-slate-950 transition hover:bg-teal-300"
        >
          <Home size={18} />
          Back Home
        </Link>
      </div>
    </section>
  );
}
