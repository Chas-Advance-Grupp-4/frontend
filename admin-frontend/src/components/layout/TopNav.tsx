import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "@frontend/common";

function NavItem({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `rounded-md px-3 py-2 text-sm font-medium ${
          isActive
            ? "bg-blue-50 text-blue-700"
            : "text-gray-700 hover:bg-gray-50"
        }`
      }
    >
      {children}
    </NavLink>
  );
}

export default function TopNav() {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const nav = useNavigate();

  return (
    <header className="sticky top-0 z-30 border-b bg-white">
      <div className="mx-auto flex max-w-screen-2xl items-center justify-between px-4 py-3">
        {/* Left: logo + brand */}
        <NavItem to="/">
          <div className="flex items-center gap-3">
            <span className="text-base font-semibold text-gray-900">
              logivance 🚛
            </span>
          </div>
        </NavItem>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 md:flex">
          <NavItem to="/">Dashboard</NavItem>
          <NavItem to="/shipments">Shipments</NavItem>
          <NavItem to="/customers">Customers</NavItem>
          <NavItem to="/notifications">Notifications</NavItem>
        </nav>

        {/* Right: user menu */}
        <div className="hidden items-center gap-3 md:flex">
          <span className="text-sm text-gray-600">
            {user?.email ?? "Signed in"}
          </span>
          <button
            onClick={() => {
              logout();
              nav("/login", { replace: true });
            }}
            className="rounded-md border px-3 py-1.5 text-sm hover:bg-gray-50"
          >
            Sign out
          </button>
        </div>

        {/* Mobile menu button */}
        <button
          className="inline-flex items-center rounded-md border px-2 py-1.5 md:hidden"
          onClick={() => setOpen((o) => !o)}
          aria-label="Toggle navigation"
        >
          ☰
        </button>
      </div>

      {/* Mobile nav panel */}
      {open && (
        <div className="border-t bg-white px-4 py-2 md:hidden">
          <div className="flex flex-col gap-1">
            <NavItem to="/">Dashboard</NavItem>
            <NavItem to="/shipments">Shipments</NavItem>
            <NavItem to="/customers">Customers</NavItem>
            <NavItem to="/notifications">Notifications</NavItem>
            <button
              className="mt-2 rounded-md border px-3 py-2 text-left text-sm hover:bg-gray-50"
              onClick={() => {
                logout();
                setOpen(false);
                nav("/login", { replace: true });
              }}
            >
              Sign out
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
