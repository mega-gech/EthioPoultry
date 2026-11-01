import { Link } from "react-router-dom";
import {
  Heart,
  Search,
  Eye,
  MapPin,
  Store,
  ArrowRight,
} from "lucide-react";

import eggTray from "../../assets/02_egg_tray.jpg";
import brownHen from "../../assets/03_brown_hen.jpg";
import stackedEggTrays from "../../assets/05_stacked_egg_trays.jpg";

// Sample favorite products for frontend design.
const favoriteProducts = [
  {
    id: 1,
    name: "Fresh Eggs (30 pcs)",
    image: eggTray,
    price: 240,
    location: "Addis Ababa",
    seller: "Abebe Poultry Farm",
    category: "Eggs",
    description: "Fresh farm-produced eggs, clean and nutritious.",
  },
  {
    id: 2,
    name: "Brown Layer Chicken",
    image: brownHen,
    price: 850,
    location: "Addis Ababa",
    seller: "Abebe Poultry Farm",
    category: "Chickens",
    description:
      "Healthy brown layer chicken suitable for poultry farming.",
  },
  {
    id: 3,
    name: "Eggs Wholesale Tray",
    image: stackedEggTrays,
    price: 1200,
    location: "Bahir Dar",
    seller: "Gojjam Poultry",
    category: "Eggs",
    description:
      "Quality eggs available for household and wholesale buyers.",
  },
];

function formatPrice(price: number) {
  return `${price.toLocaleString()} ETB`;
}

export default function BuyerFavorites() {
  return (
    <main className="min-w-0 space-y-6 bg-slate-50/60 p-4 sm:p-6 lg:p-8">
      {/* Page heading */}
      <section className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-slate-900 sm:text-2xl">
            My Favorites
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Keep track of the poultry products you like.
          </p>
        </div>

        <Link
          to="/products"
          className="inline-flex items-center gap-2 rounded-lg bg-emerald-700 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-emerald-800"
        >
          Browse Products
          <ArrowRight size={16} />
        </Link>
      </section>

      {/* Favorite statistics */}
      <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-500">Total Favorites</p>
            <Heart size={18} className="text-emerald-700" />
          </div>

          <p className="mt-2 text-2xl font-semibold text-slate-900">
            {favoriteProducts.length}
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-500">Egg Products</p>
            <span className="text-lg">🥚</span>
          </div>

          <p className="mt-2 text-2xl font-semibold text-slate-900">
            {favoriteProducts.filter((p) => p.category === "Eggs").length}
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-500">Chicken Products</p>
            <span className="text-lg">🐔</span>
          </div>

          <p className="mt-2 text-2xl font-semibold text-slate-900">
            {favoriteProducts.filter((p) => p.category === "Chickens").length}
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-500">Categories</p>
            <Search size={18} className="text-slate-400" />
          </div>

          <p className="mt-2 text-2xl font-semibold text-slate-900">
            2
          </p>
        </div>
      </section>

      {/* Search and category filters - visual only */}
      <section className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-md">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="search"
              placeholder="Search favorite products..."
              readOnly
              className="w-full rounded-lg border border-slate-200 py-3 pl-10 pr-4 text-sm outline-none"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <span className="rounded-lg bg-emerald-700 px-4 py-2 text-sm font-medium text-white">
              All
            </span>

            <span className="rounded-lg bg-slate-100 px-4 py-2 text-sm font-medium text-slate-600">
              Eggs
            </span>

            <span className="rounded-lg bg-slate-100 px-4 py-2 text-sm font-medium text-slate-600">
              Chickens
            </span>
          </div>
        </div>
      </section>

      {/* Favorite products */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-slate-900">
              Saved Products
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Products you have added to your favorites.
            </p>
          </div>

          <span className="text-sm text-slate-500">
            {favoriteProducts.length} products
          </span>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {favoriteProducts.map((product) => (
            <article
              key={product.id}
              className="overflow-hidden rounded-xl border border-slate-200 bg-white transition-shadow hover:shadow-md"
            >
              {/* Product image */}
              <div className="relative">
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-48 w-full object-cover"
                />

                <div className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white text-red-500 shadow-sm">
                  <Heart size={18} fill="currentColor" />
                </div>

                <span className="absolute bottom-3 left-3 rounded-full bg-white px-3 py-1 text-xs font-medium text-emerald-800 shadow-sm">
                  {product.category}
                </span>
              </div>

              {/* Product details */}
              <div className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-semibold text-slate-900">
                    {product.name}
                  </h3>

                  <p className="shrink-0 text-sm font-bold text-emerald-700">
                    {formatPrice(product.price)}
                  </p>
                </div>

                <p className="mt-2 text-sm leading-5 text-slate-500">
                  {product.description}
                </p>

                <div className="mt-4 space-y-2 text-sm text-slate-500">
                  <div className="flex items-center gap-2">
                    <Store size={15} />
                    {product.seller}
                  </div>

                  <div className="flex items-center gap-2">
                    <MapPin size={15} />
                    {product.location}
                  </div>
                </div>

                {/* View product */}
                <div className="mt-4 border-t border-slate-100 pt-4">
                  <Link
                    to={`/product/${product.id}`}
                    className="flex w-full items-center justify-center gap-2 rounded-lg border border-emerald-700 px-3 py-2.5 text-sm font-medium text-emerald-700 transition-colors hover:bg-emerald-50"
                  >
                    <Eye size={16} />
                    View Product
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="pt-2 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} EthioPoultry. Connecting buyers
        with poultry farmers.
      </footer>
    </main>
  );
}