import { useEffect, useState, useMemo } from "react";
import { getMyShipments } from "../../../common/src/lib/shipmentApi";
import type { Shipment } from "../../../common/src/types/shipment";
import Card from "../../../common/src/components/Card";
import { useAuth } from "../../../common/src/hooks/auth/AuthProvider";
import QRCodeDisplay from "../components/QRCodeDisplay";
import { ShipmentStatusBadge } from "../../../common/src/utils/shipmentStatus";
import { Link } from "react-router-dom";

export default function Deliveries() {
	const { user } = useAuth();
	const [shipments, setShipments] = useState<Shipment[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [tab, setTab] = useState<
		"pick-up" | "on-board" | "delivered" | "cancelled"
	>("pick-up");

	// Fetch shipments
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

	// bucket shipments for driver workflow
	const toPickUp = assignedToMe.filter(
		(s) => s.status === "created" || s.status === "assigned"
	);
	const inTransit = assignedToMe.filter((s) => s.status === "in_transit");
	const delivered = assignedToMe.filter((s) => s.status === "delivered");
	const cancelled = assignedToMe.filter((s) => s.status === "cancelled");

	if (loading) return <p className="text-center p-4">Loading deliveries…</p>;
	if (error) return <p className="text-center text-red-500">{error}</p>;
	if (assignedToMe.length === 0)
		return <p className="text-center p-4">No assigned deliveries 🚚</p>;

	/** Renders card like customer UI but driver-context-aware */
	const renderShipmentCard = (s: Shipment, showPickup: boolean) => (
		<Link key={s.id} to={`/deliveries/${s.id}`}>
			<Card
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
					<span className="font-medium">Status:</span>{" "}
					<ShipmentStatusBadge status={s.status} />
				</p>

				{s.min_temp !== null && s.max_temp !== null && (
					<p className="text-sm text-gray-600 mt-1">
						<span className="font-medium">Temp range:</span> {s.min_temp}°C –{" "}
						{s.max_temp}°C
					</p>
				)}

				{/* driver can always scan QR unless already delivered */}
				{s.status !== "delivered" && (
					<div className="mt-4 pt-2 border-t border-gray-200">
						<QRCodeDisplay
							value={s.qr_code_value || ""}
							shipment_number={s.shipment_number}
							onPrint={() => console.log(`Print QR for ${s.shipment_number}`)}
						/>
					</div>
				)}
			</Card>
		</Link>
	);

	// Tab mapping
	const tabs = {
		"pick-up": toPickUp,
		"on-board": inTransit,
		delivered: delivered,
		cancelled: cancelled,
	};

	return (
		<div className="p-6">
			<h1 className="text-2xl font-bold mb-6 text-center">
				Driver Deliveries 🚛
			</h1>

			{/* Tabs */}
			<div className="flex justify-center mb-6 space-x-4">
				{(Object.keys(tabs) as Array<keyof typeof tabs>).map((t) => (
					<button
						key={t}
						className={`px-4 py-2 rounded-t-lg ${
							tab === t
								? "font-bold underline underline-offset-8"
								: "text-gray-600"
						}`}
						onClick={() => setTab(t)}
					>
						{t === "pick-up" && `Pick-up (${toPickUp.length})`}
						{t === "on-board" && `On Board (${inTransit.length})`}
						{t === "delivered" && `Delivered (${delivered.length})`}
						{t === "cancelled" && `Cancelled (${cancelled.length})`}
					</button>
				))}
			</div>

			{/* Results grid */}
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 justify-items-around">
				{tabs[tab].length === 0 ? (
					<p className="text-sm text-gray-500">No shipments here</p>
				) : (
					tabs[tab].map((s) => renderShipmentCard(s, tab === "pick-up"))
				)}
			</div>
		</div>
	);
}
