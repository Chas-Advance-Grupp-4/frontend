export type ShipmentStatus =
  | "CREATED"
  | "ASSIGNED"
  | "IN_TRANSIT"
  | "DELIVERED"
  | "CANCELLED";

export interface Shipment {
	shipment_number: string;
	sender_id: string;
	receiver_id: string;
	driver_id: string | null;
	id: string;
	created_at: string;
	sensor_unit_id?: string | null;
	status: ShipmentStatus;
}
