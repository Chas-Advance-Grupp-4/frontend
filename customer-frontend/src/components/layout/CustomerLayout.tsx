import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HealthPage from "../pages/HealthPage";
import HomePage from "../pages/HomePage";
import LoginPage from "../pages/LoginPage";

const router = createBrowserRouter([
	{ path: "/login", element: <LoginPage /> },
	{ path: "/health", element: <HealthPage /> },

	{
		element: <ProtectedRoute redirectTo="/login" />,
		children: [
			{
				element: <CustomerLayout />,
				children: [
					{
						path: "/",
						element: <DashboardPage />,
					},
					{
						path: "/shipments",
						element: <div className="p-4">Shipments (WIP)</div>,
					},
					{
						path: "/customers",
						element: <div className="p-4">Customers (WIP)</div>,
					},
					{
						path: "/notifications",
						element: <div className="p-4">Notifications (WIP)</div>,
					},
				],
			},
		],
	},
]);

export default function AppRouter() {
	return <RouterProvider router={router} />;
}
