import TopNav from "./TopNav";
import { Outlet } from "react-router-dom";

export default function AdminLayout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <TopNav />
      <main className="mx-auto max-w-screen-2xl px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
}
