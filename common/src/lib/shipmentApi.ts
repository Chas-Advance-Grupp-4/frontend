import { http } from "./http";
import type { Shipment } from "../types/shipment";

/**
 * Get shipments for current user (driver/customer)
 * GET /api/v1/shipments/me
 */
export async function getMyShipments(): Promise<Shipment[]> {
	return http<Shipment[]>("/v1/shipments/me", { method: "GET" });
}

/**
 * Get shipments for current user including latest sensor data
 * GET /api/v1/shipments/me/all
 */
export async function getMyShipmentsWithSensorData(): Promise<Shipment[]> {
	return http<Shipment[]>("/v1/shipments/me/all", { method: "GET" });
}

/**
 * Get all shipments (admin only)
 * GET /api/v1/shipments
 */
export async function getAllShipments(): Promise<Shipment[]> {
	return http<Shipment[]>("/v1/shipments", { method: "GET" });
}

/**
 * Get all shipments with latest sensor data (admin only)
 * GET /api/v1/shipments/all
 */
export async function getAllShipmentsWithSensorData(): Promise<Shipment[]> {
	return http<Shipment[]>("/v1/shipments/all", { method: "GET" });
}

/**
 * Get shipment by ID
 * GET /api/v1/shipments/{shipmentId}
 */
export async function getShipmentById(shipmentId: string): Promise<Shipment> {
	return http<Shipment>(`/v1/shipments/${shipmentId}`, { method: "GET" });
}

/**
 * Get shipment by ID with latest temperature + humidity
 * GET /api/v1/shipments/all/{shipmentId}
 */
export async function getShipmentWithSensorData(
	shipmentId: string
): Promise<Shipment> {
	return http<Shipment>(`/v1/shipments/all/${shipmentId}`, { method: "GET" });
}

/**
 * Update shipment (allowed roles: driver/customer/admin)
 * PATCH /api/v1/shipments/{shipmentId}
 */
export async function updateShipment(
	shipmentId: string,
	data: Partial<Shipment>
): Promise<Shipment> {
	return http<Shipment>(`/v1/shipments/${shipmentId}`, {
		method: "PATCH",
		body: JSON.stringify(data),
	});
}

/**
 * Update ALL fields on shipment (admin only)
 * PATCH /api/v1/shipments/update-all/{shipmentId}
 */
export async function adminUpdateAllShipmentFields(
	shipmentId: string,
	data: Partial<Shipment>
): Promise<Shipment> {
	return http<Shipment>(`/v1/shipments/update-all/${shipmentId}`, {
		method: "PATCH",
		body: JSON.stringify(data),
	});
}

/**
 * Create new shipment (admin or customer)
 * POST /api/v1/shipments
 */
export async function createShipment(
	shipmentData: Partial<Shipment>
): Promise<Shipment> {
	return http<Shipment>("/v1/shipments", {
		method: "POST",
		body: JSON.stringify(shipmentData),
	});
}

/**
 * Delete shipment (admin only)
 * DELETE /api/v1/shipments/{shipmentId}
 */
export async function deleteShipment(shipmentId: string): Promise<void> {
	return http<void>(`/v1/shipments/${shipmentId}`, {
		method: "DELETE",
	});
}
