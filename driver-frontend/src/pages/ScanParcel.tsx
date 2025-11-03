import { useNavigate } from "react-router-dom";
import QRCodeScanner from "../components/QRCodeScanner";
import { useState } from "react";
import { useAuth } from "../../../common/src/hooks/auth/AuthProvider";
import type { Shipment } from "../../../common/src/types/shipment";
import {
	getShipmentById,
	updateShipmentStatus,
} from "../../../common/src/lib/shipmentApi";

export default function DriverScanPickup() {
	const navigate = useNavigate();
	const { user } = useAuth();

	const [loading, setLoading] = useState(false);
	const [message, setMessage] = useState<string | null>(null);
	const [scannerActive, setScannerActive] = useState(true);
	const [shipmentInfo, setShipmentInfo] = useState<Shipment | null>(null);

	const extractUUID = (value: string): string | null => {
		if (value.startsWith("parcel:")) return value.replace("parcel:", "").trim();
		const m = value.match(/[0-9a-fA-F-]{36}/);
		return m ? m[0] : null;
	};

	const handleScan = async (value: string) => {
		const shipmentId = extractUUID(value);
		if (!shipmentId) {
			setMessage("❌ Invalid QR — no shipment ID found.");
			return;
		}

		setScannerActive(false);
		await fetchShipment(shipmentId);
	};

	const fetchShipment = async (id: string) => {
		try {
			setLoading(true);
			setMessage("🔍 Fetching shipment...");

			const shipment = await getShipmentById(id);
			setShipmentInfo(shipment);

			validateDriverAction(shipment);
		} catch {
			setMessage("❌ Shipment not found or access denied");
			setScannerActive(true);
		} finally {
			setLoading(false);
		}
	};

	const validateDriverAction = (shipment: Shipment) => {
		if (user?.role !== "driver") {
			setMessage("❌ Only drivers can perform this scan");
			return;
		}

		if (shipment.driver_id !== user.id) {
			setMessage(`❌ Parcel assigned to another driver`);
			return;
		}

		if (shipment.status === "in_transit") {
			setMessage("ℹ️ Already checked in to transit ✅");
			return;
		}

		if (shipment.status !== "assigned") {
			setMessage(`⚠️ Cannot check in — status: ${shipment.status}`);
			return;
		}

		setMessage("✅ Parcel verified. Press Confirm Pickup.");
	};

	const confirmPickup = async () => {
		if (!shipmentInfo) return;

		try {
			setLoading(true);
			setMessage("📦 Updating shipment to IN TRANSIT...");

			await updateShipmentStatus(shipmentInfo.id, "in_transit");

			setMessage("🚚 Parcel now IN TRANSIT ✅");

			setTimeout(() => navigate("/"), 1200);
		} catch {
			setMessage("❌ Failed to update status");
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
					<h1 className="text-2xl font-bold">🚛 Driver Parcel Pickup</h1>
					<p className="text-sm text-gray-500">
						Scan parcel when loading into vehicle
					</p>
					<p className="text-xs text-blue-600">
						Driver: {user?.id?.slice(0, 8)}...
					</p>
				</div>

				{scannerActive && (
					<div className="bg-white rounded-lg shadow border p-4">
						<QRCodeScanner onScan={handleScan} isActive={!loading} />
					</div>
				)}

				{message && (
					<div className="p-3 border rounded bg-gray-50 text-sm whitespace-pre-wrap">
						{message}
					</div>
				)}

				{shipmentInfo && message?.startsWith("✅") && (
					<button
						className="w-full py-2 bg-green-600 text-white rounded"
						onClick={confirmPickup}
						disabled={loading}
					>
						✅ Confirm Pickup
					</button>
				)}

				{!scannerActive && (
					<button
						className="w-full py-2 bg-blue-600 text-white rounded"
						onClick={reset}
					>
						🔄 Scan Another
					</button>
				)}

				<button
					onClick={() => navigate("/")}
					className="w-full py-2 bg-gray-200 rounded"
				>
					← Back
				</button>
			</div>
		</div>
	);
}
