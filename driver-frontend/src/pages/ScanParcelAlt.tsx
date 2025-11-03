import { useNavigate } from "react-router-dom";
import QRCodeScanner from "../components/QRCodeScanner";
import { useState } from "react";
import { useAuth } from "../../../common/src/hooks/auth/AuthProvider";
import type { Shipment } from "../../../common/src/types/shipment";
import {
	updateShipmentStatus,
	getShipmentById,
} from "../../../common/src/lib/shipmentApi";

export default function DriverScanParcel() {
	const navigate = useNavigate();
	const { user } = useAuth();

	const [loading, setLoading] = useState(false);
	const [message, setMessage] = useState<string | null>(null);
	const [scannerActive, setScannerActive] = useState(true);
	const [shipmentInfo, setShipmentInfo] = useState<Shipment | null>(null);

	const extractUUID = (value: string): string | null => {
		if (value.startsWith("parcel:")) return value.replace("parcel:", "").trim();
		const match = value.match(
			/[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}/
		);
		return match ? match[0] : null;
	};

	const handleScan = async (value: string) => {
		setScannerActive(false);
		setMessage(null);

		const shipmentId = extractUUID(value);
		if (!shipmentId) {
			setMessage("❌ Invalid QR — no shipment ID detected");
			setScannerActive(true);
			return;
		}

		await loadShipment(shipmentId);
	};

	const loadShipment = async (id: string) => {
		try {
			setLoading(true);
			setMessage("🔍 Fetching shipment...");

			const shipment = await getShipmentById(id);
			setShipmentInfo(shipment);

			validateForDriver(shipment);
		} catch {
			setMessage("❌ Shipment not found or access denied");
			setScannerActive(true);
		} finally {
			setLoading(false);
		}
	};

	const validateForDriver = (shipment: Shipment) => {
		if (user?.role !== "driver") {
			setMessage("❌ Only drivers can check in parcels");
			return;
		}

		if (shipment.driver_id !== user.id) {
			setMessage(`❌ This parcel is assigned to another driver`);
			return;
		}

		if (shipment.status === "in_transit") {
			setMessage("ℹ️ Already marked in transit ✅");
			return;
		}

		if (shipment.status !== "ASSIGNED") {
			setMessage(`⚠️ Cannot check in — status: ${shipment.status}`);
			return;
		}

		setMessage("✅ Parcel verified — press Confirm Pickup");
	};

	const confirmPickup = async () => {
		if (!shipmentInfo) return;

		try {
			setLoading(true);
			setMessage("📦 Marking parcel as IN TRANSIT...");

			const updated = await updateShipmentStatus(shipmentInfo.id, "in_transit");

			setMessage(`🚚 Parcel now IN TRANSIT — ${updated.shipment_number}`);

			setTimeout(() => navigate("/parcels"), 1200);
		} catch {
			setMessage("❌ Failed to update parcel status");
		} finally {
			setLoading(false);
		}
	};

	const reset = () => {
		setScannerActive(true);
		setShipmentInfo(null);
		setMessage(null);
	};

	return (
		<div className="min-h-screen bg-gray-50 p-4 flex flex-col items-center">
			<div className="max-w-md w-full space-y-6">
				<div className="text-center">
					<h1 className="text-2xl font-bold mb-2">
						🚛 Scan Parcel — Driver Pickup
					</h1>
					<p className="text-gray-600 text-sm">
						Scan the QR to mark parcel as in transit.
					</p>
					<p className="text-xs text-blue-600 font-medium">
						Driver ID: {user?.id?.slice(0, 8)}...
					</p>
				</div>

				{scannerActive && (
					<div className="bg-white rounded-lg shadow p-4">
						<QRCodeScanner onScan={handleScan} isActive={!loading} />
					</div>
				)}

				{message && (
					<div className="p-3 border rounded bg-gray-50 whitespace-pre-wrap text-sm">
						{message}
					</div>
				)}

				{shipmentInfo && message?.startsWith("✅") && (
					<button
						onClick={confirmPickup}
						disabled={loading}
						className="w-full py-2 bg-green-600 text-white rounded font-medium"
					>
						✅ Confirm Pickup
					</button>
				)}

				{!scannerActive && (
					<button
						onClick={reset}
						className="w-full py-2 mt-2 bg-blue-600 text-white rounded"
					>
						🔄 Scan Another Parcel
					</button>
				)}

				<button
					onClick={() => navigate("/")}
					className="w-full py-2 bg-gray-200 rounded"
				>
					← Back to My Parcels
				</button>
			</div>
		</div>
	);
}
