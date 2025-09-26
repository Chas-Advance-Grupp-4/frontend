import { NavLink } from "react-router-dom";
import { HomeIcon, EnvelopeIcon, QrCodeIcon } from "@heroicons/react/24/outline";

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
          <HomeIcon className="h-5 w-5 md:h-6 md:w-6" />
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
          <QrCodeIcon className="h-5 w-5 md:h-6 md:w-6" />
          <span>Scan</span>
        </NavLink>

        {/* Parcels */}
        <NavLink
          to="/parcels"
          className={({ isActive }) =>
            `flex flex-col items-center text-xs md:text-sm ${
              isActive ? "text-brand-primary" : "text-gray-500"
            }`
          }
        >
          <EnvelopeIcon className="h-5 w-5 md:h-6 md:w-6" />
          <span>Parcels</span>
        </NavLink>
      </nav>
    </footer>
  );
}

export default BottomNav;