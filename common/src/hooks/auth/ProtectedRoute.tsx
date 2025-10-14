import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./AuthProvider";

type Props = {
	redirectTo?: string;
	roles?: string[]; // allowed roles, e.g. ["admin"]
};

export default function ProtectedRoute({
	redirectTo = "/login",
	roles,
}: Props) {
	const { token, user, ready } = useAuth();

	if (!ready) return null;

	if (!token) {
		// Not logged in → go to login
		return <Navigate to={redirectTo} replace />;
	}

	if (roles && user && !roles.includes(user.role)) {
		// Logged in, but role not allowed → send to "forbidden" or homepage
		return <Navigate to="/" replace />;
	}

	return <Outlet />;
}
