import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { API_BASE_URL, useAuth } from "../App";

const fallbackImg = "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=1600&auto=format&fit=crop";

export default function ServiceDetail() {
  const { id } = useParams();
  const [service, setService] = useState(null);
  const nav = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    fetch(`${API_BASE_URL}/services/${id}`)
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((s) => {
        setService({
          id: s.serId ?? s.id ?? id,
          title: s.title ?? "Service",
          description: s.description ?? "Service description",
          price: s.price ?? 0,
          provider: s.provider?.name ?? "Provider",
          imageUrl: fallbackImg,
        });
      })
      .catch(() =>
        setService({
          id,
          title: "Service",
          description: "Detailed description of the selected service.",
          price: 1500,
          provider: "Demo Provider",
          imageUrl: fallbackImg,
        })
      );
  }, [id]);

  if (!service) return null;

  const goBook = () => {
    nav("/booking", { state: { service } });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="card overflow-hidden">
        <img src={service.imageUrl} alt={service.title} className="w-full h-64 object-cover" />
        <div className="p-6">
          <h1 className="text-2xl font-bold">{service.title}</h1>
          <p className="text-gray-600 mt-1">Provider: {service.provider}</p>
          <p className="mt-3 text-gray-700">{service.description}</p>
          <div className="mt-5 flex items-center justify-between">
            <span className="text-xl font-bold text-primary">LKR {Number(service.price).toLocaleString()}</span>
            <button
              onClick={() => (user ? goBook() : nav("/login"))}
              className="btn btn-primary"
            >
              {user ? "Book Now" : "Login to Book"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
