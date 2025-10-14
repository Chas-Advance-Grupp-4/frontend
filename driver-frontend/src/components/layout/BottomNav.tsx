import { NavLink } from "react-router-dom";
import { HomeIcon, QrCodeIcon, BellIcon } from "@heroicons/react/24/outline";

function BottomNav() {
	return (
		<footer className="fixed bottom-0 w-full z-30 bg-bg-default border-t border-gray-200">
			<nav className="flex justify-center space-x-20 items-center px-4 py-2 h-[70px] md:h-[80px]">
				{/* Home */}
				<NavLink
					to="/"
					className={({ isActive }) =>
						`flex flex-col items-center text-xs md:text-sm ${
							isActive ? "text-brand-primary" : "text-gray-500"
						}`
					}
				>
					<HomeIcon className="h-6 w-6 md:h-7 md:w-7" />
					<span>Home</span>
				</NavLink>

				{/* Scan */}
				<NavLink
					to="/scan"
					className={({ isActive }) =>
						`flex flex-col items-center text-xs md:text-sm ${
							isActive ? "text-brand-primary" : "text-gray-500"
						}`
					}
				>
					<QrCodeIcon className="h-6 w-6 md:h-7 md:w-7" />
					<span>Scan</span>
				</NavLink>

				{/* Notifications */}
				<NavLink
					to="/notifications"
					className={({ isActive }) =>
						`flex flex-col items-center text-xs md:text-sm ${
							isActive ? "text-brand-primary" : "text-gray-500"
						}`
					}
				>
					<BellIcon className="h-6 w-6 md:h-7 md:w-7" />
					<span>Notifications</span>
				</NavLink>
			</nav>
		</footer>
	);
}

export default BottomNav;
