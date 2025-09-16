// login(username, password), me()

// Keep it “pure” (no redirects), just return data/throw errors.

// import { http } from "./http";
// import type { LoginResponse } from "../types/auth";

// export async function login(
//   username: string,
//   password: string
// ): Promise<LoginResponse> {
//  return http<LoginResponse>("/auth/login", {
//    method: "POST",
//    body: JSON.stringify({ username, password }),
//  });
// }

// export async function me() {
//   return http("/auth/me", { method: "GET" });
// }

// TEMP MOCK – remove once API is live
export async function login(username: string, password: string) {
  await new Promise((r) => setTimeout(r, 400));
  if (username !== "demo" || password !== "demo") {
    throw new Error("Invalid credentials");
  }
  return {
    access_token: "fake-token",
    user: { id: "u1", email: "admin@example.com", role: "admin" as const },
  };
}
