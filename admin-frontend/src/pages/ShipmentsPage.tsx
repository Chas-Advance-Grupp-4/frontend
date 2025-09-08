import { useEffect, useState } from "react";

// ---- Types ----
type ShipmentStatus =
  | "CREATED"
  | "ASSIGNED"
  | "IN_TRANSIT"
  | "DELIVERED"
  | "CANCELLED";

type Shipment = {
  id: string;
  external_ref?: string | null;
  sender_id: string;
  receiver_id: string;
  vehicle_id?: string | null;
  status: ShipmentStatus;
  min_temp?: number | null;
  max_temp?: number | null;
  max_humidity?: number | null;
  last_seen_lat?: number | null;
  last_seen_lon?: number | null;
  last_seen_at?: string | null;
  last_temp?: number | null;
  last_rh?: number | null;
  last_telemetry_at?: string | null;
  created_at: string;
  delivered_at?: string | null;
};

// ---- Helpers ----
function formatDateTime(iso?: string | null) {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return iso ?? "—";
  }
}

function statusBadgeClass(s: ShipmentStatus) {
  switch (s) {
    case "CREATED":
      return "bg-gray-100 text-gray-800";
    case "ASSIGNED":
      return "bg-indigo-100 text-indigo-800";
    case "IN_TRANSIT":
      return "bg-blue-100 text-blue-800";
    case "DELIVERED":
      return "bg-green-100 text-green-800";
    case "CANCELLED":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}

// ---- Component ----
export default function ShipmentsPage() {
  const [rows, setRows] = useState<Shipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/mock-shipments.json"); // hämtar från public/
        const data = await res.json();
        setRows(data.shipments);
      } catch (e: any) {
        setError("Failed to load shipments: " + e.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) return <p className="p-4">Loading mock shipments…</p>;
  if (error) return <p className="p-4 text-red-600">{error}</p>;

  return (
    <div className="p-4 md:p-6">
      <h1 className="text-2xl font-semibold mb-4">Shipments (Mock Data)</h1>

      <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 text-left text-gray-600">
            <tr>
              <th className="px-4 py-3 font-medium">Shipment</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Vehicle</th>
              <th className="px-4 py-3 font-medium">Last Temp/RH</th>
              <th className="px-4 py-3 font-medium">Created</th>
              <th className="px-4 py-3 font-medium">Delivered</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-t last:border-b">
                <td className="px-4 py-3">
                  <div className="font-medium text-gray-900">{r.id}</div>
                  <div className="text-xs text-gray-500">
                    {r.external_ref || "—"}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusBadgeClass(
                      r.status
                    )}`}
                  >
                    {r.status}
                  </span>
                </td>
                <td className="px-4 py-3">{r.vehicle_id ?? "—"}</td>
                <td className="px-4 py-3">
                  {r.last_temp != null || r.last_rh != null
                    ? `${r.last_temp ?? "—"}°C / ${r.last_rh ?? "—"}%`
                    : "—"}
                </td>
                <td className="px-4 py-3">{formatDateTime(r.created_at)}</td>
                <td className="px-4 py-3">{formatDateTime(r.delivered_at)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
