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
});
