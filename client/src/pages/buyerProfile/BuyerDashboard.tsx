
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
  MapPin,
} from "lucide-react";

const menuItems = [
  { label: "Dashboard", to: "/buyer/dashboard", icon: LayoutDashboard },
  { label: "My Profile", to: "/buyer/profile", icon: UserRound },
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
  {
    label: "Total Orders",
    value: "3",
    icon: ShoppingBag,
    color: "bg-blue-50 text-blue-700",
  },
  {
    label: "Pending Orders",
    value: "1",
    icon: Clock,
    color: "bg-amber-50 text-amber-700",
  },
  {
    label: "Completed Orders",
    value: "1",
    icon: CheckCircle,
    color: "bg-green-50 text-green-700",
  },
  {
    label: "Favorite Products",
    value: "4",
    icon: Heart,
    color: "bg-rose-50 text-rose-700",
  },
];

function formatPrice(price: number) {
  return `${price.toLocaleString()} ETB`;
}

function getStatusStyle(status: string) {
  switch (status) {
    case "Completed":
      return "bg-green-100 text-green-800";
    case "Pending":
      return "bg-amber-100 text-amber-800";
    case "Processing":
      return "bg-blue-100 text-blue-800";
    default:
      return "bg-gray-100 text-gray-700";
  }
}

export default function BuyerDashboard() {
  return (
    <div className="min-h-screen bg-white px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Page heading */}
        <div className="mb-7">
          <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
            Buyer Dashboard
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Manage your orders and discover poultry products.
          </p>
        </div>

        <div className="grid overflow-hidden rounded-2xl border border-gray-200 lg:grid-cols-[285px_minmax(0,1fr)]">
          {/* Sidebar */}
          <aside className="border-b border-gray-200 p-5 sm:p-6 lg:border-b-0 lg:border-r">
            <Link to="/" className="mb-9 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 text-xl">
                🐔
              </div>
              <div>
                <p className="font-bold text-green-800">EthioPoultry</p>
                <p className="text-xs text-gray-500">
                  Poultry Marketplace
                </p>
              </div>
            </Link>

            {/* Buyer summary */}
            <div className="mb-8 text-center">
              <div className="mx-auto mb-4 flex h-[88px] w-[88px] items-center justify-center rounded-full bg-green-100 text-3xl font-bold text-green-800">
                M
              </div>
              <h2 className="font-semibold text-gray-900">
                Megabi Getaneh
              </h2>
              <p className="mt-1 break-all text-sm text-gray-500">
                megabi@example.com
              </p>
            </div>

            <nav className="space-y-2" aria-label="Buyer navigation">
              {menuItems.map(({ label, to, icon: Icon }) => (
                <NavLink
                  key={to}
                  to={to}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-lg border-l-4 px-3 py-3 text-sm transition ${
                      isActive
                        ? "border-green-700 bg-green-50 font-semibold text-green-800"
                        : "border-transparent text-gray-600 hover:bg-gray-50 hover:text-green-800"
                    }`
                  }
                >
                  <Icon size={21} />
                  <span>{label}</span>
                </NavLink>
              ))}

              <Link
                to="/login"
                className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm text-gray-600 transition hover:bg-red-50 hover:text-red-700"
              >
                <LogOut size={21} />
                Logout
              </Link>
            </nav>
          </aside>

          {/* Dashboard content */}
          <main className="min-w-0 bg-gray-50/50 p-4 sm:p-6 lg:p-8">
            {/* Welcome banner */}
            <section className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-green-800 p-5 text-white sm:p-7">
              <div>
                <p className="mb-2 text-sm text-green-100">
                  Welcome back,
                </p>
                <h2 className="text-2xl font-bold">
                  Megabi Getaneh!
                </h2>
                <p className="mt-2 text-sm text-green-100">
                  Track your orders and explore fresh poultry products.
                </p>
              </div>

              <Link
                to="/products"
                className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-3 text-sm font-semibold text-green-800 transition hover:bg-green-50"
              >
                Browse Products
                <ArrowRight size={17} />
              </Link>
            </section>

            {/* Statistics cards */}
            <section
              className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
              aria-label="Order statistics"
            >
              {stats.map(({ label, value, icon: Icon, color }) => (
                <div
                  key={label}
                  className="rounded-xl border border-gray-200 bg-white p-5"
                >
                  <div className="mb-4 flex items-center justify-between gap-2">
                    <p className="text-sm text-gray-500">{label}</p>
                    <div className={`rounded-lg p-2 ${color}`}>
                      <Icon size={20} />
                    </div>
                  </div>
                  <p className="text-3xl font-bold text-slate-800">
                    {value}
                  </p>
                </div>
              ))}
            </section>

            {/* Recent orders */}
            <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 p-5 sm:p-6">
                <div>
                  <h2 className="text-lg font-semibold text-slate-800">
                    Recent Orders
                  </h2>
                  <p className="mt-1 text-sm text-gray-500">
                    Check the status of your recent orders.
                  </p>
                </div>

                <Link
                  to="/buyer/orders"
                  className="inline-flex items-center gap-1 text-sm font-semibold text-green-800 hover:text-green-900"
                >
                  View All
                  <ArrowRight size={16} />
                </Link>
              </div>

              {/* Desktop table */}
              <div className="hidden overflow-x-auto md:block">
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                    <tr>
                      <th className="px-5 py-4 font-medium">Order</th>
                      <th className="px-5 py-4 font-medium">Product</th>
                      <th className="px-5 py-4 font-medium">Date</th>
                      <th className="px-5 py-4 font-medium">Total</th>
                      <th className="px-5 py-4 font-medium">Status</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-100">
                    {recentOrders.map((order) => (
                      <tr key={order.id} className="hover:bg-gray-50">
                        <td className="whitespace-nowrap px-5 py-4 font-medium text-gray-800">
                          {order.id}
                        </td>
                        <td className="px-5 py-4">
                          <p className="font-medium text-gray-800">
                            {order.product}
                          </p>
                          <p className="mt-1 text-xs text-gray-500">
                            {order.seller}
                          </p>
                          <p className="mt-1 text-xs text-gray-500">
                            {order.quantity}
                          </p>
                        </td>
                        <td className="whitespace-nowrap px-5 py-4 text-gray-500">
                          {order.date}
                        </td>
                        <td className="whitespace-nowrap px-5 py-4 font-semibold text-gray-800">
                          {formatPrice(order.total)}
                        </td>
                        <td className="whitespace-nowrap px-5 py-4">
                          <span
                            className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${getStatusStyle(
                              order.status
                            )}`}
                          >
                            {order.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile order cards */}
              <div className="divide-y divide-gray-100 md:hidden">
                {recentOrders.map((order) => (
                  <article key={order.id} className="space-y-3 p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold text-gray-800">
                          {order.product}
                        </p>
                        <p className="mt-1 text-xs text-gray-500">
                          Order {order.id}
                        </p>
                      </div>

                      <span
                        className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium ${getStatusStyle(
                          order.status
                        )}`}
                      >
                        {order.status}
                      </span>
                    </div>

                    <p className="text-sm text-gray-500">
                      {order.seller}
                    </p>

                    <div className="flex flex-wrap justify-between gap-2 text-sm">
                      <span className="text-gray-500">
                        {order.date} · {order.quantity}
                      </span>
                      <span className="font-semibold text-gray-800">
                        {formatPrice(order.total)}
                      </span>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            {/* Quick links */}
            <section className="mt-6 grid gap-4 sm:grid-cols-2">
              <Link
                to="/buyer/orders"
                className="group flex items-center justify-between rounded-xl border border-gray-200 bg-white p-5 transition hover:border-green-300 hover:bg-green-50"
              >
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-green-100 p-3 text-green-800">
                    <Package size={22} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">
                      My Orders
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      View your purchase history.
                    </p>
                  </div>
                </div>
                <ArrowRight
                  size={19}
                  className="text-gray-400 transition group-hover:text-green-800"
                />
              </Link>

              <Link
                to="/buyer/favorites"
                className="group flex items-center justify-between rounded-xl border border-gray-200 bg-white p-5 transition hover:border-green-300 hover:bg-green-50"
              >
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-rose-50 p-3 text-rose-600">
                    <Heart size={22} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">
                      Favorite Products
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Return to products you like.
                    </p>
                  </div>
                </div>
                <ArrowRight
                  size={19}
                  className="text-gray-400 transition group-hover:text-green-800"
                />
              </Link>
            </section>

            <footer className="py-6 text-center text-sm text-gray-500">
              © {new Date().getFullYear()} EthioPoultry. Connecting
              buyers with poultry farmers.
            </footer>
          </main>
        </div>
      </div>
    </div>
  );
}