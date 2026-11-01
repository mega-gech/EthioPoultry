import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Package,
  ShoppingBag,
  Banknote,
  Search,
  Eye,
  XCircle,
  ArrowRight,
  LoaderCircle,
  RefreshCw,
} from "lucide-react";

// Order statuses must match your backend Order model.
type OrderStatus =
  | "Pending"
  | "Confirmed"
  | "Completed"
  | "Cancelled";

type OrderItem = {
  productId: string;
  name: string;
  price: number;
  quantity: number;
};

type Seller = {
  _id: string;
  name: string;
};

type Order = {
  _id: string;
  buyerId: string;
  sellerId: Seller | string;
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  createdAt: string;
  updatedAt?: string;
};

type ApiResponse<T> = {
  success: boolean;
  data: T;
  message?: string;
};

const API_URL = "http://localhost:5000/api";

// These endpoints must be implemented in your Express backend.
const ORDERS_ENDPOINT = `${API_URL}/orders/my-orders`;

const filters = [
  "All",
  "Pending",
  "Confirmed",
  "Completed",
  "Cancelled",
] as const;

type OrderFilter = (typeof filters)[number];

function formatPrice(price: number) {
  return `${price.toLocaleString("en-US")} ETB`;
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function getSellerName(seller: Seller | string) {
  if (typeof seller === "object" && seller !== null) {
    return seller.name;
  }

  return "Seller";
}

function getOrderProducts(items: OrderItem[]) {
  return items.map((item) => item.name).join(", ");
}

function getOrderQuantity(items: OrderItem[]) {
  return items.reduce((total, item) => total + item.quantity, 0);
}

function statusStyle(status: OrderStatus) {
  switch (status) {
    case "Pending":
      return "bg-amber-50 text-amber-700";

    case "Confirmed":
      return "bg-blue-50 text-blue-700";

    case "Completed":
      return "bg-green-50 text-green-700";

    case "Cancelled":
      return "bg-red-50 text-red-700";
  }
}

export default function BuyerOrders() {
  const [orders, setOrders] = useState<Order[]>([]);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<OrderFilter>("All");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [cancelOrderId, setCancelOrderId] = useState<string | null>(null);

  const [cancelling, setCancelling] = useState(false);
  const [message, setMessage] = useState("");

  // Get the authentication token saved after buyer login.
  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");

    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  };

  // Load orders belonging to the authenticated buyer.
  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Please log in to view your orders.");
      }

      const response = await fetch(ORDERS_ENDPOINT, {
        method: "GET",
        headers: getAuthHeaders(),
      });

      const result: ApiResponse<Order[]> = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Failed to load your orders."
        );
      }

      setOrders(result.data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong while loading orders."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Search and filter orders.
  const filteredOrders = useMemo(() => {
    const query = search.trim().toLowerCase();

    return orders.filter((order) => {
      const matchesSearch =
        order._id.toLowerCase().includes(query) ||
        getOrderProducts(order.items).toLowerCase().includes(query) ||
        getSellerName(order.sellerId).toLowerCase().includes(query);

      const matchesFilter =
        filter === "All" || order.status === filter;

      return matchesSearch && matchesFilter;
    });
  }, [orders, search, filter]);

  // Calculate summary cards using real order data.
  const pendingCount = orders.filter(
    (order) => order.status === "Pending"
  ).length;

  const completedCount = orders.filter(
    (order) => order.status === "Completed"
  ).length;

  const totalSpent = orders
    .filter((order) => order.status === "Completed")
    .reduce((sum, order) => sum + order.totalAmount, 0);

  // Cancel a pending order through the backend.
  const cancelOrder = async () => {
    if (!cancelOrderId) return;

    try {
      setCancelling(true);
      setMessage("");

      const response = await fetch(
        `${API_URL}/orders/${cancelOrderId}/cancel`,
        {
          method: "PATCH",
          headers: getAuthHeaders(),
        }
      );

      const result: ApiResponse<Order> = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Unable to cancel this order."
        );
      }

      // Update the order using the backend response.
      setOrders((previousOrders) =>
        previousOrders.map((order) =>
          order._id === cancelOrderId ? result.data : order
        )
      );

      setMessage("Your order was successfully cancelled.");
      setCancelOrderId(null);

      if (selectedOrder?._id === cancelOrderId) {
        setSelectedOrder(result.data);
      }
    } catch (err) {
      setMessage(
        err instanceof Error
          ? err.message
          : "Failed to cancel the order."
      );
    } finally {
      setCancelling(false);
    }
  };

  return (
    <main className="min-w-0 space-y-6 bg-slate-50/60 p-4 sm:p-6 lg:p-8">

      {/* Page heading */}
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
            My Orders
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            View your purchases and follow their progress.
          </p>
        </div>

        <Link
          to="/products"
          className="inline-flex items-center gap-2 rounded-lg bg-green-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-green-800"
        >
          Shop Products
          <ArrowRight size={16} />
        </Link>
      </header>

      {/* Error message */}
      {error && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <p>{error}</p>

          <button
            type="button"
            onClick={fetchOrders}
            className="inline-flex items-center gap-2 font-semibold hover:underline"
          >
            <RefreshCw size={15} />
            Try Again
          </button>
        </div>
      )}

      {/* Summary cards */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <SummaryCard
          label="Total Orders"
          value={loading ? "—" : String(orders.length)}
          icon={<Package size={21} />}
        />

        <SummaryCard
          label="Pending Orders"
          value={loading ? "—" : String(pendingCount)}
          icon={<ShoppingBag size={21} />}
        />

        <SummaryCard
          label="Completed Spending"
          value={loading ? "—" : formatPrice(totalSpent)}
          icon={<Banknote size={21} />}
        />
      </section>

      {/* Order history */}
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white">

        {/* Search and filters */}
        <div className="border-b border-slate-100 p-5 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                Order History
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                {completedCount} completed order(s)
              </p>
            </div>

            <button
              type="button"
              onClick={fetchOrders}
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
            >
              <RefreshCw
                size={16}
                className={loading ? "animate-spin" : ""}
              />
              Refresh
            </button>
          </div>

          {/* Search */}
          <div className="mt-5 flex items-center gap-3 rounded-lg border border-slate-200 px-3 transition focus-within:border-green-600">
            <Search size={19} className="shrink-0 text-slate-400" />

            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by order ID, product, or seller..."
              className="min-w-0 flex-1 border-0 bg-transparent py-3 text-sm outline-none"
            />
          </div>

          {/* Status filters */}
          <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
            {filters.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setFilter(item)}
                className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition ${
                  filter === item
                    ? "bg-green-700 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-green-50 hover:text-green-800"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        {/* Success or cancellation message */}
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

        {/* Loading */}
        {loading ? (
          <div className="flex flex-col items-center justify-center px-5 py-20 text-slate-500">
            <LoaderCircle
              size={36}
              className="mb-4 animate-spin text-green-700"
            />

            <p className="text-sm font-medium">
              Loading your orders...
            </p>
          </div>
        ) : filteredOrders.length === 0 ? (

          /* Empty state */
          <div className="px-5 py-16 text-center">
            <Package
              size={42}
              className="mx-auto mb-4 text-slate-300"
            />

            <h3 className="font-semibold text-slate-800">
              {orders.length === 0
                ? "You haven't placed any orders yet"
                : "No orders found"}
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              {orders.length === 0
                ? "Browse products and place your first order."
                : "Try another search or status filter."}
            </p>

            {orders.length === 0 ? (
              <Link
                to="/products"
                className="mt-5 inline-flex items-center gap-2 rounded-lg bg-green-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-green-800"
              >
                Browse Products
                <ArrowRight size={16} />
              </Link>
            ) : (
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
            )}
          </div>
        ) : (

          /* Orders */
          <div className="divide-y divide-slate-100">
            {filteredOrders.map((order) => (
              <article
                key={order._id}
                className="p-5 transition hover:bg-slate-50/70 sm:p-6"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-green-800">
                      Order #{order._id.slice(-8).toUpperCase()}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      Placed on {formatDate(order.createdAt)}
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
                    <h3 className="font-semibold text-slate-800">
                      {getOrderProducts(order.items)}
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                      Seller: {getSellerName(order.sellerId)}
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                      Quantity: {getOrderQuantity(order.items)} item(s)
                    </p>
                  </div>

                  <div className="text-left sm:text-right">
                    <p className="text-xs text-slate-500">
                      Order total
                    </p>

                    <p className="mt-1 text-lg font-bold text-slate-900">
                      {formatPrice(order.totalAmount)}
                    </p>
                  </div>
                </div>

                <div className="mt-5 flex flex-wrap gap-3 border-t border-slate-100 pt-4">
                  <button
                    type="button"
                    onClick={() => setSelectedOrder(order)}
                    className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-green-300 hover:bg-green-50"
                  >
                    <Eye size={16} />
                    View Details
                  </button>

                  {order.status === "Pending" && (
                    <button
                      type="button"
                      onClick={() => setCancelOrderId(order._id)}
                      className="inline-flex items-center gap-2 rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-700 transition hover:bg-red-50"
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

      {/* Footer */}
      <footer className="py-4 text-center text-sm text-slate-500">
        © {new Date().getFullYear()} EthioPoultry. Connecting buyers
        with poultry farmers.
      </footer>

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
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
              >
                <XCircle size={21} />
              </button>
            </div>

            <div className="space-y-4 text-sm">
              <DetailRow
                label="Order ID"
                value={selectedOrder._id}
              />

              <DetailRow
                label="Seller"
                value={getSellerName(selectedOrder.sellerId)}
              />

              <DetailRow
                label="Order Date"
                value={formatDate(selectedOrder.createdAt)}
              />

              <DetailRow
                label="Status"
                value={selectedOrder.status}
              />

              <div className="border-t border-slate-100 pt-4">
                <p className="mb-3 font-semibold text-slate-800">
                  Ordered Products
                </p>

                {selectedOrder.items.map((item, index) => (
                  <div
                    key={`${item.productId}-${index}`}
                    className="mb-3 flex justify-between gap-4"
                  >
                    <div>
                      <p className="font-medium text-slate-800">
                        {item.name}
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        {item.quantity} × {formatPrice(item.price)}
                      </p>
                    </div>

                    <p className="font-medium text-slate-800">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="flex justify-between gap-4 border-t border-slate-100 pt-4">
                <span className="font-semibold text-slate-700">
                  Total
                </span>

                <span className="font-bold text-green-800">
                  {formatPrice(selectedOrder.totalAmount)}
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

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Are you sure you want to cancel this order? This action
              will update the order status in the database.
            </p>

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                disabled={cancelling}
                onClick={() => setCancelOrderId(null)}
                className="flex-1 rounded-lg border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
              >
                Keep Order
              </button>

              <button
                type="button"
                disabled={cancelling}
                onClick={cancelOrder}
                className="flex-1 rounded-lg bg-red-600 px-4 py-3 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50"
              >
                {cancelling ? "Cancelling..." : "Confirm Cancel"}
              </button>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}

// Summary card
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
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <div className="mb-4 flex items-center justify-between gap-2">
        <p className="text-sm text-slate-500">{label}</p>

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

// Modal detail row
function DetailRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-slate-500">{label}</span>

      <span className="text-right font-medium text-slate-800">
        {value}
      </span>
    </div>
  );
}