export interface Shipment {
	shipment: string;
	sender_id: string;
	receiver_id: string;
	driver_id: string | null;
	id: string;
	created_at: string;
}
