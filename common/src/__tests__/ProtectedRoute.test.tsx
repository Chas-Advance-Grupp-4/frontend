import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { useAuth } from "@frontend/common";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "../hooks/auth/ProtectedRoute";

vi.mock("../hooks/auth/AuthProvider", () => ({
	useAuth: vi.fn(),
}));

describe("ProtectedRoute", () => {
	it("renders children when token is present", () => {
		(useAuth as vi.Mock).mockReturnValue({ token: "mock-token", ready: true });

		render(
			<MemoryRouter initialEntries={["/protected"]}>
				<Routes>
					<Route
						path="/protected"
						element={
							<ProtectedRoute>
								<div data-testid="protected-content">Protected</div>
							</ProtectedRoute>
						}
					/>
				</Routes>
			</MemoryRouter>
		);

		expect(screen.getByTestId("protected-content")).toBeInTheDocument();
	});

	it("redirects to /login when token is missing", () => {
		(useAuth as vi.Mock).mockReturnValue({ token: null, ready: true });

		render(
			<MemoryRouter initialEntries={["/protected"]}>
				<Routes>
					<Route
						path="/login"
						element={<div data-testid="login-page">Login</div>}
					/>
					<Route
						path="/protected"
						element={
							<ProtectedRoute>
								<div data-testid="protected-content">Protected</div>
							</ProtectedRoute>
						}
					/>
				</Routes>
			</MemoryRouter>
		);

		expect(screen.getByTestId("login-page")).toBeInTheDocument();
	});

	it("blocks access after logout", () => {
		// Logged in user should see protected content
		(useAuth as vi.Mock).mockReturnValueOnce({
			token: "mock-token",
			user: { id: "1", role: "customer" },
			ready: true,
		});

		const { rerender } = render(
			<MemoryRouter initialEntries={["/dashboard"]}>
				<ProtectedRoute>
					<div data-testid="protected-content">Protected</div>
				</ProtectedRoute>
			</MemoryRouter>
		);

		expect(screen.getByTestId("protected-content")).toBeInTheDocument();

		// Simulate logout
		(useAuth as vi.Mock).mockReturnValueOnce({
			token: null,
			ready: true,
		});

		rerender(
			<MemoryRouter initialEntries={["/dashboard"]}>
				<ProtectedRoute>
					<div data-testid="protected-content">Protected</div>
				</ProtectedRoute>
			</MemoryRouter>
		);

		// Check that protected content is gone
		expect(screen.queryByTestId("protected-content")).not.toBeInTheDocument();
	});
});
