import { useEffect, useState } from "react";
import { API_BASE_URL, useAuth } from "../App";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const { user } = useAuth();
  const nav = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("All");
  const [activeNav, setActiveNav] = useState("bookings");
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: "" });

  const tabs = ["All", "Pending", "Confirmed", "Completed", "Cancelled"];

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      try {
        const r = await fetch(`${API_BASE_URL}/bookings/me?userId=${user?.id}&role=customer`, {
          headers: { Authorization: user?.token ? `Bearer ${user.token}` : undefined },
        });
        if (!r.ok) throw new Error();
        const data = await r.json();
        console.log('===== BOOKING DATA DEBUG =====');
        console.log('Full response:', data);
        console.log('First booking:', data[0]);
        console.log('First booking service:', data[0]?.service);
        console.log('Service category:', data[0]?.service?.category);
        console.log('Category name:', data[0]?.service?.category?.name);
        console.log('=============================');
        setBookings(data);
      } catch (error) {
        console.error('Failed to load bookings:', error);
        setBookings([]);
      }
      setIsLoading(false);
    };
    load();
  }, [user]);

  const filteredBookings =
    activeTab === "All"
      ? bookings
      : bookings.filter((b) => b.status?.toUpperCase() === activeTab.toUpperCase());

  const getStatusColor = (status) => {
    switch (status?.toUpperCase()) {
      case "PENDING":
        return "bg-[#FFA500]/20 text-[#FFA500] border-[#FFA500]";
      case "CONFIRMED":
        return "bg-[#4169E1]/20 text-[#4169E1] border-[#4169E1]";
      case "COMPLETED":
        return "bg-[#10B981]/20 text-[#10B981] border-[#10B981]";
      case "CANCELLED":
        return "bg-[#EF4444]/20 text-[#EF4444] border-[#EF4444]";
      default:
        return "bg-[#666666]/20 text-[#666666] border-[#666666]";
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toUpperCase()) {
      case "PENDING":
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case "CONFIRMED":
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case "COMPLETED":
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        );
      case "CANCELLED":
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        );
      default:
        return null;
    }
  };

  const cancelBooking = async (bookingId) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) return;

    try {
      const res = await fetch(`${API_BASE_URL}/bookings/${bookingId}`, {
        method: "DELETE",
        headers: { Authorization: user?.token ? `Bearer ${user.token}` : undefined },
      });
      if (res.ok) {
        setBookings(bookings.filter((b) => b.bookId !== bookingId));
        alert("Booking cancelled successfully");
      }
    } catch {
      alert("Failed to cancel booking");
    }
  };

  const openReviewModal = (booking) => {
    setSelectedBooking(booking);
    setReviewForm({ rating: 5, comment: "" });
    setShowReviewModal(true);
  };

  const submitReview = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: user?.token ? `Bearer ${user.token}` : undefined,
        },
        body: JSON.stringify({
          bookingId: selectedBooking.bookId,
          rating: reviewForm.rating,
          comment: reviewForm.comment,
          customerId: user?.id,
          serviceId: selectedBooking.service?.id
        }),
      });

      if (res.ok) {
        alert("Review submitted successfully!");
        setShowReviewModal(false);
        setSelectedBooking(null);
      } else {
        alert("Failed to submit review");
      }
    } catch {
      alert("Failed to submit review");
    }
  };

  return (
    <div className="min-h-screen bg-[#ECECEC] pb-24">
      {/* Header */}
      <div className="bg-white px-6 py-6 shadow-sm">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-[#1A1A1A]">Booking History</h1>
          <button
            onClick={() => window.location.reload()}
            className="p-2 rounded-xl hover:bg-[#ECECEC] transition-colors"
          >
            <svg className="w-6 h-6 text-[#161E54]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>
      </div>

      {/* Status Tabs */}
      <div className="bg-white px-4 py-4 overflow-x-auto">
        <div className="flex gap-3 min-w-max">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-xl font-medium transition-all whitespace-nowrap ${
                activeTab === tab
                  ? "bg-[#161E54] text-white shadow-md"
                  : "bg-[#ECECEC] text-[#666666] hover:bg-[#D4D4D4]"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Bookings List */}
      <div className="px-4 py-6">
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-12 h-12 border-4 border-[#161E54] border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-24 h-24 rounded-full bg-[#161E54]/10 flex items-center justify-center mb-6">
              <svg className="w-12 h-12 text-[#161E54]/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-[#1A1A1A] mb-2">No bookings yet</h3>
            <p className="text-[#666666] text-center">Your booking history will appear here</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredBookings.map((booking) => {
              console.log('Rendering booking:', booking.bookId, 'Service:', booking.service);
              return (
              <div
                key={booking.bookId}
                className="bg-white rounded-3xl p-6 shadow-md space-y-4"
              >
                {/* Booking Header */}
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-[#1A1A1A]">
                      {booking.service?.title || "Service"}
                    </h3>
                    <p className="text-sm text-[#666666] mt-1">
                      Booking ID: #{booking.bookId}
                    </p>
                    {booking.provider?.name && (
                      <p className="text-xs text-[#666666] mt-1">
                        👤 Provider: {booking.provider.name}
                      </p>
                    )}
                  </div>
                  <div
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border ${getStatusColor(
                      booking.status
                    )}`}
                  >
                    {getStatusIcon(booking.status)}
                    <span className="text-sm font-semibold">{booking.status}</span>
                  </div>
                </div>

                {/* Booking Details */}
                <div className="space-y-2">
                  <div className="flex items-center gap-3 text-sm">
                    <svg className="w-5 h-5 text-[#666666]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-[#666666]">{booking.bookingDate}</span>
                  </div>
                  {booking.address && (
                    <div className="flex items-center gap-3 text-sm">
                      <svg className="w-5 h-5 text-[#666666]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      </svg>
                      <span className="text-[#666666]">
                        {booking.address.line1}, {booking.address.city}
                      </span>
                    </div>
                  )}
                  {booking.details && (
                    <div className="flex items-start gap-3 text-sm">
                      <svg className="w-5 h-5 text-[#666666] mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                      </svg>
                      <span className="text-[#666666]">{booking.details}</span>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-2">
                  {booking.status?.toUpperCase() === "PENDING" && (
                    <button
                      onClick={() => cancelBooking(booking.bookId)}
                      className="flex-1 py-3 bg-[#EF4444]/10 text-[#EF4444] font-semibold rounded-xl hover:bg-[#EF4444]/20 transition-colors"
                    >
                      Cancel
                    </button>
                  )}
                  {booking.status?.toUpperCase() === "COMPLETED" && (
                    <button 
                      onClick={() => openReviewModal(booking)}
                      className="flex-1 py-3 bg-[#161E54] text-white font-semibold rounded-xl hover:shadow-lg transition-all"
                    >
                      Leave Review
                    </button>
                  )}
                </div>
              </div>
            );
            })}
          </div>
        )}
      </div>

      {/* Review Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-[#1A1A1A]">Leave a Review</h3>
              <button
                onClick={() => setShowReviewModal(false)}
                className="p-2 hover:bg-[#ECECEC] rounded-xl transition-colors"
              >
                <svg className="w-6 h-6 text-[#666666]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div>
              <p className="text-sm text-[#666666] mb-2">
                Service: {selectedBooking?.service?.title || "Unknown"}
              </p>
              <p className="text-sm text-[#666666] mb-4">
                Provider: {selectedBooking?.provider?.name || "Unknown"}
              </p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#161E54] mb-2">Rating</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                    className="text-3xl transition-transform hover:scale-110"
                  >
                    {star <= reviewForm.rating ? "⭐" : "☆"}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#161E54] mb-2">Comment</label>
              <textarea
                rows={4}
                placeholder="Share your experience..."
                className="w-full px-4 py-3 border-2 border-[#D4D4D4] rounded-xl text-[#1A1A1A] placeholder-[#666666] focus:border-[#161E54] focus:outline-none transition-colors resize-none"
                value={reviewForm.comment}
                onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setShowReviewModal(false)}
                className="flex-1 py-3 bg-[#ECECEC] text-[#666666] font-semibold rounded-xl hover:bg-[#D4D4D4] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={submitReview}
                className="flex-1 py-3 gradient-secondary text-white font-semibold rounded-xl hover:shadow-lg transition-all"
              >
                Submit Review
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
