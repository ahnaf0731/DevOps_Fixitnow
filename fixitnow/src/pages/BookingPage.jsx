import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { API_BASE_URL, useAuth } from "../App";

export default function BookingPage() {
  const loc = useLocation();
  const nav = useNavigate();
  const { user } = useAuth();
  const [service, setService] = useState(loc.state?.service || null);
  const [providers, setProviders] = useState([]);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [form, setForm] = useState({
    date: "",
    timeSlot: "",
    addressLine1: "",
    city: "",
    district: "",
    description: "",
    amount: "",
    paymentMethod: "",
  });
  const [loading, setLoading] = useState(false);

  console.log('Current selected provider:', selectedProvider);
  console.log('Available providers:', providers);

  const timeSlots = [
    "9:00 AM - 11:00 AM",
    "11:00 AM - 1:00 PM",
    "1:00 PM - 3:00 PM",
    "3:00 PM - 5:00 PM",
    "5:00 PM - 7:00 PM",
  ];

  const paymentMethods = [
    { name: "Cash", icon: "💵" },
    { name: "Credit/Debit Card", icon: "💳" },
    { name: "Digital Wallet", icon: "👛" },
    { name: "Bank Transfer", icon: "🏦" },
  ];

  useEffect(() => {
    if (!service && loc.state?.serviceId) {
      fetch(`${API_BASE_URL}/services/${loc.state.serviceId}`)
        .then((r) => r.json())
        .then((s) => setService(s))
        .catch(() => {});
    }
    
    // Load providers
    fetch(`${API_BASE_URL}/users/providers`)
      .then((r) => r.json())
      .then((p) => setProviders(Array.isArray(p) ? p : []))
      .catch(() => setProviders([]));
  }, [loc.state, service]);

  const submit = async (e) => {
    e.preventDefault();
    
    if (!selectedProvider) {
      alert("Please select a provider");
      return;
    }
    
    if (!form.timeSlot) {
      alert("Please select a time slot");
      return;
    }
    
    if (!form.paymentMethod) {
      alert("Please select a payment method");
      return;
    }
    
    setLoading(true);
    try {
      const payload = {
        bookingDate: form.date,
        status: "PENDING",
        serId: service?.id,
        customerId: user?.id,
        providerId: selectedProvider,
        details: form.description,
        address: {
          line1: form.addressLine1,
          city: form.city,
          district: form.district,
          country: "Sri Lanka",
          postalCode: "00000",
        },
      };

      const res = await fetch(`${API_BASE_URL}/bookings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: user?.token ? `Bearer ${user.token}` : undefined,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to create booking");

      nav("/dashboard", { replace: true });
    } catch (err) {
      nav("/dashboard", { replace: true });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#ECECEC] px-4 py-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => nav(-1)}
            className="flex items-center text-[#161E54] mb-4"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="ml-2 font-medium">Back</span>
          </button>
          <h1 className="text-3xl font-bold text-[#1A1A1A]">Book Service</h1>
          {service && (
            <p className="text-[#666666] mt-1">
              {service.title} • LKR {Number(service.price ?? 0).toLocaleString()}
            </p>
          )}
        </div>

        <form onSubmit={submit} className="space-y-6">
          {/* Service Info Card */}
          {service && (
            <div className="bg-white rounded-3xl p-6 shadow-md">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-[#161E54] flex items-center justify-center">
                  <span className="text-3xl">{service.category?.name?.charAt(0) || "🔧"}</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-[#1A1A1A]">{service.title}</h3>
                  <p className="text-sm text-[#666666]">{service.category?.name}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-[#F16D34]">
                    LKR {Number(service.price ?? 0).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Provider Selection */}
          <div className="bg-white rounded-3xl p-6 shadow-md">
            <label className="flex items-center gap-2 text-[#161E54] font-semibold mb-3">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Select Provider
            </label>
            <div className="space-y-3 max-h-60 overflow-y-auto">
              {providers.length === 0 ? (
                <p className="text-[#666666] text-center py-4">Loading providers...</p>
              ) : (
                providers.map((provider) => {
                  const isSelected = Number(selectedProvider) === Number(provider.id);
                  return (
                    <button
                      key={provider.id}
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        console.log('Clicking provider:', provider.name, 'ID:', provider.id);
                        console.log('Previous selected:', selectedProvider);
                        setSelectedProvider(provider.id);
                        console.log('New selected:', provider.id);
                      }}
                      className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                        isSelected
                          ? "border-[#161E54] bg-[#161E54]/5"
                          : "border-[#D4D4D4] hover:border-[#161E54]"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                          isSelected
                            ? "bg-[#161E54]"
                            : "bg-[#ECECEC]"
                        }`}>
                          <span className={`text-2xl ${isSelected ? "text-white" : ""}`}>
                            👤
                          </span>
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-[#1A1A1A]">{provider.name}</h4>
                          <p className="text-sm text-[#666666]">{provider.email}</p>
                          {provider.contactNo && (
                            <p className="text-xs text-[#666666]">📞 {provider.contactNo}</p>
                          )}
                        </div>
                        {isSelected && (
                          <svg className="w-6 h-6 text-[#10B981]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* Date Selection */}
          <div className="bg-white rounded-3xl p-6 shadow-md">
            <label className="flex items-center gap-2 text-[#161E54] font-semibold mb-3">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Select Date
            </label>
            <input
              type="date"
              required
              min={new Date().toISOString().split("T")[0]}
              className="w-full px-4 py-3 border-2 border-[#D4D4D4] rounded-xl text-[#1A1A1A] focus:border-[#161E54] focus:outline-none transition-colors"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
            />
          </div>

          {/* Time Slot Selection */}
          <div className="bg-white rounded-3xl p-6 shadow-md">
            <label className="flex items-center gap-2 text-[#161E54] font-semibold mb-3">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Select Time Slot
            </label>
            <div className="grid grid-cols-1 gap-3">
              {timeSlots.map((slot) => (
                <button
                  key={slot}
                  type="button"
                  onClick={() => setForm({ ...form, timeSlot: slot })}
                  className={`px-4 py-3 rounded-xl border-2 font-medium transition-all ${
                    form.timeSlot === slot
                      ? "border-[#161E54] bg-[#161E54] text-white"
                      : "border-[#D4D4D4] bg-white text-[#666666] hover:border-[#161E54]"
                  }`}
                >
                  {slot}
                </button>
              ))}
            </div>
          </div>

          {/* Location Details */}
          <div className="bg-white rounded-3xl p-6 shadow-md space-y-4">
            <label className="flex items-center gap-2 text-[#161E54] font-semibold">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Location
            </label>
            <input
              type="text"
              required
              placeholder="Address Line 1"
              className="w-full px-4 py-3 border-2 border-[#D4D4D4] rounded-xl text-[#1A1A1A] placeholder-[#666666] focus:border-[#161E54] focus:outline-none transition-colors"
              value={form.addressLine1}
              onChange={(e) => setForm({ ...form, addressLine1: e.target.value })}
            />
            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                required
                placeholder="City"
                className="px-4 py-3 border-2 border-[#D4D4D4] rounded-xl text-[#1A1A1A] placeholder-[#666666] focus:border-[#161E54] focus:outline-none transition-colors"
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
              />
              <input
                type="text"
                required
                placeholder="District"
                className="px-4 py-3 border-2 border-[#D4D4D4] rounded-xl text-[#1A1A1A] placeholder-[#666666] focus:border-[#161E54] focus:outline-none transition-colors"
                value={form.district}
                onChange={(e) => setForm({ ...form, district: e.target.value })}
              />
            </div>
          </div>

          {/* Payment Method */}
          <div className="bg-white rounded-3xl p-6 shadow-md">
            <label className="flex items-center gap-2 text-[#161E54] font-semibold mb-3">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
              Payment Method
            </label>
            <div className="grid grid-cols-2 gap-3">
              {paymentMethods.map((method) => (
                <button
                  key={method.name}
                  type="button"
                  onClick={() => setForm({ ...form, paymentMethod: method.name })}
                  className={`px-4 py-4 rounded-xl border-2 font-medium transition-all flex flex-col items-center gap-2 ${
                    form.paymentMethod === method.name
                      ? "border-[#161E54] bg-[#161E54] text-white"
                      : "border-[#D4D4D4] bg-white text-[#666666] hover:border-[#161E54]"
                  }`}
                >
                  <span className="text-2xl">{method.icon}</span>
                  <span className="text-sm">{method.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Amount */}
          <div className="bg-white rounded-3xl p-6 shadow-md">
            <label className="flex items-center gap-2 text-[#161E54] font-semibold mb-3">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Amount (LKR)
            </label>
            <input
              type="number"
              required
              placeholder="Enter amount"
              className="w-full px-4 py-3 border-2 border-[#D4D4D4] rounded-xl text-[#1A1A1A] placeholder-[#666666] focus:border-[#161E54] focus:outline-none transition-colors"
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
            />
          </div>

          {/* Description */}
          <div className="bg-white rounded-3xl p-6 shadow-md">
            <label className="flex items-center gap-2 text-[#161E54] font-semibold mb-3">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
              </svg>
              Additional Details
            </label>
            <textarea
              rows={4}
              placeholder="Describe the issue or request..."
              className="w-full px-4 py-3 border-2 border-[#D4D4D4] rounded-xl text-[#1A1A1A] placeholder-[#666666] focus:border-[#161E54] focus:outline-none transition-colors resize-none"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-[#161E54] text-white font-bold text-lg rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Booking..." : "Confirm Booking"}
          </button>
        </form>
      </div>
    </div>
  );
}
