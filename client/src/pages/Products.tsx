import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Topbar from "../components/Topbar";
import Navbar from "../components/Navbar";
import {
  getProducts,
  getStatistics,
  type SellerProduct,
  type MarketplaceStatistics,
} from "../services/sellerService";

const categories = ["Eggs", "Chickens", "Ducks", "Feed", "Equipment", "Medicine"];

const locations = [
  "Addis Ababa",
  "Bahir Dar",
  "Gondar",
  "Debre Markos",
  "Hawassa",
  "Mekelle",
];

const PRICE_MAX = 5000;

const stats = [
  { key: "registeredFarmers", label: "Registered Farmers", icon: "user" },
  { key: "availableProducts", label: "Active Listings", icon: "box" },
  { key: "successfulConnections", label: "Successful Deals", icon: "handshake" },
  { key: "coveredLocations", label: "Cities Covered", icon: "shield" },
] as const;

function getPhoneNumber(phone: string | undefined) {
  if (!phone) return "";

  let number = phone.replace(/\D/g, "");

  // Convert Ethiopian local mobile numbers to international format.
  if (number.startsWith("0")) {
    number = `251${number.slice(1)}`;
  } else if (number.startsWith("9") && number.length === 9) {
    number = `251${number}`;
  }

  // Reject missing or obviously incomplete placeholder numbers.
  if (number.length < 12 || number.length > 15) {
    return "";
  }

  return number;
}

function formatPrice(price: number) {
  return `${price.toLocaleString("en-ET")} ETB`;
}

function getSeller(product: SellerProduct) {
  const seller = product.sellerId;

  if (!seller || typeof seller === "string") {
    return { name: "Unknown seller", phone: undefined };
  }

  return {
    name: seller.name || "Unknown seller",
    phone: seller.phone,
  };
}

/* ---------- Small icon helpers ---------- */

function PinIcon({ className = "h-3.5 w-3.5" }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M12 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0z"
      />
    </svg>
  );
}

function ChevronIcon() {
  return (
    <svg
      className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="m6 9 6 6 6-6"
      />
    </svg>
  );
}

function StatIcon({ name }: { name: string }) {
  const common = {
    className: "h-9 w-9 text-[#0b7a3b]",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.5,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    viewBox: "0 0 24 24",
    "aria-hidden": true,
  };

  if (name === "user") {
    return (
      <svg {...common}>
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21v-1a6 6 0 0 1 6-6h4a6 6 0 0 1 6 6v1" />
      </svg>
    );
  }

  if (name === "box") {
    return (
      <svg {...common}>
        <path d="M21 8 12 3 3 8v8l9 5 9-5V8z" />
        <path d="m3 8 9 5 9-5M12 13v8" />
        <path d="m7.5 5.5 9 5" />
      </svg>
    );
  }

  if (name === "handshake") {
    return (
      <svg {...common}>
        <path d="m11 17 2 2a1.4 1.4 0 0 0 2-2" />
        <path d="m14 14 2.5 2.5a1.4 1.4 0 0 0 2-2l-3.8-3.8a2.1 2.1 0 0 0-3 0l-.4.4a1.4 1.4 0 0 1-2-2l2.6-2.6a4.2 4.2 0 0 1 3-1.2H16" />
        <path d="m21 3 1 11h-2" />
        <path d="M3 3 2 14l6.5 6.5a1.4 1.4 0 0 0 2-2" />
        <path d="M3 4h8" />
      </svg>
    );
  }

  return (
    <svg {...common}>
      <path d="M12 3 4 6v6c0 4.5 3.2 7.8 8 9 4.8-1.2 8-4.5 8-9V6l-8-3z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

function Products() {
  const navigate = useNavigate();
  const [products, setProducts] = useState<SellerProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Marketplace statistics (stats bar)
  const [statisticsData, setStatisticsData] =
    useState<MarketplaceStatistics | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    async function loadProducts() {
      try {
        setLoading(true);
        setError("");
        const data = await getProducts();
        setProducts(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Unable to load products",
        );
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, []);

  useEffect(() => {
    getStatistics()
      .then((data) => {
        setStatisticsData(data);
      })
      .catch((err) => {
        console.error("Failed to load statistics:", err);
      })
      .finally(() => {
        setStatsLoading(false);
      });
  }, []);

  // Search and filter states (sidebar and top bar share the same state)
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState(""); // "" = all
  const [location, setLocation] = useState("all");
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(PRICE_MAX);
  const [sortBy, setSortBy] = useState("newest");

  // Favorite product IDs
  const [favorites, setFavorites] = useState<string[]>([]);

  const toggleFavorite = (id: string) => {
    setFavorites((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    );
  };

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    const result = products.filter((product) => {
      const matchesSearch =
        !normalizedSearch ||
        product.name.toLowerCase().includes(normalizedSearch) ||
        product.category.toLowerCase().includes(normalizedSearch) ||
        product.location.toLowerCase().includes(normalizedSearch) ||
        (product.description ?? "").toLowerCase().includes(normalizedSearch) ||
        getSeller(product).name.toLowerCase().includes(normalizedSearch);

      const matchesCategory = !category || product.category === category;

      const matchesLocation =
        location === "all" || product.location === location;

      // "5,000+ ETB" means no upper limit
      const matchesPrice =
        product.price >= minPrice &&
        (maxPrice >= PRICE_MAX || product.price <= maxPrice);

      return (
        matchesSearch && matchesCategory && matchesLocation && matchesPrice
      );
    });

    if (sortBy === "price-low") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-high") {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === "name") {
      result.sort((a, b) => a.name.localeCompare(b.name));
    }

    return result;
  }, [products, search, category, location, minPrice, maxPrice, sortBy]);

  const clearFilters = () => {
    setSearch("");
    setCategory("");
    setLocation("all");
    setMinPrice(0);
    setMaxPrice(PRICE_MAX);
    setSortBy("newest");
  };

  const callSeller = (
    event: React.MouseEvent<HTMLButtonElement>,
    phone: string | undefined,
  ) => {
    event.stopPropagation();

    const number = getPhoneNumber(phone);

    if (!number) {
      window.alert("The seller's phone number is not available yet.");
      return;
    }

    window.location.href = `tel:+${number}`;
  };

  const contactWhatsApp = (
    event: React.MouseEvent<HTMLButtonElement>,
    phone: string | undefined,
    productName: string,
  ) => {
    event.stopPropagation();

    const number = getPhoneNumber(phone);

    if (!number) {
      window.alert("The seller's WhatsApp number is not available yet.");
      return;
    }

    const message = encodeURIComponent(
      `Hello, I am interested in your ${productName} listed on EthioPoultry. Is it available?`,
    );

    window.open(
      `https://wa.me/${number}?text=${message}`,
      "_blank",
      "noopener,noreferrer",
    );
  };

  const openProduct = (id: string) => {
    navigate(`/products/${id}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const selectClass =
    "h-11 w-full appearance-none rounded-lg border border-gray-200 bg-white text-sm text-gray-700 outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100";

  const minPercent = (minPrice / PRICE_MAX) * 100;
  const maxPercent = (maxPrice / PRICE_MAX) * 100;

  return (
    <>
      <Topbar />
      <Navbar />

      {/* Dual-handle price slider styling */}
      <style>{`
        .dual-range {
          -webkit-appearance: none;
          appearance: none;
          background: transparent;
          pointer-events: none;
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          height: 100%;
          margin: 0;
        }
        .dual-range::-webkit-slider-runnable-track {
          background: transparent;
          height: 100%;
        }
        .dual-range::-moz-range-track {
          background: transparent;
          height: 100%;
        }
        .dual-range::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          pointer-events: auto;
          height: 14px;
          width: 14px;
          border-radius: 9999px;
          background: #0b7a3b;
          border: 2px solid #ffffff;
          box-shadow: 0 0 0 1px #0b7a3b;
          cursor: pointer;
          margin-top: 1px;
        }
        .dual-range::-moz-range-thumb {
          pointer-events: auto;
          height: 12px;
          width: 12px;
          border-radius: 9999px;
          background: #0b7a3b;
          border: 2px solid #ffffff;
          box-shadow: 0 0 0 1px #0b7a3b;
          cursor: pointer;
        }
      `}</style>

      {loading ? (
        <div className="flex min-h-[80vh] items-center justify-center bg-[#f1f8f6] px-4 py-16">
          <p className="text-sm font-medium text-gray-600">
            Loading products...
          </p>
        </div>
      ) : error ? (
        <div className="flex min-h-[80vh] items-center justify-center bg-[#f1f8f6] px-4 py-16">
          <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
            <h1 className="text-xl font-bold text-gray-900">
              Could not load products
            </h1>
            <p className="mt-3 text-sm leading-6 text-red-600">{error}</p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-6 rounded-xl bg-[#0b7a3b] px-5 py-3 text-sm font-semibold text-white hover:bg-[#09662f]"
            >
              Try again
            </button>
          </div>
        </div>
      ) : (
        <main className="bg-[#f1f8f6]">
          <div className="mx-auto max-w-[1280px] px-4 py-5 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-[225px_minmax(0,1fr)]">
              {/* ================= FILTER SIDEBAR ================= */}
              <aside className="h-fit rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                <div className="flex items-center gap-2.5 border-b border-gray-200 pb-3">
                  <svg
                    className="h-5 w-5 text-[#0b7a3b]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeWidth="2"
                      d="M4 7h10M18 7h2M4 17h2M10 17h10"
                    />
                    <circle cx="16" cy="7" r="2" strokeWidth="2" />
                    <circle cx="8" cy="17" r="2" strokeWidth="2" />
                  </svg>

                  <h2 className="text-lg font-bold text-[#12372a]">Filters</h2>
                </div>

                {/* Category filter */}
                <div className="mt-5">
                  <h3 className="mb-3 text-sm font-bold text-[#12372a]">
                    Category
                  </h3>

                  <div className="space-y-3">
                    {categories.map((item) => (
                      <label
                        key={item}
                        className="flex cursor-pointer items-center gap-2.5 text-[13px] text-gray-700"
                      >
                        <input
                          type="checkbox"
                          checked={category === item}
                          onChange={() =>
                            setCategory(category === item ? "" : item)
                          }
                          className="h-4 w-4 cursor-pointer rounded accent-[#0b7a3b]"
                        />
                        <span>{item}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Location filter */}
                <div className="mt-6">
                  <h3 className="mb-2 text-sm font-bold text-[#12372a]">
                    Location
                  </h3>

                  <div className="relative">
                    <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#0b7a3b]">
                      <PinIcon />
                    </span>

                    <select
                      value={location}
                      onChange={(event) => setLocation(event.target.value)}
                      className={`${selectClass} h-10 pl-9 pr-8 text-xs`}
                      aria-label="Filter by location"
                    >
                      <option value="all">All Locations</option>
                      {locations.map((item) => (
                        <option key={item} value={item}>
                          {item}
                        </option>
                      ))}
                    </select>

                    <ChevronIcon />
                  </div>
                </div>

                {/* Price filter */}
                <div className="mt-6">
                  <h3 className="mb-4 text-sm font-bold text-[#12372a]">
                    Price Range
                  </h3>

                  <div className="relative mx-1 h-4">
                    {/* Track */}
                    <div className="absolute left-0 right-0 top-1/2 h-1 -translate-y-1/2 rounded-full bg-gray-200" />
                    {/* Selected range */}
                    <div
                      className="absolute top-1/2 h-1 -translate-y-1/2 rounded-full bg-[#0b7a3b]"
                      style={{
                        left: `${minPercent}%`,
                        width: `${Math.max(maxPercent - minPercent, 0)}%`,
                      }}
                    />

                    <input
                      type="range"
                      min={0}
                      max={PRICE_MAX}
                      step={50}
                      value={minPrice}
                      onChange={(event) =>
                        setMinPrice(
                          Math.min(Number(event.target.value), maxPrice - 50),
                        )
                      }
                      aria-label="Minimum product price"
                      className="dual-range"
                    />

                    <input
                      type="range"
                      min={0}
                      max={PRICE_MAX}
                      step={50}
                      value={maxPrice}
                      onChange={(event) =>
                        setMaxPrice(
                          Math.max(Number(event.target.value), minPrice + 50),
                        )
                      }
                      aria-label="Maximum product price"
                      className="dual-range"
                    />
                  </div>

                  <div className="mt-2 flex justify-between text-[11px] text-gray-600">
                    <span>{minPrice.toLocaleString()} ETB</span>
                    <span>
                      {maxPrice >= PRICE_MAX
                        ? "5,000+ ETB"
                        : `${maxPrice.toLocaleString()} ETB`}
                    </span>
                  </div>
                </div>

                {/* Filter actions */}
                <button
                  type="button"
                  onClick={() =>
                    document.getElementById("product-results")?.scrollIntoView({
                      behavior: "smooth",
                      block: "start",
                    })
                  }
                  className="mt-6 flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#0b7a3b] text-sm font-semibold text-white transition hover:bg-[#09662f]"
                >
                  <svg
                    className="h-4 w-4"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M3 4h18l-7 8.5V20l-4-2v-5.5L3 4z" />
                  </svg>
                  Apply Filters
                </button>

                <button
                  type="button"
                  onClick={clearFilters}
                  className="mt-4 block w-full text-center text-xs font-medium text-[#0b7a3b] hover:text-[#09662f]"
                >
                  Clear All
                </button>
              </aside>

              {/* ================= MARKETPLACE CONTENT ================= */}
              <section className="min-w-0">
                {/* Page heading */}
                <div>
                  <h1 className="text-2xl font-extrabold text-[#12372a] sm:text-[28px]">
                    Products Marketplace
                  </h1>

                  <p className="mt-1.5 text-sm text-gray-500">
                    Find fresh poultry and egg products from trusted farmers.
                  </p>
                </div>

                {/* Search and top filters */}
                <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3 lg:grid-cols-[minmax(0,1fr)_140px_140px_150px] xl:grid-cols-[minmax(0,1fr)_148px_148px_160px]">
                  {/* Search */}
                  <div className="relative sm:col-span-3 lg:col-span-1">
                    <input
                      type="search"
                      value={search}
                      onChange={(event) => setSearch(event.target.value)}
                      placeholder="Search products..."
                      className="h-11 w-full rounded-lg border border-gray-200 bg-white pl-10 pr-10 text-sm text-gray-700 outline-none placeholder:text-gray-400 focus:border-green-600 focus:ring-2 focus:ring-green-100 [&::-webkit-search-cancel-button]:hidden"
                    />

                    <svg
                      className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#0b7a3b]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="m21 21-4.35-4.35m2.35-5.65a8 8 0 11-16 0 8 8 0 0116 0z"
                      />
                    </svg>
                  </div>

                  {/* Category */}
                  <div className="relative">
                    <select
                      value={category || "all"}
                      onChange={(event) =>
                        setCategory(
                          event.target.value === "all"
                            ? ""
                            : event.target.value,
                        )
                      }
                      className={`${selectClass} pl-3.5 pr-9`}
                      aria-label="Filter by category"
                    >
                      <option value="all">All Categories</option>
                      {categories.map((item) => (
                        <option key={item} value={item}>
                          {item}
                        </option>
                      ))}
                    </select>
                    <ChevronIcon />
                  </div>

                  {/* Location */}
                  <div className="relative">
                    <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#0b7a3b]">
                      <PinIcon />
                    </span>

                    <select
                      value={location}
                      onChange={(event) => setLocation(event.target.value)}
                      className={`${selectClass} pl-9 pr-9`}
                      aria-label="Filter by location"
                    >
                      <option value="all">All Locations</option>
                      {locations.map((item) => (
                        <option key={item} value={item}>
                          {item}
                        </option>
                      ))}
                    </select>
                    <ChevronIcon />
                  </div>

                  {/* Sorting */}
                  <div className="relative">
                    <select
                      value={sortBy}
                      onChange={(event) => setSortBy(event.target.value)}
                      className={`${selectClass} pl-3.5 pr-9`}
                      aria-label="Sort products"
                    >
                      <option value="newest">Sort by: Newest</option>
                      <option value="price-low">Price: Low to High</option>
                      <option value="price-high">Price: High to Low</option>
                      <option value="name">Name: A to Z</option>
                    </select>
                    <ChevronIcon />
                  </div>
                </div>

                {/* Product cards */}
                <div
                  id="product-results"
                  className="mt-4 grid scroll-mt-24 grid-cols-1 gap-3 min-[480px]:grid-cols-2 md:grid-cols-[repeat(auto-fill,minmax(200px,1fr))]"
                >
                  {filteredProducts.map((product) => {
                    const seller = getSeller(product);
                    const isFavorite = favorites.includes(product._id);
                    const isAvailable = product.status !== "Out of Stock";

                    return (
                      <article
                        key={product._id}
                        role="link"
                        tabIndex={0}
                        aria-label={`View ${product.name} details`}
                        onClick={() => openProduct(product._id)}
                        onKeyDown={(event) => {
                          if (event.key === "Enter" || event.key === " ") {
                            event.preventDefault();
                            openProduct(product._id);
                          }
                        }}
                        className="group min-w-0 cursor-pointer rounded-xl border border-gray-200 bg-white p-2 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-green-200 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      >
                        {/* Product image */}
                        <div className="relative h-[120px] overflow-hidden rounded-lg bg-gray-100 sm:h-[122px]">
                          <img
                            src={product.image}
                            alt={product.name}
                            loading="lazy"
                            className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
                          />

                          {/* Out of stock badge (only shown when unavailable) */}
                          {!isAvailable && (
                            <span className="absolute left-2 top-2 rounded-full bg-red-100 px-2 py-1 text-[9px] font-semibold text-red-700">
                              Out of Stock
                            </span>
                          )}

                          {/* Favorite button */}
                          <button
                            type="button"
                            onClick={(event) => {
                              event.stopPropagation();
                              toggleFavorite(product._id);
                            }}
                            aria-label={
                              isFavorite
                                ? `Remove ${product.name} from favorites`
                                : `Add ${product.name} to favorites`
                            }
                            aria-pressed={isFavorite}
                            className={`absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full transition ${
                              isFavorite
                                ? "bg-white text-red-500 shadow-sm"
                                : "bg-black/30 text-white hover:bg-white hover:text-red-500"
                            }`}
                          >
                            <svg
                              className="h-4 w-4"
                              fill={isFavorite ? "currentColor" : "none"}
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              aria-hidden="true"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z"
                              />
                            </svg>
                          </button>
                        </div>

                        {/* Product information */}
                        <div className="px-1 pb-1 pt-2.5">
                          <h2
                            title={product.name}
                            className="truncate text-[13px] font-bold capitalize text-[#12372a]"
                          >
                            {product.name}
                          </h2>

                          <p className="mt-1.5 text-base font-bold text-[#0b7a3b]">
                            {formatPrice(product.price)}
                          </p>

                          {/* Location */}
                          <div className="mt-1.5 flex items-center gap-1 text-[11px] text-gray-500">
                            <PinIcon className="h-3 w-3 shrink-0 text-gray-400" />
                            <span className="truncate">{product.location}</span>
                          </div>

                          {/* Category */}
                          <div className="mt-2">
                            <span className="inline-flex max-w-full truncate rounded-full bg-[#e3f4ea] px-2.5 py-1 text-[10px] font-medium text-[#0b7a3b]">
                              {product.category}
                            </span>
                          </div>

                          {/* Contact actions */}
                          <div className="mt-3 grid grid-cols-2 gap-2">
                            <button
                              type="button"
                              disabled={!isAvailable}
                              onClick={(event) => callSeller(event, seller.phone)}
                              className="flex h-9 min-w-0 items-center justify-center gap-1.5 rounded-md bg-[#0b7a3b] px-1 text-[11px] font-semibold text-white transition hover:bg-[#09662f] disabled:cursor-not-allowed disabled:bg-gray-300"
                            >
                              <svg
                                className="h-3.5 w-3.5 shrink-0"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                                aria-hidden="true"
                              >
                                <path d="M6.62 10.79a15.46 15.46 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.02-.24c1.12.37 2.33.57 3.57.57a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1C10.16 21 3 13.84 3 5a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.57a1 1 0 0 1-.25 1.02z" />
                              </svg>
                              <span className="truncate">Call Seller</span>
                            </button>

                            <button
                              type="button"
                              disabled={!isAvailable}
                              onClick={(event) =>
                                contactWhatsApp(event, seller.phone, product.name)
                              }
                              className="flex h-9 min-w-0 items-center justify-center gap-1.5 rounded-md border border-[#0b7a3b] bg-white px-1 text-[11px] font-semibold text-[#0b7a3b] transition hover:bg-green-50 disabled:cursor-not-allowed disabled:border-gray-300 disabled:text-gray-400"
                            >
                              <svg
                                className="h-3.5 w-3.5 shrink-0"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                                aria-hidden="true"
                              >
                                <path d="M20.52 3.48A11.86 11.86 0 0 0 12.07 0C5.52 0 .2 5.32.2 11.87c0 2.09.55 4.13 1.6 5.93L.1 24l6.34-1.66a11.86 11.86 0 0 0 5.63 1.43h.01c6.55 0 11.87-5.32 11.87-11.87 0-3.17-1.23-6.15-3.43-8.42zM12.08 21.78h-.01a9.88 9.88 0 0 1-5.03-1.38l-.36-.21-3.76.99 1-3.66-.23-.38a9.9 9.9 0 0 1-1.52-5.27c0-5.47 4.45-9.92 9.92-9.92 2.65 0 5.14 1.03 7.02 2.91a9.87 9.87 0 0 1 2.9 7.03c0 5.47-4.45 9.92-9.93 9.92z" />
                              </svg>
                              <span className="truncate">WhatsApp</span>
                            </button>
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>

                {/* Empty results */}
                {filteredProducts.length === 0 && (
                  <div className="mt-6 rounded-xl border border-dashed border-gray-300 bg-white px-5 py-12 text-center">
                    <svg
                      className="mx-auto h-10 w-10 text-gray-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <circle cx="11" cy="11" r="7" strokeWidth="1.5" />
                      <path
                        d="m16 16 4 4"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                    </svg>

                    <h3 className="mt-3 text-sm font-bold text-gray-800">
                      No products found
                    </h3>

                    <p className="mt-1 text-xs text-gray-500">
                      Try another search term or clear your filters.
                    </p>

                    <button
                      type="button"
                      onClick={clearFilters}
                      className="mt-4 rounded-md bg-[#0b7a3b] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#09662f]"
                    >
                      Clear Filters
                    </button>
                  </div>
                )}
              </section>
            </div>
          </div>

          {/* ================= STATS BAR ================= */}
          <section className="mt-8 border-t border-[#d9ebe5] bg-[#e8f3ef]">
            <div className="mx-auto grid max-w-[1280px] grid-cols-2 gap-y-6 px-4 py-6 sm:px-6 lg:grid-cols-4 lg:px-8">
              {stats.map((stat, index) => (
                <div
                  key={stat.key}
                  className={`flex items-center justify-center gap-4 ${
                    index !== 0 ? "lg:border-l lg:border-[#cfe3dc]" : ""
                  }`}
                >
                  <StatIcon name={stat.icon} />

                  <div>
                    <p className="text-lg font-bold text-[#12372a]">
                      {statsLoading
                        ? "..."
                        : statisticsData
                          ? statisticsData[stat.key].toLocaleString()
                          : "—"}
                    </p>
                    <p className="text-xs text-gray-600">{stat.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </main>
      )}
    </>
  );
}

export default Products;