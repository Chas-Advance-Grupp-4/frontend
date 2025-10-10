import React, { useEffect, useState } from "react";
import { getShipmentsForCurrentUser } from "@frontend/common/src/lib/shipmentApi";
import type { Shipment } from "@frontend/common/src/types/shipment";
import Card from "@frontend/common/src/components/Card";
import { useAuth } from "@frontend/common";


export default function Deliveries() {
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
		return <p className="text-center p-4">Loading…</p>;
	}

	if (error) {
		return <p className="text-center text-red-500">{error}</p>;
	}

	if (shipments.length === 0) {
		return <p className="text-center p-4">No deliveries 📭</p>;
	}
	// Separate shipments to "to pick up", "on board", and "delivered"
	const toPickUp = shipments.filter((s) => s.sender_id === user?.id);
	const onBoard = shipments.filter((s) => s.receiver_id === user?.id);
	const delivered = shipments.filter((s) => s.status === "Delivered");

    return (
        	<div className="p-6">
			<h1 className="text-2xl text-text-primary font-bold mb-6 text-center">Deliveries 📦</h1>
			{/* To pick up */}
			<h2 className="text-xl text-text-primary font-semibold mt-6 mb-2">Pick-up</h2>
			{toPickUp.length === 0 ? (
				<p className="text-sm text-gray-500 mb-4">No pick ups</p>
			) : (
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 justify-items-around">
					{toPickUp.map((s) => (
						<Card
							key={s.id}
							title={s.shipment_number}
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

			{/* On Board the truck*/}
			<h2 className="text-xl text-text-primary font-semibold mt-8 mb-2">On Board</h2>
			{onBoard.length === 0 ? (
				<p className="text-sm text-gray-500 mb-4">No parcels on board</p>
			) : (
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 justify-items-around">
					{onBoard.map((s) => (
						<Card
							key={s.id}
							title={s.shipment_number}
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

						{/*Delivery history */}
			<h2 className="text-xl text-text-primary font-semibold mt-8 mb-2">Delivery History</h2>
			{delivered.length === 0 ? (
				<p className="text-sm text-gray-500 mb-4">No parcels delivered...yet!</p>
			) : (
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 justify-items-around">
					{delivered.map((s) => (
						<Card
							key={s.id}
							title={s.shipment_number}
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
};

