import React, { useEffect, useState } from "react";
import { getShipmentsForCurrentUser } from "../../../common/src/lib/shipmentApi";
import type { Shipment, ShipmentStatus } from "../../../common/src/types/shipment";
import Card from "../../../common/src/components/Card";
import { useAuth } from "../../../common/src/hooks/auth/AuthProvider";
import QRCodeDisplay from "../components/QRCodeDisplay";

export default function Deliveries() {
    const { user } = useAuth();
    const [shipments, setShipments] = useState<Shipment[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!user) return;
        let cancelled = false;

        const fetchShipments = async () => {
            setLoading(true);
            try {
                const data = await getShipmentsForCurrentUser();
                // ensure qr_code_value exists for UI/printing
                const withQR = data.map((s: Shipment) => ({
                    ...s,
                    qr_code_value: s.qr_code_value ?? `parcel:${s.id}`,
                }));
                if (!cancelled) setShipments(withQR);
            } catch (err: any) {
                console.error(err);
                if (!cancelled) setError(err.message || "Failed to load shipments");
            } finally {
                if (!cancelled) setLoading(false);
            }
        };

        fetchShipments();
        return () => {
            cancelled = true;
        };
    }, [user]);

    if (loading) {
        return <p className="text-center p-4">Loading deliveries…</p>;
    }

    if (error) {
        return <p className="text-center text-red-500 p-4">{error}</p>;
    }

    // filter shipments for the driver
    const assignedToMe = shipments.filter((s) => s.driver_id === user?.id);

    if (assignedToMe.length === 0) {
        return <p className="text-center p-4">No assigned deliveries 🚚</p>;
    }

    // group shipments into categories
    const toPickUp = assignedToMe.filter(
        (s) => s.status === "ASSIGNED" || s.status === "CREATED"
    );
    const inTransit = assignedToMe.filter((s) => s.status === "IN_TRANSIT");
    const delivered = assignedToMe.filter((s) => s.status === "DELIVERED");
    const cancelled = assignedToMe.filter((s) => s.status === "CANCELLED");

    const getStatusBadge = (status: ShipmentStatus) => {
        const map: Record<ShipmentStatus, { bg: string; text: string }> = {
            CREATED: { bg: "bg-yellow-100", text: "text-yellow-800" },
            ASSIGNED: { bg: "bg-blue-100", text: "text-blue-800" },
            IN_TRANSIT: { bg: "bg-indigo-100", text: "text-indigo-800" },
            DELIVERED: { bg: "bg-green-100", text: "text-green-800" },
            CANCELLED: { bg: "bg-red-100", text: "text-red-800" },
        };
        const cfg = map[status] || { bg: "bg-gray-100", text: "text-gray-800" };
        return (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${cfg.bg} ${cfg.text}`}>
                {status}
            </span>
        );
    };

    return (
        <div className="p-6">
            {/* To pick up */}
            <h2 className="text-xl text-text-primary font-semibold mt-6 mb-2">Pick-up</h2>
            {toPickUp.length === 0 ? (
                <p className="text-sm text-gray-500 mb-4">No parcels to pick up</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 justify-items-around">
                    {toPickUp.map((s) => (
                        <Card
                            key={s.id}
                            title={s.shipment_number}
                            subtitle={`Created: ${new Date(s.created_at).toLocaleDateString()}`}
                        >
                            <p className="text-sm text-gray-600">
                                <strong>From:</strong> {s.sender_id.slice(0, 8)}…
                            </p>
                            {s.driver_id && (
                                <p className="text-sm text-gray-600">
                                    <strong>Driver:</strong> {s.driver_id.slice(0, 8)}…
                                </p>
                            )}

                            <div className="mt-3 flex items-center justify-between">
                                {getStatusBadge(s.status)}
                                { s.status !== "DELIVERED" && (
                                    <div className="w-32">
                                        <QRCodeDisplay value={s.qr_code_value || `parcel:${s.id}`} shipment_number={s.shipment_number} onPrint={() => window.print()} />
                                    </div>
                                ) }
                            </div>
                        </Card>
                    ))}
                </div>
            )}

            {/* On Board the truck */}
            <h2 className="text-xl text-text-primary font-semibold mt-8 mb-2">On Board</h2>
            {inTransit.length === 0 ? (
                <p className="text-sm text-gray-500 mb-4">No parcels currently in transit</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 justify-items-around">
                    {inTransit.map((s) => (
                        <Card
                            key={s.id}
                            title={s.shipment_number}
                            subtitle={`Created: ${new Date(s.created_at).toLocaleDateString()}`}
                        >
                            <p className="text-sm text-gray-600">
                                <strong>To:</strong> {s.receiver_id.slice(0, 8)}…
                            </p>
                            {s.driver_id && (
                                <p className="text-sm text-gray-600">
                                    <strong>Driver:</strong> {s.driver_id.slice(0, 8)}…
                                </p>
                            )}

                            <div className="mt-3 flex items-center justify-between">
                                {getStatusBadge(s.status)}
                                { s.status !== "DELIVERED" && (
                                    <div className="w-32">
                                        <QRCodeDisplay value={s.qr_code_value || `parcel:${s.id}`} shipment_number={s.shipment_number} onPrint={() => window.print()} />
                                    </div>
                                ) }
                            </div>
                        </Card>
                    ))}
                </div>
            )}

            {/* Delivery history */}
            <h2 className="text-xl text-text-primary font-semibold mt-8 mb-2">Delivery History</h2>
            {delivered.length === 0 ? (
                <p className="text-sm text-gray-500 mb-4">No parcels delivered...yet!</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 justify-items-around">
                    {delivered.map((s) => (
                        <Card
                            key={s.id}
                            title={s.shipment_number}
                            subtitle={`Created: ${new Date(s.created_at).toLocaleDateString()}`}
                        >
                            <p className="text-sm text-gray-600">
                                <strong>To:</strong> {s.receiver_id.slice(0, 8)}…
                            </p>
                            {s.driver_id && (
                                <p className="text-sm text-gray-600">
                                    <strong>Driver:</strong> {s.driver_id.slice(0, 8)}…
                                </p>
                            )}
                        </Card>
                    ))}
                </div>
            )}

            {/* Cancelled */}
            {cancelled.length > 0 && (
                <>
                    <h2 className="text-xl font-semibold mt-8 mb-2 text-red-600">Cancelled</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {cancelled.map((s) => (
                            <Card key={s.id} title={s.shipment_number}>
                                <p className="text-sm text-gray-600">
                                    <strong>Sender:</strong> {s.sender_id.slice(0, 8)}…
                                </p>
                                <p className="text-sm text-gray-600">
                                    <strong>Receiver:</strong> {s.receiver_id.slice(0, 8)}…
                                </p>
                            </Card>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
