import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getShipmentWithSensorData } from "../../../common/src/lib/shipmentApi";
import type { Shipment } from "../../../common/src/types/shipment";
import { ShipmentStatusBadge } from "../../../common/src/utils/shipmentStatus";

export default function ParcelDetails() {
	const { id } = useParams();
	const navigate = useNavigate();
	const [shipment, setShipment] = useState<Shipment | null>(null);

	useEffect(() => {
		if (!id) return;
		fetchShipment();
		const i = setInterval(fetchShipment, 5000); // poll every 5s
		return () => clearInterval(i);
	}, [id]);

	async function fetchShipment() {
		const data = await getShipmentWithSensorData(id!);
		setShipment(data);
	}

	if (!shipment) return <p className="p-4 text-center">Loading…</p>;

	const tempOutOfRange =
		shipment.temperature !== null &&
		(shipment.temperature < shipment.min_temp ||
			shipment.temperature > shipment.max_temp);

	const humidityOutOfRange =
		shipment.humidity !== null &&
		(shipment.humidity < shipment.min_humidity ||
			shipment.humidity > shipment.max_humidity);

	const statusOK = !tempOutOfRange && !humidityOutOfRange;

	// Fake journey data
	const journey = [
		{
			place: "Malmö Logistics Center",
			date: "2025-09-01 08:45",
			text: "Parcel registered and prepared for dispatch",
		},
		{
			place: "Malmö Terminal",
			date: "2025-09-01 10:10",
			text: "Shipment loaded and departed from origin terminal",
		},
		{
			place: "Göteborg Hub",
			date: "2025-09-01 15:55",
			text: "Arrived at regional sorting facility",
		},
		{
			place: "Linköping Distribution Center",
			date: "2025-09-01 20:40",
			text: "Sorted and forwarded for onward transport",
		},
		{
			place: "Stockholm Central Terminal",
			date: "2025-09-02 08:20",
			text: "Arrived for national distribution",
		},
		{
			place: "Stockholm Arlanda Airport",
			date: "2025-09-02 11:50",
			text: "Loaded onto aircraft for northern delivery route",
		},
		{
			place: "Umeå Airport",
			date: "2025-09-02 13:20",
			text: "Arrived at arrival airport, pending local distribution",
		},
		{
			place: "Umeå City Depot",
			date: "2025-09-02 15:45",
			text: "Out for final delivery",
		},
	];

	return (
		<div className="p-6 space-y-6">
			<button
				onClick={() => navigate(-1)}
				className="text-sm text-blue-600 underline mb-2"
			>
				← Back
			</button>

			<h1 className="text-2xl font-bold">Parcel #{shipment.shipment_number}</h1>

			{/* SUMMARY */}
			<div className="bg-gray-100 rounded-2xl p-5 space-y-4 shadow-sm">
				<h2 className="text-lg font-semibold">Summary</h2>

				<div className="grid grid-cols-2 gap-4">
					{/* STATUS */}
					<div className="bg-white p-3 rounded-xl shadow-sm">
						<div className="text-sm text-gray-500">Status</div>
						<div className="flex gap-2 items-center">
							<div className="font-medium flex items-center gap-2">
								<ShipmentStatusBadge status={shipment.status} />
								{statusOK ? "OK ✅" : "⚠️ Issues detected"}
							</div>
						</div>
					</div>

					{/* LOCATION (placeholder until GPS) */}
					<div className="bg-white p-3 rounded-xl shadow-sm">
						<div className="text-sm text-gray-500">Current position</div>
						<div className="font-semibold">Stockholm</div>
					</div>

					{/* PICKUP */}
					<div className="bg-white p-3 rounded-xl shadow-sm col-span-2">
						<div className="text-sm text-gray-500">Pickup address</div>
						<div className="font-semibold">{shipment.pickup_address}</div>
					</div>

					{/* DESTINATION */}
					<div className="bg-white p-3 rounded-xl shadow-sm col-span-2">
						<div className="text-sm text-gray-500">Delivery address</div>
						<div className="font-semibold">{shipment.delivery_address}</div>
					</div>

					{/* TEMPERATURE */}
					<div className="bg-white p-3 rounded-xl shadow-sm">
						<div className="text-sm text-gray-500">Temperature</div>
						<div className="font-semibold flex items-center gap-2">
							🌡️ {shipment.temperature ?? "N/A"}°C {tempOutOfRange && "⚠️"}
						</div>
						<div className="text-xs text-gray-500">
							Allowed: {shipment.min_temp}°C – {shipment.max_temp}°C
						</div>
					</div>

					{/* HUMIDITY */}
					<div className="bg-white p-3 rounded-xl shadow-sm">
						<div className="text-sm text-gray-500">Humidity</div>
						<div className="font-semibold flex items-center gap-2">
							💧 {shipment.humidity ?? "N/A"}% {humidityOutOfRange && "⚠️"}
						</div>
						<div className="text-xs text-gray-500">
							Allowed: {shipment.min_humidity}% – {shipment.max_humidity}%
						</div>
					</div>
				</div>
			</div>

			{/* PARCEL JOURNEY */}
			<div className="space-y-4">
				<h2 className="text-lg font-semibold">Parcel journey</h2>

				{journey.map((j, i) => (
					<div key={i} className="flex gap-3">
						<div className="flex flex-col items-center pt-1">
							<div className="bg-blue-600 text-white p-2 rounded-full">🔔</div>
							{i < journey.length - 1 && (
								<div className="w-px h-14 bg-gray-300"></div>
							)}
						</div>

						<div>
							<div className="font-semibold">{j.place}</div>
							<div className="text-xs text-gray-500">{j.date}</div>
							<div className="text-sm text-gray-600">{j.text}</div>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
