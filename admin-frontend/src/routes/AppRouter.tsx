import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AuthProvider, ProtectedRoute } from "@frontend/common";
import LoginPage from "../pages/LoginPage";
import AdminLayout from "../components/layout/AdminLayout";
import DashboardPage from "../pages/DashboardPage";

const router = createBrowserRouter([
	{ path: "/login", element: <LoginPage /> },

	{
		element: <ProtectedRoute redirectTo="/login" />,
		children: [
			{
				element: <AdminLayout />,
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
	return (
		<AuthProvider storageKey="admin_auth">
			<RouterProvider router={router} />
		</AuthProvider>
	);
}
