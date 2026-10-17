
import {
  Package,
  Banknote,
  MessageCircle,
  ShoppingBag,
  ArrowUpRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const stats = [
  {
    title: "Products",
    value: "24",
    description: "Listed products",
    icon: Package,
    color: "text-emerald-700",
    bgColor: "bg-emerald-50",
    path: "/seller/products",
  },
  {
    title: "Sales",
    value: "ETB 1,240",
    description: "Total sales",
    icon: Banknote,
    color: "text-blue-700",
    bgColor: "bg-blue-50",
    path: "/seller/sales",
  },
  {
    title: "Messages",
    value: "16",
    description: "Total messages",
    icon: MessageCircle,
    color: "text-purple-700",
    bgColor: "bg-purple-50",
    path: "/seller/messages",
  },
  {
    title: "Orders",
    value: "32",
    description: "Total orders",
    icon: ShoppingBag,
    color: "text-amber-700",
    bgColor: "bg-amber-50",
    path: "/seller/orders",
  },
];

export default function DashboardStats() {
  const navigate = useNavigate();

  return (
    <section
      aria-label="Seller business statistics"
      className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4"
    >
      {stats.map((stat) => {
        const Icon = stat.icon;

        return (
          <button
            key={stat.title}
            type="button"
            onClick={() => navigate(stat.path)}
            className="group flex min-w-0 flex-col rounded-xl border border-gray-200 bg-white p-4 text-left shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2 sm:p-4"
            aria-label={`View ${stat.title.toLowerCase()}: ${stat.value}`}
          >
            <div className="flex w-full items-center justify-between gap-3">
              <p className="text-sm font-medium text-gray-500">
                {stat.title}
              </p>

              <div
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${stat.bgColor} ${stat.color}`}
              >
                <Icon size={19} strokeWidth={1.8} />
              </div>
            </div>

            <div className="mt-3 flex w-full min-w-0 items-center justify-between gap-2">
              <h3 className="min-w-0 break-words text-xl font-bold tracking-tight text-gray-900 sm:text-2xl">
                {stat.value}
              </h3>

              <ArrowUpRight
                size={17}
                className="shrink-0 text-gray-300 transition group-hover:text-emerald-600"
                aria-hidden="true"
              />
            </div>

            <p className="mt-1 text-xs text-gray-500">
              {stat.description}
            </p>
          </button>
        );
      })}
    </section>
  );
}
