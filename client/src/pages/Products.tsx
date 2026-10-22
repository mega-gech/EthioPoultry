
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Topbar from "../components/Topbar";
import Navbar from "../components/Navbar";
import {
  getProducts,
  type SellerProduct } from "../services/sellerService"
const categories = [
  "Eggs",
  "Chickens",
  "Ducks",
  "Feed",
  "Equipment",
  "Medicine",
];

const locations = [
  "Addis Ababa",
  "Bahir Dar",
  "Gondar",
  "Debre Markos",
  "Hawassa",
  "Mekelle",
];

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

function Products() {
  const navigate = useNavigate();
  const [products, setProducts] = useState<SellerProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(()=>{
    async function loadProducts() {
      try {
        setLoading(true)
        setError("")
        const data = await getProducts();
        setProducts(data)
      } catch (error) {
        setError(
          error instanceof Error? error.message : "unavle to load products"
        ) 
      } finally {
        setLoading(false)
      }
    }

    loadProducts()
  }, [])

  // Search and filter states
  const [search, setSearch] = useState("");
  const [sidebarCategory, setSidebarCategory] = useState("");
  const [topCategory, setTopCategory] = useState("all");
  const [sidebarLocation, setSidebarLocation] = useState("all");
  const [topLocation, setTopLocation] = useState("all");
  const [maxPrice, setMaxPrice] = useState(5000);
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
        product.name.toLowerCase().includes(normalizedSearch) ||
        product.description.toLowerCase().includes(normalizedSearch);

      const matchesSidebarCategory =
        !sidebarCategory || product.category === sidebarCategory;

      const matchesTopCategory =
        topCategory === "all" || product.category === topCategory;

      const matchesSidebarLocation =
        sidebarLocation === "all" ||
        product.location === sidebarLocation;

      const matchesTopLocation =
        topLocation === "all" || product.location === topLocation;

      const matchesPrice = product.price <= maxPrice;

      return (
        matchesSearch &&
        matchesSidebarCategory &&
        matchesTopCategory &&
        matchesSidebarLocation &&
        matchesTopLocation &&
        matchesPrice
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
  }, [
    search,
    sidebarCategory,
    topCategory,
    sidebarLocation,
    topLocation,
    maxPrice,
    sortBy,
  ]);

  const clearFilters = () => {
    setSearch("");
    setSidebarCategory("");
    setTopCategory("all");
    setSidebarLocation("all");
    setTopLocation("all");
    setMaxPrice(5000);
    setSortBy("newest");
  };

  const callSeller = (
    event: React.MouseEvent<HTMLButtonElement>,
    phone: string | undefined,
  ) => {
    event.stopPropagation();

    const number = getPhoneNumber(phone);

    if (!number) {
      window.alert(
        "The seller's phone number is not available yet. Please update the sellerPhone field in your product data.",
      );
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
      window.alert(
        "The seller's WhatsApp number is not available yet. Please update the sellerPhone field in your product data.",
      );
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

  return (
    <>
      <Topbar />
      <Navbar />

      

      <main className="min-h-screen bg-[#f3fbfa]">
        <div className="mx-auto max-w-[1280px] px-4 py-5 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-[225px_minmax(0,1fr)]">
            {/* FILTER SIDEBAR */}
            <aside className="h-fit rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
              <div className="flex items-center gap-2 border-b border-gray-200 pb-3">
                <svg
                  className="h-4 w-4 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 6h18M6 12h12M10 18h4"
                  />
                </svg>

                <h2 className="text-sm font-bold text-gray-800">
                  Filters
                </h2>
              </div>

              {/* Category filter */}
              <div className="mt-4">
                <h3 className="mb-2 text-xs font-bold text-gray-700">
                  Category
                </h3>

                <div className="space-y-2">
                  {categories.map((category) => (
                    <label
                      key={category}
                      className="flex cursor-pointer items-center gap-2 text-xs text-gray-600"
                    >
                      <input
                        type="checkbox"
                        checked={sidebarCategory === category}
                        onChange={() =>
                          setSidebarCategory(
                            sidebarCategory === category ? "" : category,
                          )
                        }
                        className="h-3.5 w-3.5 cursor-pointer accent-green-600"
                      />

                      <span>{category}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Location filter */}
              <div className="mt-5">
                <h3 className="mb-2 text-xs font-bold text-gray-700">
                  Location
                </h3>

                <select
                  value={sidebarLocation}
                  onChange={(event) =>
                    setSidebarLocation(event.target.value)
                  }
                  className="h-9 w-full rounded-md border border-gray-200 bg-white px-3 text-[11px] text-gray-600 outline-none focus:border-green-500"
                >
                  <option value="all">All Locations</option>

                  {locations.map((location) => (
                    <option key={location} value={location}>
                      {location}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price filter */}
              <div className="mt-5">
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-xs font-bold text-gray-700">
                    Maximum Price
                  </h3>

                  <span className="text-[10px] font-semibold text-green-700">
                    {maxPrice.toLocaleString()} ETB
                  </span>
                </div>

                <input
                  type="range"
                  min="0"
                  max="5000"
                  step="50"
                  value={maxPrice}
                  onChange={(event) =>
                    setMaxPrice(Number(event.target.value))
                  }
                  aria-label="Maximum product price"
                  className="w-full cursor-pointer accent-green-600"
                />

                <div className="mt-1 flex justify-between text-[10px] text-gray-500">
                  <span>0 ETB</span>
                  <span>5,000 ETB</span>
                </div>
              </div>

              {/* Filter actions */}
              <button
                type="button"
                onClick={() =>
                  document
                    .getElementById("product-results")
                    ?.scrollIntoView({
                      behavior: "smooth",
                      block: "start",
                    })
                }
                className="mt-5 flex h-9 w-full items-center justify-center gap-2 rounded-md bg-green-600 text-xs font-semibold text-white transition hover:bg-green-700"
              >
                <svg
                  className="h-3.5 w-3.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 4h18M6 8h12M10 12h4"
                  />
                </svg>
                Apply Filters
              </button>

              <button
                type="button"
                onClick={clearFilters}
                className="mt-3 block w-full text-center text-[10px] font-medium text-green-600 hover:text-green-700"
              >
                Clear All
              </button>
            </aside>

            {/* MARKETPLACE CONTENT */}
            <section className="min-w-0">
              {/* Page heading */}
              <div>
                <h1 className="text-xl font-bold text-gray-800 sm:text-2xl">
                  Products Marketplace
                </h1>

                <p className="mt-1 text-xs text-gray-500 sm:text-sm">
                  Find fresh poultry and egg products from trusted farmers.
                </p>
              </div>

              {/* Search and top filters */}
              <div className="mt-4 grid grid-cols-1 gap-2.5 sm:grid-cols-2 md:grid-cols-2 xl:grid-cols-[minmax(0,1fr)_145px_145px_155px]">
                {/* Search */}
                <div className="relative sm:col-span-2 xl:col-span-1">
                  <svg
                    className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-green-700"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="m21 21-4.35-4.35m2.35-5.65a8 8 0 11-16 0 8 8 0 0116 0z"
                    />
                  </svg>

                  <input
                    type="search"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search products or sellers..."
                    className="h-9 w-full rounded-md border border-gray-200 bg-white pl-9 pr-3 text-xs text-gray-700 outline-none placeholder:text-gray-400 focus:border-green-500 focus:ring-1 focus:ring-green-100"
                  />
                </div>

                {/* Category */}
                <select
                  value={topCategory}
                  onChange={(event) => setTopCategory(event.target.value)}
                  className="h-9 w-full rounded-md border border-gray-200 bg-white px-3 text-[11px] text-gray-600 outline-none focus:border-green-500"
                  aria-label="Filter by category"
                >
                  <option value="all">All Categories</option>

                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>

                {/* Location */}
                <select
                  value={topLocation}
                  onChange={(event) => setTopLocation(event.target.value)}
                  className="h-9 w-full rounded-md border border-gray-200 bg-white px-3 text-[11px] text-gray-600 outline-none focus:border-green-500"
                  aria-label="Filter by location"
                >
                  <option value="all">All Locations</option>

                  {locations.map((location) => (
                    <option key={location} value={location}>
                      {location}
                    </option>
                  ))}
                </select>

                {/* Sorting */}
                <select
                  value={sortBy}
                  onChange={(event) => setSortBy(event.target.value)}
                  className="h-9 w-full rounded-md border border-gray-200 bg-white px-3 text-[11px] text-gray-600 outline-none focus:border-green-500"
                  aria-label="Sort products"
                >
                  <option value="newest">Sort by: Default</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="name">Name: A to Z</option>
                </select>
              </div>

              {/* Results heading */}
              <div
                id="product-results"
                className="mt-5 flex scroll-mt-24 items-center justify-between gap-3"
              >
                <p className="text-xs text-gray-600">
                  Showing{" "}
                  <span className="font-bold text-gray-800">
                    {filteredProducts.length}
                  </span>{" "}
                  {filteredProducts.length === 1 ? "product" : "products"}
                </p>

                <button
                  type="button"
                  onClick={() => navigate("/buyer/favorites")}
                  className="flex shrink-0 items-center gap-1.5 text-xs font-medium text-green-700 transition hover:text-green-800"
                >
                  <svg
                    className="h-4 w-4"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                  </svg>
                  Favorites ({favorites.length})
                </button>
              </div>

              {/* Product cards */}
              <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filteredProducts.map((product) => {
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
                        if (
                          event.key === "Enter" ||
                          event.key === " "
                        ) {
                          event.preventDefault();
                          openProduct(product._id);
                        }
                      }}
                      className="group min-w-0 cursor-pointer overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-green-200 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      {/* Product image */}
                      <div className="relative h-[105px] bg-gray-100 sm:h-[125px]">
                        <img
                          src={product.image}
                          alt={product.name}
                          loading="lazy"
                          className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]"
                        />

                        {/* Availability */}
                        <span
                          className={`absolute left-2 top-2 rounded-full px-2 py-1 text-[9px] font-semibold ${
                            isAvailable
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {isAvailable ? "Available" : "Out of Stock"}
                        </span>

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
                          className={`absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full shadow-sm transition ${
                            isFavorite
                              ? "bg-white text-red-500"
                              : "bg-black/35 text-white hover:bg-white hover:text-red-500"
                          }`}
                        >
                          <svg
                            className="h-4 w-4"
                            fill={isFavorite ? "currentColor" : "none"}
                            stroke="currentColor"
                            viewBox="0 0 24 24"
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
                      <div className="p-2.5 sm:p-3">
                        <h2
                          title={product.name}
                          className="truncate text-[11px] font-bold text-gray-800 sm:text-xs"
                        >
                          {product.name}
                        </h2>

                        <p className="mt-1.5 text-xs font-bold text-green-600 sm:text-sm">
                          {formatPrice(product.price)}
                        </p>

                        {/* Quantity */}
                        <p className="mt-1 truncate text-[10px] text-gray-500">
                          Quantity: {product.quantity}
                        </p>

                        {/* Location */}
                        <div className="mt-1.5 flex items-center gap-1 text-[10px] text-gray-500">
                          <svg
                            className="h-3 w-3 shrink-0 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
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

                          <span className="truncate">
                            {product.location}
                          </span>
                        </div>

                        {/* Category */}
                        <div className="mt-2">
                          <span className="inline-flex max-w-full truncate rounded-full bg-green-50 px-2 py-1 text-[9px] font-medium text-green-700">
                            {product.category}
                          </span>
                        </div>

                        {/* Seller name */}
                        <p className="mt-2 truncate text-[10px] text-gray-500">
                          Seller:{" "}
                          <span className="font-medium text-gray-700">
                            {product.sellerId}
                          </span>
                        </p>

                        {/* Contact actions */}
                        <div className="mt-2.5 grid grid-cols-2 gap-1.5">
                          <button
                            type="button"
                            disabled={!isAvailable}
                            onClick={(event) =>
                              callSeller(event, product.name)
                            }
                            className="flex h-8 min-w-0 items-center justify-center gap-1 rounded-md bg-green-600 px-1 text-[9px] font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-gray-300 sm:text-[10px]"
                          >
                            <svg
                              className="h-3 w-3 shrink-0"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path d="M6.62 10.79a15.46 15.46 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.02-.24c1.12.37 2.33.57 3.57.57a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1C10.16 21 3 13.84 3 5a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.57a1 1 0 0 1-.25 1.02z" />
                            </svg>
                            <span className="truncate">Call</span>
                          </button>

                          <button
                            type="button"
                            disabled={!isAvailable}
                            onClick={(event) =>
                              contactWhatsApp(
                                event,
                                product.name,
                                product.name,
                              )
                            }
                            className="flex h-8 min-w-0 items-center justify-center gap-1 rounded-md border border-green-500 bg-white px-1 text-[9px] font-semibold text-green-700 transition hover:bg-green-50 disabled:cursor-not-allowed disabled:border-gray-300 disabled:text-gray-400 sm:text-[10px]"
                          >
                            <svg
                              className="h-3 w-3 shrink-0"
                              fill="currentColor"
                              viewBox="0 0 24 24"
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
                    className="mt-4 rounded-md bg-green-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-green-700"
                  >
                    Clear Filters
                  </button>
                </div>
              )}
            </section>
          </div>
        </div>
      </main>
    </>
  );
}

export default Products;
