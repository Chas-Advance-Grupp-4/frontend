import React, { useEffect, useState } from "react";
import { getShipmentsForCurrentUser } from "../../../common/src/lib/shipmentApi";
import type { Shipment, ShipmentStatus } from "../../../common/src/types/shipment";
import Card from "../../../common/src/components/Card";
import QRCodeDisplay from "../components/QRCodeDisplay";
import { useAuth } from "../../../common/src/hooks/auth/AuthProvider";

export default function MyParcels() {
  const { user } = useAuth();
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState<"expecting" | "sent" | "history">("expecting");

  useEffect(() => {
    const fetchShipments = async () => {
      try {
        const data = await getShipmentsForCurrentUser();

        // Generate QR code values client-side for all shipments
        const shipmentsWithQR = data.map((shipment: Shipment) => {
          const qrValue = `parcel:${shipment.id}`;
          return {
            ...shipment,
            qr_code_value: qrValue
          };
        });

        setShipments(shipmentsWithQR);
      } catch (err: any) {
        console.error("Failed to fetch shipments:", err);
        setError(err.message || "Failed to load shipments");
      } finally {
        setLoading(false);
      }
    };
    if (user) {
      fetchShipments();
    }
  }, [user]);

  if (loading) {
    return <p className="text-center p-4">Loading parcels…</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  if (shipments.length === 0) {
    return <p className="text-center p-4">You have no parcels to view 📭</p>;
  }
  // Separate shipments into "expecting" and "sent"
  // const expecting = shipments.filter((s) => s.receiver_id === user?.id);
  // const sent = shipments.filter((s) => s.sender_id === user?.id);

 // For customers: separate into expecting (receiver) and sent (sender)
  // For drivers: all shipments are "assigned" so show them in one tab
  const isDriver = user?.role === "driver";
  
  const expecting = isDriver 
    ? [] // Drivers don't have "expecting" shipments
    : shipments.filter((s) => s.receiver_id === user?.id && s.status !== "DELIVERED");
    
  const sent = isDriver 
    ? shipments.filter((s) => s.status !== "DELIVERED") // Driver's assigned shipments
    : shipments.filter((s) => s.sender_id === user?.id);

const getStatusBadge = (status: ShipmentStatus) => {
  const statusConfig: Record<ShipmentStatus, { bg: string; text: string }> = {
    CREATED: { bg: "bg-yellow-100", text: "text-yellow-800" },
    ASSIGNED: { bg: "bg-blue-100", text: "text-blue-800" },
    IN_TRANSIT: { bg: "bg-indigo-100", text: "text-indigo-800" },
    DELIVERED: { bg: "bg-green-100", text: "text-green-800" },
    CANCELLED: { bg: "bg-red-100", text: "text-red-800" },
  };
  
  const config = statusConfig[status] || { bg: "bg-gray-100", text: "text-gray-800" };
  
  return (  // ← Added return statement
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
      {status}
    </span>
  );  // ← Fixed brace placement
};

  const handlePrintQR = (shipmentId: string, shipmentNumber: string) => {
    console.log(`🖨️ Printing QR for shipment ${shipmentNumber} (${shipmentId})`);
    // The QRCodeDisplay component handles the actual printing
  };

  const renderShipments = (shipmentsList: Shipment[], title: string, isDriverView = false) => (
    <div className="space-y-4">
      {shipmentsList.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p className="text-lg">{isDriverView ? "No assigned shipments" : `No ${title.toLowerCase()}`}</p>
          <p className="text-sm mt-1">
            {isDriverView 
              ? "You have no shipments assigned to you yet"
              : title === "Expecting" 
                ? "No incoming parcels at this time"
                : "No sent parcels yet"
            }
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {shipmentsList.map((shipment) => (
            <Card
              key={shipment.id}
              title={shipment.shipment_number}
              subtitle={`Created: ${new Date(shipment.created_at).toLocaleDateString()}`}
            >
              {/* Basic Info */}
              <div className="space-y-2 mb-3">
                {!isDriverView && (
                  <p className="text-sm text-gray-600">
                    <strong>{title === "Expecting" ? "From:" : "To:"}</strong> 
                    {title === "Expecting" ? shipment.sender_id : shipment.receiver_id}
                  </p>
                )}
                
                {shipment.driver_id && (
                  <p className="text-sm text-gray-600">
                    <strong>Driver:</strong> {shipment.driver_id}
                  </p>
                )}
                
                {shipment.sensor_unit_id && (
                  <p className="text-sm text-gray-600">
                    <strong>Sensor:</strong> {shipment.sensor_unit_id}
                  </p>
                )}
              </div>

              {/* Status */}
              <div className="mb-3">
                <p className="text-sm text-gray-600 mb-1"><strong>Status:</strong></p>
                {getStatusBadge(shipment.status)}
              </div>

              {/* Sensor Data (if available) */}
              {/* {shipment.latest_temperature !== undefined && (
                <div className="text-xs bg-blue-50 p-2 rounded">
                  <p className="text-blue-800">
                    🌡️ {shipment.latest_temperature}°C 
                    {shipment.latest_humidity !== undefined && (
                      <> • 💧 {shipment.latest_humidity}%</>
                    )}
                  </p>
                  {shipment.temperature_updated_at && (
                    <p className="text-blue-600 text-[10px] mt-1">
                      Updated: {new Date(shipment.temperature_updated_at).toLocaleTimeString()}
                    </p>
                  )}
                </div>
              )} */}

              {/* QR Code - Only show for non-delivered shipments that user can manage */}
              {shipment.status !== "DELIVERED" && 
               (isDriverView || shipment.sender_id === user?.id) && (
                <div className="mt-4 pt-2 border-t border-gray-200">
                  <QRCodeDisplay 
                    value={shipment.qr_code_value || `parcel:${shipment.id}`}
                    shipment_number={shipment.shipment_number}
                    onPrint={() => handlePrintQR(shipment.id, shipment.shipment_number)}
                  />
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );

  if (isDriver) {
    // Simplified view for drivers - just their assigned shipments
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6 text-center">My Assigned Shipments 🚛</h1>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h2 className="text-lg font-semibold text-blue-800 mb-2">👋 Welcome, Driver!</h2>
          <p className="text-blue-700 text-sm">
            These are the parcels assigned to you for delivery. Scan the QR codes to mark them as delivered.
          </p>
        </div>

        {renderShipments(sent, "Assigned", true)}
      </div>
    );
  }

  // Customer view with tabs
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 text-center">My Parcels 📦</h1>

      {/* Tabs - only for customers */}
      <div className="flex justify-center mb-6 bg-white rounded-t-lg shadow-sm">
        <button
          className={`px-6 py-3 rounded-t-lg font-medium transition-colors ${
            tab === "expecting" 
              ? "bg-blue-600 text-white shadow-md" 
              : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
          }`}
          onClick={() => setTab("expecting")}
        >
          Expecting ({expecting.length})
        </button>
        <button
          className={`px-6 py-3 rounded-t-lg font-medium transition-colors ${
            tab === "sent" 
              ? "bg-blue-600 text-white shadow-md" 
              : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
          }`}
          onClick={() => setTab("sent")}
        >
          Sent by Me ({sent.length})
        </button>
        <button
          className={`px-4 py-2 rounded-t-lg ${
            tab === "history" ? " font-bold underline underline-offset-8" : ""
          }`}
          onClick={() => setTab("history")}
        >
          My History
        </button>
      </div>

      {tab === "expecting" ? (
        <>
          <h2 className="text-xl font-semibold mb-4 text-gray-800">📥 Expecting ({expecting.length})</h2>
          {renderShipments(expecting, "Expecting")}
        </>
      ) : tab === "sent" ?(
        <>
          <h2 className="text-xl font-semibold mb-4 text-gray-800">📤 Sent by Me ({sent.length})</h2>
          {renderShipments(sent, "Sent")}
        </>
      ):(
        <>
              {/* History */} 
              {pastShipments.length === 0 ? (
                <p className="text-sm text-gray-500 mb-4">No history</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 justify-items-around">
                  {pastShipments.map((s) => (
                    <Card
                      key={s.id}
                      title={s.shipment_number}
                      subtitle={`Created: ${new Date(
                        s.created_at  
                      ).toLocaleDateString()}`}
                    >
                      <p className="text-sm text-gray-600">
                        <strong>Status:</strong> {s.status}
                      </p>
                    </Card>
                  ))}
                </div>
              )}
            </>
      )}
    </div>
   
  );
}
