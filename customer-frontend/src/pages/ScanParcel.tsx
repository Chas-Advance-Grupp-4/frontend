import { useNavigate } from "react-router-dom";
import QRCodeScanner from "../components/QRCodeScanner";
import { useState } from "react";
import { useAuth } from "../../../common/src/hooks/auth/AuthProvider";
import type { Shipment } from "../../../common/src/types/shipment";
import {
	getShipmentById,
	updateShipmentStatus,
} from "../../../common/src/lib/shipmentApi";

export default function ScanParcelCustomer() {
	const navigate = useNavigate();
	const { user } = useAuth();

	const [loading, setLoading] = useState(false);
	const [message, setMessage] = useState<string | null>(null);
	const [scannerActive, setScannerActive] = useState(true);
	const [shipment, setShipment] = useState<Shipment | null>(null);

	/** ✅ Extract UUID from QR */
	const extractId = (value: string): string | null => {
		const trimmed = value.trim();

		if (trimmed.startsWith("parcel:")) {
			const id = trimmed.replace("parcel:", "").trim();
			return /^[0-9a-fA-F-]{36}$/.test(id) ? id : null;
		}

		if (/^[0-9a-fA-F-]{36}$/.test(trimmed)) return trimmed;

		const match = trimmed.match(
			/[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89ab][0-9a-fA-F]{3}-[0-9a-fA-F]{12}/i
		);
		return match ? match[0] : null;
	};

	/** ✅ When QR is scanned */
	const handleScan = async (value: string) => {
		setScannerActive(false);
		setMessage(null);

		const id = extractId(value);
		if (!id) {
			setMessage("❌ Invalid QR — no shipment ID found");
			setScannerActive(true);
			return;
		}

		setMessage(`✅ QR recognized\nID: ${id}`);
		await loadShipment(id);
	};

	/** ✅ Fetch & validate */
	const loadShipment = async (id: string) => {
		try {
			setLoading(true);
			setMessage("🔍 Fetching parcel...");

			const s = await getShipmentById(id);
			setShipment(s);

			// ✅ Must be the receiving customer
			if (user?.role !== "customer") {
				setMessage("❌ Only the receiving customer can confirm delivery");
				return;
			}

			if (s.receiver_id !== user.id) {
				setMessage("❌ This parcel belongs to another customer");
				return;
			}

			// ✅ Already delivered?
			if (s.status === "delivered") {
				setMessage("ℹ️ Already delivered ✅");
				return;
			}

			// ✅ Must be in transit
			if (s.status !== "in_transit") {
				setMessage(`⚠️ Parcel not ready.\nStatus: ${s.status}`);
				return;
			}

			setMessage("✅ Parcel verified.\nPress Confirm Delivery");
		} catch {
			setMessage("❌ Parcel not found or no access");
			setScannerActive(true);
		} finally {
			setLoading(false);
		}
	};

	/** ✅ Confirm delivery */
	const confirmDelivery = async () => {
		if (!shipment) return;

		try {
			setLoading(true);
			setMessage(`📦 Marking ${shipment.shipment_number} as delivered...`);

			const updated = await updateShipmentStatus(shipment.id, "delivered");
			setShipment(updated);

			setMessage(`🎉 Delivery confirmed for ${updated.shipment_number}!`);

			setTimeout(() => {
				navigate(`/parcels/${updated.id}`, { state: { justDelivered: true } });
			}, 1200);
		} catch {
			setMessage("❌ Failed to update status");
		} finally {
			setLoading(false);
		}
	};

	/** ✅ Reset for new scan */
	const resetScan = () => {
		setScannerActive(true);
		setShipment(null);
		setMessage(null);
		setLoading(false);
	};

	return (
		<div className="p-4 max-w-md mx-auto">
			<h1 className="text-xl font-bold text-center mb-4">
				Confirm Delivery 📦
			</h1>

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

			{shipment && message?.includes("Press Confirm") && (
				<button
					onClick={confirmDelivery}
					disabled={loading}
					className="w-full mt-4 py-2 bg-green-600 text-white rounded font-medium"
				>
					✅ Confirm Delivery
				</button>
			)}

			{!scannerActive && (
				<button
					onClick={resetScan}
					className="w-full mt-2 py-2 bg-blue-600 text-white rounded"
				>
					🔄 Scan Another
				</button>
			)}

			<button
				onClick={() => navigate("/parcels")}
				className="w-full mt-2 py-2 bg-gray-200 rounded"
			>
				← Back to My Parcels
			</button>
		</div>
	);
}
