import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <header className="relative bg-[#161E54] text-white overflow-hidden">
      {/* Animated background shapes */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-secondary rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="animate-fadeInUp">
          <h1 className="text-5xl md:text-6xl font-extrabold leading-tight mb-4">
            Fix home problems{" "}
            <span className="relative inline-block">
              <span className="relative z-10">fast</span>
              <span className="absolute bottom-2 left-0 w-full h-4 bg-secondary/40 -z-0"></span>
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-white/90 mb-3 max-w-3xl mx-auto">
            Book trusted professionals for plumbing, electrical, cleaning, painting & more.
          </p>
          <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto">
            Available 24/7 • Verified Experts • Instant Booking
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              to="/services" 
              className="btn btn-primary bg-white text-primary hover:scale-105 hover:shadow-xl px-8 py-4 text-lg font-semibold"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Browse Services
            </Link>
            <a 
              href="#reviews" 
              className="px-8 py-4 rounded-xl border-2 border-white text-white font-semibold hover:bg-white/10 transition-all text-lg"
            >
              <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
              See Reviews
            </a>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-8 mt-16 max-w-3xl mx-auto">
          <div className="text-center">
            <div className="text-4xl font-bold mb-1">500+</div>
            <div className="text-white/80">Expert Providers</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold mb-1">10k+</div>
            <div className="text-white/80">Happy Customers</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold mb-1">4.8★</div>
            <div className="text-white/80">Average Rating</div>
          </div>
        </div>
      </div>
    </header>
  );
}
