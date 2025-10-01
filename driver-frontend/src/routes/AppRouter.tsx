import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AuthProvider, ProtectedRoute } from "@frontend/common";
import LoginPage from "../pages/LoginPage";
import HomePage from "../pages/HomePage";
import DriverLayout from "../components/layout/DriverLayout";
import ScanParcel from "../pages/ScanParcel";
import NotificationsPage from "@/pages/NotificationsPage";

const router = createBrowserRouter([
	{ path: "/login", element: <LoginPage /> },

	{
		element: <ProtectedRoute roles={["driver"]} redirectTo="/login" />,
		children: [
			{
				element: <DriverLayout />,
				children: [
					{
						path: "/",
						element: <HomePage />,
					},
					{
						path: "/scan",
						element: <ScanParcel />,
					},
					{
						path: "/notifications",
						element: <NotificationsPage />,
					},

					{
						path: "/settings",
						element: <div className="p-4">Settings (WIP)</div>,
					},
				],
			},
		],
	},
]);

export default function AppRouter() {
	return (
		<AuthProvider storageKey="driver_auth">
			<RouterProvider router={router} />
		</AuthProvider>
	);
}
