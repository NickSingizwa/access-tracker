import { Link } from "react-router-dom";

interface NavbarProps {
  isAuthenticated: boolean;
  userName?: string;
  onLogout: () => void;
}

export function Navbar({ isAuthenticated, userName, onLogout }: NavbarProps) {
  return (
    <nav className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <Link
          to={isAuthenticated ? "/dashboard" : "/"}
          className="text-lg font-semibold text-slate-800 transition hover:text-slate-600"
        >
          PS Access Tracker
        </Link>

        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <>
              <Link
                to="/services"
                className="hidden text-sm text-slate-600 transition hover:text-slate-900 sm:inline-block"
              >
                Services
              </Link>
              <Link
                to="/certificates"
                className="hidden text-sm text-slate-600 transition hover:text-slate-900 sm:inline-block"
              >
                Certificates
              </Link>
              <span className="hidden text-sm text-slate-500 sm:inline-block">
                {userName}
              </span>
              <button
                onClick={onLogout}
                className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-sm text-slate-600 transition hover:text-slate-900"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="rounded-md bg-slate-800 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-slate-700"
              >
                Sign up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
