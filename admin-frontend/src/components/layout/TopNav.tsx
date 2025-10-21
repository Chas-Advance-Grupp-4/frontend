import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth, ToggleTheme } from "@frontend/common/src";
function NavItem({ to, children }: { to: string; children: React.ReactNode }) {
	return (
		<NavLink
			to={to}
			className={({ isActive }) =>
				`rounded-md px-3 py-2 text-sm font-medium ${
					isActive
						? "bg-brand-accent text-brand-primary"
						: "text-brand-secondary hover:bg-brand-muted"
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
		<header className="sticky top-0 z-30 border-b bg-bg-default">
			<div className="mx-auto flex max-w-screen-2xl items-center justify-between px-4 py-3">
				{/* Left: logo + brand */}
				<NavItem to="/">
					<div className="flex items-center gap-3">
						<span className="text-base font-semibold text-brand-primary">
							logivance 🚛
						</span>
					</div>
				</NavItem>

				{/* Desktop nav */}
				<nav className="hidden items-center gap-1 md:flex">
					<NavItem to="/">Dashboard</NavItem>
					<NavItem to="/shipments">Shipments</NavItem>
					<NavItem to="/users">User Management</NavItem>
					<NavItem to="/notifications">Notifications</NavItem>
					<ToggleTheme />
				</nav>

				{/* Right: user menu */}
				<div className="hidden items-center gap-3 md:flex">
					<span className="text-sm text-text-secondary">
						{user?.username ?? "Signed in"}
					</span>
					<button
						onClick={() => {
							logout();
							nav("/login", { replace: true });
						}}
						className="rounded-md border px-3 py-1.5 text-sm text-text-primary hover:bg-brand-muted"
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
				<div className="border-t bg-bg-card px-4 py-2 md:hidden">
					<div className="flex flex-col gap-1">
						<NavItem to="/">Dashboard</NavItem>
						<NavItem to="/shipments">Shipments</NavItem>
						<NavItem to="/users">User Management</NavItem>
						<NavItem to="/notifications">Notifications</NavItem>
						<ToggleTheme />
						<button
							className="mt-2 rounded-md border px-3 py-2 text-left text-sm bg-bg-default hover:bg-brand-muted"
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
