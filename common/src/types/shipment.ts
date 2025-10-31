export type ShipmentStatus =
	| "created"
	| "assigned"
	| "in_transit"
	| "delivered"
	| "cancelled";

export interface Shipment {
	shipment_number: string;
	sender_id: string;
	receiver_id: string;
	driver_id: string | null;
	sensor_unit_id: string | null;
	id: string;
	created_at: string;
	status: ShipmentStatus;
	min_temp: number;
	max_temp: number;
	min_humidity: number;
	max_humidity: number;
	temperature: number | null;
	humidity: number | null;
	pickup_address: string;
	delivery_address: string;
}
