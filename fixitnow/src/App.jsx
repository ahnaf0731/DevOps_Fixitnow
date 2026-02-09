import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Services from "./pages/Services";
import ServiceDetail from "./pages/ServiceDetail";
import BookingPage from "./pages/BookingPage";
import Dashboard from "./pages/Dashboard";
import ProviderDashboard from "./pages/ProviderDashboard";
import Profile from "./pages/Profile";
import Notifications from "./pages/Notifications";
import SelectProvider from "./pages/SelectProvider";


export const API_BASE_URL = "http://localhost:8090/api";


const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // { id, name, email, role, token }
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem("fixit_auth");
    if (saved) {
      try {
        setUser(JSON.parse(saved));
      } catch (e) {
        localStorage.removeItem("fixit_auth");
      }
    }
    setLoading(false);
  }, []);

  const login = (payload) => {
    setUser(payload);
    localStorage.setItem("fixit_auth", JSON.stringify(payload));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("fixit_auth");
  };

  const value = useMemo(() => ({ user, login, logout, setUser, loading }), [user, loading]);
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#ECECEC]">
        <div className="w-16 h-16 border-4 border-[#161E54] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

function PrivateRoute({ children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

function RoleBasedRoute({ customerElement, providerElement }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return user.role === 'provider' ? providerElement : customerElement;
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/services" element={<Services />} />
            <Route path="/services/:id" element={<ServiceDetail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/select-provider"
              element={
                <PrivateRoute>
                  <SelectProvider />
                </PrivateRoute>
              }
            />
            <Route
              path="/notifications"
              element={
                <PrivateRoute>
                  <Notifications />
                </PrivateRoute>
              }
            />
            <Route
              path="/booking"
              element={
                <PrivateRoute>
                  <BookingPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                <RoleBasedRoute 
                  customerElement={<Dashboard />}
                  providerElement={<ProviderDashboard />}
                />
              }
            />
            <Route
              path="/profile"
              element={
                <PrivateRoute>
                  <Profile />
                </PrivateRoute>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}
