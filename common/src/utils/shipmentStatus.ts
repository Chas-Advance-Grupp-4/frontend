import type { ShipmentStatus } from "../types/shipment";

export function formatShipmentStatus(status: ShipmentStatus): string {
	switch (status) {
		case "created":
			return "Preparing shipment";
		case "assigned":
			return "Driver assigned";
		case "in_transit":
			return "In transit";
		case "delivered":
			return "Delivered";
		case "cancelled":
			return "Cancelled";
		default:
			return status;
	}
}

export function getShipmentStatusIcon(status: ShipmentStatus): string {
	switch (status) {
		case "created":
			return "📦";
		case "assigned":
			return "👷";
		case "in_transit":
			return "🚚";
		case "delivered":
			return "✅";
		case "cancelled":
			return "❌";
		default:
			return "";
	}
}

export function getShipmentStatusLabel(status: ShipmentStatus): string {
	return `${formatShipmentStatus(status)} ${getShipmentStatusIcon(status)}`;
}
