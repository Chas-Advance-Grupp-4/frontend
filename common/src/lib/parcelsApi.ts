import type { Parcel } from "../types/parcel";
import { me } from "./authApi";

// TEMP MOCK – remove once API is live
const mockParcels: Parcel[] = [
	{
		id: "1111-aaaa",
		sender_id: "company-001",
		receiver_id: "u1", // demo user id
		vehicle_id: "veh-01",
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
		sender_name: "Deo Company",
		pickup_address: "Industrigatan 10, Malmö",
		receiver_name: "Demo User",
		delivery_address: "Köpenhamnsvägen 7, Malmö",
		eta: "15 mins",
	},
	{
		id: "2222-bbbb",
		sender_id: "u1",
		receiver_id: "company-001",
		vehicle_id: "veh-02",
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
		sender_name: "Demo User",
		pickup_address: "Testgatan 1, Malmö",
		receiver_name: "Deo Company",
		delivery_address: "Östra Förstadsgatan 12, Malmö",
		eta: "0 mins",
	},
	{
		id: "3333-cccc",
		sender_id: "company-001",
		receiver_id: "u1",
		vehicle_id: "veh-03",
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
		sender_name: "Deo Company",
		pickup_address: "Industrigatan 10, Malmö",
		receiver_name: "Demo User",
		delivery_address: "Davidshallstorg 3, Malmö",
		eta: "30 mins",
	},
	{
		id: "4444-dddd",
		sender_id: "u1",
		receiver_id: "company-001",
		vehicle_id: "veh-04",
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
		sender_name: "Demo User",
		pickup_address: "Testgatan 2, Malmö",
		receiver_name: "Deo Company",
		delivery_address: "Stora Nygatan 59, Malmö",
		eta: "45 mins",
	},
];

/**
 * Returns parcels for the logged-in user.
 * Uses authApi.me() to fetch the current user.
 */
export async function getParcelsForCurrentUser(): Promise<Parcel[]> {
	// When API is live:
	// return http<Parcel[]>("/api/v1/parcels/me");

	// For now: mock
	const user = await me();
	await new Promise((r) => setTimeout(r, 300)); // simulate delay

	return mockParcels.filter(
		(p) => p.sender_id === user.id || p.receiver_id === user.id
	);
}
