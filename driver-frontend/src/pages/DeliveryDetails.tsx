import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
	getShipmentById,
	updateShipment,
} from "../../../common/src/lib/shipmentApi";
import type { Shipment } from "../../../common/src/types/shipment";
import { getShipmentStatusLabel } from "../../../common/src/utils/shipmentStatus";

export default function DeliveryDetails() {
	const { id } = useParams();
	const navigate = useNavigate();
	const [shipment, setShipment] = useState<Shipment | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [actionLoading, setActionLoading] = useState(false);

	useEffect(() => {
		if (!id) return;
		const fetchShipment = async () => {
			try {
				const data = await getShipmentById(id);
				setShipment(data);
			} catch (err) {
				console.error(err);
				setError("Could not load shipment");
			} finally {
				setLoading(false);
			}
		};
		fetchShipment();
	}, [id]);

	const handleStartDelivery = async () => {
		if (!shipment) return;
		setActionLoading(true);
		try {
			const updated = await updateShipment(shipment.id, {
				status: "in_transit",
			});
			setShipment(updated);
		} catch {
			alert("Failed to start delivery");
		}
		setActionLoading(false);
	};

	const handleMarkDelivered = async () => {
		if (!shipment) return;
		setActionLoading(true);
		try {
			const updated = await updateShipment(shipment.id, {
				status: "delivered",
			});
			setShipment(updated);
		} catch {
			alert("Failed to complete delivery");
		}
		setActionLoading(false);
	};

	if (loading) return <p className="p-4 text-center">Loading parcel…</p>;
	if (error || !shipment)
		return <p className="p-4 text-center text-red-500">{error}</p>;

	return (
		<div className="p-6 space-y-4">
			<button onClick={() => navigate(-1)} className="text-sm text-blue-600">
				← Back to deliveries
			</button>

			<h1 className="text-xl font-semibold">
				Parcel #{shipment.shipment_number}
			</h1>
			<p className="text-sm text-gray-600">
				Status:{" "}
				<span className="font-medium">
					{getShipmentStatusLabel(shipment.status)}
				</span>
			</p>

			<div className="grid gap-2 text-sm text-gray-700">
				<p>
					<span className="font-medium">Pickup:</span> {shipment.pickup_address}
				</p>
				<p>
					<span className="font-medium">Deliver to:</span>{" "}
					{shipment.delivery_address}
				</p>
				<p>
					<span className="font-medium">Created:</span>{" "}
					{new Date(shipment.created_at).toLocaleString()}
				</p>

				{shipment.min_temp != null && shipment.max_temp != null && (
					<p>
						<span className="font-medium">Temp range:</span> {shipment.min_temp}
						°C – {shipment.max_temp}°C
					</p>
				)}
			</div>

			{/* ACTION BUTTONS */}
			<div className="pt-4 space-y-2">
				{shipment.status === "assigned" && (
					<button
						className="w-full bg-blue-600 text-white py-2 rounded"
						disabled={actionLoading}
						onClick={handleStartDelivery}
					>
						{actionLoading ? "Starting delivery..." : "Start Delivery"}
					</button>
				)}

				{shipment.status === "in_transit" && (
					<button
						className="w-full bg-green-600 text-white py-2 rounded"
						disabled={actionLoading}
						onClick={handleMarkDelivered}
					>
						{actionLoading ? "Completing..." : "Mark as Delivered ✅"}
					</button>
				)}
			</div>
		</div>
	);
}
