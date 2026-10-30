
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  MapPin,
  Users,
  Package,
  HeartHandshake,
  MapPinned,
  ArrowRight,
  Phone,
  LoaderCircle,
} from "lucide-react";

import {
  getProducts,
  getStatistics,
  type SellerProduct,
  type MarketplaceStatistics,
} from "../services/sellerService";

import eggBasket from "../assets/06_egg_basket.jpg";
import farmBrochure from "../assets/07_farm_brochure.jpg";
import veterinaryKit from "../assets/08_veterinary_kit.jpg";

const categoryOrder = ["Eggs", "Chickens", "Equipment", "Feed"];

const statistics = [
  {
    icon: Users,
    key: "registeredFarmers",
    label: "Registered Farmers",
  },
  {
    icon: Package,
    key: "availableProducts",
    label: "Active Listings",
  },
  {
    icon: HeartHandshake,
    key: "successfulConnections",
    label: "Successful Deals",
  },
  {
    icon: MapPinned,
    key: "coveredLocations",
    label: "Cities Covered",
  },
] as const;

const promotions = [
  {
    id: "sell",
    title: "Post Your Ad",
    description: "Reach thousands of buyers and grow your business.",
    button: "Post an Ad",
    image: eggBasket,
    imageAlt: "Basket of fresh eggs",
    theme: "green",
    action: "/seller/products/add",
  },
  {
  id: "market-price",
  title: "Poultry Market Prices",
  description:
    "Explore the latest prices of eggs, chickens, poultry feed, and equipment across different markets.",
  button: "View Market Prices",
  image: farmBrochure,
  imageAlt: "Poultry market prices",
  theme: "amber",
  action: "/market",
},
  {
    id: "health",
    title: "Health & Diseases",
    description: "Learn about common diseases and how to prevent them.",
    button: "Learn More",
    image: veterinaryKit,
    imageAlt: "Poultry veterinary supplies",
    theme: "blue",
    action: "/health",
  },
] as const;

function FeaturedProducts() {
  const navigate = useNavigate();

  const [products, setProducts] = useState<SellerProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [statisticsData, setStatisticsData] =
    useState<MarketplaceStatistics | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);
        setError("");

        const data = await getProducts();
        setProducts(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load products"
        );
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
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

  // Select the newest product from each category.
  const displayedProducts = categoryOrder
    .map((category) =>
      products
        .filter((product) => product.category === category)
        .sort(
          (a, b) =>
            new Date(b.createdAt ?? 0).getTime() -
            new Date(a.createdAt ?? 0).getTime()
        )[0]
    )
    .filter((product): product is SellerProduct => Boolean(product))
    .slice(0, 4);

  const themeStyles = {
    green: {
      card: "bg-[#eef5eb]",
      button: "bg-green-800 text-white hover:bg-green-900",
    },
    amber: {
      card: "bg-[#fff8e8]",
      button:
        "border border-amber-300 bg-white text-amber-900 hover:bg-amber-50",
    },
    blue: {
      card: "bg-[#edf4fc]",
      button:
        "border border-blue-200 bg-white text-blue-900 hover:bg-blue-50",
    },
  };

  return (
    <section
      aria-labelledby="featured-products-heading"
      className="bg-white py-6 sm:py-8"
    >
      <div className="mx-auto w-full max-w-[1440px] px-4 sm:px-6 lg:px-8">
        {/* PRODUCTS AND PROMOTIONS */}
        <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-[minmax(0,1fr)_290px] xl:gap-6">
          {/* LEFT COLUMN */}
          <div className="min-w-0">
            <div className="mb-3 flex items-center justify-between gap-3">
              <h2
                id="featured-products-heading"
                className="text-base font-bold text-gray-900 sm:text-lg"
              >
                Featured Listings
              </h2>

              <button
                type="button"
                onClick={() => navigate("/products")}
                className="inline-flex shrink-0 items-center gap-1 text-xs font-semibold text-green-800 hover:text-green-950 sm:text-sm"
              >
                View all listings
                <ArrowRight size={14} />
              </button>
            </div>

            {/* PRODUCT LOADING, ERROR, AND EMPTY STATES */}
            {loading ? (
              <div className="flex min-h-[180px] flex-col items-center justify-center gap-2">
                <LoaderCircle
                  size={30}
                  className="animate-spin text-green-700"
                  aria-label="Loading products"
                />
                <p className="text-sm text-gray-500">Loading products...</p>
              </div>
            ) : error ? (
              <p className="py-8 text-center text-sm text-red-600">
                {error}
              </p>
            ) : displayedProducts.length === 0 ? (
              <p className="rounded-lg border border-dashed border-gray-300 py-10 text-center text-sm text-gray-500">
                No products available yet.
              </p>
            ) : (
              /* FOUR CARDS ON DESKTOP, TWO ON SMALL SCREENS */
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {displayedProducts.map((product) => (
                  <article
                    key={product._id}
                    className="group min-w-0 overflow-hidden rounded-md border border-gray-200 bg-white transition hover:border-green-200 hover:shadow-md"
                  >
                    <button
                      type="button"
                      onClick={() => navigate(`/products/${product._id}`)}
                      aria-label={`View ${product.name}`}
                      className="block w-full overflow-hidden bg-gray-100 text-left"
                    >
                      <div className="aspect-[5/3] overflow-hidden">
                        <img
                          src={product.image || product.images?.[0] || ""}
                          alt={product.name}
                          loading="lazy"
                          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                        />
                      </div>
                    </button>

                    <div className="p-2 sm:p-2.5">
                      <h3
                        title={product.name}
                        className="truncate text-xs font-semibold text-gray-900 sm:text-sm"
                      >
                        {product.name}
                      </h3>

                      <p className="mt-1 flex items-center gap-1 text-[10px] text-gray-500 sm:text-[11px]">
                        <MapPin
                          size={11}
                          className="shrink-0 text-gray-500"
                        />
                        <span className="truncate">
                          {product.location || "Ethiopia"}
                        </span>
                      </p>

                      <p className="mt-2 text-xs font-bold text-green-800 sm:text-sm">
                        {product.price.toLocaleString()} ETB
                      </p>

                      <div className="mt-2 flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() =>
                            navigate(`/products/${product._id}`)
                          }
                          aria-label={`View ${product.name} contact details`}
                          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-green-200 text-green-800 transition hover:bg-green-50"
                        >
                          <Phone size={13} />
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            navigate(`/products/${product._id}`)
                          }
                          className="min-w-0 flex-1 rounded border border-green-200 px-1 py-1.5 text-[9px] font-semibold text-green-800 transition hover:bg-green-50 sm:text-[10px]"
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: PROMOTIONAL BANNERS */}
          <aside className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-1">
            {promotions.map((promotion) => {
              const theme = themeStyles[promotion.theme];

              return (
                <article
                  key={promotion.id}
                  className={`relative flex min-h-[100px] items-center overflow-hidden rounded-lg ${theme.card} sm:min-h-[100px] lg:min-h-[86px]`}
                >
                  <div className="relative z-10 flex w-[68%] flex-col items-start p-3 sm:p-3.5 lg:w-[70%]">
                    <h3 className="text-xs font-bold leading-snug text-gray-900 sm:text-sm">
                      {promotion.title}
                    </h3>

                    <p className="mt-1 max-w-[210px] text-[10px] leading-[1.4] text-gray-600 sm:text-[11px]">
                      {promotion.description}
                    </p>

                    <button
                      type="button"
                      onClick={() => navigate(promotion.action)}
                      className={`mt-2 rounded-md px-2.5 py-1 text-[10px] font-semibold transition sm:text-[11px] ${theme.button}`}
                    >
                      {promotion.button}
                    </button>
                  </div>

                  <div className="absolute inset-y-0 right-0 w-[34%]">
                    <img
                      src={promotion.image}
                      alt={promotion.imageAlt}
                      loading="lazy"
                      className="h-full w-full object-contain p-1"
                    />
                  </div>
                </article>
              );
            })}
          </aside>
        </div>

        {/* MARKETPLACE STATISTICS */}
        <div className="mt-5 overflow-hidden rounded-lg border border-gray-100 bg-white shadow-sm sm:mt-6">
          <div className="grid grid-cols-2 sm:grid-cols-4">
            {statistics.map((stat, index) => {
              const Icon = stat.icon;

              return (
                <div
                  key={stat.key}
                  className={[
                    "flex items-center justify-center gap-2.5 px-2 py-3 sm:py-4",
                    index % 2 === 0 ? "border-r border-gray-100" : "",
                    index < 2 ? "border-b border-gray-100" : "",
                    "sm:border-b-0 sm:border-r sm:last:border-r-0",
                  ].join(" ")}
                >
                  <Icon
                    size={27}
                    strokeWidth={1.7}
                    className="shrink-0 text-green-800 sm:h-8 sm:w-8"
                  />

                  <div className="min-w-0">
                    <p className="text-sm font-bold leading-tight text-green-800 sm:text-base">
                      {statsLoading
                        ? "..."
                        : statisticsData
                          ? statisticsData[stat.key].toLocaleString()
                          : "—"}
                    </p>

                    <p className="mt-0.5 text-[9px] leading-tight text-gray-600 sm:text-[11px]">
                      {stat.label}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

export default FeaturedProducts;
