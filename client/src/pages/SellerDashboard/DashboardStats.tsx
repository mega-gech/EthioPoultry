
import {
  Package,
  Banknote,
  ShoppingBag,
} from "lucide-react";

import { useEffect, useState } from "react";

import {
  getMyProducts,
  getSellerOrderStats,
} from "../../services/sellerService";

const stats = [
  {
    title: "Products",
    description: "Listed products",
    icon: Package,
    color: "text-emerald-700",
    bgColor: "bg-emerald-50",
  },
  {
    title: "Sales",
    description: "Total completed sales",
    icon: Banknote,
    color: "text-blue-700",
    bgColor: "bg-blue-50",
  },
  {
    title: "Orders",
    description: "Non-cancelled orders",
    icon: ShoppingBag,
    color: "text-amber-700",
    bgColor: "bg-amber-50",
  },
];

export default function DashboardStats() {
  const [productCount, setProductCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [orderCount, setOrderCount] = useState(0);
  const [totalSales, setTotalSales] = useState(0);
  const [orderStatsLoading, setOrderStatsLoading] = useState(true);
  const [orderStatsError, setOrderStatsError] = useState("");

  // Fetch seller products
  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);

        const products = await getMyProducts();

        setProductCount(products.length);
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Failed to load products"
        );
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  // Fetch seller order statistics
  useEffect(() => {
    async function fetchOrderStats() {
      try {
        setOrderStatsLoading(true);

        const data = await getSellerOrderStats();

        setOrderCount(data.orderCount);
        setTotalSales(data.totalSales);
      } catch (error) {
        setOrderStatsError(
          error instanceof Error
            ? error.message
            : "Failed to load order statistics"
        );
      } finally {
        setOrderStatsLoading(false);
      }
    }

    fetchOrderStats();
  }, []);

  return (
    <section
      aria-label="Seller business statistics"
      className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4"
    >
      {stats.map((stat) => {
        const Icon = stat.icon;

        let value: string | number;

        if (stat.title === "Products") {
          value = loading ? "..." : error ? "!" : productCount;
        } else if (stat.title === "Orders") {
          value = orderStatsLoading
            ? "..."
            : orderStatsError
              ? "!"
              : orderCount;
        } else {
          value = orderStatsLoading
            ? "..."
            : orderStatsError
              ? "!"
              : `ETB ${totalSales.toLocaleString()}`;
        }

        return (
          <div
            key={stat.title}
            className="flex min-w-0 flex-col rounded-xl border border-gray-200 bg-white p-3 shadow-sm sm:p-4"
          >
            <div className="flex w-full items-center justify-between gap-2">
              <p className="truncate text-xs font-medium text-gray-500 sm:text-sm">
                {stat.title}
              </p>

              <div
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg sm:h-9 sm:w-9 ${stat.bgColor} ${stat.color}`}
              >
                <Icon
                  className="h-4 w-4 sm:h-5 sm:w-5"
                  strokeWidth={1.8}
                />
              </div>
            </div>

            <h3 className="mt-3 truncate text-xl font-bold tracking-tight text-gray-900 sm:text-2xl">
              {value}
            </h3>

            <p className="mt-1 truncate text-xs text-gray-500">
              {stat.description}
            </p>
          </div>
        );
      })}
    </section>
  );
}
