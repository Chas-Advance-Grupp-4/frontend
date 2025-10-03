import { http } from "./http";
import type { Shipment } from "../types/shipment";

/**
 * Fetch all shipments for the current logged-in user.
 * Calls backend GET /api/v1/shipments/me.
 */
export async function getShipmentsForCurrentUser(): Promise<Shipment[]> {
	return http<Shipment[]>("/api/v1/shipments/me", { method: "GET" });
}
