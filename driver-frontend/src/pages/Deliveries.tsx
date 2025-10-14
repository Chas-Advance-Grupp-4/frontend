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

//   const mockShipments: Shipment[] = [
//   {
//     id: "1",
//     shipment_number: "SHIP-001",
//     sender_id: "11111111-aaaa-bbbb-cccc-111111111111",
//     receiver_id: "22222222-aaaa-bbbb-cccc-222222222222",
//     driver_id: "33333333-aaaa-bbbb-cccc-333333333333",
//     sensor_unit_id: "sensor-123",
//     status: "in_transit",
//     created_at: new Date("2025-10-01T09:30:00Z").toISOString(),
//   },
//   {
//     id: "2",
//     shipment_number: "SHIP-002",
//     sender_id: "11111111-aaaa-bbbb-cccc-111111111111",
//     receiver_id: "22222222-aaaa-bbbb-cccc-222222222222",
//     driver_id: "33333333-aaaa-bbbb-cccc-333333333333",
//     sensor_unit_id: "sensor-456",
//     status: "delivered",
//     created_at: new Date("2025-09-29T14:00:00Z").toISOString(),
//   },
//   {
//     id: "3",
//     shipment_number: "SHIP-003",
//     sender_id: "55555555-aaaa-bbbb-cccc-555555555555",
//     receiver_id: "66666666-aaaa-bbbb-cccc-666666666666",
//     driver_id: "33333333-aaaa-bbbb-cccc-333333333333",
//     sensor_unit_id: null,
//     status: "cancelled",
//     created_at: new Date("2025-09-27T12:15:00Z").toISOString(),
//   },
// ];

// useEffect(() => {
//   // Simulate async API delay
//   const timer = setTimeout(() => {
//     setShipments(mockShipments);
//     setLoading(false);
//   }, 500);

//   return () => clearTimeout(timer);
// }, []);
  
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
		return <p className="text-center p-4">Loading deliveries…</p>;
	}

	if (error) {
		return <p className="text-center text-red-500">{error}</p>;
	}

	if (shipments.length === 0) {
		return <p className="text-center p-4">No assigned deliveries 🚚</p>;
	}

	// filter shipments for the driver
	const assignedToMe = shipments.filter((s) => s.driver_id === user?.id);
	
	// group shipments into categories
	const toPickUp = assignedToMe.filter((s) => !s.sensor_unit_id);
	const inTransit = assignedToMe.filter((s) => s.sensor_unit_id);
	const delivered: Shipment[] = [];

	// const toPickUp = assignedToMe.filter((s) => s.status === "assigned" || s.status === "created");
	// const inTransit = assignedToMe.filter((s) => s.status === "in_transit");
	// const delivered = assignedToMe.filter((s) => s.status === "delivered");
	const cancelled = assignedToMe.filter((s) => s.status === "cancelled");

    return (
        	<div className="p-6">
			
			{/* To pick up */}
			<h2 className="text-xl text-text-primary font-semibold mt-6 mb-2">Pick-up</h2>
			{toPickUp.length === 0 ? (
				<p className="text-sm text-gray-500 mb-4">No parcels to pick up</p>
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
			{inTransit.length === 0 ? (
				<p className="text-sm text-gray-500 mb-4">No parcels currently in transit</p>
			) : (
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 justify-items-around">
					{inTransit.map((s) => (
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

			{/* Cancelled */}
			{cancelled.length > 0 && (
				<>
				<h2 className="text-xl font-semibold mt-8 mb-2 text-red-600">Cancelled</h2>
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
					{cancelled.map((s) => (
					<Card key={s.id} title={s.shipment_number}>
						<p className="text-sm text-gray-600">
						<strong>Sender:</strong> {s.sender_id.slice(0, 8)}…
						</p>
						<p className="text-sm text-gray-600">
						<strong>Receiver:</strong> {s.receiver_id.slice(0, 8)}…
						</p>
					</Card>
					))}
				</div>
				</>
			)}
		</div>
    );
};

