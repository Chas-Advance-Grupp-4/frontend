import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AuthProvider } from "../../../common/src/hooks/auth/AuthProvider";
import ProtectedRoute from "../../../common/src/hooks/auth/ProtectedRoute";
import LoginPage from "../pages/LoginPage";
import AdminLayout from "../components/layout/AdminLayout";
import DashboardPage from "../pages/DashboardPage";
import UserManagementPage from "../pages/UserManagementPage";

const router = createBrowserRouter([
	{ path: "/login", element: <LoginPage /> },

	{
		element: <ProtectedRoute roles={["admin"]} redirectTo="/login" />,
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
						path: "/users",
						element: <UserManagementPage />,
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
