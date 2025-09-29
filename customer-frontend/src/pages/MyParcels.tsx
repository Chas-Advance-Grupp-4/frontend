import { useEffect, useState } from "react";
import { Card } from "@frontend/common";
import type { Parcel } from "@frontend/common/src/types/parcel";
import { getParcelsForCurrentUser } from "@frontend/common/src/lib/parcelsApi";

export default function MyParcels() {
	const [parcels, setParcels] = useState<Parcel[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		async function load() {
			try {
				const data = await getParcelsForCurrentUser();
				setParcels(data);
			} catch (err) {
				console.error("Failed to load parcels:", err);
			} finally {
				setLoading(false);
			}
		}
		load();
	}, []);

	if (loading) {
		return <p className="text-center">Loading parcels...</p>;
	}

	const expecting = parcels.filter(
		(p) => p.receiver_id === "u1" && p.status !== "Delivered"
	);
	const sent = parcels.filter(
		(p) => p.sender_id === "u1" && p.status !== "Delivered"
	);
	const history = parcels.filter((p) => p.status === "Delivered");

	return (
		<div className="text-center">
			<h1 className="text-2xl font-bold mb-4">My Parcels</h1>

			<h2 className="text-xl font-semibold">Expecting</h2>
			<section className="p-6 flex flex-wrap justify-center gap-4">
				{expecting.length > 0 ? (
					expecting.map((p) => (
						<Card key={p.id} title={p.sender_name} subtitle={p.pickup_address}>
							<p>Status: {p.status}</p>
							<p>ETA: {p.eta}</p>
						</Card>
					))
				) : (
					<p>No parcels expected</p>
				)}
			</section>

			<h2 className="text-xl font-semibold">Sent</h2>
			<section className="p-6 flex flex-wrap justify-center gap-4">
				{sent.length > 0 ? (
					sent.map((p) => (
						<Card
							key={p.id}
							title={p.receiver_name}
							subtitle={p.delivery_address}
						>
							<p>Status: {p.status}</p>
							<p>ETA: {p.eta}</p>
						</Card>
					))
				) : (
					<p>No parcels sent</p>
				)}
			</section>

			<h2 className="text-xl font-semibold">History</h2>
			<section className="p-6 flex flex-wrap justify-center gap-4">
				{history.length > 0 ? (
					history.map((p) => (
						<Card
							key={p.id}
							title={p.receiver_name}
							subtitle={p.delivery_address}
						>
							<p>Delivered from {p.sender_name}</p>
							<p>Delivered at: {new Date(p.last_seen_at).toLocaleString()}</p>
						</Card>
					))
				) : (
					<p>No history yet</p>
				)}
			</section>
		</div>
	);
}
