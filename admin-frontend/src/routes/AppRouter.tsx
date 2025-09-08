import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HealthPage from "../pages/HealthPage";
import HomePage from "../pages/HomePage";
import LoginPage from "../pages/LoginPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/health",
    element: <HealthPage />,
  },
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}
