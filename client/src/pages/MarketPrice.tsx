import { useEffect, useMemo, useRef, useState } from "react";
import Topbar from "../components/Topbar";
import Navbar from "../components/Navbar";

import heroImage from "../assets/01_hen_egg_basket.jpg";

import {
  TrendingUp,
  TrendingDown,
  Minus,
  ArrowUp,
  ArrowDown,
  Egg,
  Bird,
  Wheat,
  Wrench,
  MapPin,
  CalendarDays,
  History,
  Package,
  CircleDollarSign,
  Info,
  Lightbulb,
  BarChart3,
  TriangleAlert,
} from "lucide-react";

import {
  getSellerPrices,
  getMarketPriceHistory,
} from "../services/marketPriceService";

import type { MarketPriceRecord } from "../services/marketPriceService";
import type { SellerProduct } from "../services/sellerService";

// --------------------------------------------------
// SETTINGS
// --------------------------------------------------

// While developing: if the backend is down or empty, show sample data
// that matches the design. Set to false for production.
const USE_SAMPLE_DATA_FALLBACK = true;

const REQUEST_TIMEOUT_MS = 10000;

// --------------------------------------------------
// TYPES
// --------------------------------------------------

type Category = "Eggs" | "Chickens" | "Feed" | "Equipment";

type PriceDirection = "up" | "down" | "stable" | "unknown";

type Change = { amount: number; percentage: number } | null;

const categories: {
  name: Category;
  label: string;
  title: string;
  unit: string;
  icon: typeof Egg;
}[] = [
  {
    name: "Eggs",
    label: "Egg",
    title: "Egg Prices",
    unit: "Per piece / per tray",
    icon: Egg,
  },
  {
    name: "Chickens",
    label: "Hens / Chickens",
    title: "Hen Prices",
    unit: "Per bird",
    icon: Bird,
  },
  {
    name: "Feed",
    label: "Feed",
    title: "Feed Prices",
    unit: "Per kg / per sack",
    icon: Wheat,
  },
  {
    name: "Equipment",
    label: "Equipment",
    title: "Equipment Prices",
    unit: "Per item",
    icon: Wrench,
  },
];

const iconStyles: Record<Category, string> = {
  Eggs: "bg-amber-100 text-amber-600",
  Chickens: "bg-orange-100 text-orange-600",
  Feed: "bg-green-100 text-green-700",
  Equipment: "bg-slate-100 text-slate-600",
};

// --------------------------------------------------
// SAMPLE DATA (matches the design mockup)
// --------------------------------------------------

const SAMPLE_DATES = [
  "2025-10-01T00:00:00.000Z",
  "2025-10-08T00:00:00.000Z",
  "2025-10-15T00:00:00.000Z",
  "2025-10-29T00:00:00.000Z",
];

const sampleHistory = (
  productName: string,
  category: Category,
  unit: string,
  location: string,
  prices: number[]
) =>
  prices.map((price, i) => ({
    _id: `h-${productName}-${location}-${i}`,
    productName,
    category,
    location,
    unit,
    price,
    recordedAt: SAMPLE_DATES[i],
    source: "Sample",
  }));

const sampleSeller = (
  id: string,
  name: string,
  category: Category,
  location: string,
  quantity: string,
  price: number
) => ({
  _id: id,
  name,
  description: "",
  category,
  location,
  quantity,
  price,
  createdAt: SAMPLE_DATES[3],
});

// price = current listing, history = oldest -> newest
const SAMPLE_EGG_LOCATIONS = [
  { location: "Addis Ababa", price: 14, history: [13, 12, 16, 14] },
  { location: "Dire Dawa", price: 15, history: [14, 13, 17, 15] },
  { location: "Hawassa", price: 13, history: [12, 11, 15, 13] },
  { location: "Bahir Dar", price: 14, history: [14, 12, 16, 14] },
  { location: "Mekelle", price: 13, history: [14, 15, 11, 13] },
];

const SAMPLE_SELLERS = [
  ...SAMPLE_EGG_LOCATIONS.map((item, i) =>
    sampleSeller(
      `s-egg-${i}`,
      "Egg (per piece)",
      "Eggs",
      item.location,
      "1 egg",
      item.price
    )
  ),
  sampleSeller("s-tray", "Egg Tray", "Eggs", "Addis Ababa", "30 pcs", 390),
  sampleSeller("s-quail", "Quail Egg", "Eggs", "Addis Ababa", "1 egg", 20),
  sampleSeller("s-hen", "Layer Hen", "Chickens", "Addis Ababa", "1 bird", 850),
  sampleSeller("s-feed", "Layer Feed", "Feed", "Addis Ababa", "50 kg", 2400),
  sampleSeller(
    "s-equip",
    "Egg Incubator",
    "Equipment",
    "Addis Ababa",
    "1 unit",
    6500
  ),
] as unknown as SellerProduct[];

const SAMPLE_HISTORY = [
  ...SAMPLE_EGG_LOCATIONS.flatMap((item) =>
    sampleHistory(
      "Egg (per piece)",
      "Eggs",
      "1 egg",
      item.location,
      item.history
    )
  ),
  ...sampleHistory("Egg Tray", "Eggs", "30 pcs", "Addis Ababa", [
    380, 360, 450, 390,
  ]),
  ...sampleHistory("Quail Egg", "Eggs", "1 egg", "Addis Ababa", [
    20, 18, 25, 20,
  ]),
] as unknown as MarketPriceRecord[];

// --------------------------------------------------
// HELPERS
// --------------------------------------------------

const num = (value: number) =>
  value.toLocaleString("en-US", { maximumFractionDigits: 2 });

const dateLabel = (date: string) => {
  const parsed = new Date(date);

  return Number.isNaN(parsed.getTime())
    ? "Date unavailable"
    : parsed.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
};

const withTimeout = <T,>(promise: Promise<T>, ms = REQUEST_TIMEOUT_MS) =>
  Promise.race([
    promise,
    new Promise<never>((_, reject) =>
      setTimeout(
        () =>
          reject(
            new Error("The server did not respond. Is the backend running?")
          ),
        ms
      )
    ),
  ]);

const sameText = (a?: string, b?: string) =>
  (a ?? "").trim().toLowerCase() === (b ?? "").trim().toLowerCase();

// Min / max for one product (and location). Only if all records share a unit.
const getHistoricalRange = (
  history: MarketPriceRecord[],
  productName: string,
  location?: string
) => {
  const records = history.filter(
    (record) =>
      sameText(record.productName, productName) &&
      (!location || sameText(record.location, location))
  );

  const units = new Set(records.map((record) => record.unit));

  if (records.length === 0 || units.size !== 1) return null;

  const prices = records.map((record) => record.price);

  return { min: Math.min(...prices), max: Math.max(...prices) };
};

// First -> last recorded price for one product (and location).
const getHistoricalChange = (
  history: MarketPriceRecord[],
  productName: string,
  location?: string
): Change => {
  const records = history
    .filter(
      (record) =>
        sameText(record.productName, productName) &&
        (!location || sameText(record.location, location))
    )
    .sort(
      (a, b) =>
        new Date(a.recordedAt).getTime() - new Date(b.recordedAt).getTime()
    );

  const units = new Set(records.map((record) => record.unit));

  if (records.length < 2 || units.size !== 1) return null;

  const first = records[0].price;
  const last = records[records.length - 1].price;

  if (first === 0) return null;

  return {
    amount: last - first,
    percentage: ((last - first) / first) * 100,
  };
};

// Change cell: arrow + amount + percentage (matches the design)
function ChangeCell({ change }: { change: Change }) {
  if (!change) return <span className="text-gray-400">—</span>;

  const pct = change.percentage.toFixed(1);

  if (change.amount > 0) {
    return (
      <span className="inline-flex items-center gap-1 font-semibold text-green-700">
        <ArrowUp size={13} />+{num(change.amount)} ({pct}%)
      </span>
    );
  }

  if (change.amount < 0) {
    return (
      <span className="inline-flex items-center gap-1 font-semibold text-red-600">
        <ArrowDown size={13} />
        {num(change.amount)} ({pct}%)
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 text-gray-500">
      <Minus size={13} />0 (0%)
    </span>
  );
}

// --------------------------------------------------
// MAIN COMPONENT
// --------------------------------------------------

export default function MarketPrice() {
  const [sellerPrices, setSellerPrices] = useState<SellerProduct[]>([]);
  const [marketHistory, setMarketHistory] = useState<MarketPriceRecord[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [historyError, setHistoryError] = useState("");
  const [sampleNotice, setSampleNotice] = useState("");

  const [selectedCategory, setSelectedCategory] =
    useState<Category>("Eggs");

  const [selectedLocation, setSelectedLocation] = useState("All");
  const [draftLocation, setDraftLocation] = useState("All");

  const [trendProduct, setTrendProduct] = useState("");

  const locationInitialised = useRef(false);

  // --------------------------------------------------
  // LOAD BACKEND DATA
  // --------------------------------------------------

  useEffect(() => {
    let cancelled = false;

    const loadPrices = async () => {
      setLoading(true);
      setError("");
      setHistoryError("");
      setSampleNotice("");

      const [sellerResult, historyResult] = await Promise.allSettled([
        withTimeout(getSellerPrices()),
        withTimeout(getMarketPriceHistory()),
      ]);

      if (cancelled) return;

      const sellerOk =
        sellerResult.status === "fulfilled" && sellerResult.value.length > 0;

      // Backend failed or is empty -> use sample data (development only)
      if (!sellerOk && USE_SAMPLE_DATA_FALLBACK) {
        const reason =
          sellerResult.status === "rejected"
            ? sellerResult.reason instanceof Error
              ? sellerResult.reason.message
              : "Could not load seller prices."
            : "The server returned no listings.";

        setSellerPrices(SAMPLE_SELLERS);
        setMarketHistory(SAMPLE_HISTORY);
        setSampleNotice(reason);
        setLoading(false);
        return;
      }

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

  // --------------------------------------------------
  // LOCATIONS
  // --------------------------------------------------

  const locations = useMemo(() => {
    const allLocations = [
      ...sellerPrices.map((p) => p.location),
      ...marketHistory.map((p) => p.location),
    ];

    return [
      "All",
      ...Array.from(
        new Set(
          allLocations
            .filter((location): location is string =>
              Boolean(location?.trim())
            )
            .map((location) => location.trim())
        )
      ).sort((a, b) => a.localeCompare(b)),
    ];
  }, [sellerPrices, marketHistory]);

  // Default to Addis Ababa once data is loaded (as in the design)
  useEffect(() => {
    if (loading || locationInitialised.current) return;

    locationInitialised.current = true;

    if (locations.includes("Addis Ababa")) {
      setSelectedLocation("Addis Ababa");
      setDraftLocation("Addis Ababa");
    }
  }, [loading, locations]);

  // --------------------------------------------------
  // FILTER SELLER PRODUCTS
  // --------------------------------------------------

  const filteredProducts = useMemo(() => {
    return sellerPrices
      .filter(
        (product) =>
          product.category === selectedCategory &&
          (selectedLocation === "All" ||
            sameText(product.location, selectedLocation))
      )
      .sort(
        (a, b) =>
          new Date(b.createdAt ?? 0).getTime() -
          new Date(a.createdAt ?? 0).getTime()
      );
  }, [sellerPrices, selectedCategory, selectedLocation]);

  // --------------------------------------------------
  // FILTER HISTORICAL RECORDS
  // --------------------------------------------------

  const filteredHistory = useMemo(() => {
    return marketHistory.filter(
      (record) =>
        record.category === selectedCategory &&
        (selectedLocation === "All" ||
          sameText(record.location, selectedLocation))
    );
  }, [marketHistory, selectedCategory, selectedLocation]);

  // --------------------------------------------------
  // LOCATION COMPARISON
  // Compares ONE reference product (the most listed one)
  // across locations, e.g. "Egg (per piece)".
  // --------------------------------------------------

  const referenceProduct = useMemo(() => {
    const counts = new Map<string, { name: string; count: number }>();

    sellerPrices
      .filter((product) => product.category === selectedCategory)
      .forEach((product) => {
        const key = product.name.toLowerCase();
        const current = counts.get(key) ?? { name: product.name, count: 0 };

        current.count += 1;
        counts.set(key, current);
      });

    return (
      Array.from(counts.values()).sort((a, b) => b.count - a.count)[0]
        ?.name ?? ""
    );
  }, [sellerPrices, selectedCategory]);

  const locationComparisons = useMemo(() => {
    if (!referenceProduct) return [];

    const grouped = new Map<
      string,
      {
        location: string;
        count: number;
        total: number;
        lowest: number;
        highest: number;
      }
    >();

    sellerPrices
      .filter(
        (product) =>
          product.category === selectedCategory &&
          sameText(product.name, referenceProduct)
      )
      .forEach((product) => {
        const location = product.location?.trim();

        if (!location) return;

        const key = location.toLowerCase();

        const current = grouped.get(key) ?? {
          location,
          count: 0,
          total: 0,
          lowest: product.price,
          highest: product.price,
        };

        current.count += 1;
        current.total += product.price;
        current.lowest = Math.min(current.lowest, product.price);
        current.highest = Math.max(current.highest, product.price);

        grouped.set(key, current);
      });

    return Array.from(grouped.values())
      .map((group) => {
        const range = getHistoricalRange(
          marketHistory,
          referenceProduct,
          group.location
        ) ?? { min: group.lowest, max: group.highest };

        return {
          location: group.location,
          price: group.total / group.count,
          range,
          change: getHistoricalChange(
            marketHistory,
            referenceProduct,
            group.location
          ),
        };
      })
      .sort((a, b) => a.location.localeCompare(b.location));
  }, [sellerPrices, marketHistory, selectedCategory, referenceProduct]);

  // --------------------------------------------------
  // PRICE TREND OPTIONS
  // --------------------------------------------------

  const trendOptions = useMemo(() => {
    const groups = new Map<
      string,
      {
        key: string;
        label: string;
        records: MarketPriceRecord[];
      }
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

  // --------------------------------------------------
  // LATEST UPDATE
  // --------------------------------------------------

  const latestUpdate = useMemo(() => {
    const dates = [
      ...sellerPrices.map((p) => p.createdAt),
      ...marketHistory.map((p) => p.recordedAt),
    ]
      .filter(Boolean)
      .map((date) => new Date(date!).getTime())
      .filter((date) => !Number.isNaN(date));

    return dates.length
      ? dateLabel(new Date(Math.max(...dates)).toISOString())
      : "Not available";
  }, [sellerPrices, marketHistory]);

  // --------------------------------------------------
  // ACTIONS
  // --------------------------------------------------

  const selectCategory = (category: Category) => {
    setSelectedCategory(category);
    setTrendProduct("");
  };

  const applyLocation = () => {
    setSelectedLocation(draftLocation);
    setTrendProduct("");
  };

  const clearFilters = () => {
    setSelectedLocation("All");
    setDraftLocation("All");
    setTrendProduct("");
  };

  const activeCategory =
    categories.find((item) => item.name === selectedCategory) ??
    categories[0];

  const ActiveIcon = activeCategory.icon;

  // --------------------------------------------------
  // RENDER
  // --------------------------------------------------

  return (
    <main className="min-h-screen bg-[#f5f8f7]">
      <Topbar />
      <Navbar />

      <div className="mx-auto max-w-[1400px] px-3 py-4 sm:px-5 lg:px-7">
        {/* ==========================================
            1. HERO BANNER
        ========================================== */}

        <section
          className="relative mb-4 flex min-h-[130px] items-center overflow-hidden rounded-xl bg-[#e9f3ed] bg-cover bg-center shadow-sm"
          style={{
            backgroundImage: `
              linear-gradient(
                90deg,
                rgba(239,248,242,0.98) 0%,
                rgba(239,248,242,0.94) 40%,
                rgba(239,248,242,0.1) 100%
              ),
              url(${heroImage})
            `,
          }}
        >
          <div className="relative z-10 max-w-xl px-5 py-5 sm:px-7">
            <div className="mb-1.5 flex items-center gap-2 text-sm font-medium text-slate-700">
              <TrendingUp size={19} className="text-green-700" />
              Market Prices
            </div>

            <h1 className="text-2xl font-extrabold tracking-tight text-[#102a43] sm:text-[32px]">
              Poultry Products Price
            </h1>

            <p className="mt-2 max-w-md text-xs leading-5 text-slate-600 sm:text-[13px]">
              Check the latest prices of poultry products by category and
              location. Make better decisions for your farm or business.
            </p>
          </div>
        </section>

        {/* ==========================================
            2. CATEGORY TABS
        ========================================== */}

        <section className="mb-4">
          <div className="grid max-w-4xl grid-cols-2 gap-2.5 sm:grid-cols-4">
            {categories.map((category) => {
              const Icon = category.icon;
              const active = selectedCategory === category.name;

              return (
                <button
                  key={category.name}
                  type="button"
                  onClick={() => selectCategory(category.name)}
                  className={`flex min-h-[48px] items-center justify-center gap-2.5 rounded-lg px-3 py-3 text-xs font-semibold transition sm:text-sm ${
                    active
                      ? "bg-[#198754] text-white shadow-sm"
                      : "bg-[#edf2f7] text-slate-600 hover:bg-green-50"
                  }`}
                >
                  <Icon
                    size={20}
                    className={
                      active ? "fill-white/90 text-white" : "text-slate-600"
                    }
                  />
                  <span>{category.label}</span>
                </button>
              );
            })}
          </div>
        </section>

        {/* ==========================================
            3. MAIN DASHBOARD GRID
            (lg: so the sidebar sits beside the tables
            on normal laptop screens)
        ========================================== */}

        <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-12">
          {/* ========================================
              LEFT CONTENT
          ======================================== */}

          <div className="min-w-0 space-y-4 lg:col-span-8">
            {/* SAMPLE DATA NOTICE */}

            {sampleNotice && (
              <div
                role="status"
                className="flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800"
              >
                <TriangleAlert size={16} className="mt-0.5 shrink-0" />
                <p>
                  Showing sample data. {sampleNotice}
                </p>
              </div>
            )}

            {/* LOCATION SEARCH */}

            <section className="rounded-xl border border-gray-200 bg-white p-3 shadow-sm sm:p-4">
              <label
                htmlFor="market-location"
                className="mb-2 flex items-center gap-2 text-xs font-bold text-slate-700"
              >
                <MapPin size={15} className="text-green-700" />
                Select Location
              </label>

              <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                <select
                  id="market-location"
                  value={draftLocation}
                  onChange={(e) => setDraftLocation(e.target.value)}
                  className="w-full max-w-[260px] rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
                >
                  {locations.map((location) => (
                    <option key={location} value={location}>
                      {location === "All" ? "All locations" : location}
                    </option>
                  ))}
                </select>

                <button
                  type="button"
                  onClick={applyLocation}
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#198754] px-8 py-2.5 text-sm font-semibold text-white transition hover:bg-green-800"
                >
                  Search
                </button>
              </div>
            </section>

            {/* PRICES CARD (main table + by-location table) */}

            <section className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
              {/* Header */}
              <div className="flex flex-wrap items-center justify-between gap-3 px-4 pb-3 pt-4">
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#2d5a46] text-white">
                    <ActiveIcon size={19} className="fill-white/20" />
                  </span>

                  <h2 className="text-lg font-bold text-slate-800">
                    {activeCategory.title}
                  </h2>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-[11px] text-gray-500">
                  <span className="flex items-center gap-1.5">
                    <MapPin size={14} className="text-slate-700" />
                    Location:{" "}
                    {selectedLocation === "All"
                      ? "All locations"
                      : selectedLocation}
                  </span>

                  <span className="flex items-center gap-1.5">
                    <CalendarDays size={14} className="text-slate-700" />
                    Last updated: {latestUpdate}
                  </span>
                </div>
              </div>

              {error && !sampleNotice && (
                <div
                  role="alert"
                  className="mx-4 mb-3 rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-700"
                >
                  Could not load seller prices: {error}
                </div>
              )}

              {/* Main product table */}
              <div className="px-4 pb-4">
                {loading ? (
                  <div className="py-12 text-center text-sm text-gray-500">
                    Loading market prices...
                  </div>
                ) : !error && filteredProducts.length === 0 ? (
                  <div className="rounded-lg border border-gray-200 px-4 py-12 text-center">
                    <Package
                      size={35}
                      className="mx-auto mb-3 text-gray-300"
                    />

                    <h3 className="text-sm font-semibold text-slate-700">
                      No products found
                    </h3>

                    <p className="mt-1 text-xs text-gray-500">
                      Try changing the category or location.
                    </p>

                    <button
                      type="button"
                      onClick={clearFilters}
                      className="mt-3 text-xs font-semibold text-green-700 hover:underline"
                    >
                      Clear filters
                    </button>
                  </div>
                ) : !error ? (
                  <div className="overflow-hidden rounded-lg border border-gray-200">
                    <div className="overflow-x-auto">
                      <table className="w-full min-w-[620px] text-left text-xs">
                        <thead className="bg-[#eef3f8] text-[11px] font-semibold text-slate-700">
                          <tr>
                            <th className="px-4 py-3">Product</th>
                            <th className="px-4 py-3">Unit</th>
                            <th className="px-4 py-3">Price (ETB)</th>
                            <th className="px-4 py-3">Price Range (ETB)</th>
                            <th className="px-4 py-3">Change</th>
                          </tr>
                        </thead>

                        <tbody className="divide-y divide-gray-100">
                          {filteredProducts.map((product) => {
                            const range = getHistoricalRange(
                              marketHistory,
                              product.name,
                              product.location
                            );

                            const change = getHistoricalChange(
                              marketHistory,
                              product.name,
                              product.location
                            );

                            return (
                              <tr
                                key={product._id}
                                className="transition hover:bg-green-50/40"
                              >
                                <td className="px-4 py-3">
                                  <span className="flex items-center gap-3">
                                    <span
                                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${iconStyles[selectedCategory]}`}
                                    >
                                      <ActiveIcon size={16} />
                                    </span>

                                    <span className="font-semibold text-slate-800">
                                      {product.name}
                                    </span>
                                  </span>
                                </td>

                                <td className="px-4 py-3 text-gray-600">
                                  {product.quantity || "—"}
                                </td>

                                <td className="whitespace-nowrap px-4 py-3 font-bold text-slate-800">
                                  {num(product.price)}
                                </td>

                                <td className="whitespace-nowrap px-4 py-3 text-gray-600">
                                  {range
                                    ? `${num(range.min)} – ${num(range.max)}`
                                    : "—"}
                                </td>

                                <td className="whitespace-nowrap px-4 py-3">
                                  <ChangeCell change={change} />
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : null}
              </div>

              {/* Prices by location */}
              <div className="mx-4 mb-4 overflow-hidden rounded-lg border border-gray-200">
                <div className="bg-[#eaf5ef] px-4 py-2.5">
                  <h3 className="text-xs font-bold text-slate-800">
                    {activeCategory.label} Prices by Location{" "}
                    {referenceProduct && (
                      <span className="font-normal text-gray-500">
                        – {referenceProduct}
                      </span>
                    )}
                  </h3>
                </div>

                {loading ? (
                  <div className="p-8 text-center text-xs text-gray-500">
                    Loading location prices...
                  </div>
                ) : locationComparisons.length === 0 ? (
                  <div className="p-8 text-center text-xs text-gray-500">
                    No location prices available.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[500px] text-left text-xs">
                      <thead className="bg-white text-[11px] font-semibold text-slate-600">
                        <tr className="border-b border-gray-100">
                          <th className="px-4 py-3">Location</th>
                          <th className="px-4 py-3">Price (ETB)</th>
                          <th className="px-4 py-3">Range (ETB)</th>
                          <th className="px-4 py-3">Change</th>
                        </tr>
                      </thead>

                      <tbody className="divide-y divide-gray-100">
                        {locationComparisons.map((item) => (
                          <tr
                            key={item.location}
                            className={`hover:bg-green-50/40 ${
                              sameText(selectedLocation, item.location)
                                ? "bg-green-50/60"
                                : ""
                            }`}
                          >
                            <td className="px-4 py-3">
                              <span className="flex items-center gap-2 font-medium text-slate-700">
                                <MapPin
                                  size={14}
                                  className="fill-green-700 text-green-700"
                                />
                                {item.location}
                              </span>
                            </td>

                            <td className="px-4 py-3 font-semibold text-slate-800">
                              {num(item.price)}
                            </td>

                            <td className="px-4 py-3 text-gray-600">
                              {num(item.range.min)} – {num(item.range.max)}
                            </td>

                            <td className="whitespace-nowrap px-4 py-3">
                              <ChangeCell change={item.change} />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 border-t border-gray-100 bg-gray-50 px-4 py-3">
                <span className="text-[11px] text-gray-500">
                  {filteredProducts.length} seller listings
                </span>

                <span className="text-[10px] text-gray-400">
                  Prices in Ethiopian Birr. Averages are calculated from
                  seller listings, not standardized market rates.
                </span>
              </div>
            </section>

            {/* ======================================
                PRICE TREND SECTION
            ====================================== */}

            <section className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5">
              <div className="mb-4 flex items-center gap-2">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-green-50 text-green-700">
                  <BarChart3 size={20} />
                </span>

                <div>
                  <h2 className="text-sm font-bold text-slate-800">
                    Historical Price Trends
                  </h2>

                  <p className="text-[11px] text-gray-500">
                    Track recorded price movements over time
                  </p>
                </div>
              </div>

              {historyError ? (
                <div className="rounded-lg bg-amber-50 p-4 text-xs text-amber-800">
                  Could not load historical prices: {historyError}
                </div>
              ) : loading ? (
                <div className="py-8 text-center text-xs text-gray-500">
                  Loading price history...
                </div>
              ) : trendOptions.length === 0 ? (
                <div className="py-8 text-center">
                  <History
                    size={34}
                    className="mx-auto mb-2 text-gray-300"
                  />

                  <p className="text-sm font-semibold text-slate-700">
                    No historical observations yet
                  </p>

                  <p className="mx-auto mt-2 max-w-md text-xs leading-5 text-gray-500">
                    Price trends will appear when historical prices have
                    been recorded for the selected category and location.
                  </p>
                </div>
              ) : (
                <>
                  <label
                    htmlFor="trend-product"
                    className="mb-2 block text-xs font-semibold text-gray-700"
                  >
                    Select Product
                  </label>

                  <select
                    id="trend-product"
                    value={trendProduct}
                    onChange={(e) => setTrendProduct(e.target.value)}
                    className="mb-5 w-full max-w-sm rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-xs outline-none focus:border-green-600"
                  >
                    <option value="">Choose a product</option>

                    {trendOptions.map((group) => (
                      <option key={group.key} value={group.key}>
                        {group.label}
                      </option>
                    ))}
                  </select>

                  {!activeTrend ? (
                    <p className="py-5 text-center text-xs text-gray-500">
                      Choose a product to display its historical trend.
                    </p>
                  ) : trendRecords.length < 2 ? (
                    <p className="rounded-lg bg-gray-50 p-6 text-center text-xs text-gray-600">
                      At least two observations are needed to display a
                      price trend.
                    </p>
                  ) : (
                    <>
                      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <h3 className="text-sm font-semibold text-slate-800">
                            {activeTrend.label}
                          </h3>

                          <p className="mt-1 text-[11px] text-gray-500">
                            {trendRecords.length} recorded observations
                          </p>
                        </div>

                        <div className="text-right">
                          <p className="text-[10px] text-gray-500">
                            Latest recorded price
                          </p>

                          <p className="text-lg font-bold text-green-700">
                            {num(
                              trendRecords[trendRecords.length - 1].price
                            )}{" "}
                            ETB
                          </p>
                        </div>
                      </div>

                      {(() => {
                        const width = 720;
                        const height = 240;
                        const padX = 48;
                        const padY = 25;

                        const prices = trendRecords.map(
                          (record) => record.price
                        );

                        const min = Math.min(...prices);
                        const max = Math.max(...prices);
                        const range = max - min || 1;

                        const points = trendRecords.map((record, index) => ({
                          x:
                            padX +
                            (index / (trendRecords.length - 1)) *
                              (width - padX * 2),

                          y:
                            height -
                            padY -
                            ((record.price - min) / range) *
                              (height - padY * 2),

                          record,
                        }));

                        const line = points
                          .map((point) => `${point.x},${point.y}`)
                          .join(" ");

                        return (
                          <div className="w-full overflow-x-auto">
                            <svg
                              viewBox={`0 0 ${width} ${height + 35}`}
                              role="img"
                              aria-label={`Historical prices for ${activeTrend.label}`}
                              className="h-auto w-full min-w-[450px]"
                            >
                              {[0, 1, 2, 3].map((tick) => {
                                const y =
                                  padY + (tick / 3) * (height - padY * 2);

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
                                      fill="#64748b"
                                    >
                                      {value.toLocaleString()}
                                    </text>
                                  </g>
                                );
                              })}

                              <polyline
                                points={line}
                                fill="none"
                                stroke="#198754"
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
                                    fill="#198754"
                                    stroke="white"
                                    strokeWidth="2"
                                  >
                                    <title>
                                      {`${num(point.record.price)} ETB on ${dateLabel(point.record.recordedAt)}`}
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
                                  fill="#64748b"
                                >
                                  {dateLabel(point.record.recordedAt)}
                                </text>
                              ))}
                            </svg>
                          </div>
                        );
                      })()}

                      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-gray-100 pt-3">
                        <span className="text-[10px] text-gray-500">
                          Historical observations only
                        </span>

                        <span
                          className={`flex items-center gap-1 text-xs font-semibold ${
                            priceDirection === "up"
                              ? "text-green-700"
                              : priceDirection === "down"
                                ? "text-red-600"
                                : "text-gray-500"
                          }`}
                        >
                          {priceDirection === "up" ? (
                            <TrendingUp size={15} />
                          ) : priceDirection === "down" ? (
                            <TrendingDown size={15} />
                          ) : (
                            <Minus size={15} />
                          )}

                          {priceChange === null
                            ? "Change unavailable"
                            : `${priceChange > 0 ? "+" : ""}${priceChange.toFixed(1)}%`}
                        </span>
                      </div>
                    </>
                  )}
                </>
              )}
            </section>
          </div>

          {/* ========================================
              RIGHT SIDEBAR
          ======================================== */}

          <aside className="space-y-3 lg:col-span-4">
            {/* QUICK INFO */}

            <section className="rounded-xl border border-[#d9ebe2] bg-[#eff8f3] p-3 shadow-sm">
              <h2 className="mb-3 flex items-center gap-2 text-sm font-bold text-slate-800">
                <Info size={18} className="fill-green-700 text-white" />
                <span>Quick Info</span>
              </h2>

              <div className="space-y-2">
                <div className="flex items-center gap-3 rounded-lg border border-green-100 bg-white p-3">
                  <span className="flex h-10 w-10 items-center justify-center text-green-800">
                    <ActiveIcon size={27} />
                  </span>

                  <div>
                    <p className="text-[11px] font-semibold text-slate-700">
                      Product Type
                    </p>

                    <p className="text-xs text-gray-500">
                      {activeCategory.label}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-lg border border-green-100 bg-white p-3">
                  <span className="flex h-10 w-10 items-center justify-center text-green-800">
                    <Package size={27} />
                  </span>

                  <div>
                    <p className="text-[11px] font-semibold text-slate-700">
                      Unit
                    </p>

                    <p className="text-xs text-gray-500">
                      {activeCategory.unit}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-lg border border-green-100 bg-white p-3">
                  <span className="flex h-10 w-10 items-center justify-center text-green-800">
                    <CircleDollarSign size={27} />
                  </span>

                  <div>
                    <p className="text-[11px] font-semibold text-slate-700">
                      Currency
                    </p>

                    <p className="text-xs text-gray-500">
                      Ethiopian Birr (ETB)
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* WHY PRICES CHANGE */}

            <section className="rounded-xl border border-blue-100 bg-[#eff6fd] p-4 shadow-sm">
              <h2 className="mb-3 flex items-center gap-2 text-sm font-bold text-slate-800">
                <MapPin size={19} className="fill-blue-600 text-blue-600" />
                Why Prices Change?
              </h2>

              <ul className="space-y-2 text-xs text-slate-600">
                <li className="flex gap-2">
                  <span>•</span>
                  <span>Seasonality (holidays, festivals)</span>
                </li>

                <li className="flex gap-2">
                  <span>•</span>
                  <span>Feed cost</span>
                </li>

                <li className="flex gap-2">
                  <span>•</span>
                  <span>Supply and demand</span>
                </li>

                <li className="flex gap-2">
                  <span>•</span>
                  <span>Disease outbreaks</span>
                </li>

                <li className="flex gap-2">
                  <span>•</span>
                  <span>Transportation cost</span>
                </li>
              </ul>
            </section>

            {/* TIP */}

            <section className="rounded-xl border border-amber-100 bg-[#fff6e3] p-4 shadow-sm">
              <h2 className="mb-2 flex items-center gap-2 text-sm font-bold text-slate-800">
                <Lightbulb
                  size={21}
                  className="fill-amber-300 text-amber-600"
                />
                Tip
              </h2>

              <p className="text-xs leading-5 text-slate-600">
                Prices may vary by region and quality. Always check with
                local traders for the most accurate price.
              </p>
            </section>

            {/* IMAGE */}

            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
              <img
                src={heroImage}
                alt="Poultry and eggs"
                className="h-36 w-full object-cover object-[75%_65%]"
              />
            </div>
          </aside>
        </div>

        {/* ==========================================
            FOOTER
        ========================================== */}

        <footer className="mt-6 border-t border-gray-200 py-5 text-center">
          <p className="text-[11px] leading-5 text-gray-500">
            Seller asking prices may differ from completed transaction
            prices and average market rates. Historical price movements
            are shown only when comparable dated observations are
            available.
          </p>
        </footer>
      </div>
    </main>
  );
}