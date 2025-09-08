import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AuthProvider, ProtectedRoute } from "@frontend/common";
import LoginPage from "../pages/LoginPage";
import HealthPage from "../pages/HealthPage";
import AdminLayout from "../components/layout/AdminLayout";
import ShipmentsPage from "../pages/ShipmentsPage";

const router = createBrowserRouter([
  { path: "/login", element: <LoginPage /> },
  { path: "/health", element: <HealthPage /> },

  {
    element: <ProtectedRoute redirectTo="/login" />,
    children: [
      {
        element: <AdminLayout />, // << navbar lives here
        children: [
          { path: "/", element: <ShipmentsPage /> }, // or DashboardPage
          {
            path: "/dashboard",
            element: <div className="p-4">Dashboard (WIP)</div>,
          },
          { path: "/shipments", element: <ShipmentsPage /> },
          { path: "/alerts", element: <div className="p-4">Alerts (WIP)</div> },
          {
            path: "/vehicles",
            element: <div className="p-4">Vehicles (WIP)</div>,
          },
          {
            path: "/customers",
            element: <div className="p-4">Customers (WIP)</div>,
          },
          {
            path: "/analytics",
            element: <div className="p-4">Analytics (WIP)</div>,
          },
        ],
      },
    ],
  },
]);

export default function AppRouter() {
  return (
    <AuthProvider storageKey="admin_auth">
      <RouterProvider router={router} />
    </AuthProvider>
  );
}
