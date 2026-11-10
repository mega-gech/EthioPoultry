
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  CreditCard,
  Search,
  RefreshCw,
  LoaderCircle,
  CheckCircle2,
  Clock,
  XCircle,
  RotateCcw,
  Receipt,
} from "lucide-react";

import {
  getMyPayments,
  type Payment,
  type PaymentStatus,
} from "../../services/paymentService";

// Payment status filters
const filters = [
  "All",
  "Pending",
  "Successful",
  "Failed",
  "Refunded",
] as const;

type PaymentFilter = (typeof filters)[number];

// Format Ethiopian Birr
function formatPrice(amount: number, currency: string) {
  return `${amount.toLocaleString("en-US")} ${currency}`;
}

// Format payment date
function formatDate(date?: string) {
  if (!date) return "Date unavailable";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Date unavailable";
  }

  return parsedDate.toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// Shorten an ID for display
function shortId(id: string) {
  return id.slice(-8).toUpperCase();
}

// Payment status styles
function statusStyle(status: PaymentStatus) {
  switch (status) {
    case "Successful":
      return "bg-green-50 text-green-700";

    case "Pending":
      return "bg-amber-50 text-amber-700";

    case "Failed":
      return "bg-red-50 text-red-700";

    case "Refunded":
      return "bg-blue-50 text-blue-700";
  }
}

// Payment status icon
function StatusIcon({ status }: { status: PaymentStatus }) {
  switch (status) {
    case "Successful":
      return <CheckCircle2 size={16} />;

    case "Pending":
      return <Clock size={16} />;

    case "Failed":
      return <XCircle size={16} />;

    case "Refunded":
      return <RotateCcw size={16} />;
  }
}

export default function BuyerPayments() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<PaymentFilter>("All");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch the authenticated buyer's payment history
  const fetchPayments = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getMyPayments();

      setPayments(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong while loading payments."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchPayments();
  }, [fetchPayments]);

  // Search and filter payment history
  const filteredPayments = useMemo(() => {
    const query = search.trim().toLowerCase();

    return payments.filter((payment) => {
      const matchesSearch =
        payment.transactionReference.toLowerCase().includes(query) ||
        payment.orderId.toLowerCase().includes(query) ||
        payment.method.toLowerCase().includes(query) ||
        payment.status.toLowerCase().includes(query);

      const matchesFilter =
        filter === "All" || payment.status === filter;

      return matchesSearch && matchesFilter;
    });
  }, [payments, search, filter]);

  // Calculate payment statistics
  const totalPayments = payments.length;

  const successfulPayments = payments.filter(
    (payment) => payment.status === "Successful"
  );

  const pendingCount = payments.filter(
    (payment) => payment.status === "Pending"
  ).length;

  const failedCount = payments.filter(
    (payment) => payment.status === "Failed"
  ).length;

  const totalPaid = successfulPayments.reduce(
    (total, payment) => total + payment.amount,
    0
  );

  return (
    <main className="min-w-0 space-y-6 bg-slate-50/60 p-4 sm:p-6 lg:p-8">

      {/* Page heading */}
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Payment History
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            View and track your payments for all orders.
          </p>
        </div>

        <button
          type="button"
          onClick={() => void fetchPayments()}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
        >
          <RefreshCw
            size={16}
            className={loading ? "animate-spin" : ""}
          />
          Refresh
        </button>
      </header>

      {/* Error message */}
      {error && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <p>{error}</p>

          <button
            type="button"
            onClick={() => void fetchPayments()}
            className="inline-flex items-center gap-2 font-semibold hover:underline"
          >
            <RefreshCw size={15} />
            Try Again
          </button>
        </div>
      )}

      {/* Payment summary cards */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

        <SummaryCard
          label="Total Payments"
          value={loading ? "—" : String(totalPayments)}
          description="All payment attempts"
          icon={<Receipt size={21} />}
          iconStyle="bg-green-50 text-green-800"
        />

        <SummaryCard
          label="Successful Payments"
          value={loading ? "—" : String(successfulPayments.length)}
          description="Payments completed"
          icon={<CheckCircle2 size={21} />}
          iconStyle="bg-green-50 text-green-700"
        />

        <SummaryCard
          label="Pending Payments"
          value={loading ? "—" : String(pendingCount)}
          description="Waiting for payment result"
          icon={<Clock size={21} />}
          iconStyle="bg-amber-50 text-amber-700"
        />

        <SummaryCard
          label="Total Paid"
          value={loading ? "—" : formatPrice(totalPaid, "ETB")}
          description={`${failedCount} failed payment(s)`}
          icon={<CreditCard size={21} />}
          iconStyle="bg-blue-50 text-blue-700"
        />
      </section>

      {/* Payment history */}
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

        {/* Search and filters */}
        <div className="border-b border-slate-100 p-5 sm:p-6">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Transaction History
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Your payment attempts and their current status.
            </p>
          </div>

          {/* Search */}
          <div className="mt-5 flex items-center gap-3 rounded-lg border border-slate-200 px-3 transition focus-within:border-green-600 focus-within:ring-2 focus-within:ring-green-100">
            <Search size={19} className="shrink-0 text-slate-400" />

            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by transaction reference, order ID, or method..."
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
              </button>
            ))}
          </div>
        </div>

        {/* Loading state */}
        {loading ? (
          <div className="flex flex-col items-center justify-center px-5 py-20 text-slate-500">
            <LoaderCircle
              size={36}
              className="mb-4 animate-spin text-green-700"
            />

            <p className="text-sm font-medium">
              Loading your payment history...
            </p>
          </div>
        ) : filteredPayments.length === 0 ? (

          /* Empty state */
          <div className="px-5 py-16 text-center">
            <CreditCard
              size={42}
              className="mx-auto mb-4 text-slate-300"
            />

            <h3 className="font-semibold text-slate-800">
              {payments.length === 0
                ? "No payment history yet"
                : "No payments found"}
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              {payments.length === 0
                ? "Your payments will appear here after you start paying for an order."
                : "Try another search or payment status filter."}
            </p>

            {payments.length > 0 && (
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

          /* Payment list */
          <div className="divide-y divide-slate-100">
            {filteredPayments.map((payment) => (
              <article
                key={payment._id}
                className="p-5 transition hover:bg-slate-50/70 sm:p-6"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">

                  <div className="flex min-w-0 items-start gap-3">
                    <div className="rounded-xl bg-green-50 p-3 text-green-800">
                      <CreditCard size={21} />
                    </div>

                    <div className="min-w-0">
                      <p className="break-all text-sm font-semibold text-slate-900">
                        {payment.transactionReference}
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        {formatDate(payment.paidAt || payment.createdAt)}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${statusStyle(
                      payment.status
                    )}`}
                  >
                    <StatusIcon status={payment.status} />
                    {payment.status}
                  </span>
                </div>

                <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">

                  <div>
                    <p className="text-xs text-slate-500">
                      Payment Amount
                    </p>

                    <p className="mt-1 text-lg font-bold text-slate-900">
                      {formatPrice(payment.amount, payment.currency)}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-slate-500">
                      Payment Method
                    </p>

                    <p className="mt-1 font-semibold text-slate-800">
                      {payment.method}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-slate-500">
                      Related Order
                    </p>

                    <p className="mt-1 font-semibold text-green-800">
                      #{shortId(payment.orderId)}
                    </p>
                  </div>
                </div>

                <div className="mt-5 border-t border-slate-100 pt-3">
                  <p className="text-xs text-slate-500">
                    Payment ID: {payment._id}
                  </p>
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
