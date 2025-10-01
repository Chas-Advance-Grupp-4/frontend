import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AuthProvider, ProtectedRoute } from "@frontend/common";
import LoginPage from "../pages/LoginPage";
import HomePage from "../pages/HomePage";
import MyParcels from "../pages/MyParcels";
import CustomerLayout from "../components/layout/CustomerLayout";
import Scan from "../pages/ScanParcel";

const router = createBrowserRouter([
	{ path: "/login", element: <LoginPage /> },

	{
		element: <ProtectedRoute roles={["customer"]} redirectTo="/login" />,
		children: [
			{
				element: <CustomerLayout />,
				children: [
					{
						path: "/",
						element: <HomePage />,
					},
					{
						path: "/parcels",
						element: <MyParcels />,
					},
					{
						path: "/scan",
						element: <Scan />,
					},
					{
						path: "/notifications",
						element: <div className="p-4">Notifications (WIP)</div>,
					},
					{
						path: "/order",
						element: <div className="p-4">Order (WIP)</div>,
					},
					{
						path: "/settings",
						element: <div className="p-4">Settings (WIP)</div>,
					},
					{
						path: "/support",
						element: <div className="p-4">Support (WIP)</div>,
					},
				],
			},
		],
	},
]);

export default function AppRouter() {
	return (
		<AuthProvider storageKey="customer_auth">
			<RouterProvider router={router} />
		</AuthProvider>
	);
}
