import { useEffect, useMemo, useState } from "react";
import ServiceCard from "../components/ServiceCard";
import { API_BASE_URL } from "../App";

const imagesByCategory = {
  Plumbing: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=1600&auto=format&fit=crop",
  Electrical: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=1600&auto=format&fit=crop",
  Cleaning: "https://images.unsplash.com/photo-1686178827149-6d55c72d81df?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fGNsZWFuaW5nfGVufDB8fDB8fHww",
  Painting: "https://images.unsplash.com/photo-1529070538774-1843cb3265df?q=80&w=1600&auto=format&fit=crop",
  Carpentry: "https://images.unsplash.com/photo-1500051638674-ff996a0ec29e?q=80&w=1600&auto=format&fit=crop",
};

const demo = [
  { id: 1, title: "Plumbing", description: "Leak repairs, faucet install", price: 1500, category: "Plumbing" },
  { id: 2, title: "Electrical", description: "Wiring & appliance setup", price: 2000, category: "Electrical" },
  { id: 3, title: "Deep Cleaning", description: "Home & office cleaning", price: 1000, category: "Cleaning" },
  { id: 4, title: "Painting", description: "Interior & exterior", price: 2500, category: "Painting" },
  { id: 5, title: "Carpentry", description: "Furniture fixes", price: 1800, category: "Carpentry" },
];

export default function Services() {
  const [services, setServices] = useState(demo);
  const [query, setQuery] = useState("");

  useEffect(() => {
    fetch(`${API_BASE_URL}/services`)
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((data) => {
        if (Array.isArray(data) && data.length) {
          const mapped = data.map((s, idx) => ({
            id: s.serId ?? s.id ?? idx + 1,
            title: s.title,
            description: s.description ?? "",
            price: s.price ?? 0,
            category: s.category?.catName ?? s.categoryName ?? "General",
          }));
          setServices(mapped);
        }
      })
      .catch(() => {});
  }, []);

  const filtered = useMemo(
    () => services.filter((s) => (query ? s.title.toLowerCase().includes(query.toLowerCase()) : true)),
    [services, query]
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">All Services</h1>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search services..."
          className="input w-64"
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filtered.map((s) => (
          <ServiceCard
            key={s.id}
            service={{
              ...s,
              imageUrl: imagesByCategory[s.category] || imagesByCategory.Plumbing,
            }}
          />
        ))}
      </div>
    </div>
  );
}
