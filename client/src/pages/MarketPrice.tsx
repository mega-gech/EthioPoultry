
import { useEffect, useMemo, useState } from "react";
import Topbar from "../components/Topbar";
import Navbar from "../components/Navbar";
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Package,
  Tags,
  MapPin,
  Search,
  CalendarDays,
  History,
  X,
  BarChart3,
  ArrowUpDown,
} from "lucide-react";

import {
  getSellerPrices,
  getMarketPriceHistory,
} from "../services/marketPriceService";

import type { MarketPriceRecord } from "../services/marketPriceService";
import type { SellerProduct } from "../services/sellerService";

const categories = ["All", "Eggs", "Chickens", "Equipment", "Feed"];

const money = (price: number) =>
  `${price.toLocaleString("en-ET", {
    maximumFractionDigits: 2,
  })} ETB`;

const dateLabel = (date: string) => {
  const parsed = new Date(date);

  return Number.isNaN(parsed.getTime())
    ? "Date unavailable"
    : parsed.toLocaleDateString("en-ET", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
};

type PriceDirection = "up" | "down" | "stable" | "unknown";

export default function MarketPrice() {
  const [sellerPrices, setSellerPrices] = useState<SellerProduct[]>([]);
  const [marketHistory, setMarketHistory] = useState<MarketPriceRecord[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [historyError, setHistoryError] = useState("");

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedLocation, setSelectedLocation] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [trendProduct, setTrendProduct] = useState("");

  useEffect(() => {
    let cancelled = false;

    const loadPrices = async () => {
      setLoading(true);
      setError("");
      setHistoryError("");

      const [sellerResult, historyResult] = await Promise.allSettled([
        getSellerPrices(),
        getMarketPriceHistory(),
      ]);

      if (cancelled) return;

      if (sellerResult.status === "fulfilled") {
        setSellerPrices(sellerResult.value);
      } else {
        setError(
          sellerResult.reason instanceof Error
            ? sellerResult.reason.message
            : "Could not load seller prices."
        );
      }

      if (historyResult.status === "fulfilled") {
        setMarketHistory(historyResult.value);
      } else {
        setHistoryError(
          historyResult.reason instanceof Error
            ? historyResult.reason.message
            : "Could not load historical prices."
        );
      }

      setLoading(false);
    };

    loadPrices();

    return () => {
      cancelled = true;
    };
  }, []);

  const locations = useMemo(
    () => [
      "All",
      ...Array.from(
        new Set(
          [
            ...sellerPrices.map((p) => p.location),
            ...marketHistory.map((p) => p.location),
          ]
            .filter((location): location is string => Boolean(location?.trim()))
            .map((location) => location.trim())
        )
      ).sort((a, b) => a.localeCompare(b)),
    ],
    [sellerPrices, marketHistory]
  );

  const matchesSearch = (
    values: Array<string | number | undefined>
  ) => {
    const query = searchTerm.trim().toLowerCase();

    return (
      !query ||
      values.some((value) =>
        String(value ?? "").toLowerCase().includes(query)
      )
    );
  };

  const filteredProducts = useMemo(() => {
    const filtered = sellerPrices.filter((product) => {
      const categoryMatch =
        selectedCategory === "All" ||
        product.category === selectedCategory;

      const locationMatch =
        selectedLocation === "All" ||
        product.location?.toLowerCase() === selectedLocation.toLowerCase();

      return (
        categoryMatch &&
        locationMatch &&
        matchesSearch([
          product.name,
          product.description,
          product.category,
          product.location,
          product.quantity,
        ])
      );
    });

    return [...filtered].sort((a, b) => {
      if (sortBy === "price-low") return a.price - b.price;
      if (sortBy === "price-high") return b.price - a.price;
      if (sortBy === "name") return a.name.localeCompare(b.name);

      return (
        new Date(b.createdAt ?? 0).getTime() -
        new Date(a.createdAt ?? 0).getTime()
      );
    });
  }, [
    sellerPrices,
    selectedCategory,
    selectedLocation,
    searchTerm,
    sortBy,
  ]);

  const filteredHistory = useMemo(
    () =>
      marketHistory.filter((record) => {
        const categoryMatch =
          selectedCategory === "All" ||
          record.category === selectedCategory;

        const locationMatch =
          selectedLocation === "All" ||
          record.location?.toLowerCase() === selectedLocation.toLowerCase();

        return (
          categoryMatch &&
          locationMatch &&
          matchesSearch([
            record.productName,
            record.category,
            record.location,
            record.unit,
            record.source,
          ])
        );
      }),
    [marketHistory, selectedCategory, selectedLocation, searchTerm]
  );

  // Average of listed prices in each category.
  // This is not a standardized market price because product units can differ.
  const categoryAverage = (category: string) => {
    const products = sellerPrices.filter(
      (product) => product.category === category
    );

    if (products.length === 0) return null;

    return (
      products.reduce((total, product) => total + product.price, 0) /
      products.length
    );
  };

  // Build historical series separately for each product and unit.
  // Never compare different products or units as if they were equivalent.
  const trendOptions = useMemo(() => {
    const groups = new Map<
      string,
      { key: string; label: string; records: MarketPriceRecord[] }
    >();

    filteredHistory.forEach((record) => {
      const key = `${record.productName}|||${record.unit}`;

      if (!groups.has(key)) {
        groups.set(key, {
          key,
          label: `${record.productName} (${record.unit})`,
          records: [],
        });
      }

      groups.get(key)!.records.push(record);
    });

    return Array.from(groups.values())
      .map((group) => ({
        ...group,
        records: [...group.records].sort(
          (a, b) =>
            new Date(a.recordedAt).getTime() -
            new Date(b.recordedAt).getTime()
        ),
      }))
      .sort((a, b) => a.label.localeCompare(b.label));
  }, [filteredHistory]);

  const activeTrend = trendOptions.find(
    (group) => group.key === trendProduct
  );

  const trendRecords = activeTrend?.records ?? [];

  const priceDirection: PriceDirection = (() => {
    if (trendRecords.length < 2) return "unknown";

    const first = trendRecords[0].price;
    const last = trendRecords[trendRecords.length - 1].price;

    if (last > first) return "up";
    if (last < first) return "down";

    return "stable";
  })();

  const priceChange =
    trendRecords.length >= 2 && trendRecords[0].price !== 0
      ? ((trendRecords[trendRecords.length - 1].price -
          trendRecords[0].price) /
          trendRecords[0].price) *
        100
      : null;

  // Compare current asking prices in each location for the selected category.
  const locationComparisons = useMemo(() => {
    const products = sellerPrices.filter(
      (product) =>
        selectedCategory === "All" ||
        product.category === selectedCategory
    );

    const grouped = new Map<
      string,
      { location: string; count: number; total: number; lowest: number }
    >();

    products.forEach((product) => {
      const location = product.location?.trim();

      if (!location) return;

      const key = location.toLowerCase();
      const current = grouped.get(key) ?? {
        location,
        count: 0,
        total: 0,
        lowest: product.price,
      };

      current.count += 1;
      current.total += product.price;
      current.lowest = Math.min(current.lowest, product.price);

      grouped.set(key, current);
    });

    return Array.from(grouped.values())
      .map((group) => ({
        ...group,
        average: group.total / group.count,
      }))
      .sort((a, b) => a.average - b.average);
  }, [sellerPrices, selectedCategory]);

  const clearFilters = () => {
    setSelectedCategory("All");
    setSelectedLocation("All");
    setSearchTerm("");
    setSortBy("newest");
  };

  const hasActiveFilters =
    selectedCategory !== "All" ||
    selectedLocation !== "All" ||
    searchTerm.trim() !== "";

  const resetTrend = () => setTrendProduct("");

  return (
    <main className="min-h-screen bg-gray-50">
      <Topbar />
      <Navbar />

      {/* Page heading */}
      <section className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
            <div>
              <span className="mb-3 inline-flex items-center gap-2 rounded-full bg-green-50 px-3 py-1.5 text-sm font-medium text-green-800">
                <TrendingUp size={16} />
                Poultry market insights
              </span>

              <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                Market Prices
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-600 sm:text-base">
                Explore seller asking prices, compare poultry markets by
                location, and track recorded price changes over time.
              </p>
            </div>

            <div className="flex items-center gap-3 rounded-xl border border-green-100 bg-green-50 p-4">
              <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-white text-green-700">
                <Package size={23} />
              </span>
              <div>
                <p className="text-sm text-gray-600">Active listings</p>
                <p className="text-2xl font-bold text-gray-900">
                  {loading ? "—" : sellerPrices.length}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        {/* 1. Market overview */}
        <section className="mb-12">
          <div className="mb-5">
            <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">
              1. Market Overview
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Category-level averages from current seller listings, plus
              recorded historical price movement.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {[
              { name: "Eggs", color: "amber", icon: Package },
              { name: "Chickens", color: "green", icon: Tags },
              { name: "Feed", color: "blue", icon: Package },
            ].map((item) => {
              const average = categoryAverage(item.name);

              const Icon = item.icon;

              return (
                <div
                  key={item.name}
                  className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-500">
                      {item.name} prices
                    </span>
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-50 text-green-700">
                      <Icon size={21} />
                    </span>
                  </div>

                  <p className="mt-4 text-2xl font-bold text-gray-900">
                    {loading
                      ? "—"
                      : average === null
                        ? "No listings"
                        : money(average)}
                  </p>

                  <p className="mt-2 text-xs leading-5 text-gray-500">
                    {average === null
                      ? "No active listings in this category"
                      : "Average asking price per listing; units may differ"}
                  </p>
                </div>
              );
            })}

            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-500">
                  Recent price movement
                </span>
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-50 text-green-700">
                  {priceDirection === "up" ? (
                    <TrendingUp size={21} />
                  ) : priceDirection === "down" ? (
                    <TrendingDown size={21} />
                  ) : (
                    <Minus size={21} />
                  )}
                </span>
              </div>

              <p className="mt-4 text-2xl font-bold text-gray-900">
                {priceChange === null
                  ? "Not available"
                  : `${priceChange > 0 ? "+" : ""}${priceChange.toFixed(1)}%`}
              </p>

              <p className="mt-2 text-xs leading-5 text-gray-500">
                {priceChange === null
                  ? "Requires at least two observations for the same product and unit"
                  : `Change for ${activeTrend?.label ?? "selected product"}`}
              </p>
            </div>
          </div>
        </section>

        {/* Shared search and filters */}
        <section className="mb-12 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="mb-5 flex items-center gap-2">
            <BarChart3 size={20} className="text-green-700" />
            <h2 className="font-semibold text-gray-900">
              Explore prices
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            <div className="xl:col-span-2">
              <label
                htmlFor="market-search"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Search products
              </label>
              <div className="relative">
                <Search
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  id="market-search"
                  type="search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search eggs, feed, chickens..."
                  className="w-full rounded-xl border border-gray-300 py-3 pl-10 pr-4 text-sm outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="market-category"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Category
              </label>
              <select
                id="market-category"
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  resetTrend();
                }}
                className="w-full rounded-xl border border-gray-300 bg-white px-3 py-3 text-sm outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category === "All" ? "All categories" : category}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="market-location"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Location
              </label>
              <select
                id="market-location"
                value={selectedLocation}
                onChange={(e) => {
                  setSelectedLocation(e.target.value);
                  resetTrend();
                }}
                className="w-full rounded-xl border border-gray-300 bg-white px-3 py-3 text-sm outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
              >
                {locations.map((location) => (
                  <option key={location} value={location}>
                    {location === "All" ? "All locations" : location}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 pt-4">
            <p className="text-sm text-gray-500">
              {filteredProducts.length} seller listings ·{" "}
              {filteredHistory.length} historical observations
            </p>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="inline-flex items-center gap-1.5 text-sm font-medium text-green-700 hover:text-green-900"
              >
                <X size={16} />
                Clear filters
              </button>
            )}
          </div>
        </section>

        {/* 2. Price trends */}
        <section className="mb-12">
          <div className="mb-5">
            <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">
              2. Price Trends
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              View recorded price observations over time for the same product
              and unit.
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
            {historyError ? (
              <div className="rounded-xl bg-amber-50 p-5 text-sm text-amber-800">
                Historical price data could not be loaded: {historyError}
              </div>
            ) : loading ? (
              <div className="py-12 text-center text-sm text-gray-500">
                Loading price history...
              </div>
            ) : trendOptions.length === 0 ? (
              <div className="py-10 text-center">
                <History
                  size={38}
                  className="mx-auto mb-3 text-gray-400"
                />
                <h3 className="font-semibold text-gray-900">
                  No historical observations yet
                </h3>
                <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-gray-500">
                  The trend chart will appear when market prices have been
                  recorded over time. Current seller listings are not
                  historical observations.
                </p>
              </div>
            ) : (
              <>
                <label
                  htmlFor="trend-product"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Product and unit
                </label>
                <select
                  id="trend-product"
                  value={trendProduct}
                  onChange={(e) => setTrendProduct(e.target.value)}
                  className="mb-6 w-full max-w-md rounded-xl border border-gray-300 bg-white px-3 py-3 text-sm outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
                >
                  <option value="">Choose a product to view its trend</option>
                  {trendOptions.map((group) => (
                    <option key={group.key} value={group.key}>
                      {group.label}
                    </option>
                  ))}
                </select>

                {!activeTrend ? (
                  <p className="py-8 text-center text-sm text-gray-500">
                    Choose a product to display its historical prices.
                  </p>
                ) : trendRecords.length < 2 ? (
                  <p className="rounded-xl bg-gray-50 px-4 py-8 text-center text-sm text-gray-600">
                    This product has only one recorded observation. At least
                    two observations are needed to show a price trend.
                  </p>
                ) : (
                  <div>
                    <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {activeTrend.label}
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">
                          {trendRecords.length} observations
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="text-xs text-gray-500">
                          Latest recorded price
                        </p>
                        <p className="text-xl font-bold text-green-700">
                          {money(trendRecords[trendRecords.length - 1].price)}
                        </p>
                      </div>
                    </div>

                    {(() => {
                      const width = 720;
                      const height = 260;
                      const padX = 44;
                      const padY = 28;

                      const prices = trendRecords.map((record) => record.price);
                      const min = Math.min(...prices);
                      const max = Math.max(...prices);
                      const range = max - min || 1;

                      const points = trendRecords.map((record, index) => {
                        const x =
                          padX +
                          (index / (trendRecords.length - 1)) *
                            (width - padX * 2);

                        const y =
                          height -
                          padY -
                          ((record.price - min) / range) *
                            (height - padY * 2);

                        return { x, y, record };
                      });

                      const line = points
                        .map((point) => `${point.x},${point.y}`)
                        .join(" ");

                      return (
                        <div className="w-full overflow-x-auto">
                          <svg
                            viewBox={`0 0 ${width} ${height + 36}`}
                            role="img"
                            aria-label={`Historical prices for ${activeTrend.label}`}
                            className="h-auto w-full min-w-[520px]"
                          >
                            {[0, 1, 2, 3].map((tick) => {
                              const y =
                                padY +
                                (tick / 3) * (height - padY * 2);

                              const value =
                                max - (tick / 3) * (max - min);

                              return (
                                <g key={tick}>
                                  <line
                                    x1={padX}
                                    y1={y}
                                    x2={width - padX}
                                    y2={y}
                                    stroke="#e5e7eb"
                                    strokeDasharray="4 4"
                                  />
                                  <text
                                    x={padX - 8}
                                    y={y + 4}
                                    textAnchor="end"
                                    fontSize="11"
                                    fill="#6b7280"
                                  >
                                    {value.toLocaleString()}
                                  </text>
                                </g>
                              );
                            })}

                            <polyline
                              points={line}
                              fill="none"
                              stroke="#15803d"
                              strokeWidth="3"
                              strokeLinejoin="round"
                              strokeLinecap="round"
                            />

                            {points.map((point, index) => (
                              <g key={`${point.record._id}-${index}`}>
                                <circle
                                  cx={point.x}
                                  cy={point.y}
                                  r="5"
                                  fill="#15803d"
                                  stroke="white"
                                  strokeWidth="2"
                                >
                                  <title>
                                    {`${money(point.record.price)} on ${dateLabel(point.record.recordedAt)}`}
                                  </title>
                                </circle>
                              </g>
                            ))}

                            {[
                              points[0],
                              points[Math.floor((points.length - 1) / 2)],
                              points[points.length - 1],
                            ].map((point, index) => (
                              <text
                                key={`${point.record._id}-date-${index}`}
                                x={point.x}
                                y={height + 16}
                                textAnchor={
                                  index === 0
                                    ? "start"
                                    : index === 2
                                      ? "end"
                                      : "middle"
                                }
                                fontSize="11"
                                fill="#6b7280"
                              >
                                {dateLabel(point.record.recordedAt)}
                              </text>
                            ))}
                          </svg>
                        </div>
                      );
                    })()}

                    <p className="mt-3 text-xs leading-5 text-gray-500">
                      The chart connects recorded observations in date order.
                      It does not predict future prices.
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        </section>

        {/* 3. Prices by location */}
        <section className="mb-12">
          <div className="mb-5">
            <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">
              3. Prices by Location
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Compare current seller asking prices across the locations in
              your database.
            </p>
          </div>

          {loading ? (
            <div className="rounded-2xl border border-gray-200 bg-white p-8 text-sm text-gray-500">
              Loading location comparisons...
            </div>
          ) : locationComparisons.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-8 text-center text-sm text-gray-500">
              No location price comparisons are available.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              {locationComparisons.map((location) => {
                const highestAverage = Math.max(
                  ...locationComparisons.map((item) => item.average)
                );

                const barWidth =
                  highestAverage > 0
                    ? (location.average / highestAverage) * 100
                    : 0;

                return (
                  <article
                    key={location.location}
                    className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50 text-green-700">
                          <MapPin size={20} />
                        </span>
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            {location.location}
                          </h3>
                          <p className="mt-1 text-xs text-gray-500">
                            {location.count} seller listing
                            {location.count === 1 ? "" : "s"}
                          </p>
                        </div>
                      </div>
                    </div>

                    <p className="mt-5 text-sm text-gray-500">
                      Average listed price
                    </p>
                    <p className="mt-1 text-2xl font-bold text-gray-900">
                      {money(location.average)}
                    </p>

                    <div className="mt-4 h-2 overflow-hidden rounded-full bg-gray-100">
                      <div
                        className="h-full rounded-full bg-green-600"
                        style={{ width: `${barWidth}%` }}
                      />
                    </div>

                    <div className="mt-4 flex justify-between gap-3 border-t border-gray-100 pt-3 text-xs text-gray-500">
                      <span>Lowest listing</span>
                      <span className="font-semibold text-gray-700">
                        {money(location.lowest)}
                      </span>
                    </div>
                  </article>
                );
              })}
            </div>
          )}

          <p className="mt-3 text-xs leading-5 text-gray-500">
            These are averages of listing prices, not standardized market
            rates. Products, quantities, and units can differ between sellers.
          </p>
        </section>

        {/* 4. Market price table */}
        <section className="mb-12">
          <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">
                4. Market Price Table
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Search and compare current seller prices in Ethiopian birr.
              </p>
            </div>

            <span className="rounded-full bg-green-100 px-3 py-1.5 text-sm font-semibold text-green-800">
              {filteredProducts.length} listings
            </span>
          </div>

          {error && (
            <div
              role="alert"
              className="mb-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800"
            >
              Could not load seller prices: {error}
            </div>
          )}

          {loading ? (
            <div className="rounded-2xl border border-gray-200 bg-white p-10 text-center text-sm text-gray-500">
              Loading market prices...
            </div>
          ) : !error && filteredProducts.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-12 text-center">
              <Package size={36} className="mx-auto mb-3 text-gray-400" />
              <h3 className="font-semibold text-gray-900">
                No matching listings
              </h3>
              <p className="mt-2 text-sm text-gray-500">
                Change your search or filters to find more products.
              </p>
            </div>
          ) : !error ? (
            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 p-4">
                <p className="text-sm text-gray-500">
                  Prices are displayed as listed by each seller.
                </p>

                <label className="flex items-center gap-2 text-sm text-gray-600">
                  <ArrowUpDown size={16} />
                  <span className="sr-only">Sort products</span>
                  <select
                    aria-label="Sort market prices"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="rounded-lg border border-gray-300 bg-white px-3 py-2 outline-none focus:border-green-600"
                  >
                    <option value="newest">Newest first</option>
                    <option value="price-low">Price: low to high</option>
                    <option value="price-high">Price: high to low</option>
                    <option value="name">Product name</option>
                  </select>
                </label>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[760px] text-left text-sm">
                  <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
                    <tr>
                      <th className="px-5 py-4 font-semibold">Product</th>
                      <th className="px-5 py-4 font-semibold">Category</th>
                      <th className="px-5 py-4 font-semibold">Asking price</th>
                      <th className="px-5 py-4 font-semibold">Quantity</th>
                      <th className="px-5 py-4 font-semibold">Location</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-100">
                    {filteredProducts.map((product) => (
                      <tr
                        key={product._id}
                        className="transition hover:bg-gray-50"
                      >
                        <td className="px-5 py-4">
                          <p className="font-semibold text-gray-900">
                            {product.name}
                          </p>
                          <p className="mt-1 max-w-xs truncate text-xs text-gray-500">
                            {product.description || "No description"}
                          </p>
                        </td>

                        <td className="px-5 py-4">
                          <span className="inline-flex rounded-full bg-green-50 px-2.5 py-1 text-xs font-medium text-green-800">
                            {product.category}
                          </span>
                        </td>

                        <td className="whitespace-nowrap px-5 py-4 font-bold text-green-700">
                          {money(product.price)}
                        </td>

                        <td className="px-5 py-4 text-gray-600">
                          {product.quantity || "Not specified"}
                        </td>

                        <td className="px-5 py-4 text-gray-600">
                          <span className="inline-flex items-center gap-1.5">
                            <MapPin
                              size={15}
                              className="shrink-0 text-gray-400"
                            />
                            {product.location || "Not specified"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : null}
        </section>

        <footer className="border-t border-gray-200 pt-5 text-center text-xs leading-5 text-gray-500">
          Seller asking prices may differ from completed transaction prices
          and average market rates. Historical movements are shown only when
          dated observations are available.
        </footer>
      </div>
    </main>
  );
}
