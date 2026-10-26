
import { useState } from "react";

import {
  LayoutDashboard,
  Package,
  PlusCircle,
  MessageSquare,
  ShoppingBag,
  UserRound,
  Settings,
  LogOut,
  Egg,
  Menu,
  Bell,
  X,
} from "lucide-react";

import DashboardStats from "./DashboardStats";
import RecentProducts from "./RecentProducts";

const navigation = [
  { name: "Dashboard", icon: LayoutDashboard, href: "/seller/dashboard" },
  { name: "My Products", icon: Package, href: "/seller/products" },
  { name: "Add Product", icon: PlusCircle, href: "/seller/products/add" },
  { name: "Messages", icon: MessageSquare, href: "/seller/messages" },
  { name: "Orders", icon: ShoppingBag, href: "/seller/orders" },
  { name: "Profile", icon: UserRound, href: "/seller/profile" },
  { name: "Settings", icon: Settings, href: "/seller/settings" },
];

export default function SellerDashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <div className="min-h-screen bg-gray-50 md:flex">
      {/* Mobile overlay */}
      {isSidebarOpen && (
        <button
          type="button"
          aria-label="Close navigation menu"
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col
          bg-emerald-950 text-white transition-transform duration-300
          md:static md:min-h-screen md:w-60 md:shrink-0 md:translate-x-0
          ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-700">
              <Egg size={24} />
            </div>

            <div>
              <h1 className="text-lg font-bold">EthioPoultry</h1>
              <p className="text-xs text-emerald-200">
                Seller Center
              </p>
            </div>
          </div>

          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setIsSidebarOpen(false)}
            className="rounded-lg p-2 hover:bg-emerald-900 md:hidden"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-5">
          <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-emerald-300">
            Menu
          </p>

          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = item.name === "Dashboard";

            return (
              <a
                key={item.name}
                href={item.href}
                onClick={() => setIsSidebarOpen(false)}
                className={`flex items-center gap-3 rounded-lg px-3 py-3 text-sm transition ${
                  isActive
                    ? "bg-emerald-700 font-semibold text-white"
                    : "text-emerald-100 hover:bg-emerald-900"
                }`}
              >
                <Icon size={19} />
                <span>{item.name}</span>
              </a>
            );
          })}

          <div className="pt-5">
            <button
              type="button"
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-sm text-red-200 transition hover:bg-red-500/10"
            >
              <LogOut size={19} />
              <span>Logout</span>
            </button>
          </div>
        </nav>

        <div className="border-t border-white/10 px-5 py-4">
          <p className="text-xs text-emerald-300">
            Growing together with Ethiopian farmers
          </p>
        </div>
      </aside>

      {/* Main content */}
      <main className="min-w-0 flex-1">
        {/* Topbar */}
        <header className="sticky top-0 z-30 flex h-[72px] items-center justify-between border-b border-gray-200 bg-white px-4 sm:px-6 md:px-8">
          <div className="flex items-center gap-3">
            <button
              type="button"
              aria-label="Open navigation menu"
              onClick={() => setIsSidebarOpen(true)}
              className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 md:hidden"
            >
              <Menu size={23} />
            </button>

            <div>
              <p className="text-xs text-gray-500 sm:text-sm">
                Seller Workspace
              </p>
              <h2 className="text-base font-semibold text-gray-900 sm:text-lg">
                Dashboard
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <button
              type="button"
              aria-label="Notifications"
              className="rounded-full p-2 text-gray-600 hover:bg-gray-100"
            >
              <Bell size={20} />
            </button>

            <div className="flex items-center gap-2 border-l border-gray-200 pl-3 sm:gap-3 sm:pl-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-100 font-bold text-emerald-800">
                A
              </div>

              <div className="hidden sm:block">
                <p className="text-sm font-semibold text-gray-900">
                  Abebe
                </p>
                <p className="text-xs text-gray-500">
                  Seller Account
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard content */}
        <section className="p-4 sm:p-6 md:p-8">
          <div>
            <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">
              Welcome back, Abebe!
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Here is what is happening with your poultry business today.
            </p>
          </div>

          {/* Summary cards */}
          <DashboardStats />

          {/* Recent products */}
          <RecentProducts />
        </section>
      </main>
    </div>
  );
}
