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

			await validateForCustomerDelivery(shipment);
		} catch {
			setMessage("❌ Shipment not found or no access");
			setScannerActive(true);
			setLoading(false);
		}
	};

	// ---------------- VALIDATE FOR CUSTOMER DELIVERY ----------------
	const validateForCustomerDelivery = async (shipment: Shipment) => {
		// Customer only validation
		if (user?.role !== "customer") {
			setMessage("❌ Only the receiving customer can confirm delivery.");
			setLoading(false);
			return;
		}

		// Parcel must belong to this customer
		if (shipment.receiver_id !== user.id) {
			setMessage("❌ This parcel belongs to another customer.");
			setLoading(false);
			return;
		}

		// Already delivered?
		if (shipment.status === "delivered") {
			setMessage("ℹ️ Parcel already delivered ✅");
			setLoading(false);
			return;
		}

		// Must be in transit
		if (shipment.status !== "in_transit") {
			setMessage(
				`⚠️ Parcel is not ready to be confirmed.\nCurrent status: ${shipment.status}`
			);
			setLoading(false);
			return;
		}

		// Ready for customer confirmation
		setMessage('✅ Parcel verified.\nPress "Confirm Delivery" to complete.');
		setLoading(false);
	};

	// ---------------- MARK DELIVERED ----------------
	const confirmDelivery = async (shipment: Shipment) => {
		try {
			setMessage(`📦 Marking ${shipment.shipment_number} as delivered...`);

			const updated = await updateShipmentStatus(shipment.id, "delivered");
			setShipmentInfo(updated);

			setMessage(`🎉 Delivery confirmed for ${updated.shipment_number}!`);

			setTimeout(() => {
				navigate(`/parcel/${shipment.id}`, { state: { justDelivered: true } });
			}, 1500);
		} catch {
			setMessage("❌ Failed to confirm delivery.");
		} finally {
			setLoading(false);
		}
	};

	// ---------------- RESET SCAN ----------------
	const handleRescan = () => {
		setScannerActive(true);
		setShipmentInfo(null);
		setMessage(null);
		setLoading(false);
	};

	// ---------------- UI ----------------
	return (
		<div className="p-4 max-w-md mx-auto">
			<h1 className="text-xl font-bold text-center mb-4">Scan Parcel 📦</h1>

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

			{shipmentInfo && !loading && message?.includes("Confirm Delivery") && (
				<div className="mt-3 p-3 border rounded bg-white text-sm">
					<p>
						<b>Shipment:</b> {shipmentInfo.shipment_number}
					</p>
					<p>
						<b>Status:</b> {shipmentInfo.status}
					</p>

					<button
						onClick={() => confirmDelivery(shipmentInfo)}
						className="w-full mt-4 py-2 bg-green-600 text-white rounded font-medium"
					>
						✅ Confirm Delivery
					</button>
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
