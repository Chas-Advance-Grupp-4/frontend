import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./AuthProvider";

type Props = {
	redirectTo?: string;
	roles?: string[];
	children?: React.ReactNode;
};

export default function ProtectedRoute({
	redirectTo = "/login",
	roles,
	children,
}: Props) {
	const { token, user, ready } = useAuth();

	if (!ready) return null;

	if (!token) {
		// Not logged in → go to login
		return <Navigate to={redirectTo} replace />;
	}

	if (roles && user && !roles.includes(user.role)) {
		// Logged in but not allowed → redirect to home (or forbidden)
		return <Navigate to="/" replace />;
	}

	// hybrid: render children if provided, otherwise <Outlet />
	return <>{children || <Outlet />}</>;
}
