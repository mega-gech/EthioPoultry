
import { useMemo, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  UserRound,
  ShoppingBag,
  Heart,
  Settings,
  LogOut,
  Search,
  Package,
  Eye,
  XCircle,
  ArrowRight,
} from "lucide-react";

type OrderStatus =
  | "Pending"
  | "Processing"
  | "Completed"
  | "Cancelled";

type Order = {
  id: string;
  product: string;
  seller: string;
  date: string;
  quantity: number;
  unit: string;
  total: number;
  status: OrderStatus;
};

const initialOrders: Order[] = [
  {
    id: "EP-1001",
    product: "Fresh Eggs (30 pcs)",
    seller: "Abebe Poultry Farm",
    date: "2026-10-12",
    quantity: 2,
    unit: "trays",
    total: 480,
    status: "Completed",
  },
  {
    id: "EP-1002",
    product: "Brown Layer Chicken",
    seller: "Abebe Poultry Farm",
    date: "2026-10-13",
    quantity: 1,
    unit: "chicken",
    total: 850,
    status: "Pending",
  },
  {
    id: "EP-1003",
    product: "Fresh Eggs (30 pcs)",
    seller: "Gojjam Poultry",
    date: "2026-10-13",
    quantity: 1,
    unit: "tray",
    total: 240,
    status: "Processing",
  },
];

const menuItems = [
  { label: "Dashboard", to: "/buyer/dashboard", icon: LayoutDashboard },
  { label: "My Profile", to: "/buyer/profile", icon: UserRound },
  { label: "My Orders", to: "/buyer/orders", icon: ShoppingBag },
  { label: "Favorites", to: "/buyer/favorites", icon: Heart },
  { label: "Settings", to: "/buyer/settings", icon: Settings },
];

const filters = [
  "All",
  "Pending",
  "Processing",
  "Completed",
  "Cancelled",
] as const;

type OrderFilter = (typeof filters)[number];

function formatPrice(price: number) {
  return `${price.toLocaleString()} ETB`;
}

function formatDate(date: string) {
  return new Date(`${date}T00:00:00`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function statusStyle(status: OrderStatus) {
  switch (status) {
    case "Pending":
      return "bg-amber-100 text-amber-800";
    case "Processing":
      return "bg-blue-100 text-blue-800";
    case "Completed":
      return "bg-green-100 text-green-800";
    case "Cancelled":
      return "bg-red-100 text-red-800";
  }
}

export default function BuyerOrders() {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<OrderFilter>("All");
  const [message, setMessage] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [cancelOrderId, setCancelOrderId] = useState<string | null>(null);

  const filteredOrders = useMemo(() => {
    const query = search.trim().toLowerCase();

    return orders.filter((order) => {
      const matchesSearch =
        order.id.toLowerCase().includes(query) ||
        order.product.toLowerCase().includes(query) ||
        order.seller.toLowerCase().includes(query);

      const matchesFilter =
        filter === "All" || order.status === filter;

      return matchesSearch && matchesFilter;
    });
  }, [orders, search, filter]);

  const cancelOrder = () => {
    if (!cancelOrderId) return;

    const order = orders.find((item) => item.id === cancelOrderId);

    if (!order || order.status !== "Pending") {
      setCancelOrderId(null);
      return;
    }

    setOrders((previous) =>
      previous.map((item) =>
        item.id === cancelOrderId
          ? { ...item, status: "Cancelled" }
          : item
      )
    );

    setMessage(`${cancelOrderId} was cancelled in this demo.`);
    setCancelOrderId(null);
  };

  const pendingCount = orders.filter(
    (order) => order.status === "Pending"
  ).length;

  const completedCount = orders.filter(
    (order) => order.status === "Completed"
  ).length;

  const totalSpent = orders
    .filter((order) => order.status === "Completed")
    .reduce((sum, order) => sum + order.total, 0);

  return (
    <div className="min-h-screen bg-white px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-7">
          <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
            My Orders
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            View your orders and follow their progress.
          </p>
        </header>

        <div className="grid overflow-hidden rounded-2xl border border-gray-200 lg:grid-cols-[285px_minmax(0,1fr)]">
          {/* Buyer sidebar */}
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
                  {label}
                </NavLink>
              ))}

              <Link
                to="/login"
                className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm text-gray-600 hover:bg-red-50 hover:text-red-700"
              >
                <LogOut size={21} />
                Logout
              </Link>
            </nav>
          </aside>

          {/* Main orders area */}
          <main className="min-w-0 bg-gray-50/50 p-4 sm:p-6 lg:p-8">
            {/* Summary cards */}
            <section className="mb-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              <SummaryCard
                label="Total Orders"
                value={String(orders.length)}
                icon={<Package size={21} />}
              />
              <SummaryCard
                label="Pending Orders"
                value={String(pendingCount)}
                icon={<ShoppingBag size={21} />}
              />
              <SummaryCard
                label="Completed Spending"
                value={formatPrice(totalSpent)}
                icon={<Heart size={21} />}
              />
            </section>

            {/* Orders list */}
            <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
              <div className="border-b border-gray-100 p-5 sm:p-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-semibold text-slate-800">
                      Order History
                    </h2>
                    <p className="mt-1 text-sm text-gray-500">
                      {completedCount} completed order(s)
                    </p>
                  </div>
                  <Link
                    to="/products"
                    className="inline-flex items-center gap-2 rounded-lg bg-green-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-green-800"
                  >
                    Shop Products
                    <ArrowRight size={16} />
                  </Link>
                </div>

                <div className="mt-5">
                  <label htmlFor="order-search" className="sr-only">
                    Search orders
                  </label>
                  <div className="flex items-center gap-3 rounded-lg border border-gray-200 px-3 focus-within:border-green-600">
                    <Search size={19} className="shrink-0 text-gray-400" />
                    <input
                      id="order-search"
                      type="search"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Search by order ID, product, or seller..."
                      className="min-w-0 flex-1 border-0 py-3 text-sm outline-none"
                    />
                  </div>
                </div>

                <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
                  {filters.map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setFilter(item)}
                      className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition ${
                        filter === item
                          ? "bg-green-700 text-white"
                          : "bg-gray-100 text-gray-600 hover:bg-green-50 hover:text-green-800"
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>

              {message && (
                <div
                  role="status"
                  className="mx-5 mt-4 rounded-lg bg-green-50 px-4 py-3 text-sm text-green-800 sm:mx-6"
                >
                  {message}
                  <button
                    type="button"
                    onClick={() => setMessage("")}
                    className="ml-3 font-semibold underline"
                  >
                    Dismiss
                  </button>
                </div>
              )}

              {filteredOrders.length === 0 ? (
                <div className="px-5 py-16 text-center">
                  <Package
                    size={42}
                    className="mx-auto mb-4 text-gray-300"
                  />
                  <h3 className="font-semibold text-gray-800">
                    No orders found
                  </h3>
                  <p className="mt-2 text-sm text-gray-500">
                    Try another search or status filter.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setSearch("");
                      setFilter("All");
                    }}
                    className="mt-4 text-sm font-semibold text-green-800 hover:underline"
                  >
                    Clear filters
                  </button>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {filteredOrders.map((order) => (
                    <article
                      key={order.id}
                      className="p-5 transition hover:bg-gray-50/70 sm:p-6"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <p className="text-sm font-semibold text-green-800">
                            Order #{order.id}
                          </p>
                          <p className="mt-1 text-xs text-gray-500">
                            Placed on {formatDate(order.date)}
                          </p>
                        </div>

                        <span
                          className={`rounded-full px-3 py-1.5 text-xs font-semibold ${statusStyle(
                            order.status
                          )}`}
                        >
                          {order.status}
                        </span>
                      </div>

                      <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
                        <div className="min-w-0">
                          <h3 className="font-semibold text-gray-800">
                            {order.product}
                          </h3>
                          <p className="mt-1 text-sm text-gray-500">
                            Seller: {order.seller}
                          </p>
                          <p className="mt-1 text-sm text-gray-500">
                            Quantity: {order.quantity} {order.unit}
                          </p>
                        </div>

                        <div className="text-left sm:text-right">
                          <p className="text-xs text-gray-500">
                            Order total
                          </p>
                          <p className="mt-1 text-lg font-bold text-slate-800">
                            {formatPrice(order.total)}
                          </p>
                        </div>
                      </div>

                      <div className="mt-5 flex flex-wrap gap-3 border-t border-gray-100 pt-4">
                        <button
                          type="button"
                          onClick={() => setSelectedOrder(order)}
                          className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:border-green-300 hover:bg-green-50"
                        >
                          <Eye size={16} />
                          View Details
                        </button>

                        {order.status === "Pending" && (
                          <button
                            type="button"
                            onClick={() => setCancelOrderId(order.id)}
                            className="inline-flex items-center gap-2 rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-50"
                          >
                            <XCircle size={16} />
                            Cancel Order
                          </button>
                        )}
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </section>

            <footer className="py-6 text-center text-sm text-gray-500">
              © {new Date().getFullYear()} EthioPoultry. Connecting buyers
              with poultry farmers.
            </footer>
          </main>
        </div>
      </div>

      {/* Order details modal */}
      {selectedOrder && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => setSelectedOrder(null)}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="order-modal-title"
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-5 flex items-center justify-between">
              <h2
                id="order-modal-title"
                className="text-xl font-bold text-slate-800"
              >
                Order Details
              </h2>
              <button
                type="button"
                aria-label="Close order details"
                onClick={() => setSelectedOrder(null)}
                className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
              >
                <XCircle size={21} />
              </button>
            </div>

            <div className="space-y-4 text-sm">
              <DetailRow label="Order ID" value={selectedOrder.id} />
              <DetailRow
                label="Product"
                value={selectedOrder.product}
              />
              <DetailRow
                label="Seller"
                value={selectedOrder.seller}
              />
              <DetailRow
                label="Order Date"
                value={formatDate(selectedOrder.date)}
              />
              <DetailRow
                label="Quantity"
                value={`${selectedOrder.quantity} ${selectedOrder.unit}`}
              />
              <DetailRow
                label="Status"
                value={selectedOrder.status}
              />
              <div className="flex justify-between gap-4 border-t border-gray-100 pt-4">
                <span className="font-semibold text-gray-700">Total</span>
                <span className="font-bold text-green-800">
                  {formatPrice(selectedOrder.total)}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setSelectedOrder(null)}
              className="mt-6 w-full rounded-lg bg-green-700 px-4 py-3 font-semibold text-white hover:bg-green-800"
            >
              Close
            </button>
          </section>
        </div>
      )}

      {/* Cancellation confirmation */}
      {cancelOrderId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="cancel-modal-title"
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
          >
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-600">
              <XCircle size={25} />
            </div>
            <h2
              id="cancel-modal-title"
              className="text-lg font-bold text-slate-800"
            >
              Cancel this order?
            </h2>
            <p className="mt-2 text-sm leading-6 text-gray-500">
              Are you sure you want to cancel order #{cancelOrderId}?
              This demo will change its status to Cancelled.
            </p>
            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => setCancelOrderId(null)}
                className="flex-1 rounded-lg border border-gray-300 px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50"
              >
                Keep Order
              </button>
              <button
                type="button"
                onClick={cancelOrder}
                className="flex-1 rounded-lg bg-red-600 px-4 py-3 text-sm font-semibold text-white hover:bg-red-700"
              >
                Confirm Cancel
              </button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}

function SummaryCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5">
      <div className="mb-4 flex items-center justify-between gap-2">
        <p className="text-sm text-gray-500">{label}</p>
        <div className="rounded-lg bg-green-50 p-2 text-green-800">
          {icon}
        </div>
      </div>
      <p className="break-words text-2xl font-bold text-slate-800">
        {value}
      </p>
    </div>
  );
}

function DetailRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-gray-500">{label}</span>
      <span className="text-right font-medium text-gray-800">
        {value}
      </span>
    </div>
  );
}