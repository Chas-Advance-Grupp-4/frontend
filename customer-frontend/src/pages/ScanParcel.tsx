import { useNavigate } from "react-router-dom";
import QRCodeScanner from "../components/QRCodeScanner";
import { useState } from "react";
import { useAuth } from "../../../common/src/hooks/auth/AuthProvider";
import type {
	Shipment,
	ShipmentStatus,
} from "../../../common/src/types/shipment";
import {
	updateShipmentStatus,
	getShipmentById,
} from "../../../common/src/lib/shipmentApi";

export default function ScanParcel() {
	const navigate = useNavigate();
	const { user } = useAuth();

	const [loading, setLoading] = useState(false);
	const [message, setMessage] = useState<string | null>(null);
	const [scannerActive, setScannerActive] = useState(true);
	const [scannedValue, setScannedValue] = useState<string | null>(null);
	const [shipmentInfo, setShipmentInfo] = useState<Shipment | null>(null);

	// ---------------- SCAN HANDLER ----------------
	const handleScan = async (value: string) => {
		setScannedValue(value);
		setScannerActive(false);
		setMessage(null);

		// Extract UUID
		const uuidMatch = value.match(
			/[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}/
		);
		const shipmentId = uuidMatch ? uuidMatch[0] : null;

		if (!shipmentId) {
			setMessage("❌ Invalid QR code — no shipment ID found.");
			setScannerActive(true);
			return;
		}

		await loadShipment(shipmentId);
	};

	// ---------------- FETCH SHIPMENT ----------------
	const loadShipment = async (id: string) => {
		try {
			setLoading(true);
			setMessage("🔍 Fetching shipment...");

			const shipment = await getShipmentById(id);
			setShipmentInfo(shipment);

			await validateAndDeliver(shipment);
		} catch (err: any) {
			setMessage(`❌ Shipment not found or no access`);
			setScannerActive(true);
			setLoading(false);
		}
	};

	// ---------------- VALIDATE ----------------
	const validateAndDeliver = async (shipment: Shipment) => {
		const allowedStatuses: ShipmentStatus[] = ["in_transit"];

		if (!allowedStatuses.includes(shipment.status)) {
			setMessage(`⚠️ Cannot deliver shipment in status: ${shipment.status}`);
			setLoading(false);
			return;
		}

		// Customer self-delivery allowed (optional)
		if (user?.role === "customer" && shipment.receiver_id !== user.id) {
			setMessage(`❌ This shipment belongs to another customer`);
			setLoading(false);
			return;
		}

		await confirmDelivery(shipment);
	};

	// ---------------- DELIVER ----------------
	const confirmDelivery = async (shipment: Shipment) => {
		try {
			setMessage(`✅ Marking ${shipment.shipment_number} as delivered...`);

			// ✅ USE SHARED HELPER HERE
			const updated = await updateShipmentStatus(shipment.id, "delivered");

			setMessage(`🎉 Delivered ${updated.shipment_number}!`);
			setShipmentInfo(updated);

			setTimeout(() => {
				navigate(`/parcel/${shipment.id}`, { state: { justDelivered: true } });
			}, 1500);
		} catch (err: any) {
			setMessage(`❌ Failed to update delivery.`);
		} finally {
			setLoading(false);
		}
	};

	// ---------------- RESET ----------------
	const handleRescan = () => {
		setScannerActive(true);
		setShipmentInfo(null);
		setMessage(null);
		setLoading(false);
	};

	// ---------------- UI ----------------
	return (
		<div className="p-4 max-w-md mx-auto">
			<h1 className="text-xl font-bold text-center mb-4">📦 Scan Parcel</h1>

			{scannerActive && (
				<div className="p-3 border rounded bg-white">
					<QRCodeScanner onScan={handleScan} isActive={!loading} />
				</div>
			)}

			{message && (
				<div className="mt-3 p-3 border rounded bg-gray-50 text-sm whitespace-pre-wrap">
					{message}
				</div>
			)}

			{shipmentInfo && !loading && message?.startsWith("✅") === false && (
				<div className="mt-3 p-3 border rounded bg-white text-sm">
					<p>
						<b>Shipment:</b> {shipmentInfo.shipment_number}
					</p>
					<p>
						<b>Status:</b> {shipmentInfo.status}
					</p>
					<p>
						<b>Driver:</b> {shipmentInfo.driver_id?.slice(0, 8)}...
					</p>
				</div>
			)}

			{!scannerActive && (
				<button
					onClick={handleRescan}
					className="w-full mt-4 py-2 bg-blue-600 text-white rounded"
				>
					🔄 Scan Again
				</button>
			)}

			<button
				onClick={() => navigate("/parcels")}
				className="w-full mt-2 py-2 bg-gray-200 rounded"
			>
				← Back
			</button>
		</div>
	);
}
