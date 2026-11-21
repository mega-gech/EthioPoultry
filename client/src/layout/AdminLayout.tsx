import { useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AdminHeader from "../components/dashboard/AdminHeader";
import AdminSidebar from "../components/dashboard/AdminSidebar";

const pageTitles: Record<string, string> = {
  "/admin/dashboard": "Dashboard",
  "/admin/users": "User Management",
  "/admin/products": "Product Management",
  "/admin/sellers": "Seller Management",
  "/admin/orders": "Order Management",
  "/admin/market-prices": "Market Price Management",
  "/admin/reports": "Reports & Complaints",
  "/admin/settings": "Admin Settings",
};

export default function AdminLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate("/", { replace: true });
  };

  return (
    <div className="min-h-screen bg-gray-50 md:flex md:items-start">
      <AdminSidebar
        userName={user?.name || "Admin"}
        userEmail={user?.email}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onLogout={handleLogout}
      />

      <main className="min-w-0 flex-1">
        <AdminHeader
          pageTitle={pageTitles[location.pathname] || "Dashboard"}
          onOpenMenu={() => setIsSidebarOpen(true)}
        />
        <section className="p-4 sm:p-6 md:p-8">
          <Outlet />
        </section>
      </main>
    </div>
  );
}
