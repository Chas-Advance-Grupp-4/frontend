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

    // Parse our QR format: "parcel:{uuid}"
    let shipmentId: string | null = null;

    if (value.startsWith("parcel:")) {
      // Our custom format: parcel:{uuid}
      shipmentId = value.replace("parcel:", "").trim();
    } else if (value.match(/^[0-9a-fA-F-]{8}-[0-9a-fA-F-]{4}-[0-9a-fA-F-]{4}-[0-9a-fA-F-]{4}-[0-9a-fA-F-]{12}$/i)) {
      // Direct UUID (fallback)
      shipmentId = value.trim();
    } else {
      // Try to extract UUID from anywhere in the string
      const uuidMatch = value.match(/[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}/i);
      shipmentId = uuidMatch ? uuidMatch[0] : null;
    }

    if (!shipmentId) {
      setMessage(
        "❌ Invalid QR Code\n\n" +
        "Could not find a valid shipment ID in the scanned code.\n\n" +
        "Please scan a QR code generated from this app.\n" +
        "Expected format: parcel:{UUID}"
      );
      setScannerActive(true); // Allow rescan
      return;
    }

    // Validate UUID format
    const uuidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89ab][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/i;
    if (!uuidRegex.test(shipmentId)) {
      setMessage(
        `❌ Invalid Shipment ID\n\n` +
        `"${shipmentId}" is not a valid shipment identifier.\n\n` +
        `Please scan a valid parcel QR code.`
      );
      setScannerActive(true);
      return;
    }

    console.log("🔍 Processing shipment ID:", shipmentId);
    await processShipment(shipmentId);
  };

  const processShipment = async (shipmentId: string) => {
    setLoading(true);
    setMessage("🔍 Fetching shipment details...");

    try {
      const apiBase = import.meta.env.VITE_API_URL || "http://localhost:8000";
      const token = localStorage.getItem("access_token");
      
      // Step 1: Fetch shipment details using your GET /shipments/{id} endpoint
      const response = await fetch(`${apiBase}/v1/shipments/${shipmentId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          setMessage(
            `❌ Shipment Not Found\n\n` +
            `Could not find shipment with ID:\n\`${shipmentId}\`\n\n` +
            `This shipment may not exist or you don't have permission to view it.`
          );
        } else {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.detail || `HTTP ${response.status}`);
        }
        setScannerActive(true);
        setLoading(false);
        return;
      }

      const shipment = await response.json() as Shipment;
      console.log("📋 Shipment loaded:", shipment);
      setShipmentInfo(shipment);

      // Step 2: Validate permissions and status
      await validateAndUpdateShipment(shipment);

    } catch (error: any) {
      console.error("Error fetching shipment:", error);
      setMessage(
        `❌ Error Loading Shipment\n\n` +
        `${error.message}\n\n` +
        `Please check your connection and try again.`
      );
      setScannerActive(true);
      setLoading(false);
    }
  };

  const validateAndUpdateShipment = async (shipment: Shipment) => {
    // Check current status - only allow delivery from certain states
    const validDeliveryStates = ["ASSIGNED", "IN_TRANSIT"];
    if (!validDeliveryStates.includes(shipment.status)) {
      if (shipment.status === "DELIVERED") {
        setMessage(
          `ℹ️ Already Delivered\n\n` +
          `Shipment #${shipment.shipment_number} has already been marked as delivered.\n\n` +
          `Status: ${shipment.status}\n` +
          `If this seems incorrect, contact support.`
        );
      } else if (shipment.status === "CREATED") {
        setMessage(
          `⚠️ Shipment Not Ready\n\n` +
          `Shipment #${shipment.shipment_number} is still in "${shipment.status}" status.\n\n` +
          `It needs to be ASSIGNED to a driver first before it can be delivered.`
        );
      } else {
        setMessage(
          `⚠️ Invalid Status\n\n` +
          `Cannot mark "${shipment.status}" shipment as delivered.\n\n` +
          `Valid states for delivery: ASSIGNED, IN_TRANSIT`
        );
      }
      setLoading(false);
      return;
    }

    // Check permissions based on your backend roles
    const isCustomer = user?.role === "customer";
    const isDriver = user?.role === "driver";
    
    let hasPermission = false;
    let permissionReason = "";

    if (isDriver) {
      // Drivers can only deliver their assigned shipments
      hasPermission = shipment.driver_id === user?.id;
      permissionReason = hasPermission 
        ? "You are the assigned driver" 
        : `This shipment is assigned to: ${shipment.driver_id}`;
    } else if (isCustomer) {
      // Customers can mark their received shipments as delivered (self-delivery)
      hasPermission = shipment.receiver_id === user?.id;
      permissionReason = hasPermission 
        ? "You are the receiver" 
        : `This shipment is for: ${shipment.receiver_id}`;
    }

    if (!hasPermission) {
      setMessage(
        `❌ Access Denied\n\n` +
        `You don't have permission to mark this shipment as delivered.\n\n` +
        `Your role: ${user?.role || "unknown"}\n` +
        `${permissionReason}\n\n` +
        `Shipment #: ${shipment.shipment_number}`
      );
      setLoading(false);
      return;
    }

    // All validations passed - update the shipment
    await updateShipmentStatus(shipment);
  };

  const updateShipmentStatus = async (shipment: Shipment) => {
    setMessage(`✅ Marking #${shipment.shipment_number} as delivered...`);

    try {
      const apiBase = import.meta.env.VITE_API_URL || "http://localhost:8000";
      const token = localStorage.getItem('access_token');
      
      // IMPORTANT: Your backend expects status as QUERY PARAMETER, not JSON body
      // Use: PATCH /shipments/{id}?status=DELIVERED
      const updateUrl = `${apiBase}/v1/shipments/${shipment.id}?status=DELIVERED`;
      
      const response = await fetch(updateUrl, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        // NO BODY - status is in the URL query parameter
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        
        // Handle specific error cases from your FastAPI backend
        if (response.status === 404) {
          throw new Error("Shipment not found or was deleted");
        } else if (response.status === 401) {
          throw new Error("Authentication required - please log in again");
        } else if (response.status === 403) {
          throw new Error("You don't have permission to update this shipment");
        } else {
          throw new Error(errorData.detail || `Update failed (HTTP ${response.status})`);
        }
      }

      const updatedShipment = await response.json() as Shipment;
      console.log("✅ Shipment successfully updated:", updatedShipment);

      setMessage(
        `🎉 Delivery Confirmed!\n\n` +
        `📦 Shipment #${shipment.shipment_number}\n` +
        `✅ Status: ${updatedShipment.status}\n` +
        `📅 Completed: ${new Date().toLocaleString()}\n\n` +
        `The shipment has been marked as delivered in the system!`
      );

      // Auto-navigate to shipment details after success
      setTimeout(() => {
        navigate(`/parcel/${shipment.id}`, { 
          state: { 
            justDelivered: true,
            message: `Delivery confirmed for #${shipment.shipment_number}!`,
            shipment: updatedShipment 
          } 
        });
      }, 3000);

    } catch (error: any) {
      console.error("Error updating shipment:", error);
      
      setMessage(
        `❌ Update Failed\n\n` +
        `Shipment #${shipment.shipment_number}\n\n` +
        `${error.message}\n\n` +
        `The QR was scanned successfully, but the server update failed.\n` +
        `You may need to mark this manually or contact support.`
      );
      
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

  const handleManualEntry = () => {
    const id = prompt("Enter Shipment ID manually (UUID format):\n\nExample: 123e4567-e89b-12d3-a456-426614174000");
    if (id && id.match(/^[0-9a-fA-F-]{8}-[0-9a-fA-F-]{4}-[0-9a-fA-F-]{4}-[0-9a-fA-F-]{4}-[0-9a-fA-F-]{12}$/i)) {
      setScannedValue(`parcel:${id}`);
      processShipment(id);
    } else if (id) {
      alert("❌ Invalid ID Format\n\nPlease enter a valid UUID in this format:\n123e4567-e89b-12d3-a456-426614174000");
    }
  };

  // Get status display info
  const getStatusDisplay = (status: ShipmentStatus) => {
    const statusInfo: Record<ShipmentStatus, { icon: string; color: string }> = {
      CREATED: { icon: "⏳", color: "text-yellow-600" },
      ASSIGNED: { icon: "🚛", color: "text-blue-600" },
      IN_TRANSIT: { icon: "🚚", color: "text-indigo-600" },
      DELIVERED: { icon: "✅", color: "text-green-600" },
      CANCELLED: { icon: "❌", color: "text-red-600" },
    };
    return statusInfo[status] || { icon: "📦", color: "text-gray-600" };
  };

  return (
    <div className="min-h-screen bg-gray-50 py-4 flex flex-col items-center px-4">
      <div className="max-w-md w-full space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {user?.role === "driver" ? "🚛 Driver Delivery" : "📦 Mark Delivered"}
          </h1>
          <p className="text-gray-600 text-sm">
            Scan the QR code on the parcel to confirm delivery
          </p>
          {user?.role === "driver" && (
            <p className="text-xs text-blue-600 mt-1 font-medium">
              Driver ID: {user?.id?.substring(0, 8)}...
            </p>
          )}
        </div>

        {/* Scanner */}
        {scannerActive && (
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <QRCodeScanner 
              onScan={handleScan} 
              isActive={!loading} 
            />
          </div>
        )}

        {/* Shipment Preview (when found but not yet updated) */}
        {shipmentInfo && !loading && scannerActive === false && !message?.startsWith("🎉") && (
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <div className="text-center mb-4">
              <div className="flex items-center justify-center mb-2">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                  <span className="text-xl">📦</span>
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-gray-900">
                    {shipmentInfo.shipment_number}
                  </h3>
                  <p className="text-sm text-gray-500">
                    Ready to mark as delivered
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-3 text-sm border-t pt-3">
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-600">Current Status</span>
                <span className={`${getStatusDisplay(shipmentInfo.status).color} font-medium`}>
                  {getStatusDisplay(shipmentInfo.status).icon} {shipmentInfo.status}
                </span>
              </div>
              
              {shipmentInfo.driver_id && (
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600">Assigned Driver</span>
                  <span className="text-blue-600 font-medium">
                    {shipmentInfo.driver_id.substring(0, 8)}...
                  </span>
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

              {shipmentInfo.sensor_unit_id && (
                <div className="flex justify-between items-center py-2 text-xs text-blue-600 bg-blue-50 p-2 rounded">
                  <span>Sensor Unit</span>
                  <span>{shipmentInfo.sensor_unit_id}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="bg-white rounded-lg shadow-sm border p-4 text-center">
            <div className="flex flex-col items-center space-y-3">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <div>
                <p className="text-blue-600 font-medium mb-2">{message || "Processing scan..."}</p>
                {scannedValue && (
                  <div className="text-xs text-blue-500 bg-blue-50 px-3 py-1 rounded">
                    <div className="font-mono text-[10px]">Scanned: {scannedValue.substring(0, 30)}...</div>
                    <div className="text-[10px] mt-1">ID: {scannedValue.split(":")[1]?.substring(0, 8)}...</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Messages */}
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

        {/* Action Buttons */}
        <div className="space-y-3">
          {/* Rescan Button */}
          {scannerActive === false && (
            <button
              onClick={handleRescan}
              disabled={loading}
              className={`w-full py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center ${
                loading
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Processing...
                </>
              ) : (
                "🔄 Scan Another Parcel"
              )}
            </button>
          )}

          {/* Manual Entry Button */}
          {scannerActive === false && !message?.startsWith("🎉") && (
            <button
              onClick={handleManualEntry}
              className="w-full py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors flex items-center justify-center"
            >
              ⌨️ Enter Shipment ID Manually
            </button>
          )}

          {/* Success Navigation */}
          {message?.startsWith("🎉") && (
            <button
              onClick={() => navigate("/parcels")}
              className="w-full py-3 px-4 bg-green-600 text-white rounded-lg font-medium transition-colors flex items-center justify-center"
            >
              ✅ View All Parcels
            </button>
          )}

          {/* Back Button */}
          <button
            onClick={() => navigate("/parcels")}
            className="w-full py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors"
          >
            ← Back to My Parcels
          </button>
        </div>

        {/* Instructions */}
        {scannerActive && !loading && !message && (
          <div className="text-center space-y-2 text-xs text-gray-500 bg-gray-50 p-3 rounded-lg">
            <p className="font-medium text-sm mb-2">📋 How to Scan</p>
            <div className="space-y-1 text-[11px]">
              <p>• Hold camera 6-12 inches from QR code</p>
              <p>• Ensure good, even lighting</p>
              <p>• Keep the QR code steady and level</p>
              <p>• Works with printed labels or phone screens</p>
            </div>
            <div className="text-[10px] text-gray-400 pt-2 border-t border-gray-200">
              <p>QR format: <code className="bg-gray-200 px-1 rounded">parcel:{user?.id?.substring(0, 8)}...</code></p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}