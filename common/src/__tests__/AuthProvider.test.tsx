import React from "react";
import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { AuthProvider, useAuth } from "../hooks/auth/AuthProvider";
import type { User } from "../types/auth";
import { setJSON, remove, getJSON } from "../lib/storage";

vi.mock("../lib/authApi", () => ({
	login: vi.fn(),
	me: vi.fn(),
}));

vi.mock("../lib/storage", () => ({
	getJSON: vi.fn(),
	setJSON: vi.fn(),
	remove: vi.fn(),
}));

vi.mock("jwt-decode", () => ({
	jwtDecode: vi.fn(() => ({ exp: Date.now() / 1000 + 3600 })),
}));

import * as authApi from "../lib/authApi";
const { login: mockLogin, me: mockMe } = authApi as {
	login: jest.Mock;
	me: jest.Mock;
};
import * as storage from "../lib/storage";

describe("AuthProvider", () => {
	const mockUser = {
		id: "1",
		username: "user1",
		role: "customer",
		created_at: "2025-10-13T13:04:49.000Z",
	};

	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("logs in and stores token + user in storage", async () => {
		mockLogin.mockResolvedValueOnce({
			access_token: "mock-token",
			token_type: "bearer",
		});
		mockMe.mockResolvedValueOnce(mockUser);

		const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider });

		await act(async () => {
			await result.current.login("user1", "password123");
		});

		expect(result.current.token).toBe("mock-token");
		expect(result.current.user).toEqual(mockUser);

		// Match (key, value, prefix)
		expect(setJSON).toHaveBeenCalledWith(
			"session",
			{
				token: "mock-token",
				user: mockUser,
			},
			expect.any(String) // matches "auth" or any custom storageKey
		);
	});

	it("logout clears token + user + removes session", async () => {
		const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider });

		await act(async () => {
			result.current.logout();
		});

		expect(result.current.token).toBeNull();
		expect(result.current.user).toBeNull();

		expect(remove).toHaveBeenCalledWith("session", expect.any(String));
	});
});

it("restores session from storage on mount if valid token", async () => {
	const mockUser = {
		id: "1",
		username: "restoredUser",
		role: "customer",
		created_at: new Date().toISOString(),
	};

	// Mock stored session
	(getJSON as jest.Mock).mockReturnValue({
		token: "stored-token",
		user: mockUser,
	});

	// jwtDecode returns a valid token (not expired)
	const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider });

	expect(result.current.token).toBe("stored-token");
	expect(result.current.user).toEqual(mockUser);
	expect(result.current.ready).toBe(true);
});
