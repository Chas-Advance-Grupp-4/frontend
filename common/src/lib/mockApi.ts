// mockApi.ts

import type { LoginResponse } from "../types/auth";

// Simulated DB
const mockUser = {
	id: "u-demo-1234-5678-9012", // UUID-like string
	username: "demo",
	password: "$2b$12$abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
	// hashed (dummy bcrypt hash)
	role: "customer" as const,
	created_at: "2025-09-28T10:00:00Z",
	email: "demo@example.com", // optional, if you still use it on FE
};

const mockParcels = [
	{
		id: "p1",
		sender_id: "s-restaurant-1",
		receiver_id: "u-demo",
		vehicle_id: "veh-101",
		created_at: "2025-09-28T14:30:00Z",
		status: "On the Way",
		last_temp: 5.2,
		last_humidity: 63.5,
		min_temp: 2.0,
		max_temp: 8.0,
		max_humidity: 75.0,
		last_seen_lat: 55.605293,
		last_seen_lon: 13.003822,
		last_seen_at: "2025-09-28T14:45:00Z",
		sender_name: "Rosegarden",
		pickup_address: "Köpenhamnsvägen 7, 217 43 Malmö",
		receiver_name: "Demo Customer",
		delivery_address: "Norra Vallgatan 12, 211 25 Malmö",
		eta: "15 mins",
	},
	{
		id: "p2",
		sender_id: "u-demo",
		receiver_id: "r-mcdonalds",
		vehicle_id: "veh-102",
		created_at: "2025-09-27T10:15:00Z",
		status: "Delivered",
		last_temp: 7.8,
		last_humidity: 59.1,
		min_temp: 4.0,
		max_temp: 9.0,
		max_humidity: 80.0,
		last_seen_lat: 55.604981,
		last_seen_lon: 13.003822,
		last_seen_at: "2025-09-27T12:00:00Z",
		sender_name: "Demo Customer",
		pickup_address: "Norra Vallgatan 12, 211 25 Malmö",
		receiver_name: "McDonalds",
		delivery_address: "Möllevångstorget 3, 214 24 Malmö",
		eta: "0 mins",
	},
	{
		id: "p3",
		sender_id: "s-max",
		receiver_id: "u-demo",
		vehicle_id: "veh-103",
		created_at: "2025-09-28T08:00:00Z",
		status: "Pending",
		last_temp: 4.3,
		last_humidity: 70.2,
		min_temp: 0.0,
		max_temp: 6.0,
		max_humidity: 85.0,
		last_seen_lat: 55.606321,
		last_seen_lon: 13.0021,
		last_seen_at: "2025-09-28T08:30:00Z",
		sender_name: "Max Hamburgare",
		pickup_address: "Mobilia, Per Albin Hanssons väg 40, 214 32 Malmö",
		receiver_name: "Demo Customer",
		delivery_address: "Norra Vallgatan 12, 211 25 Malmö",
		eta: "30 mins",
	},
	{
		id: "p4",
		sender_id: "u-demo",
		receiver_id: "s-freden",
		vehicle_id: "veh-104",
		created_at: "2025-09-28T09:45:00Z",
		status: "On the Way",
		last_temp: 6.1,
		last_humidity: 67.8,
		min_temp: 2.0,
		max_temp: 10.0,
		max_humidity: 78.0,
		last_seen_lat: 55.6035,
		last_seen_lon: 13.0002,
		last_seen_at: "2025-09-28T10:15:00Z",
		sender_name: "Demo Customer",
		pickup_address: "Norra Vallgatan 12, 211 25 Malmö",
		receiver_name: "Freden",
		delivery_address: "Spånehusvägen 81, 214 39 Malmö",
		eta: "20 mins",
	},
	{
		id: "p5",
		sender_id: "s-special",
		receiver_id: "u-demo",
		vehicle_id: "veh-105",
		created_at: "2025-09-28T07:20:00Z",
		status: "Delayed",
		last_temp: 9.4,
		last_humidity: 72.3,
		min_temp: 5.0,
		max_temp: 8.0,
		max_humidity: 70.0,
		last_seen_lat: 55.6077,
		last_seen_lon: 13.0109,
		last_seen_at: "2025-09-28T07:50:00Z",
		sender_name: "Pizzeria Special",
		pickup_address: "Amiralsgatan 90, 214 37 Malmö",
		receiver_name: "Demo Customer",
		delivery_address: "Norra Vallgatan 12, 211 25 Malmö",
		eta: "45 mins",
	},
];

// Simulated login
export async function login(
	username: string,
	password: string
): Promise<LoginResponse> {
	await new Promise((r) => setTimeout(r, 400));
	if (username !== "demo" || password !== "demo") {
		throw new Error("Invalid credentials");
	}
	return {
		access_token: "fake-token",
		user: mockUser,
	};
}

// Simulated /me endpoint
export async function me() {
	await new Promise((r) => setTimeout(r, 300));
	return {
		user: mockUser,
		parcels: mockParcels,
	};
}
