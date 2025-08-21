import { useAuth } from "@/context/AuthContext";
import { jwtDecode } from "jwt-decode";
import { useEffect, useMemo } from "react";
import { Navigate, Outlet, useNavigate } from "react-router";

// Define JWT payload type (extend if your token has more claims)
interface DecodedToken {
  exp: number; // expiration timestamp (seconds)
  iat?: number; // issued at timestamp (optional)
  [key: string]: unknown; // allow other claims
}

export default function ProtectedRoutes() {
  const { accessToken } = useAuth();
  const navigate = useNavigate();

  const storedToken = useMemo<string | null>(
    () => accessToken || localStorage.getItem("accessToken"),
    [accessToken]
  );

  const isTokenValid = (token: string | null): boolean => {
    if (!token) return false;
    try {
      const decoded = jwtDecode<DecodedToken>(token);
      return decoded.exp * 1000 > Date.now();
    } catch {
      return false;
    }
  };

  useEffect(() => {
    if (storedToken && !isTokenValid(storedToken)) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      navigate("/login");
    }
  }, [storedToken, navigate]);

  return isTokenValid(storedToken) ? <Outlet /> : <Navigate to="/login" />;
  // return 1? <Outlet /> : <Navigate to="/login" />;
}
