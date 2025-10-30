// import { useNavigate } from "react-router-dom";
// import QRCodeScanner from "../components/QRCodeScanner";

// export default function ScanParcel() {
//   const navigate = useNavigate();

//   const handleScan = (value: string) => {
//     console.log("Scanned:", value);
//     const id = value.split("/parcel/")[1];
//     if (id) navigate(`/parcel/${id}`);
//   };

//   return (
//     <div className="p-4">
//       <QRCodeScanner onScan={handleScan} />
//     </div>
//   );
// }

import { useNavigate } from "react-router-dom";
import QRCodeScanner from "../components/QRCodeScanner";
import { useState, useEffect } from "react";

export default function ScanParcel() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [scanned, setScanned] = useState(false);

  // Cleanup effect
  useEffect(() => {
    return () => {
      console.log("Leaving ScanParcel page - cleaning up...");
    };
  }, []);

  const handleScan = async (value: string) => {
    console.log("📦 Scanned QR:", value);
    setScanned(true);

    const idMatch = value.match(/([0-9a-fA-F-]{36})/);
    const shipmentId = idMatch ? idMatch[1] : null;

    if (!shipmentId) {
      setMessage("❌ Invalid QR code format — shipment ID not found");
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/shipments/${shipmentId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: "DELIVERED" }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || "Failed to update shipment");
      }

      const updatedShipment = await response.json();
      console.log("✅ Shipment updated:", updatedShipment);
      setMessage(`✅ Shipment marked as DELIVERED`);

      setTimeout(() => navigate(`/parcel/${shipmentId}`), 1500);
    } catch (err: any) {
      console.error("🚨 Error updating shipment:", err);
      setMessage(`❌ ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleRescan = () => {
    setScanned(false);
    setMessage(null);
  };

  return (
    <div className="p-4 flex flex-col items-center">
      {/* Pass isActive prop - only active when not scanned and not loading */}
      {!scanned && <QRCodeScanner onScan={handleScan} isActive={!loading && !scanned} />}

      {loading && <p className="text-blue-600 mt-4">Updating shipment...</p>}

      {message && (
        <p
          className={`mt-4 text-sm ${
            message.startsWith("✅")
              ? "text-green-600"
              : "text-red-500"
          }`}
        >
          {message}
        </p>
      )}

      {scanned && !loading && (
        <button
          onClick={handleRescan}
          className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Re-scan another parcel
        </button>
      )}
    </div>
  );
}