import { useEffect, useState } from "react";
import { API_BASE_URL, useAuth } from "../App";
import { useNavigate } from "react-router-dom";

export default function ProviderDashboard() {
  const { user } = useAuth();
  const nav = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [activeNav, setActiveNav] = useState("home");
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, pending: 0, completed: 0, revenue: 0 });
  const [assignedBookings, setAssignedBookings] = useState([]);
  const [completedBookings, setCompletedBookings] = useState([]);

  useEffect(() => {
    loadProviderData();
  }, [user]);

  const loadProviderData = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/bookings/me?userId=${user?.id}&role=provider`, {
        headers: { Authorization: user?.token ? `Bearer ${user.token}` : undefined },
      });
      
      if (res.ok) {
        const bookings = await res.json();
        
        const assigned = bookings.filter(b => 
          ['PENDING', 'CONFIRMED'].includes(b.status?.toUpperCase())
        );
        const completed = bookings.filter(b => 
          b.status?.toUpperCase() === 'COMPLETED'
        );
        
        setAssignedBookings(assigned);
        setCompletedBookings(completed);
        
        // Calculate revenue from actual service prices
        const totalRevenue = completed.reduce((sum, booking) => {
          const price = booking.service?.price || 0;
          return sum + parseFloat(price);
        }, 0);
        
        setStats({
          total: bookings.length,
          pending: assigned.length,
          completed: completed.length,
          revenue: totalRevenue
        });
      }
    } catch (err) {
      console.error(err);
    }
    setIsLoading(false);
  };

  const updateBookingStatus = async (bookingId, newStatus) => {
    try {
      const res = await fetch(`${API_BASE_URL}/bookings/${bookingId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: user?.token ? `Bearer ${user.token}` : undefined,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        loadProviderData();
        alert(`Booking ${newStatus.toLowerCase()} successfully!`);
      }
    } catch (err) {
      alert("Failed to update booking status");
    }
  };

  return (
    <div className="min-h-screen bg-[#ECECEC] pb-24">
      {/* Header */}
      <div className="bg-white px-6 py-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#161E54] flex items-center justify-center">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold text-[#1A1A1A]">FixItNow</h1>
              <p className="text-xs text-[#666666]">Provider Portal</p>
            </div>
          </div>
          <button
            onClick={loadProviderData}
            className="p-2 rounded-xl hover:bg-[#ECECEC] transition-colors"
          >
            <svg className="w-6 h-6 text-[#161E54]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <div className="w-12 h-12 border-4 border-[#161E54] border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <>
          {/* Stats Cards */}
          <div className="p-6">
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-white rounded-3xl p-5 shadow-md">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-xl bg-[#FFA500]/10 flex items-center justify-center">
                    <svg className="w-5 h-5 text-[#FFA500]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <span className="text-sm text-[#666666]">Pending</span>
                </div>
                <p className="text-3xl font-bold text-[#1A1A1A]">{stats.pending}</p>
              </div>

              <div className="bg-white rounded-3xl p-5 shadow-md">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-xl bg-[#10B981]/10 flex items-center justify-center">
                    <svg className="w-5 h-5 text-[#10B981]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-sm text-[#666666]">Completed</span>
                </div>
                <p className="text-3xl font-bold text-[#1A1A1A]">{stats.completed}</p>
              </div>

              <div className="bg-[#161E54] rounded-3xl p-5 shadow-md col-span-2">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-white/80 mb-1">Total Revenue</p>
                    <p className="text-3xl font-bold text-white">LKR {stats.revenue.toLocaleString()}</p>
                  </div>
                  <svg className="w-12 h-12 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-3 mb-4">
              <button
                onClick={() => setActiveTab(0)}
                className={`flex-1 py-3 rounded-2xl font-semibold transition-all ${
                  activeTab === 0
                    ? "gradient-secondary text-white shadow-lg"
                    : "bg-white text-[#666666]"
                }`}
              >
                My Jobs ({assignedBookings.length})
              </button>
              <button
                onClick={() => setActiveTab(1)}
                className={`flex-1 py-3 rounded-2xl font-semibold transition-all ${
                  activeTab === 1
                    ? "gradient-secondary text-white shadow-lg"
                    : "bg-white text-[#666666]"
                }`}
              >
                Completed ({completedBookings.length})
              </button>
            </div>

            {/* Bookings List */}
            <div className="space-y-4">
              {(activeTab === 0 ? assignedBookings : completedBookings).length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-20 h-20 rounded-full bg-[#161E54]/10 flex items-center justify-center mx-auto mb-4">
                    <svg className="w-10 h-10 text-[#161E54]/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-[#1A1A1A] mb-2">No bookings yet</h3>
                  <p className="text-[#666666]">
                    {activeTab === 0 ? "Assigned jobs will appear here" : "Completed jobs will appear here"}
                  </p>
                </div>
              ) : (
                (activeTab === 0 ? assignedBookings : completedBookings).map((booking) => (
                  <div key={booking.bookId} className="bg-white rounded-3xl p-6 shadow-md">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-[#1A1A1A]">
                          {booking.service?.title || "Service"}
                        </h3>
                        <p className="text-sm text-[#666666] mt-1">
                          Customer: {booking.customer?.name || "Unknown"}
                        </p>
                        <p className="text-sm text-[#666666]">
                          Booking ID: #{booking.bookId}
                        </p>
                      </div>
                      <span
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold ${
                          booking.status?.toUpperCase() === "PENDING"
                            ? "bg-[#FFA500]/20 text-[#FFA500]"
                            : booking.status?.toUpperCase() === "CONFIRMED"
                            ? "bg-[#4169E1]/20 text-[#4169E1]"
                            : "bg-[#10B981]/20 text-[#10B981]"
                        }`}
                      >
                        {booking.status}
                      </span>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-3 text-sm">
                        <svg className="w-5 h-5 text-[#666666]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="text-[#666666]">{booking.bookingDate}</span>
                      </div>
                      {booking.customer?.contactNo && (
                        <div className="flex items-center gap-3 text-sm">
                          <svg className="w-5 h-5 text-[#666666]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                          <span className="text-[#666666]">{booking.customer.contactNo}</span>
                        </div>
                      )}
                    </div>

                    {activeTab === 0 && booking.status?.toUpperCase() === "PENDING" && (
                      <div className="flex gap-3">
                        <button
                          onClick={() => updateBookingStatus(booking.bookId, "CONFIRMED")}
                          className="flex-1 py-3 bg-[#161E54] text-white font-semibold rounded-xl hover:shadow-lg transition-all"
                        >
                          Accept Job
                        </button>
                      </div>
                    )}

                    {activeTab === 0 && booking.status?.toUpperCase() === "CONFIRMED" && (
                      <button
                        onClick={() => updateBookingStatus(booking.bookId, "COMPLETED")}
                        className="w-full py-3 bg-[#10B981] text-white font-semibold rounded-xl hover:shadow-lg transition-all"
                      >
                        Mark as Completed
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
