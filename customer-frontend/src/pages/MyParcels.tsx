import { useEffect, useState, useMemo } from "react";
import { getMyShipments } from "../../../common/src/lib/shipmentApi";
import type {
	Shipment,
	ShipmentStatus,
} from "../../../common/src/types/shipment";
import Card from "../../../common/src/components/Card";
import { useAuth } from "../../../common/src/hooks/auth/AuthProvider";
import { getShipmentStatusLabel } from "../../../common/src/utils/shipmentStatus";

export default function MyParcels() {
	const { user } = useAuth();
	const [shipments, setShipments] = useState<Shipment[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [tab, setTab] = useState<"expecting" | "sending" | "history">(
		"expecting"
	);

	// filter shipments by perspective
	const expecting = useMemo(
		() => shipments.filter((s) => s.receiver_id === user?.id),
		[shipments, user?.id]
	);

	const sending = useMemo(
		() => shipments.filter((s) => s.sender_id === user?.id),
		[shipments, user?.id]
	);

	const history = useMemo(
		() =>
			shipments.filter(
				(s) =>
					(s.receiver_id === user?.id || s.sender_id === user?.id) &&
					["delivered", "cancelled"].includes(s.status)
			),
		[shipments, user?.id]
	);

	useEffect(() => {
		const fetchShipments = async () => {
			try {
				const data = await getMyShipments();
				setShipments(data);
			} catch (err) {
				console.error(err);
				setError("Failed to load shipments");
			} finally {
				setLoading(false);
			}
		};
		fetchShipments();
	}, []);

	if (loading) return <p className="text-center p-4">Loading parcels…</p>;
	if (error) return <p className="text-center text-red-500">{error}</p>;
	if (shipments.length === 0)
		return (
			<p className="text-center p-4">You don't have any parcels to view 📭</p>
		);

	const renderShipmentCard = (
		s: Shipment,
		type: "expecting" | "sending" | "history"
	) => (
		<Card
			key={s.id}
			title={s.shipment_number}
			subtitle={`Ordered: ${new Date(s.created_at).toLocaleDateString()}`}
		>
			{/* From */}
			{type !== "sending" && (
				<p className="text-sm text-gray-600 mb-1">
					<span className="font-medium">From:</span> {s.pickup_address}
				</p>
			)}

			{/* To */}
			{type !== "expecting" && (
				<p className="text-sm text-gray-600 mb-1">
					<span className="font-medium">To:</span> {s.delivery_address}
				</p>
			)}

			{/* Status */}
			<p className="text-sm text-gray-600 mb-1">
				<span className="font-medium">Status:</span>{" "}
				{getShipmentStatusLabel(s.status)}
			</p>

			{/* Temp range */}
			{s.min_temp !== null && s.max_temp !== null && (
				<p className="text-sm text-gray-600 mt-1">
					<span className="font-medium">Temp range:</span> {s.min_temp}°C –{" "}
					{s.max_temp}°C
				</p>
			)}
		</Card>
	);

	return (
		<div className="p-6">
			<h1 className="text-2xl font-bold mb-6 text-center">My Parcels 📦</h1>

			{/* Tabs */}
			<div className="flex justify-center mb-6 space-x-4">
				{(["expecting", "sending", "history"] as const).map((val) => (
					<button
						key={val}
						className={`px-4 py-2 rounded-t-lg ${
							tab === val ? "font-bold underline underline-offset-8" : ""
						}`}
						onClick={() => setTab(val)}
					>
						{val === "expecting" && "Expecting"}
						{val === "sending" && "Sending"}
						{val === "history" && "History"}
					</button>
				))}
			</div>

			{/* Tab content */}
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 justify-items-around">
				{tab === "expecting" &&
					(expecting.length === 0 ? (
						<p className="text-sm text-gray-500">No incoming parcels</p>
					) : (
						expecting.map((s) => renderShipmentCard(s, "expecting"))
					))}

				{tab === "sending" &&
					(sending.length === 0 ? (
						<p className="text-sm text-gray-500">
							You are not sending any parcels.
						</p>
					) : (
						sending.map((s) => renderShipmentCard(s, "sending"))
					))}

				{tab === "history" &&
					(history.length === 0 ? (
						<p className="text-sm text-gray-500">No history</p>
					) : (
						history.map((s) => renderShipmentCard(s, "history"))
					))}
			</div>
		</div>
	);
}
