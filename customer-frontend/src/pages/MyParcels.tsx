import React, { useEffect, useState } from "react";
import { getShipmentsForCurrentUser } from "@frontend/common/src/lib/shipmentApi";
import type { Shipment } from "@frontend/common/src/types/shipment";
import Card from "@frontend/common/src/components/Card";
import { useAuth } from "@frontend/common";

export default function MyParcels() {
	const { user } = useAuth();
	const [shipments, setShipments] = useState<Shipment[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchShipments = async () => {
			try {
				const data = await getShipmentsForCurrentUser();
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

	if (loading) {
		return <p className="text-center p-4">Loading parcels…</p>;
	}

	if (error) {
		return <p className="text-center text-red-500">{error}</p>;
	}

	if (shipments.length === 0) {
		return <p className="text-center p-4">You have no parcels to view 📭</p>;
	}
	// Separate shipments into "expecting" and "sent"
	const expecting = shipments.filter((s) => s.receiver_id === user?.id);
	const sent = shipments.filter((s) => s.sender_id === user?.id);

	return (
		<div className="p-6">
			<h1 className="text-2xl font-bold mb-6 text-center">My Parcels 📦</h1>

			{/* Expecting */}
			<h2 className="text-xl font-semibold mt-6 mb-2">Expecting</h2>
			{expecting.length === 0 ? (
				<p className="text-sm text-gray-500 mb-4">No incoming parcels</p>
			) : (
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 justify-items-around">
					{expecting.map((s) => (
						<Card
							key={s.id}
							title={s.shipment}
							subtitle={`Created: ${new Date(
								s.created_at
							).toLocaleDateString()}`}
						>
							<p className="text-sm text-gray-600">
								<strong>From:</strong> {s.sender_id.slice(0, 8)}…
							</p>
							{s.driver_id && (
								<p className="text-sm text-gray-600">
									<strong>Driver:</strong> {s.driver_id.slice(0, 8)}…
								</p>
							)}
						</Card>
					))}
				</div>
			)}

			{/* Sent */}
			<h2 className="text-xl font-semibold mt-8 mb-2">Sent by me</h2>
			{sent.length === 0 ? (
				<p className="text-sm text-gray-500 mb-4">No sent parcels</p>
			) : (
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 justify-items-around">
					{sent.map((s) => (
						<Card
							key={s.id}
							title={s.shipment}
							subtitle={`Created: ${new Date(
								s.created_at
							).toLocaleDateString()}`}
						>
							<p className="text-sm text-gray-600">
								<strong>To:</strong> {s.receiver_id.slice(0, 8)}…
							</p>
							{s.driver_id && (
								<p className="text-sm text-gray-600">
									<strong>Driver:</strong> {s.driver_id.slice(0, 8)}…
								</p>
							)}
						</Card>
					))}
				</div>
			)}
		</div>
	);
}
