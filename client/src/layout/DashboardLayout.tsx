import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Menu } from "lucide-react";

import Sidebar, {
  type DashboardMenuItem,
} from "../components/dashboard/Sidebar";

type DashboardLayoutProps = {
  role: "buyer" | "seller";
  menuItems: DashboardMenuItem[];
  userName: string;
  userEmail?: string;
};

export default function DashboardLayout({
  role,
  menuItems,
  userName,
  userEmail,
}: DashboardLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    window.location.href = "/";
  };

  return (
    <div className="min-h-screen bg-gray-50 md:flex">

      <Sidebar
        role={role}
        menuItems={menuItems}
        userName={userName}
        userEmail={userEmail}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onLogout={handleLogout}
      />

      <main className="min-w-0 flex-1">

        {/* Dashboard header */}
        <header className="sticky top-0 z-30 flex h-[72px] items-center border-b border-gray-200 bg-white px-4 sm:px-6 md:px-8">

          <button
            type="button"
            aria-label="Open navigation menu"
            onClick={() => setIsSidebarOpen(true)}
            className="mr-3 rounded-lg p-2 text-gray-600 hover:bg-gray-100 md:hidden"
          >
            <Menu size={23} />
          </button>

          <div>
            <p className="text-xs text-gray-500 sm:text-sm">
              {role === "buyer" ? "Buyer Workspace" : "Seller Workspace"}
            </p>

            <h2 className="text-base font-semibold text-gray-900 sm:text-lg">
              Dashboard
            </h2>
          </div>

        </header>

        {/* Individual page content */}
        <section className="p-4 sm:p-6 md:p-8">
          <Outlet />
        </section>

      </main>
    </div>
  );
}