import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AuthProvider } from "@frontend/common"; //ProtectedRoute
import LoginPage from "../pages/LoginPage";
import HealthPage from "../pages/HealthPage";
import HomePage from "../pages/HomePage";
import MyParcels from "../pages/MyParcels";
import CustomerLayout from "../components/layout/CustomerLayout";
import Scan from "../pages/ScanParcel";

const router = createBrowserRouter([
	{ path: "/login", element: <LoginPage /> },
	{ path: "/health", element: <HealthPage /> },

	// {
	// 	element: <ProtectedRoute redirectTo="/login" />,
	// 	children: [
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
				path: "/parcels",
				element: <MyParcels />,
			},
			{
				path: "/parcels",
				element: <MyParcels />,
			},
			{
				path: "/parcels",
				element: <MyParcels />,
			},
			// 	],
			// },
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
