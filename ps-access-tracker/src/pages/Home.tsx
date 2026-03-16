import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export function Home() {
  const { isAuthenticated } = useAuth();
  if (isAuthenticated) return <Navigate to="/dashboard" replace />;
  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center px-4 py-12 text-center">
      <h1 className="text-3xl font-semibold text-slate-900 sm:text-4xl">
        Public Service Access Tracker
      </h1>
      <p className="mt-4 max-w-lg text-slate-600">
        Understand public service processes, track requirements, application stages, and timelines.
        Store your certificates and get expiry reminders.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-4">
        <Link
          to="/login"
          className="rounded-md border border-slate-300 bg-white px-6 py-2.5 font-medium text-slate-700 transition hover:bg-slate-50"
        >
          Login
        </Link>
        <Link
          to="/signup"
          className="rounded-md bg-slate-800 px-6 py-2.5 font-medium text-white transition hover:bg-slate-700"
        >
          Sign up
        </Link>
      </div>
    </div>
  );
}
