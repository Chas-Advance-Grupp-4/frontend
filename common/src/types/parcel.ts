export type Parcel = {
	id: string;
	sender_id: string;
	receiver_id: string;
	vehicle_id: string;
	created_at: string;
	status: string;
	last_temp: number;
	last_humidity: number;
	min_temp: number;
	max_temp: number;
	max_humidity: number;
	last_seen_lat: number;
	last_seen_lon: number;
	last_seen_at: string;

	sender_name: string;
	pickup_address: string;
	receiver_name: string;
	delivery_address: string;
	eta: string;
};
