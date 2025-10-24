import React from "react";
import { http } from "./http";
import type { LoginResponse, User } from "../types/auth";

export async function login(
	username: string,
	password: string
): Promise<LoginResponse> {
	return http<LoginResponse>("/api/v1/auth/login", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ username, password }),
	});
}

export async function me(): Promise<User> {
	return http<User>("/api/v1/users/me", { method: "GET" });
}
