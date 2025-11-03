import type { ShipmentStatus } from "../types/shipment";

const STATUS_META: Record<
	ShipmentStatus,
	{ label: string; icon: string; className: string }
> = {
	created: {
		label: "Preparing for pickup",
		icon: "📦",
		className: "bg-yellow-100 text-yellow-800",
	},
	assigned: {
		label: "Driver assigned",
		icon: "👷",
		className: "bg-blue-100 text-blue-800",
	},
	in_transit: {
		label: "In transit",
		icon: "🚚",
		className: "bg-indigo-100 text-indigo-800",
	},
	delivered: {
		label: "Delivered",
		icon: "✅",
		className: "bg-green-100 text-green-800",
	},
	cancelled: {
		label: "Cancelled",
		icon: "❌",
		className: "bg-red-100 text-red-800",
	},
};

// Text (for logs, table, etc)
export function getShipmentStatusLabel(status: ShipmentStatus): string {
	const info = STATUS_META[status];
	return `${info.label} ${info.icon}`;
}

export function ShipmentStatusBadge({ status }: { status: ShipmentStatus }) {
	const { label, icon, className } = STATUS_META[status];
	return (
		<span className={`px-2 py-1 rounded-full text-xs font-medium ${className}`}>
			{label} {icon}
		</span>
	);
}
