import { Outlet } from "react-router-dom";
import BottomNav from "./BottomNav";
import SettingsNav from "./OptionsNav";

export default function DriverLayout() {
	return (
		<div className="min-h-screen">
			<SettingsNav />
			<main className="mx-auto max-w-screen-2xl px-4 py-6">
				<Outlet />
			</main>
			<BottomNav />
		</div>
	);
}
