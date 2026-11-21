import { useEffect, useState } from "react";
import {
  Activity,
  CheckCircle2,
  ClipboardList,
  Package,
  ShoppingCart,
  Users,
} from "lucide-react";
import {
  getAdminOverview,
  type AdminUser,
  type AdminOverview as OverviewData,
} from "../../services/adminService";

const numberFormat = new Intl.NumberFormat("en-US");

function dateLabel(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "Date unavailable"
    : date.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
}

export default function AdminOverview() {
  const [data, setData] = useState<OverviewData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    getAdminOverview()
      .then((result) => {
        if (active) setData(result);
      })
      .catch((cause: unknown) => {
        if (active) {
          setError(
            cause instanceof Error
              ? cause.message
              : "Unable to load platform overview."
          );
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  if (loading) {
    return <LoadingState message="Loading platform overview..." />;
  }
  if (error || !data) {
    return <ErrorState message={error || "No overview data available."} />;
  }

  const { totals, recentUsers, recentOrders, activities, charts } = data;
  const maxMonthly = Math.max(
    1,
    ...charts.monthly.flatMap((item) => [item.users, item.orders])
  );
  const statusColors: Record<string, string> = {
    Pending: "bg-amber-500",
    Confirmed: "bg-sky-600",
    Completed: "bg-emerald-600",
    Cancelled: "bg-rose-500",
  };
  const stats = [
    { title: "Registered users", value: totals.totalUsers, icon: Users, tone: "text-blue-700 bg-blue-50" },
    { title: "Buyers", value: totals.totalBuyers, icon: Users, tone: "text-violet-700 bg-violet-50" },
    { title: "Sellers", value: totals.totalSellers, icon: Users, tone: "text-emerald-700 bg-emerald-50" },
    { title: "Products", value: totals.totalProducts, icon: Package, tone: "text-amber-700 bg-amber-50" },
    { title: "Active products", value: totals.activeProducts, icon: CheckCircle2, tone: "text-green-700 bg-green-50" },
    { title: "Product approvals", value: totals.pendingProductApprovals, icon: ClipboardList, tone: "text-orange-700 bg-orange-50" },
    { title: "Orders", value: totals.totalOrders, icon: ShoppingCart, tone: "text-sky-700 bg-sky-50" },
    { title: "Completed orders", value: totals.completedOrders, icon: CheckCircle2, tone: "text-teal-700 bg-teal-50" },
  ];

  return (
    <div className="space-y-6">
      <section>
        <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">
          Platform overview
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Live activity and marketplace statistics.
        </p>
      </section>

      <section
        aria-label="Platform statistics"
        className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4"
      >
        {stats.map(({ title, value, icon: Icon, tone }) => (
          <article
            key={title}
            className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5"
          >
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-medium text-gray-500">{title}</p>
              <span className={`rounded-lg p-2 ${tone}`}>
                <Icon size={19} />
              </span>
            </div>
            <p className="mt-3 text-2xl font-bold tracking-tight text-gray-900">
              {numberFormat.format(value)}
            </p>
          </article>
        ))}
      </section>

      {(totals.pendingMarketPrices > 0 ||
        totals.pendingProductApprovals > 0) && (
        <div className="flex flex-wrap gap-3">
          {totals.pendingProductApprovals > 0 && (
            <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
              {totals.pendingProductApprovals} product(s) need review.
            </div>
          )}
          {totals.pendingMarketPrices > 0 && (
            <div className="rounded-lg border border-sky-200 bg-sky-50 px-4 py-3 text-sm text-sky-900">
              {totals.pendingMarketPrices} market price submission(s) need review.
            </div>
          )}
        </div>
      )}

      <section className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        <article className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="mb-5">
            <h2 className="font-semibold text-gray-900">Platform growth</h2>
            <p className="mt-1 text-sm text-gray-500">
              New user registrations and orders by month.
            </p>
          </div>
          {charts.monthly.every(
            (month) => month.users === 0 && month.orders === 0
          ) ? (
            <EmptyState message="No monthly activity in this period yet." />
          ) : (
            <div className="flex h-56 items-end justify-around gap-3 border-b border-gray-100 px-2">
              {charts.monthly.map((month) => (
                <div
                  key={month.month}
                  className="flex h-full flex-1 flex-col items-center justify-end gap-2"
                >
                  <div className="flex h-[80%] w-full max-w-16 items-end justify-center gap-1">
                    <div
                      title={`${month.users} users`}
                      className="w-1/2 rounded-t bg-emerald-600"
                      style={{
                        height: `${Math.max(3, (month.users / maxMonthly) * 100)}%`,
                      }}
                    />
                    <div
                      title={`${month.orders} orders`}
                      className="w-1/2 rounded-t bg-sky-500"
                      style={{
                        height: `${Math.max(3, (month.orders / maxMonthly) * 100)}%`,
                      }}
                    />
                  </div>
                  <span className="text-[11px] text-gray-500">
                    {new Date(`${month.month}-01T00:00:00`).toLocaleDateString(
                      "en",
                      { month: "short" }
                    )}
                  </span>
                </div>
              ))}
            </div>
          )}
          <div className="mt-4 flex gap-5 text-xs text-gray-500">
            <span className="inline-flex items-center gap-2">
              <i className="h-2.5 w-2.5 rounded-sm bg-emerald-600" />
              New users
            </span>
            <span className="inline-flex items-center gap-2">
              <i className="h-2.5 w-2.5 rounded-sm bg-sky-500" />
              Orders
            </span>
          </div>
        </article>

        <article className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="mb-5">
            <h2 className="font-semibold text-gray-900">Orders by status</h2>
            <p className="mt-1 text-sm text-gray-500">
              Current distribution across the platform.
            </p>
          </div>
          <div className="space-y-4">
            {charts.ordersByStatus.map(({ status, count }) => {
              const percent =
                totals.totalOrders > 0
                  ? (count / totals.totalOrders) * 100
                  : 0;
              return (
                <div key={status}>
                  <div className="mb-1.5 flex justify-between text-sm">
                    <span className="text-gray-600">{status}</span>
                    <span className="font-semibold text-gray-900">
                      {numberFormat.format(count)}
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                    <div
                      className={`h-full rounded-full ${statusColors[status]}`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </article>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <article className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          <PanelHeading title="Recent registrations" />
          {recentUsers.length ? (
            <div className="divide-y divide-gray-100">
              {recentUsers.map((user) => (
                <div
                  key={user._id}
                  className="flex flex-wrap items-center justify-between gap-3 px-5 py-3.5"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-gray-900">
                      {user.name}
                    </p>
                    <p className="truncate text-xs text-gray-500">
                      {user.email}
                    </p>
                  </div>
                  <div className="text-right">
                    <RoleBadge role={user.role} />
                    <p className="mt-1 text-xs text-gray-400">
                      {dateLabel(user.createdAt)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState message="No registrations yet." />
          )}
        </article>

        <article className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          <PanelHeading title="Recent orders" />
          {recentOrders.length ? (
            <div className="divide-y divide-gray-100">
              {recentOrders.map((order) => (
                <div
                  key={order._id}
                  className="flex flex-wrap items-center justify-between gap-3 px-5 py-3.5"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-900">
                      Order #{order._id.slice(-8).toUpperCase()}
                    </p>
                    <p className="truncate text-xs text-gray-500">
                      {displayUser(order.buyerId)} ·{" "}
                      {order.items.map((item) => item.name).join(", ")}
                    </p>
                  </div>
                  <div className="text-right">
                    <StatusBadge status={order.status} />
                    <p className="mt-1 text-xs font-medium text-gray-600">
                      {numberFormat.format(order.totalAmount)} ETB
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState message="No orders yet." />
          )}
        </article>
      </section>

      <article className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <PanelHeading title="Recent platform activity" icon />
        {activities.length ? (
          <div className="divide-y divide-gray-100">
            {activities.map((activity, index) => (
              <div
                key={`${activity.type}-${activity.createdAt}-${index}`}
                className="flex items-start gap-3 px-5 py-3.5"
              >
                <span className="mt-0.5 rounded-full bg-emerald-50 p-2 text-emerald-700">
                  <Activity size={15} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-gray-800">
                    {activity.description}
                  </p>
                  <p className="mt-1 text-xs text-gray-400">
                    {new Date(activity.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState message="No platform activity yet." />
        )}
      </article>
    </div>
  );
}

export function LoadingState({ message = "Loading..." }: { message?: string }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white px-5 py-14 text-center text-sm text-gray-500">
      <span className="mx-auto mb-3 block h-7 w-7 animate-spin rounded-full border-2 border-emerald-200 border-t-emerald-700" />
      {message}
    </div>
  );
}

export function ErrorState({ message }: { message: string }) {
  return (
    <div
      role="alert"
      className="rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700"
    >
      {message}
    </div>
  );
}

export function EmptyState({ message }: { message: string }) {
  return (
    <p className="px-5 py-10 text-center text-sm text-gray-500">{message}</p>
  );
}

export function PanelHeading({
  title,
  icon = false,
}: {
  title: string;
  icon?: boolean;
}) {
  return (
    <div className="flex items-center gap-2 border-b border-gray-100 px-5 py-4">
      {icon && <Activity size={17} className="text-emerald-700" />}
      <h2 className="font-semibold text-gray-900">{title}</h2>
    </div>
  );
}

export function RoleBadge({ role }: { role: string }) {
  const styles: Record<string, string> = {
    buyer: "bg-sky-50 text-sky-700",
    seller: "bg-emerald-50 text-emerald-700",
    admin: "bg-violet-50 text-violet-700",
  };
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium capitalize ${styles[role] ?? "bg-gray-100 text-gray-600"}`}
    >
      {role}
    </span>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    Pending: "bg-amber-50 text-amber-700",
    Confirmed: "bg-sky-50 text-sky-700",
    Completed: "bg-emerald-50 text-emerald-700",
    Cancelled: "bg-rose-50 text-rose-700",
    Approved: "bg-emerald-50 text-emerald-700",
    Rejected: "bg-rose-50 text-rose-700",
    Open: "bg-amber-50 text-amber-700",
    Resolved: "bg-emerald-50 text-emerald-700",
    Dismissed: "bg-gray-100 text-gray-600",
    Active: "bg-emerald-50 text-emerald-700",
    "Out of Stock": "bg-gray-100 text-gray-600",
  };
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${styles[status] ?? "bg-gray-100 text-gray-600"}`}
    >
      {status}
    </span>
  );
}

export function displayUser(user: AdminUser | string | null) {
  return typeof user === "object" && user !== null
    ? user.name
    : "Unknown user";
}
