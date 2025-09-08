import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AuthProvider, ProtectedRoute } from "@frontend/common";
import LoginPage from "../pages/LoginPage";

// demo page
function Dashboard() {
  return <div style={{ padding: 16 }}>Admin dashboard (protected)</div>;
}

const router = createBrowserRouter([
  { path: "/login", element: <LoginPage /> },
  {
    element: <ProtectedRoute redirectTo="/login" />,
    children: [{ path: "/dashboard", element: <Dashboard /> }],
  },
  { path: "/", element: <LoginPage /> },
]);

export default function AppRouter() {
  return (
    <AuthProvider storageKey="admin_auth">
      <RouterProvider router={router} />
    </AuthProvider>
  );
}
