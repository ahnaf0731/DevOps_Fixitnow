import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL, useAuth } from "../App";

export default function Home() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedIndex, setSelectedIndex] = useState(0);

  const services = [
    {
      name: "Plumbing",
      icon: "🔧",
      color: "#3B82F6",
      image: "https://plus.unsplash.com/premium_photo-1664299069577-11579b487e6c?w=600&auto=format&fit=crop&q=60"
    },
    {
      name: "Electrical",
      icon: "⚡",
      color: "#F59E0B",
      image: "https://plus.unsplash.com/premium_photo-1661645634440-2e747c979980?w=600&auto=format&fit=crop&q=60"
    },
    {
      name: "Cleaning",
      icon: "🧹",
      color: "#10B981",
      image: "https://plus.unsplash.com/premium_photo-1667520405114-47d3677f966e?w=600&auto=format&fit=crop&q=60"
    },
    {
      name: "Carpentry",
      icon: "🔨",
      color: "#8B5CF6",
      image: "https://images.unsplash.com/photo-1667344970482-e939871e9f25?w=600&auto=format&fit=crop&q=60"
    },
    {
      name: "Painting",
      icon: "🎨",
      color: "#EC4899",
      image: "https://media.istockphoto.com/id/1461683093/photo/man-painting-wall-with-light-blue-dye-indoors-back-view.webp?a=1&b=1&s=612x612&w=0&k=20&c=RJXhG4yaV1vSKKMm_d9VygS0VtGzALgGnVECZMkRNnM="
    },
    {
      name: "AC Repair",
      icon: "❄️",
      color: "#06B6D4",
      image: "https://plus.unsplash.com/premium_photo-1682126012378-859ca7a9f4cf?w=600&auto=format&fit=crop&q=60"
    }
  ];

  const handleServiceClick = (serviceName) => {
    navigate("/booking", { state: { serviceName } });
  };

  const handleNavigation = (index) => {
    setSelectedIndex(index);
    if (index === 0) return;
    if (index === 1) navigate("/dashboard");
    if (index === 2) navigate("/profile");
  };

  return (
    <div className="min-h-screen bg-[#ECECEC] pb-20">
      {/* Content */}
      <div className="px-5 py-5">
        {/* Welcome Card */}
        <div className="bg-[#161E54] rounded-3xl p-6 shadow-lg mb-8">
          <h1 className="text-2xl font-bold text-white mb-2">Welcome Back! Ahnaf👋</h1>
          <p className="text-white/90">What service do you need today?</p>
        </div>

        {/* Our Services Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-[#1A1A1A]">Our Services</h2>
          <button className="text-sm text-[#F16D34] font-medium">View All</button>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-2 gap-4">
          {services.map((service, index) => (
            <div
              key={index}
              onClick={() => handleServiceClick(service.name)}
              className="bg-white rounded-2xl shadow-sm overflow-hidden cursor-pointer transform hover:scale-105 transition-all duration-300"
              style={{
                animation: `fadeInScale 0.6s ease-out ${index * 0.1}s both`
              }}
            >
              {/* Image Section */}
              <div className="h-32 overflow-hidden relative">
                <img
                  src={service.image}
                  alt={service.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><rect fill="${service.color}" width="200" height="200"/></svg>`;
                  }}
                />
              </div>
              {/* Content Section */}
              <div className="p-3 flex flex-col items-center justify-center min-h-[80px]">
                <span className="text-3xl mb-2" style={{ color: service.color }}>
                  {service.icon}
                </span>
                <h3 className="text-sm font-semibold text-[#1A1A1A] text-center">
                  {service.name}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
}
