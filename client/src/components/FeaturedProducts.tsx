
import { useNavigate } from "react-router-dom";
import {
  MapPin,
  Users,
  Package,
  HeartHandshake,
  MapPinned,
  ArrowRight,
  Phone,
  BookOpen,
  Stethoscope,
} from "lucide-react";

import eggTray from "../assets/02_egg_tray.jpg";
import brownHen from "../assets/03_brown_hen.jpg";
import whiteHens from "../assets/04_white_hens.jpg";
import stackedEggTrays from "../assets/05_stacked_egg_trays.jpg";

import eggBasket from "../assets/06_egg_basket.jpg";
import farmBrochure from "../assets/07_farm_brochure.jpg";
import veterinaryKit from "../assets/08_veterinary_kit.jpg";

const products = [
  {
    id: 1,
    image: eggTray,
    name: "Fresh Eggs (30 pcs)",
    location: "Addis Ababa",
    price: "240 ETB",
  },
  {
    id: 2,
    image: brownHen,
    name: "Brown Layer Chicken",
    location: "Addis Ababa",
    price: "850 ETB",
  },
  {
    id: 3,
    image: whiteHens,
    name: "White Layer Chicken",
    location: "Addis Ababa",
    price: "900 ETB",
  },
  {
    id: 4,
    image: stackedEggTrays,
    name: "Eggs (60 pcs)",
    location: "Addis Ababa",
    price: "480 ETB",
  },
];

const statistics = [
  {
    icon: Users,
    number: "12,450+",
    label: "Registered Farmers",
  },
  {
    icon: Package,
    number: "8,750+",
    label: "Available Products",
  },
  {
    icon: HeartHandshake,
    number: "25,300+",
    label: "Successful Connections",
  },
  {
    icon: MapPinned,
    number: "120+",
    label: "Covered Locations",
  },
];

const promotions = [
  {
    id: "sell",
    eyebrow: "For Farmers & Sellers",
    title: "Want to Sell Your Products?",
    description: "Reach more customers across Ethiopia.",
    button: "Start Selling",
    image: eggBasket,
    imageAlt: "Basket of fresh eggs",
    theme: "green",
    icon: Package,
    action: "/seller/products/add",
  },
  {
    id: "learn",
    eyebrow: "Learn",
    title: "Poultry Farming Guide",
    description: "Learn about poultry farming and care.",
    button: "Read Guide",
    image: farmBrochure,
    imageAlt: "Poultry farming guide",
    theme: "amber",
    icon: BookOpen,
    action: "/#learn",
  },
  {
    id: "health",
    eyebrow: "Health",
    title: "Poultry Health",
    description: "Learn about common diseases and care.",
    button: "Health Guide",
    image: veterinaryKit,
    imageAlt: "Poultry veterinary supplies",
    theme: "blue",
    icon: Stethoscope,
    action: "/#health",
  },
] as const;

function FeaturedProducts() {
  const navigate = useNavigate();

  return (
    <section
      aria-labelledby="featured-products-heading"
      className="bg-gray-50 py-8 sm:py-10 lg:py-12"
    >
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* SECTION HEADER */}
        <div className="mb-5 flex items-end justify-between gap-3 sm:mb-6">
          <div>
            <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-green-700">
              Discover Enqulalie
            </p>

            <h2
              id="featured-products-heading"
              className="text-xl font-bold tracking-tight text-gray-900 sm:text-2xl"
            >
              Featured Products
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Quality poultry products from local sellers.
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate("/products")}
            className="inline-flex shrink-0 items-center gap-1 rounded-lg px-2 py-2 text-sm font-semibold text-green-700 transition hover:bg-green-50 hover:text-green-800"
          >
            View All
            <ArrowRight size={16} />
          </button>
        </div>

        {/* PRODUCTS + PROMOTIONS */}
        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,1fr)_300px] xl:gap-8">
          {/* LEFT COLUMN */}
          <div className="min-w-0">
            {/* SMALLER PRODUCT CARDS */}
            <div className="grid grid-cols-2 gap-3 sm:gap-3 xl:grid-cols-4">
              {products.map((product) => (
                <article
                  key={product.id}
                  className="group min-w-0 overflow-hidden rounded-lg border border-gray-200 bg-white transition duration-200 hover:-translate-y-1 hover:border-green-200 hover:shadow-md"
                >
                  <button
                    type="button"
                    onClick={() => navigate(`/products/${product.id}`)}
                    aria-label={`View ${product.name}`}
                    className="block w-full overflow-hidden bg-gray-100 text-left"
                  >
                    <div className="aspect-[5/3] overflow-hidden">
                      <img
                        src={product.image}
                        alt={product.name}
                        loading="lazy"
                        className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                      />
                    </div>
                  </button>

                  <div className="p-2 sm:p-3">
                    <h3
                      title={product.name}
                      className="truncate text-xs font-semibold text-gray-900 sm:text-sm"
                    >
                      {product.name}
                    </h3>

                    <p className="mt-1.5 flex items-center gap-1 text-[10px] text-gray-500 sm:text-xs">
                      <MapPin
                        size={12}
                        className="shrink-0 text-green-600"
                      />
                      <span className="truncate">{product.location}</span>
                    </p>

                    <p className="mt-2 text-sm font-bold text-green-700 sm:text-base">
                      {product.price}
                    </p>

                    <button
                      type="button"
                      onClick={() => navigate(`/products/${product.id}`)}
                      className="mt-2 flex min-h-9 w-full items-center justify-center gap-1 rounded-md bg-green-700 px-1.5 py-1.5 text-[10px] font-semibold text-white transition hover:bg-green-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-600 focus-visible:ring-offset-2 sm:text-xs"
                    >
                      <Phone size={13} />
                      View Details
                    </button>
                  </div>
                </article>
              ))}
            </div>

            {/* MARKETPLACE STATISTICS */}
            <div className="mt-6 overflow-hidden rounded-xl border border-green-100 bg-white shadow-sm sm:mt-8">
              <div className="grid grid-cols-2 sm:grid-cols-4">
                {statistics.map((stat, index) => {
                  const Icon = stat.icon;

                  return (
                    <div
                      key={stat.label}
                      className={[
                        "flex items-center justify-center gap-2 px-2 py-4 sm:px-3 sm:py-5",
                        index < 2 ? "border-b border-gray-100" : "",
                        index % 2 === 0 ? "border-r border-gray-100" : "",
                        "sm:border-b-0 sm:border-r sm:last:border-r-0",
                      ].join(" ")}
                    >
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-green-50 text-green-700 sm:h-10 sm:w-10">
                        <Icon size={20} strokeWidth={1.8} />
                      </div>

                      <div className="min-w-0">
                        <p className="text-sm font-bold text-gray-900 sm:text-base">
                          {stat.number}
                        </p>

                        <p className="text-[10px] leading-4 text-gray-500 sm:text-xs">
                          {stat.label}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: PROMOTIONAL CARDS */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-1">
            {promotions.map((promotion) => {
              const Icon = promotion.icon;

              const themeStyles = {
                green: {
                  card: "bg-green-50",
                  eyebrow: "text-green-800",
                  icon: "bg-green-100 text-green-800",
                  button:
                    "bg-green-700 text-white hover:bg-green-800 focus-visible:ring-green-600",
                },
                amber: {
                  card: "bg-amber-50",
                  eyebrow: "text-amber-800",
                  icon: "bg-amber-100 text-amber-800",
                  button:
                    "border border-amber-200 bg-white text-amber-900 hover:bg-amber-100 focus-visible:ring-amber-500",
                },
                blue: {
                  card: "bg-blue-50",
                  eyebrow: "text-blue-800",
                  icon: "bg-blue-100 text-blue-800",
                  button:
                    "border border-blue-200 bg-white text-blue-900 hover:bg-blue-100 focus-visible:ring-blue-500",
                },
              };

              const theme = themeStyles[promotion.theme];

              return (
                <article
                  key={promotion.id}
                  className={`relative flex min-h-[168px] overflow-hidden rounded-xl ${theme.card} sm:min-h-[180px] lg:min-h-[170px]`}
                >
                  <div className="relative z-10 flex w-[64%] flex-col items-start justify-center p-4">
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`flex h-6 w-6 items-center justify-center rounded-md ${theme.icon}`}
                      >
                        <Icon size={14} />
                      </span>

                      <p
                        className={`text-[9px] font-bold uppercase tracking-wide ${theme.eyebrow}`}
                      >
                        {promotion.eyebrow}
                      </p>
                    </div>

                    <h3 className="mt-2 text-sm font-bold leading-snug text-gray-900 sm:text-base">
                      {promotion.title}
                    </h3>

                    <p className="mt-1.5 text-xs leading-5 text-gray-600">
                      {promotion.description}
                    </p>

                    <button
                      type="button"
                      onClick={() => navigate(promotion.action)}
                      className={`mt-3 inline-flex min-h-9 items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${theme.button}`}
                    >
                      {promotion.button}
                      <ArrowRight size={14} />
                    </button>
                  </div>

                  <div className="absolute inset-y-0 right-0 w-[40%]">
                    <img
                      src={promotion.image}
                      alt={promotion.imageAlt}
                      loading="lazy"
                      className="h-full w-full object-cover"
                    />

                    <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/5" />
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

export default FeaturedProducts;
