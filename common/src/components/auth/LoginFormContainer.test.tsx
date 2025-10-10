import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { useAuth } from "@frontend/common";
import { useNavigate } from "react-router-dom";
import LoginFormContainer from "./LoginFormContainer";

vi.mock("@frontend/common", () => ({
	useAuth: vi.fn(),
}));

vi.mock("react-router-dom", () => ({
	useNavigate: vi.fn(),
}));

vi.mock("./LoginForm", () => ({
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
		(useAuth as vi.Mock).mockReturnValue({ login: mockLogin });
		(useNavigate as vi.Mock).mockReturnValue(mockNavigate);
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

		const usernameInput = screen.getByTestId("username-input");
		const passwordInput = screen.getByTestId("password-input");
		const submitButton = screen.getByTestId("submit-button");

		fireEvent.change(usernameInput, { target: { value: "testuser" } });
		fireEvent.change(passwordInput, { target: { value: "password123" } });
		fireEvent.click(submitButton);

		expect(mockLogin).toHaveBeenCalledWith("testuser", "password123");
		await screen.findByTestId("submit-button");
		expect(mockNavigate).toHaveBeenCalledWith("/", { replace: true });
	});

	it("handles failed login", async () => {
		mockLogin.mockRejectedValueOnce(new Error("Invalid credentials"));
		render(<LoginFormContainer />);

		const usernameInput = screen.getByTestId("username-input");
		const passwordInput = screen.getByTestId("password-input");
		const submitButton = screen.getByTestId("submit-button");

		fireEvent.change(usernameInput, { target: { value: "testuser" } });
		fireEvent.change(passwordInput, { target: { value: "wrongpassword" } });
		fireEvent.click(submitButton);

		expect(mockLogin).toHaveBeenCalledWith("testuser", "wrongpassword");
		const errorMessage = await screen.findByTestId("error-message");
		expect(errorMessage).toHaveTextContent("Invalid credentials");
	});
});
