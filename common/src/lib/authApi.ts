import { http } from "./http";
import type { LoginResponse, User } from "../types/auth";

// Login returns JWT + user info
export async function login(
	username: string,
	password: string
): Promise<LoginResponse> {
	return http<LoginResponse>("/api/v1/auth/login", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ username, password }),
	});
}

// Me fetches the current logged-in user
export async function me(): Promise<User> {
	return http<User>("/api/v1/auth/me", { method: "GET" });
}

// TEMP MOCK – remove once API is live
// export async function login(username: string, password: string) {
//  await new Promise((r) => setTimeout(r, 400));
//  if (username !== "demo" || password !== "demo") {
//    throw new Error("Invalid credentials");
//  }
//  return {
//    access_token: "fake-token",
//    user: { id: "u1", email: "admin@example.com", role: "admin" as const },
//  };
// }
