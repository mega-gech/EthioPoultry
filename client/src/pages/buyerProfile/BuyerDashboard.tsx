import { NavLink, Link } from "react-router-dom";
import {
  LayoutDashboard,
  UserRound,
  ShoppingBag,
  Heart,
  Settings,
  LogOut,
  Package,
  Clock,
  CheckCircle,
  ArrowRight,
} from "lucide-react";

const menuItems = [
  { label: "Dashboard", to: "/buyer/dashboard", icon: LayoutDashboard },
  { label: "My Orders", to: "/buyer/orders", icon: ShoppingBag },
  { label: "Favorites", to: "/buyer/favorites", icon: Heart },
  { label: "Settings", to: "/buyer/settings", icon: Settings },
];

// Sample orders for frontend development.
// Later, load these from the backend.
const recentOrders = [
  {
    id: "EP-1001",
    product: "Fresh Eggs (30 pcs)",
    seller: "Abebe Poultry Farm",
    date: "Oct 12, 2026",
    quantity: "2 trays",
    total: 480,
    status: "Completed",
  },
  {
    id: "EP-1002",
    product: "Brown Layer Chicken",
    seller: "Abebe Poultry Farm",
    date: "Oct 13, 2026",
    quantity: "1 chicken",
    total: 850,
    status: "Pending",
  },
  {
    id: "EP-1003",
    product: "Fresh Eggs (30 pcs)",
    seller: "Gojjam Poultry",
    date: "Oct 13, 2026",
    quantity: "1 tray",
    total: 240,
    status: "Processing",
  },
];

const stats = [
  { label: "Total Orders", value: "3", icon: ShoppingBag },
  { label: "Pending", value: "1", icon: Clock },
  { label: "Completed", value: "1", icon: CheckCircle },
  { label: "Favorites", value: "4", icon: Heart },
];

function formatPrice(price: number) {
  return `${price.toLocaleString()} ETB`;
}

function getStatusStyle(status: string) {
  switch (status) {
    case "Completed":
      return "bg-emerald-50 text-emerald-700 ring-emerald-600/20";
    case "Pending":
      return "bg-amber-50 text-amber-700 ring-amber-600/20";
    case "Processing":
      return "bg-sky-50 text-sky-700 ring-sky-600/20";
    default:
      return "bg-slate-50 text-slate-600 ring-slate-500/20";
  }
}

function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${getStatusStyle(
        status
      )}`}
    >
      {status}
    </span>
  );
}

export default function BuyerDashboard() {
  return (
    <div className="min-h-screen bg-white px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <div className="grid lg:grid-cols-[260px_minmax(0,1fr)]">
          {/* Sidebar */}
          <aside className="flex flex-col border-b border-slate-200 p-5 lg:border-b-0 lg:border-r">
            <Link to="/" className="mb-8 flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-700 text-lg">
                🐔
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900">
                  EthioPoultry
                </p>
                <p className="text-xs text-slate-500">Poultry Marketplace</p>
              </div>
            </Link>

            <nav className="space-y-1" aria-label="Buyer navigation">
              {menuItems.map(({ label, to, icon: Icon }) => (
                <NavLink
                  key={to}
                  to={to}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                      isActive
                        ? "bg-emerald-50 font-medium text-emerald-800"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    }`
                  }
                >
                  <Icon size={18} />
                  <span>{label}</span>
                </NavLink>
              ))}
            </nav>

            {/* Bottom: user + logout */}
            <div className="mt-8 border-t border-slate-100 pt-5 lg:mt-auto">
              <div className="mb-3 flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-sm font-semibold text-slate-700">
                  M
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-slate-900">
                    Megabi Getaneh
                  </p>
                  <p className="truncate text-xs text-slate-500">
                    megabi@example.com
                  </p>
                </div>
              </div>

              <Link
                to="/login"
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-slate-600 transition-colors hover:bg-red-50 hover:text-red-700"
              >
                <LogOut size={18} />
                Logout
              </Link>
            </div>
          </aside>

          {/* Dashboard content */}
          <main className="min-w-0 space-y-6 bg-slate-50/60 p-4 sm:p-6 lg:p-8">
            {/* Welcome */}
            <section className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h1 className="text-xl font-semibold text-slate-900 sm:text-2xl">
                  Welcome back, Megabi
                </h1>
                <p className="mt-1 text-sm text-slate-500">
                  Track your orders and explore fresh poultry products.
                </p>
              </div>

              <Link
                to="/products"
                className="inline-flex items-center gap-2 rounded-lg bg-emerald-700 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-emerald-800"
              >
                Browse Products
                <ArrowRight size={16} />
              </Link>
            </section>

            {/* Statistics */}
            <section
              className="grid grid-cols-2 gap-4 lg:grid-cols-4"
              aria-label="Order statistics"
            >
              {stats.map(({ label, value, icon: Icon }) => (
                <div
                  key={label}
                  className="rounded-xl border border-slate-200 bg-white p-4"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-slate-500">{label}</p>
                    <Icon size={18} className="text-slate-400" />
                  </div>
                  <p className="mt-2 text-2xl font-semibold text-slate-900">
                    {value}
                  </p>
                </div>
              ))}
            </section>

            {/* Recent orders */}
            <section className="overflow-hidden rounded-xl border border-slate-200 bg-white">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-5 py-4">
                <div>
                  <h2 className="text-base font-semibold text-slate-900">
                    Recent Orders
                  </h2>
                  <p className="mt-0.5 text-sm text-slate-500">
                    Check the status of your latest orders.
                  </p>
                </div>

                <Link
                  to="/buyer/orders"
                  className="inline-flex items-center gap-1 text-sm font-medium text-emerald-700 hover:text-emerald-800"
                >
                  View all
                  <ArrowRight size={15} />
                </Link>
              </div>

              {/* Desktop table */}
              <div className="hidden overflow-x-auto md:block">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 text-xs font-medium uppercase tracking-wide text-slate-500">
                    <tr>
                      <th className="px-5 py-3">Order</th>
                      <th className="px-5 py-3">Product</th>
                      <th className="px-5 py-3">Date</th>
                      <th className="px-5 py-3">Total</th>
                      <th className="px-5 py-3">Status</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">
                    {recentOrders.map((order) => (
                      <tr key={order.id} className="hover:bg-slate-50/60">
                        <td className="whitespace-nowrap px-5 py-4 font-medium text-slate-900">
                          {order.id}
                        </td>
                        <td className="px-5 py-4">
                          <p className="font-medium text-slate-900">
                            {order.product}
                          </p>
                          <p className="mt-0.5 text-xs text-slate-500">
                            {order.seller} · {order.quantity}
                          </p>
                        </td>
                        <td className="whitespace-nowrap px-5 py-4 text-slate-500">
                          {order.date}
                        </td>
                        <td className="whitespace-nowrap px-5 py-4 font-medium text-slate-900">
                          {formatPrice(order.total)}
                        </td>
                        <td className="whitespace-nowrap px-5 py-4">
                          <StatusBadge status={order.status} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile order cards */}
              <div className="divide-y divide-slate-100 md:hidden">
                {recentOrders.map((order) => (
                  <article key={order.id} className="space-y-2 p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-medium text-slate-900">
                          {order.product}
                        </p>
                        <p className="mt-0.5 text-xs text-slate-500">
                          {order.id} · {order.seller}
                        </p>
                      </div>
                      <StatusBadge status={order.status} />
                    </div>

                    <div className="flex flex-wrap justify-between gap-2 text-sm">
                      <span className="text-slate-500">
                        {order.date} · {order.quantity}
                      </span>
                      <span className="font-medium text-slate-900">
                        {formatPrice(order.total)}
                      </span>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            {/* Quick links */}
            <section className="grid gap-4 sm:grid-cols-2">
              <Link
                to="/buyer/orders"
                className="group flex items-center justify-between rounded-xl border border-slate-200 bg-white p-5 transition-colors hover:border-slate-300 hover:bg-slate-50"
              >
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-slate-100 p-2.5 text-slate-600">
                    <Package size={20} />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900">
                      My Orders
                    </h3>
                    <p className="mt-0.5 text-sm text-slate-500">
                      View your purchase history.
                    </p>
                  </div>
                </div>
                <ArrowRight
                  size={18}
                  className="text-slate-400 transition-colors group-hover:text-slate-700"
                />
              </Link>

              <Link
                to="/buyer/favorites"
                className="group flex items-center justify-between rounded-xl border border-slate-200 bg-white p-5 transition-colors hover:border-slate-300 hover:bg-slate-50"
              >
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-slate-100 p-2.5 text-slate-600">
                    <Heart size={20} />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900">
                      Favorite Products
                    </h3>
                    <p className="mt-0.5 text-sm text-slate-500">
                      Return to products you like.
                    </p>
                  </div>
                </div>
                <ArrowRight
                  size={18}
                  className="text-slate-400 transition-colors group-hover:text-slate-700"
                />
              </Link>
            </section>

            <footer className="pt-2 text-center text-xs text-slate-500">
              © {new Date().getFullYear()} EthioPoultry. Connecting buyers
              with poultry farmers.
            </footer>
          </main>
        </div>
      </div>
    </div>
  );
}