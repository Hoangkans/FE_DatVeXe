import { Navigate, useLocation } from "react-router-dom";
import { isAuthenticated } from "../services/auth/auth.service";
import { useEffect } from "react";

export default function RequireAuth({ children }) {
  const location = useLocation();
  const authenticated = isAuthenticated(); 

  useEffect(() => {
    if (!authenticated) {
      window.alert("Vui lòng đăng nhập để tiếp tục!");
    }
  }, [authenticated, location]); 

  if (!authenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}