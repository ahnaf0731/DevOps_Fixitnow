import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function SelectProvider() {
  const location = useLocation();
  const navigate = useNavigate();
  const serviceName = location.state?.serviceName || "Service";
  
  const [providers, setProviders] = useState([
    {
      id: 1,
      name: "Rajith Fernando",
      rating: 4.9,
      reviewCount: 124,
      completedJobs: 350,
      verified: true,
      bio: "Experienced plumber with 10+ years. Specialized in leak detection and pipe repairs.",
      hourlyRate: 1500,
      availability: "Available Today",
      reviews: [
        { customerName: "Saman", rating: 5, comment: "Excellent work! Fixed the issue quickly." },
        { customerName: "Kamala", rating: 5, comment: "Very professional and friendly." },
      ]
    },
    {
      id: 2,
      name: "Nuwan Silva",
      rating: 4.7,
      reviewCount: 89,
      completedJobs: 230,
      verified: true,
      bio: "Professional electrician specializing in residential and commercial wiring.",
      hourlyRate: 1800,
      availability: "Available Tomorrow",
      reviews: [
        { customerName: "Priya", rating: 5, comment: "Great service, very knowledgeable!" },
        { customerName: "Ravi", rating: 4, comment: "Good work, slightly delayed." },
      ]
    },
    {
      id: 3,
      name: "Chathura Perera",
      rating: 4.8,
      reviewCount: 95,
      completedJobs: 280,
      verified: false,
      bio: "Reliable service provider with expertise in home maintenance and repairs.",
      hourlyRate: 1600,
      availability: "Available Today",
      reviews: [
        { customerName: "Lakshmi", rating: 5, comment: "Highly recommended!" },
      ]
    },
  ]);

  const [selectedProvider, setSelectedProvider] = useState(null);
  const [showDetails, setShowDetails] = useState(null);

  const handleSelectProvider = (provider) => {
    setSelectedProvider(provider);
    navigate("/booking", { state: { provider, serviceName } });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary mb-2">Select a Provider</h1>
        <p className="text-gray-600">for {serviceName}</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {providers.map((provider) => (
          <div key={provider.id} className="card p-6">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Provider Info */}
              <div className="flex-shrink-0">
                <div className="w-24 h-24 rounded-full bg-[#161E54] flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                  {provider.name[0]}
                </div>
              </div>

              {/* Details */}
              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl font-bold text-primary">{provider.name}</h3>
                      {provider.verified && (
                        <svg className="w-6 h-6 text-secondary" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                    <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className={`w-4 h-4 ${i < Math.floor(provider.rating) ? 'text-warning' : 'text-gray-300'}`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                        <span className="ml-1 font-semibold">{provider.rating}</span>
                        <span>({provider.reviewCount})</span>
                      </div>
                      <span>• {provider.completedJobs} jobs completed</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-2xl font-bold text-secondary">
                      LKR {provider.hourlyRate.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-600">per hour</div>
                  </div>
                </div>

                <p className="text-gray-700 mt-3">{provider.bio}</p>

                <div className="flex items-center gap-3 mt-4">
                  <div className="flex items-center gap-2 text-sm">
                    <span className={`w-2 h-2 rounded-full ${provider.availability.includes('Today') ? 'bg-success' : 'bg-warning'}`}></span>
                    <span className="font-medium">{provider.availability}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 mt-4">
                  <button
                    onClick={() => setShowDetails(showDetails === provider.id ? null : provider.id)}
                    className="px-4 py-2 rounded-xl border-2 border-primary text-primary font-medium hover:bg-primary/5 transition-all"
                  >
                    {showDetails === provider.id ? "Hide Details" : "View Details"}
                  </button>
                  <button
                    onClick={() => handleSelectProvider(provider)}
                    className="btn btn-primary px-6"
                  >
                    Select Provider
                  </button>
                </div>

                {/* Reviews Section */}
                {showDetails === provider.id && (
                  <div className="mt-6 pt-6 border-t">
                    <h4 className="font-semibold text-lg mb-4">Recent Reviews</h4>
                    <div className="space-y-3">
                      {provider.reviews.map((review, idx) => (
                        <div key={idx} className="bg-gray-50 rounded-xl p-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium">{review.customerName}</span>
                            <div className="flex items-center gap-1">
                              {[...Array(5)].map((_, i) => (
                                <svg
                                  key={i}
                                  className={`w-4 h-4 ${i < review.rating ? 'text-warning' : 'text-gray-300'}`}
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                              ))}
                            </div>
                          </div>
                          <p className="text-sm text-gray-700">{review.comment}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
