import { useNavigate } from "react-router-dom";
import QRCodeScanner from "../components/QRCodeScanner";
import { useState } from "react";
import { useAuth } from "../../../common/src/hooks/auth/AuthProvider";
import type { Shipment, ShipmentStatus } from "../../../common/src/types/shipment";

export default function ScanParcel() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [scannerActive, setScannerActive] = useState(true);
  const [scannedValue, setScannedValue] = useState<string | null>(null);
  const [shipmentInfo, setShipmentInfo] = useState<Shipment | null>(null);

  const handleScan = async (value: string) => {
    console.log("📦 QR Code scanned:", value);
    setScannedValue(value);
    setScannerActive(false);
    setMessage(null);

    // Parse QR: support parcel:{uuid}, raw uuid, or embedded uuid
    let shipmentId: string | null = null;
    if (value.startsWith("parcel:")) {
      shipmentId = value.replace("parcel:", "").trim();
    } else {
      const uuidMatch = value.match(
        /[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}/i
      );
      shipmentId = uuidMatch ? uuidMatch[0] : null;
    }

    if (!shipmentId) {
      setMessage(
        "❌ Invalid QR Code — could not find a valid shipment ID.\nExpected format: parcel:{UUID}"
      );
      setScannerActive(true);
      return;
    }

    // Validate UUID format
    const uuidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89ab][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/i;
    if (!uuidRegex.test(shipmentId)) {
      setMessage(`❌ Invalid Shipment ID: "${shipmentId}"`);
      setScannerActive(true);
      return;
    }

    await processShipment(shipmentId);
  };

  const processShipment = async (shipmentId: string) => {
    setLoading(true);
    setMessage("🔍 Fetching shipment details...");

    try {
      const apiBase = import.meta.env.VITE_API_URL || "http://localhost:8000";
      const token = localStorage.getItem("access_token");

      const response = await fetch(`${apiBase}/v1/shipments/${shipmentId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          setMessage(`❌ Shipment not found: ${shipmentId}`);
        } else {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.detail || `HTTP ${response.status}`);
        }
        setScannerActive(true);
        setLoading(false);
        return;
      }

      const shipment = (await response.json()) as Shipment;
      setShipmentInfo(shipment);
      await validateAndUpdateShipment(shipment);
    } catch (error: any) {
      console.error("Error fetching shipment:", error);
      setMessage(`❌ Error Loading Shipment: ${error.message}`);
      setScannerActive(true);
      setLoading(false);
    }
  };

  const validateAndUpdateShipment = async (shipment: Shipment) => {
    const validDeliveryStates: ShipmentStatus[] = ["ASSIGNED", "IN_TRANSIT"];
    if (!validDeliveryStates.includes(shipment.status)) {
      if (shipment.status === "DELIVERED") {
        setMessage(`ℹ️ Already Delivered — ${shipment.shipment_number}`);
      } else {
        setMessage(`⚠️ Cannot deliver in status: ${shipment.status}`);
      }
      setLoading(false);
      return;
    }

    const isDriver = user?.role === "driver";
    const hasPermission = isDriver ? shipment.driver_id === user?.id : shipment.receiver_id === user?.id;

    if (!hasPermission) {
      setMessage(
        `❌ Access Denied\nYour role: ${user?.role || "unknown"}\nAssigned driver: ${shipment.driver_id}`
      );
      setLoading(false);
      return;
    }

    await updateShipmentStatus(shipment);
  };

  const updateShipmentStatus = async (shipment: Shipment) => {
    setMessage(`✅ Marking #${shipment.shipment_number} as delivered...`);

    try {
      const apiBase = import.meta.env.VITE_API_URL || "http://localhost:8000";
      const token = localStorage.getItem("access_token");

      // Backend expects status in query param
      const updateUrl = `${apiBase}/v1/shipments/${shipment.id}?status=DELIVERED`;

      const response = await fetch(updateUrl, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        if (response.status === 404) throw new Error("Shipment not found");
        if (response.status === 401) throw new Error("Authentication required");
        if (response.status === 403) throw new Error("Permission denied");
        throw new Error(errorData.detail || `Update failed (HTTP ${response.status})`);
      }

      const updatedShipment = (await response.json()) as Shipment;
      setMessage(`🎉 Delivery Confirmed — ${updatedShipment.shipment_number}`);
      setTimeout(() => {
        navigate(`/parcel/${shipment.id}`, {
          state: { justDelivered: true, shipment: updatedShipment },
        });
      }, 1200);
    } catch (error: any) {
      console.error("Error updating shipment:", error);
      setMessage(`❌ Update Failed: ${error.message}`);
      setLoading(false);
    }
  };

  const handleRescan = () => {
    setScannerActive(true);
    setScannedValue(null);
    setShipmentInfo(null);
    setMessage(null);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-4 flex flex-col items-center px-4">
      <div className="max-w-md w-full space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">🚛 Driver Delivery</h1>
          <p className="text-gray-600 text-sm">Scan the QR on the parcel to confirm delivery.</p>
          {user?.role === "driver" && (
            <p className="text-xs text-blue-600 mt-1 font-medium">
              Driver ID: {user?.id?.substring(0, 8)}...
            </p>
          )}
        </div>

        {scannerActive && (
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <QRCodeScanner onScan={handleScan} isActive={!loading} />
          </div>
        )}

        {shipmentInfo && !loading && !message?.startsWith("🎉") && (
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <div className="text-center mb-4">
              <div className="flex items-center justify-center mb-2">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                  <span className="text-xl">📦</span>
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-gray-900">{shipmentInfo.shipment_number}</h3>
                  <p className="text-sm text-gray-500">Ready to mark as delivered</p>
                </div>
              </div>
            </div>

            <div className="space-y-3 text-sm border-t pt-3">
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-600">Current Status</span>
                <span className="text-blue-600 font-medium">{shipmentInfo.status}</span>
              </div>

              {shipmentInfo.driver_id && (
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600">Assigned Driver</span>
                  <span className="text-blue-600 font-medium">{shipmentInfo.driver_id.substring(0, 8)}...</span>
                </div>
              )}

              <div className="flex justify-between items-center py-2">
                <span className="text-gray-600">Sender</span>
                <span className="text-gray-900">{shipmentInfo.sender_id.substring(0, 8)}...</span>
              </div>

              <div className="flex justify-between items-center py-2">
                <span className="text-gray-600">Receiver</span>
                <span className="text-gray-900">{shipmentInfo.receiver_id.substring(0, 8)}...</span>
              </div>
            </div>
          </div>
        )}

        {loading && (
          <div className="bg-white rounded-lg shadow-sm border p-4 text-center">
            <div className="flex flex-col items-center space-y-3">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
              <div>
                <p className="text-blue-600 font-medium mb-2">{message || "Processing scan..."}</p>
                {scannedValue && (
                  <div className="text-xs text-blue-500 bg-blue-50 px-3 py-1 rounded">
                    <div className="font-mono text-[10px]">Scanned: {scannedValue.substring(0, 30)}...</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {message && !loading && (
          <div
            className={`p-4 rounded-lg text-sm leading-relaxed ${
              message.startsWith("✅") || message.startsWith("🎉")
                ? "bg-green-50 border border-green-200 text-green-800"
                : message.startsWith("ℹ️")
                ? "bg-blue-50 border border-blue-200 text-blue-800"
                : message.startsWith("⚠️")
                ? "bg-yellow-50 border border-yellow-200 text-yellow-800"
                : "bg-red-50 border border-red-200 text-red-800"
            }`}
          >
            <pre className="whitespace-pre-wrap text-sm">{message}</pre>
          </div>
        )}

        <div className="space-y-3">
          {!scannerActive && (
            <button
              onClick={handleRescan}
              disabled={loading}
              className={`w-full py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center ${
                loading ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Processing...
                </>
              ) : (
                "🔄 Scan Another Parcel"
              )}
            </button>
          )}

          <button
            onClick={() => navigate("/parcels")}
            className="w-full py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors"
          >
            ← Back to My Parcels
          </button>
        </div>
      </div>
    </div>
  );
}