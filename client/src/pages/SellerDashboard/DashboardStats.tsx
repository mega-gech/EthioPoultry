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
      className="grid grid-cols-4 gap-2 sm:gap-3"
    >
      {stats.map((stat) => {
        const Icon = stat.icon;

        return (
          <button
            key={stat.title}
            type="button"
            onClick={() => navigate(stat.path)}
            className="group flex min-w-0 flex-col rounded-xl border border-gray-200 bg-white p-2.5 text-left shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2 sm:p-4"
            aria-label={`View ${stat.title.toLowerCase()}: ${stat.value}`}
          >
            <div className="flex w-full items-center justify-between gap-2">
              <p className="truncate text-[11px] font-medium text-gray-500 sm:text-sm">
                {stat.title}
              </p>

              <div
                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md sm:h-9 sm:w-9 sm:rounded-lg ${stat.bgColor} ${stat.color}`}
              >
                <Icon className="h-3.5 w-3.5 sm:h-[19px] sm:w-[19px]" strokeWidth={1.8} />
              </div>
            </div>

            <div className="mt-2 flex w-full min-w-0 items-center justify-between gap-1 sm:mt-3 sm:gap-2">
              <h3 className="min-w-0 truncate text-sm font-bold tracking-tight text-gray-900 sm:text-xl xl:text-2xl">
                {stat.value}
              </h3>

              <ArrowUpRight
                size={17}
                className="hidden shrink-0 text-gray-300 transition group-hover:text-emerald-600 sm:block"
                aria-hidden="true"
              />
            </div>

            <p className="mt-0.5 hidden truncate text-xs text-gray-500 sm:mt-1 sm:block">
              {stat.description}
            </p>
          </button>
        );
      })}
    </section>
  );
}