import { Navigate, useLocation } from "react-router-dom";
import { isAuthenticated, hasRole } from "../services/auth/auth.service";

export default function RequireAdmin({ children }) {
  const location = useLocation();

  if (!isAuthenticated()) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!hasRole("ROLE_ADMIN")) {
    return <Navigate to="/" replace state={{ from: location, error: "forbidden" }} />;
  }

  return children;
}

