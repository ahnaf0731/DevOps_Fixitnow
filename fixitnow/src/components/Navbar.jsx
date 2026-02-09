import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../App";

export default function Navbar() {
  const { user, logout } = useAuth();
  const nav = useNavigate();
  const { pathname } = useLocation();

  const handleLogout = () => {
    logout();
    if (pathname !== "/") nav("/");
  };

  const link = (to, label) => (
    <Link
      to={to}
      className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
        pathname === to 
          ? "bg-secondary text-white shadow-md" 
          : "text-white/90 hover:bg-white/10"
      }`}
    >
      {label}
    </Link>
  );

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#161E54] flex items-center justify-center shadow-lg">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
            </svg>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-extrabold text-primary tracking-tight">Fix</span>
            <span className="text-2xl font-extrabold text-secondary">It</span>
            <span className="text-2xl font-extrabold text-primary">Now</span>
          </div>
        </Link>

        <div className="flex items-center gap-2">
          <div className="hidden md:flex items-center gap-1 bg-primary rounded-xl px-2 py-1">
            {link("/", "Home")}
            {link("/services", "Services")}
            {user && link("/dashboard", "Dashboard")}
            {user && link("/profile", "Profile")}
          </div>

          {user && (
            <Link 
              to="/notifications" 
              className="relative p-2 rounded-lg hover:bg-gray-100 transition-all"
            >
              <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <span className="absolute top-1 right-1 w-5 h-5 bg-error text-white text-xs flex items-center justify-center rounded-full font-bold">
                3
              </span>
            </Link>
          )}

          {user && (
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gray-100">
              <div className="w-8 h-8 rounded-full bg-[#161E54] flex items-center justify-center text-white font-semibold">
                {user.name?.[0]?.toUpperCase() || "U"}
              </div>
              <span className="hidden md:block font-medium text-sm text-primary">
                {user.name}
              </span>
            </div>
          )}

          {!user ? (
            <div className="flex items-center gap-2">
              <Link 
                to="/login" 
                className="px-4 py-2 rounded-xl border-2 border-primary text-primary font-medium hover:bg-primary hover:text-white transition-all"
              >
                Login
              </Link>
              <Link to="/register" className="btn btn-primary">
                Register
              </Link>
            </div>
          ) : (
            <button 
              onClick={handleLogout} 
              className="px-4 py-2 rounded-xl border-2 border-error text-error font-medium hover:bg-error hover:text-white transition-all"
            >
              Logout
            </button>
          )}
        </div>
      </div>

      {/* Gradient bottom border */}
      <div className="h-1 w-full bg-[#161E54]" />
    </nav>
  );
}
