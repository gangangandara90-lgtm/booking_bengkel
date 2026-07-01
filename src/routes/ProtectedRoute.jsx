import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

function ProtectedRoute({ children, role = "admin" }) {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    const to = role === "pelanggan" ? "/pelanggan/login" : "/admin/login";
    return <Navigate to={to} state={{ from: location.pathname }} replace />;
  }

  if (role && user?.role !== role) {
    const to = user?.role === "pelanggan" ? "/pelanggan/dashboard" : "/admin/dashboard";
    return <Navigate to={to} replace />;
  }

  return children;
}

export default ProtectedRoute;
