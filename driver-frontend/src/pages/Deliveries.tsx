import { useEffect, useState, useMemo } from "react";
import { getMyShipments } from "../../../common/src/lib/shipmentApi";
import type { Shipment, ShipmentStatus } from "../../../common/src/types/shipment";
import Card from "../../../common/src/components/Card";
import { useAuth } from "../../../common/src/hooks/auth/AuthProvider";
import QRCodeDisplay from "../components/QRCodeDisplay";
import { getShipmentStatusLabel } from "../../../common/src/utils/shipmentStatus";

export default function Deliveries() {
	const { user } = useAuth();
	const [shipments, setShipments] = useState<Shipment[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (!user) return;

		const fetchShipments = async () => {
			try {
				const data = await getMyShipments();
				const withQR = data.map((s) => ({
					...s,
					qr_code_value: s.qr_code_value ?? `parcel:${s.id}`,
				}));
				setShipments(withQR);
			} catch (err: any) {
				console.error(err);
				setError("Failed to load deliveries");
			} finally {
				setLoading(false);
			}
		};

		fetchShipments();
	}, [user]);

	const assignedToMe = useMemo(
		() => shipments.filter((s) => s.driver_id === user?.id),
		[shipments, user?.id]
	);

	const toPickUp = assignedToMe.filter((s) => s.status === "created" || s.status === "assigned");
	const inTransit = assignedToMe.filter((s) => s.status === "in_transit");
	const delivered = assignedToMe.filter((s) => s.status === "delivered");
	const cancelled = assignedToMe.filter((s) => s.status === "cancelled");

	if (loading) return <p className="text-center p-4">Loading deliveries…</p>;
	if (error) return <p className="text-center text-red-500">{error}</p>;
	if (assignedToMe.length === 0) return <p className="text-center p-4">No assigned deliveries 🚚</p>;

	const statusBadge = (status: ShipmentStatus) => {
		const map: Record<ShipmentStatus, string> = {
			created: "bg-yellow-100 text-yellow-800",
			assigned: "bg-blue-100 text-blue-800",
			in_transit: "bg-indigo-100 text-indigo-800",
			delivered: "bg-green-100 text-green-800",
			cancelled: "bg-red-100 text-red-800",
		};
		const classes = map[status] ?? "bg-gray-100 text-gray-800";

		return (
			<span className={`px-2 py-1 rounded-full text-xs font-medium ${classes}`}>
				{getShipmentStatusLabel(status)}
			</span>
		);
	};

	const renderCard = (s: Shipment, showPickup: boolean) => (
		<Card
			key={s.id}
			title={s.shipment_number}
			subtitle={`Ordered: ${new Date(s.created_at).toLocaleDateString()}`}
		>
			{showPickup && (
				<p className="text-sm text-gray-600 mb-1">
					<span className="font-medium">Pickup:</span> {s.pickup_address}
				</p>
			)}

			<p className="text-sm text-gray-600 mb-1">
				<span className="font-medium">Deliver to:</span> {s.delivery_address}
			</p>

			<p className="text-sm text-gray-600 mb-1 flex items-center gap-2">
				<span className="font-medium">Status:</span> {statusBadge(s.status)}
			</p>

			{s.min_temp !== null && s.max_temp !== null && (
				<p className="text-sm text-gray-600 mt-1">
					<span className="font-medium">Temp:</span> {s.min_temp}°C – {s.max_temp}°C
				</p>
			)}

			{/* QR Code for pickup/in-transit only */}
			{s.status !== "delivered" && (
				<div className="mt-4 pt-2 border-t border-gray-200">
					<QRCodeDisplay
						value={s.qr_code_value}
						shipment_number={s.shipment_number}
						onPrint={() => window.print()}
					/>
				</div>
			)}
		</Card>
	);

	return (
		<div className="p-6">
			<h1 className="text-2xl font-bold mb-6 text-center">Driver Deliveries 🚛</h1>

			{/* Pick-up */}
			<h2 className="text-xl font-semibold mt-6 mb-2">Pick-up</h2>
			{toPickUp.length === 0 ? <p className="text-sm text-gray-500 mb-4">No parcels to pick up</p> :
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
					{toPickUp.map((s) => renderCard(s, true))}
				</div>}

			{/* In Transit */}
			<h2 className="text-xl font-semibold mt-8 mb-2">On Board</h2>
			{inTransit.length === 0 ? <p className="text-sm text-gray-500 mb-4">No parcels currently in transit</p> :
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
					{inTransit.map((s) => renderCard(s, false))}
				</div>}

			{/* Delivered */}
			<h2 className="text-xl font-semibold mt-8 mb-2">Delivered</h2>
			{delivered.length === 0 ? <p className="text-sm text-gray-500 mb-4">No delivered parcels yet</p> :
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
					{delivered.map((s) => renderCard(s, false))}
				</div>}

			{/* Cancelled */}
			{cancelled.length > 0 && (
				<>
					<h2 className="text-xl font-semibold mt-8 mb-2 text-red-600">Cancelled</h2>
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
						{cancelled.map((s) => renderCard(s, false))}
					</div>
				</>
			)}
		</div>
	);
}