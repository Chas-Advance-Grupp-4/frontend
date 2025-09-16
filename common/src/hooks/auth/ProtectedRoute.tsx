// guards nested routes; accepts optional redirectTo="/login" prop

import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./AuthProvider";

export default function ProtectedRoute({
  redirectTo = "/login",
}: {
  redirectTo?: string;
}) {
  const { token, ready } = useAuth();
  if (!ready) return null; // or loader
  return token ? <Outlet /> : <Navigate to={redirectTo} replace />;
}
