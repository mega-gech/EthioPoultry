
import { useCallback, useEffect, useMemo, useState } from "react";
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

import {
  getBuyerOrders,
  cancelBuyerOrder,
  type BuyerOrder,
  type OrderItem,
  type OrderStatus,
  type Seller,
} from "../../services/buyerOrderService";

import {
  createPayment,
  simulatePayment,
  getMyPayments,
  type Payment,
} from "../../services/paymentService";

// Order status filters
const filters = [
  "All",
  "Pending",
  "Confirmed",
  "Completed",
  "Cancelled",
] as const;

type OrderFilter = (typeof filters)[number];

// Format Ethiopian Birr
function formatPrice(price: number) {
  return `${price.toLocaleString("en-US")} ETB`;
}

// Format order date
function formatDate(date: string) {
  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Date unavailable";
  }

  return parsedDate.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

// Get seller name from populated seller information
function getSellerName(seller: Seller | string) {
  if (typeof seller === "object" && seller !== null) {
    return seller.name;
  }

  return "Seller";
}

// Get product names
function getOrderProducts(items: OrderItem[]) {
  return items.map((item) => item.name).join(", ");
}

// Calculate total ordered quantity
function getOrderQuantity(items: OrderItem[]) {
  return items.reduce((total, item) => total + item.quantity, 0);
}

// Status badge styles
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
  const [orders, setOrders] = useState<BuyerOrder[]>([]);
  const [selectedOrder, setSelectedOrder] =
    useState<BuyerOrder | null>(null);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<OrderFilter>("All");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [cancelOrderId, setCancelOrderId] = useState<string | null>(
    null
  );

  const [cancelling, setCancelling] = useState(false);
  const [message, setMessage] = useState("");
  const [messageIsError, setMessageIsError] = useState(false);

  const [payments, setPayments] = useState<Payment[]>([]);
const [payingOrderId, setPayingOrderId] = useState<string | null>(null);
const [processingPayment, setProcessingPayment] = useState(false);
const [selectedPayment, setSelectedPayment] =
  useState<Payment | null>(null);

  // Fetch orders belonging to the logged-in buyer
 const fetchOrders = useCallback(async () => {
  try {
    setLoading(true);
    setError("");

    const [ordersData, paymentsData] = await Promise.all([
      getBuyerOrders(),
      getMyPayments(),
    ]);

    setOrders(ordersData);
    setPayments(paymentsData);
  } catch (err) {
    setError(
      err instanceof Error
        ? err.message
        : "Something went wrong while loading orders."
    );
  } finally {
    setLoading(false);
  }
}, []);

// Start or resume payment for an order
const handlePayOrder = async (orderId: string) => {
  try {
    setPayingOrderId(orderId);
    setMessage("");
    setMessageIsError(false);

    // Find the latest payment attempt for this order
    const existingPayment = payments.find(
      (payment) => payment.orderId === orderId
    );

    // A successful payment must not be repeated
    if (existingPayment?.status === "Successful") {
      setMessage("This order has already been paid.");
      return;
    }

    // Reuse an existing pending payment.
    // Otherwise, create a new attempt.
    const payment =
      existingPayment?.status === "Pending"
        ? existingPayment
        : await createPayment(orderId);

    setSelectedPayment(payment);
  } catch (err) {
    setMessageIsError(true);
    setMessage(
      err instanceof Error
        ? err.message
        : "Unable to start payment."
    );
  } finally {
    setPayingOrderId(null);
  }
};

// Process a development payment simulation
const handleSimulatePayment = async (
  result: "Successful" | "Failed"
) => {
  if (!selectedPayment) return;

  try {
    setProcessingPayment(true);
    setMessage("");
    setMessageIsError(false);

    await simulatePayment(selectedPayment._id, result);

    setSelectedPayment(null);

    setMessage(
      result === "Successful"
        ? "Payment completed successfully. Your order is now confirmed."
        : "Payment failed. Your order is still pending. You can try again."
    );

    // Refresh both orders and payment history
    await fetchOrders();
  } catch (err) {
    setMessageIsError(true);
    setMessage(
      err instanceof Error
        ? err.message
        : "Payment processing failed."
    );
  } finally {
    setProcessingPayment(false);
  }
};

  useEffect(() => {
    void fetchOrders();
  }, [fetchOrders]);

  // Cancel a pending order
  const cancelOrder = async () => {
    if (!cancelOrderId) return;

    try {
      setCancelling(true);
      setMessage("");
      setMessageIsError(false);

      const updatedOrder = await cancelBuyerOrder(cancelOrderId);

      // Update the order without deleting it
      setOrders((previousOrders) =>
        previousOrders.map((order) =>
          order._id === cancelOrderId ? updatedOrder : order
        )
      );

      setMessage("Your order was successfully cancelled.");
      setCancelOrderId(null);

      // Update the details modal if it is open
      if (selectedOrder?._id === cancelOrderId) {
        setSelectedOrder(updatedOrder);
      }
    } catch (err) {
      setMessageIsError(true);

      setMessage(
        err instanceof Error
          ? err.message
          : "Failed to cancel the order."
      );
    } finally {
      setCancelling(false);
    }
  };

  // Search and filter orders
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

  // Calculate dashboard statistics from real orders
  const totalOrders = orders.length;

  const pendingCount = orders.filter(
    (order) => order.status === "Pending"
  ).length;

  const cancelledCount = orders.filter(
    (order) => order.status === "Cancelled"
  ).length;

  const completedCount = orders.filter(
    (order) => order.status === "Completed"
  ).length;

  const totalSpent = orders
    .filter((order) => order.status === "Completed")
    .reduce((sum, order) => sum + order.totalAmount, 0);

  return (
    <main className="min-w-0 space-y-6 bg-slate-50/60 p-4 sm:p-6 lg:p-8">

      {/* Page heading */}
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
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
            onClick={() => void fetchOrders()}
            className="inline-flex items-center gap-2 font-semibold hover:underline"
          >
            <RefreshCw size={15} />
            Try Again
          </button>
        </div>
      )}

      {/* Dashboard summary cards */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

        <SummaryCard
          label="Total Orders"
          value={loading ? "—" : String(totalOrders)}
          description="All your purchases"
          icon={<Package size={21} />}
          iconStyle="bg-green-50 text-green-800"
        />

        <SummaryCard
          label="Pending Orders"
          value={loading ? "—" : String(pendingCount)}
          description="Waiting for seller action"
          icon={<ShoppingBag size={21} />}
          iconStyle="bg-amber-50 text-amber-700"
        />

        <SummaryCard
          label="Cancelled Orders"
          value={loading ? "—" : String(cancelledCount)}
          description="Orders you have cancelled"
          icon={<XCircle size={21} />}
          iconStyle="bg-red-50 text-red-700"
        />

        <SummaryCard
          label="Completed Spending"
          value={loading ? "—" : formatPrice(totalSpent)}
          description={`${completedCount} completed order(s)`}
          icon={<Banknote size={21} />}
          iconStyle="bg-blue-50 text-blue-700"
        />
      </section>

      {/* Order history */}
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

        {/* Search and filters */}
        <div className="border-b border-slate-100 p-5 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                Order History
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                {completedCount} completed · {cancelledCount} cancelled
              </p>
            </div>

            <button
              type="button"
              onClick={() => void fetchOrders()}
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
          <div className="mt-5 flex items-center gap-3 rounded-lg border border-slate-200 px-3 transition focus-within:border-green-600 focus-within:ring-2 focus-within:ring-green-100">
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
                    ? "bg-green-700 text-white shadow-sm"
                    : "bg-slate-100 text-slate-600 hover:bg-green-50 hover:text-green-800"
                }`}
              >
                {item}
                {item === "Cancelled" && !loading && (
                  <span className="ml-1.5">
                    ({cancelledCount})
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Success or error message */}
        {message && (
          <div
            role="status"
            className={`mx-5 mt-4 rounded-lg px-4 py-3 text-sm sm:mx-6 ${
              messageIsError
                ? "bg-red-50 text-red-800"
                : "bg-green-50 text-green-800"
            }`}
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

        {/* Loading state */}
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

          /* Orders list */
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

                  {order.status === "Pending" && (
  <button
    type="button"
    onClick={() => void handlePayOrder(order._id)}
    disabled={payingOrderId === order._id}
    className="inline-flex items-center gap-2 rounded-lg bg-green-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-50"
  >
    {payingOrderId === order._id ? (
      <>
        <LoaderCircle size={16} className="animate-spin" />
        Starting...
      </>
    ) : (
      <>
        <Banknote size={16} />
        Pay Now
      </>
    )}
  </button>
)}

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
            className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl bg-white p-6 shadow-xl"
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

      {/* Development payment simulation modal */}
{selectedPayment && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
    <section
      role="dialog"
      aria-modal="true"
      aria-labelledby="payment-modal-title"
      className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
    >
      <div className="mb-5 flex items-center justify-between">
        <h2
          id="payment-modal-title"
          className="text-xl font-bold text-slate-900"
        >
          Complete Payment
        </h2>

        <button
          type="button"
          disabled={processingPayment}
          onClick={() => setSelectedPayment(null)}
          className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 disabled:opacity-50"
        >
          <XCircle size={21} />
        </button>
      </div>

      <div className="rounded-xl bg-green-50 p-4">
        <p className="text-sm text-green-800">
          Payment amount
        </p>

        <p className="mt-1 text-2xl font-bold text-green-900">
          {formatPrice(selectedPayment.amount)}
        </p>
      </div>

      <p className="mt-4 text-sm text-slate-600">
        This is a development simulation. Choose an outcome to
        test the payment process. No real money will be transferred.
      </p>

      <div className="mt-6 space-y-3">
        <button
          type="button"
          disabled={processingPayment}
          onClick={() =>
            void handleSimulatePayment("Successful")
          }
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-green-700 px-4 py-3 font-semibold text-white hover:bg-green-800 disabled:opacity-50"
        >
          {processingPayment ? (
            <LoaderCircle size={18} className="animate-spin" />
          ) : null}
          Simulate Successful Payment
        </button>

        <button
          type="button"
          disabled={processingPayment}
          onClick={() =>
            void handleSimulatePayment("Failed")
          }
          className="w-full rounded-lg border border-red-200 px-4 py-3 font-semibold text-red-700 hover:bg-red-50 disabled:opacity-50"
        >
          Simulate Failed Payment
        </button>
      </div>

      <p className="mt-4 text-center text-xs text-slate-400">
        Development mode only · No actual payment gateway
      </p>
    </section>
  </div>
)}

      {/* Cancellation confirmation modal */}
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

// Reusable summary card
function SummaryCard({
  label,
  value,
  description,
  icon,
  iconStyle,
}: {
  label: string;
  value: string;
  description: string;
  icon: React.ReactNode;
  iconStyle: string;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md">
      <div className="mb-4 flex items-center justify-between gap-2">
        <p className="text-sm font-medium text-slate-500">
          {label}
        </p>

        <div className={`rounded-lg p-2 ${iconStyle}`}>
          {icon}
        </div>
      </div>

      <p className="break-words text-2xl font-bold tracking-tight text-slate-900">
        {value}
      </p>

      <p className="mt-2 text-xs text-slate-500">
        {description}
      </p>
    </div>
  );
}

// Reusable modal detail row
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
