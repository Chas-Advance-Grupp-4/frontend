import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { useAuth } from "../hooks/auth/AuthProvider";
import { useNavigate } from "react-router-dom";
import LoginFormContainer from "../components/auth/LoginFormContainer";
import "@testing-library/jest-dom";

// Mock dependencies
vi.mock("../hooks/auth/AuthProvider", () => ({
	useAuth: vi.fn(),
	Input: (props: any) => <input {...props} />, // mock for Input component
	Button: (props: any) => <button {...props} />, // mock for Button
}));

vi.mock("react-router-dom", () => ({
	useNavigate: vi.fn(),
}));

// Mock LoginForm component used by LoginFormContainer
vi.mock("../components/auth/LoginForm", () => ({
	default: (props: any) => (
		<div>
			<input
				data-testid="username-input"
				value={props.username}
				onChange={(e) => props.onUsernameChange(e.target.value)}
			/>
			<input
				data-testid="password-input"
				value={props.password}
				onChange={(e) => props.onPasswordChange(e.target.value)}
			/>
			<button
				data-testid="submit-button"
				onClick={props.onSubmit}
				disabled={props.loading}
			>
				Submit
			</button>
			{props.error && <div data-testid="error-message">{props.error}</div>}
		</div>
	),
}));

describe("LoginFormContainer", () => {
	const mockLogin = vi.fn();
	const mockNavigate = vi.fn();

	beforeEach(() => {
		vi.clearAllMocks();
		(useAuth as jest.Mock).mockReturnValue({ login: mockLogin });
		(useNavigate as jest.Mock).mockReturnValue(mockNavigate);
	});

	it("renders the LoginForm with initial state", () => {
		render(<LoginFormContainer />);
		expect(screen.getByTestId("username-input")).toHaveValue("");
		expect(screen.getByTestId("password-input")).toHaveValue("");
		expect(screen.queryByTestId("error-message")).not.toBeInTheDocument();
	});

	it("updates username and password fields", () => {
		render(<LoginFormContainer />);
		const usernameInput = screen.getByTestId("username-input");
		const passwordInput = screen.getByTestId("password-input");

		fireEvent.change(usernameInput, { target: { value: "testuser" } });
		fireEvent.change(passwordInput, { target: { value: "password123" } });

		expect(usernameInput).toHaveValue("testuser");
		expect(passwordInput).toHaveValue("password123");
	});

	it("handles successful login", async () => {
		mockLogin.mockResolvedValueOnce(undefined);
		render(<LoginFormContainer />);

		fireEvent.change(screen.getByTestId("username-input"), {
			target: { value: "testuser" },
		});
		fireEvent.change(screen.getByTestId("password-input"), {
			target: { value: "password123" },
		});
		fireEvent.click(screen.getByTestId("submit-button"));

		expect(mockLogin).toHaveBeenCalledWith("testuser", "password123");
		await screen.findByTestId("submit-button");
		expect(mockNavigate).toHaveBeenCalledWith("/", { replace: true });
	});

	it("handles failed login", async () => {
		mockLogin.mockRejectedValueOnce(new Error("Invalid credentials"));
		render(<LoginFormContainer />);

		fireEvent.change(screen.getByTestId("username-input"), {
			target: { value: "testuser" },
		});
		fireEvent.change(screen.getByTestId("password-input"), {
			target: { value: "wrongpassword" },
		});
		fireEvent.click(screen.getByTestId("submit-button"));

		expect(mockLogin).toHaveBeenCalledWith("testuser", "wrongpassword");
		const errorMessage = await screen.findByTestId("error-message");
		expect(errorMessage).toHaveTextContent("Invalid credentials");
	});
});
