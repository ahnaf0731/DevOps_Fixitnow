import { useNavigate } from "react-router-dom";
import { useAuth } from "../App";
import { useState } from "react";

export default function Profile() {
  const { user, logout } = useAuth();
  const nav = useNavigate();
  const [activeNav, setActiveNav] = useState("profile");

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      logout();
      nav("/login", { replace: true });
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-[#ECECEC] flex items-center justify-center">
        <div className="text-center">
          <p className="text-[#666666] mb-4">Please login to view profile</p>
          <button
            onClick={() => nav("/login")}
            className="px-6 py-3 bg-[#161E54] text-white font-semibold rounded-2xl"
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#ECECEC] pb-24">
      {/* Header */}
      <div className="bg-white px-6 py-6 shadow-sm">
        <h1 className="text-2xl font-bold text-[#1A1A1A] text-center">Profile</h1>
      </div>

      {/* Profile Header with Gradient */}
      <div className="bg-[#161E54] rounded-b-[32px] px-6 py-10 shadow-lg">
        <div className="flex flex-col items-center">
          {/* Avatar */}
          <div className="w-24 h-24 rounded-full bg-white border-4 border-white shadow-xl flex items-center justify-center mb-4">
            <span className="text-4xl font-bold text-[#161E54]">
              {user.name ? user.name[0].toUpperCase() : "U"}
            </span>
          </div>
          {/* User Info */}
          <h2 className="text-2xl font-bold text-white mb-2">{user.name || "User"}</h2>
          <p className="text-white/90 text-sm">{user.email || "user@example.com"}</p>
        </div>
      </div>

      {/* Profile Info Cards */}
      <div className="px-6 py-6 space-y-4">
        {/* Phone Card */}
        <div className="bg-white rounded-3xl p-6 shadow-md">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#161E54]/10 flex items-center justify-center">
              <svg className="w-6 h-6 text-[#161E54]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-sm text-[#666666] mb-1">Phone</p>
              <p className="text-[#1A1A1A] font-semibold">
                {user.contactNo || "Not provided"}
              </p>
            </div>
          </div>
        </div>

        {/* Role Card */}
        <div className="bg-white rounded-3xl p-6 shadow-md">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#161E54]/10 flex items-center justify-center">
              <svg className="w-6 h-6 text-[#161E54]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-sm text-[#666666] mb-1">Account Type</p>
              <p className="text-[#1A1A1A] font-semibold capitalize">{user.role || "Customer"}</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-4 space-y-3">
          {/* Edit Profile Button */}
          <button
            onClick={() => alert("Edit profile feature coming soon!")}
            className="w-full py-4 bg-white text-[#161E54] font-semibold rounded-2xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-3"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Edit Profile
          </button>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="w-full py-4 bg-[#EF4444] text-white font-semibold rounded-2xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-3"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
