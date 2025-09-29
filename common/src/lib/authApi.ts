import { http } from "./http";
import type { LoginResponse, User } from "../types/auth";

// export async function login(
//   username: string,
//   password: string
// ): Promise<LoginResponse> {
//   return http<LoginResponse>("/api/v1/auth/login", {
//     method: "POST",
//     body: JSON.stringify({ username, password }),
//   });
// }

// export async function me() {
//   return http("/api/v1/auth/me", { method: "GET" });
// }

// TEMP MOCK – remove once API is live
const demoUser: User = {
	id: "550e8400-e29b-41d4-a716-446655440000", // UUID
	username: "demo",
	email: "demo@example.com",
	role: "customer", // 👈 now fixed
	created_at: new Date("2025-01-01T12:00:00Z").toISOString(),
};

export async function login(
	username: string,
	password: string
): Promise<LoginResponse> {
	await new Promise((r) => setTimeout(r, 400)); // simulate delay
	if (username !== "demo" || password !== "demo") {
		throw new Error("Invalid credentials");
	}
	return {
		access_token: "fake-token",
		user: demoUser,
	};
}

export async function me(): Promise<User> {
	await new Promise((r) => setTimeout(r, 200));
	return demoUser;
}
