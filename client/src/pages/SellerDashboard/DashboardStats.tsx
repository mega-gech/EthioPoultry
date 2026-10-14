
import {
  Package,
  Banknote,
  MessageCircle,
  ShoppingBag,
} from "lucide-react";

const stats = [
  {
    title: "Products",
    value: "24",
    description: "Listed products",
    icon: Package,
    color: "text-emerald-700",
    bgColor: "bg-emerald-50",
  },
  {
    title: "Sales",
    value: "ETB 1,240",
    description: "Total sales",
    icon: Banknote,
    color: "text-blue-700",
    bgColor: "bg-blue-50",
  },
  {
    title: "Messages",
    value: "16",
    description: "Total messages",
    icon: MessageCircle,
    color: "text-purple-700",
    bgColor: "bg-purple-50",
  },
  {
    title: "Orders",
    value: "32",
    description: "Total orders",
    icon: ShoppingBag,
    color: "text-amber-700",
    bgColor: "bg-amber-50",
  },
];

export default function DashboardStats() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;

        return (
          <div
            key={stat.title}
            className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-gray-500">
                {stat.title}
              </p>

              <div
                className={`flex h-10 w-10 items-center justify-center rounded-lg ${stat.bgColor} ${stat.color}`}
              >
                <Icon size={21} />
              </div>
            </div>

            <h3 className="mt-4 text-2xl font-bold text-gray-900">
              {stat.value}
            </h3>

            <p className="mt-1 text-xs text-gray-500">
              {stat.description}
            </p>
          </div>
        );
      })}
    </div>
  );
}
