import { useEffect, useState, useMemo } from "react";
import { getMyShipments } from "../../../common/src/lib/shipmentApi";
import type { Shipment } from "../../../common/src/types/shipment";
import Card from "../../../common/src/components/Card";
import { useAuth } from "../../../common/src/hooks/auth/AuthProvider";
import { getShipmentStatusLabel } from "../../../common/src/utils/shipmentStatus";

export default function Deliveries() {
	const { user } = useAuth();
	const [shipments, setShipments] = useState<Shipment[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchShipments = async () => {
			try {
				const data = await getMyShipments();
				setShipments(data);
			} catch (err) {
				console.error(err);
				setError("Failed to load deliveries");
			} finally {
				setLoading(false);
			}
		};
		fetchShipments();
	}, []);

	// filter shipments for the driver
	const assignedToMe = useMemo(
		() => shipments.filter((s) => s.driver_id === user?.id),
		[shipments, user?.id]
	);

	if (assignedToMe.length === 0) {
		return <p className="text-center p-4">No assigned deliveries 🚚</p>;
	}

	// group shipments into categories
	// const toPickUp = assignedToMe.filter((s) => !s.sensor_unit_id);
	// const inTransit = assignedToMe.filter((s) => s.sensor_unit_id);
	// const delivered: Shipment[] = [];

	// Driver workflow views (correct lowercase statuses)
	const toPickUp = assignedToMe.filter(
		(s) => s.status === "created" || s.status === "assigned"
	);

	const inTransit = assignedToMe.filter((s) => s.status === "in_transit");
	const delivered = assignedToMe.filter((s) => s.status === "delivered");
	const cancelled = assignedToMe.filter((s) => s.status === "cancelled");

	if (loading) return <p className="text-center p-4">Loading deliveries…</p>;
	if (error) return <p className="text-center text-red-500">{error}</p>;

	const renderCard = (
		s: Shipment,
		role: "pickup" | "inTransit" | "history"
	) => (
		<Card
			key={s.id}
			title={s.shipment_number}
			subtitle={`Ordered: ${new Date(s.created_at).toLocaleDateString()}`}
		>
			{/* Pickup location */}
			{role !== "inTransit" && (
				<p className="text-sm text-gray-600 mb-1">
					<span className="font-medium">Pickup:</span> {s.pickup_address}
				</p>
			)}

			{/* Delivery location */}
			<p className="text-sm text-gray-600 mb-1">
				<span className="font-medium">Deliver to:</span> {s.delivery_address}
			</p>

			<p className="text-sm text-gray-600 mb-1">
				<span className="font-medium">Status:</span>{" "}
				{getShipmentStatusLabel(s.status)}
			</p>

			{s.min_temp !== null && s.max_temp !== null && (
				<p className="text-sm text-gray-600 mt-1">
					<span className="font-medium">Temperature range:</span> {s.min_temp}°C
					– {s.max_temp}°C
				</p>
			)}

			{s.min_temp !== null && s.max_temp !== null && (
				<p className="text-sm text-gray-600 mt-1">
					<span className="font-medium">Humidity range:</span> {s.min_humidity}{" "}
					– {s.max_humidity}
				</p>
			)}
		</Card>
	);

	return (
		<div className="p-6">
			{/* Pick-up */}
			<h2 className="text-xl font-semibold mt-6 mb-2">Pick-up</h2>
			{toPickUp.length === 0 ? (
				<p className="text-sm text-gray-500 mb-4">No parcels to pick up</p>
			) : (
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
					{toPickUp.map((s) => renderCard(s, "pickup"))}
				</div>
			)}

			{/* In transit */}
			<h2 className="text-xl font-semibold mt-8 mb-2">On Board</h2>
			{inTransit.length === 0 ? (
				<p className="text-sm text-gray-500 mb-4">
					No parcels currently in transit
				</p>
			) : (
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
					{inTransit.map((s) => renderCard(s, "inTransit"))}
				</div>
			)}

			{/* Delivered */}
			<h2 className="text-xl font-semibold mt-8 mb-2">Delivered</h2>
			{delivered.length === 0 ? (
				<p className="text-sm text-gray-500 mb-4">No delivered parcels yet</p>
			) : (
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
					{delivered.map((s) => renderCard(s, "history"))}
				</div>
			)}

			{/* Cancelled */}
			{cancelled.length > 0 && (
				<>
					<h2 className="text-xl font-semibold mt-8 mb-2 text-red-600">
						Cancelled
					</h2>
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
						{cancelled.map((s) => renderCard(s, "history"))}
					</div>
				</>
			)}
		</div>
	);
}
