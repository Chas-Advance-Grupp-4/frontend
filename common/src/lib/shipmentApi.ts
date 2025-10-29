import React from "react";
import { http } from "./http";
import type { Shipment } from "../types/shipment";

/**
 * Fetch all shipments for the current logged-in user.
 * Calls backend GET /api/v1/shipments/me.
 */
export async function getShipmentsForCurrentUser(): Promise<Shipment[]> {
	return http<Shipment[]>("/v1/shipments/me", { method: "GET" });
}

/**
 * Fetch all shipments for the current logged-in user.
 * Calls backend GET /api/v1/shipments
 */
export async function getAllShipments(): Promise<Shipment[]> {
	return http<Shipment[]>("/v1/shipments", { method: "GET" });
}
