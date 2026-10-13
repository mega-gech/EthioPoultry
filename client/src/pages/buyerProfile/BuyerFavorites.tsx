
import { useEffect, useMemo, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  UserRound,
  ShoppingBag,
  Heart,
  Settings,
  LogOut,
  Search,
  Trash2,
  Eye,
 
} from "lucide-react";

import eggTray from "../../assets/02_egg_tray.jpg";
import brownHen from "../../assets/03_brown_hen.jpg";
import stackedEggTrays from "../../assets/05_stacked_egg_trays.jpg";

type FavoriteProduct = {
  id: number;
  name: string;
  image: string;
  price: number;
  location: string;
  seller: string;
  category: string;
  description: string;
};

// Sample products. Keep these IDs consistent with your product data.
const favoriteProducts: FavoriteProduct[] = [
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
    description: "Healthy brown layer chicken for poultry farming.",
  },
  {
    id: 3,
    name: "Eggs Wholesale Tray",
    image: stackedEggTrays,
    price: 1200,
    location: "Bahir Dar",
    seller: "Gojjam Poultry",
    category: "Eggs",
    description: "Egg trays suitable for household and business use.",
  },
];

const menuItems = [
  { label: "Dashboard", to: "/buyer/dashboard", icon: LayoutDashboard },
  { label: "My Profile", to: "/buyer/profile", icon: UserRound },
  { label: "My Orders", to: "/buyer/orders", icon: ShoppingBag },
  { label: "Favorites", to: "/buyer/favorites", icon: Heart },
  { label: "Settings", to: "/buyer/settings", icon: Settings },
];

const STORAGE_KEY = "ethiopoultry_favorites";

export default function BuyerFavorites() {
  const navigate = useNavigate();

  // Default sample favorites are used only on the first visit.
  const [favoriteIds, setFavoriteIds] = useState<number[]>([1, 2]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [message, setMessage] = useState("");

  // Load previously saved favorites.
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);

      if (saved !== null) {
        const parsed: unknown = JSON.parse(saved);

        if (
          Array.isArray(parsed) &&
          parsed.every(
            (id) => typeof id === "number" && Number.isFinite(id)
          )
        ) {
          setFavoriteIds(parsed);
        }
      }
    } catch {
      console.error("Could not load favorite products.");
    }
  }, []);

  const saveFavorites = (nextIds: number[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(nextIds));
      setFavoriteIds(nextIds);
    } catch {
      setMessage("Could not save your changes. Please try again.");
    }
  };

  const displayedFavorites = useMemo(() => {
    const query = search.trim().toLowerCase();

    return favoriteProducts.filter((product) => {
      const isFavorite = favoriteIds.includes(product.id);
      const matchesSearch =
        product.name.toLowerCase().includes(query) ||
        product.seller.toLowerCase().includes(query) ||
        product.location.toLowerCase().includes(query);

      const matchesCategory =
        category === "All" || product.category === category;

      return isFavorite && matchesSearch && matchesCategory;
    });
  }, [favoriteIds, search, category]);

  const removeFavorite = (id: number) => {
    const nextIds = favoriteIds.filter((favoriteId) => favoriteId !== id);

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(nextIds));
      setFavoriteIds(nextIds);
      setMessage("Product removed from your favorites.");
    } catch {
      setMessage("Could not remove the product. Please try again.");
    }
  };

  const viewProduct = (id: number) => {
    navigate(`/product/${id}`);
  };

  return (
    <div className="min-h-screen bg-white px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Page heading */}
        <header className="mb-7">
          <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
            My Favorites
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Keep the poultry products you love in one place.
          </p>
        </header>

        <div className="grid overflow-hidden rounded-2xl border border-gray-200 lg:grid-cols-[285px_minmax(0,1fr)]">
          {/* Buyer sidebar */}
          <aside className="border-b border-gray-200 p-5 sm:p-6 lg:border-b-0 lg:border-r">
            <Link to="/" className="mb-9 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 text-xl">
                🐔
              </div>
              <div>
                <p className="font-bold text-green-800">EthioPoultry</p>
                <p className="text-xs text-gray-500">
                  Poultry Marketplace
                </p>
              </div>
            </Link>

            <div className="mb-8 text-center">
              <div className="mx-auto mb-4 flex h-[88px] w-[88px] items-center justify-center rounded-full bg-green-100 text-3xl font-bold text-green-800">
                M
              </div>
              <h2 className="font-semibold text-gray-900">
                Megabi Getaneh
              </h2>
              <p className="mt-1 break-all text-sm text-gray-500">
                megabi@example.com
              </p>
            </div>

            <nav className="space-y-2" aria-label="Buyer navigation">
              {menuItems.map(({ label, to, icon: Icon }) => (
                <NavLink
                  key={to}
                  to={to}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-lg border-l-4 px-3 py-3 text-sm transition ${
                      isActive
                        ? "border-green-700 bg-green-50 font-semibold text-green-800"
                        : "border-transparent text-gray-600 hover:bg-gray-50 hover:text-green-800"
                    }`
                  }
                >
                  <Icon size={21} />
                  {label}
                </NavLink>
              ))}

              <Link
                to="/login"
                className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm text-gray-600 hover:bg-red-50 hover:text-red-700"
              >
                <LogOut size={21} />
                Logout
              </Link>
            </nav>
          </aside>

          {/* Favorites content */}
          <main className="min-w-0 bg-gray-50/50 p-4 sm:p-6 lg:p-8">
            {/* Summary */}
            <section className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-green-800 p-5 text-white sm:p-6">
              <div>
                <p className="text-sm text-green-100">
                  Your saved collection
                </p>
                <h2 className="mt-1 text-2xl font-bold">
                  Favorite Products
                </h2>
                <p className="mt-2 text-sm text-green-100">
                  {favoriteIds.length} saved product(s)
                </p>
              </div>

              <Heart size={38} />
            </section>

            {/* Search and category filter */}
            <section className="mb-6 rounded-xl border border-gray-200 bg-white p-4 sm:p-5">
              <label
                htmlFor="favorite-search"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Search favorites
              </label>

              <div className="flex items-center gap-3 rounded-lg border border-gray-200 px-3 focus-within:border-green-600">
                <Search size={19} className="shrink-0 text-gray-400" />
                <input
                  id="favorite-search"
                  type="search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search product, seller, or location..."
                  className="min-w-0 flex-1 border-0 py-3 text-sm outline-none"
                />
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {["All", "Eggs", "Chickens"].map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setCategory(item)}
                    className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                      category === item
                        ? "bg-green-700 text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-green-50 hover:text-green-800"
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </section>

            {message && (
              <div
                role="status"
                className="mb-5 flex items-center justify-between gap-3 rounded-lg bg-green-50 px-4 py-3 text-sm text-green-800"
              >
                <span>{message}</span>
                <button
                  type="button"
                  onClick={() => setMessage("")}
                  className="font-semibold"
                >
                  Dismiss
                </button>
              </div>
            )}

            {/* Product cards */}
            {displayedFavorites.length > 0 ? (
              <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {displayedFavorites.map((product) => (
                  <article
                    key={product.id}
                    className="overflow-hidden rounded-2xl border border-gray-200 bg-white transition hover:-translate-y-1 hover:shadow-md"
                  >
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => viewProduct(product.id)}
                        className="block w-full"
                        aria-label={`View ${product.name}`}
                      >
                        <img
                          src={product.image}
                          alt={product.name}
                          className="h-52 w-full object-cover"
                        />
                      </button>

                      <button
                        type="button"
                        onClick={() => removeFavorite(product.id)}
                        aria-label={`Remove ${product.name} from favorites`}
                        title="Remove from favorites"
                        className="absolute right-3 top-3 rounded-full bg-white p-2.5 text-red-600 shadow-sm transition hover:bg-red-50"
                      >
                        <Heart size={19} fill="currentColor" />
                      </button>

                      <span className="absolute bottom-3 left-3 rounded-full bg-white px-3 py-1 text-xs font-medium text-green-800 shadow-sm">
                        {product.category}
                      </span>
                    </div>

                    <div className="p-4">
                      <div className="flex items-start justify-between gap-3">
                        <h3 className="font-semibold text-slate-800">
                          {product.name}
                        </h3>
                        <p className="shrink-0 font-bold text-green-800">
                          {product.price.toLocaleString()} ETB
                        </p>
                      </div>

                      <p className="mt-2 text-sm leading-5 text-gray-500">
                        {product.description}
                      </p>

                      <p className="mt-3 text-sm text-gray-600">
                        Seller: {product.seller}
                      </p>

                      <p className="mt-1 text-sm text-gray-500">
                        {product.location}
                      </p>

                      <div className="mt-4 grid grid-cols-2 gap-2 border-t border-gray-100 pt-4">
                        <button
                          type="button"
                          onClick={() => viewProduct(product.id)}
                          className="inline-flex items-center justify-center gap-2 rounded-lg border border-green-700 px-3 py-2.5 text-sm font-semibold text-green-800 transition hover:bg-green-50"
                        >
                          <Eye size={16} />
                          View
                        </button>

                        <button
                          type="button"
                          onClick={() => removeFavorite(product.id)}
                          className="inline-flex items-center justify-center gap-2 rounded-lg bg-gray-100 px-3 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-red-50 hover:text-red-700"
                        >
                          <Trash2 size={16} />
                          Remove
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </section>
            ) : (
              <section className="rounded-2xl border border-dashed border-gray-300 bg-white px-5 py-16 text-center">
                <Heart size={44} className="mx-auto mb-4 text-gray-300" />

                <h3 className="text-lg font-semibold text-slate-800">
                  {favoriteIds.length === 0
                    ? "No favorite products yet"
                    : "No matching products"}
                </h3>

                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
                  {favoriteIds.length === 0
                    ? "Explore the marketplace and save products you want to find again."
                    : "Try another search or category to find your saved products."}
                </p>

                <div className="mt-5 flex flex-wrap justify-center gap-3">
                  <Link
                    to="/products"
                    className="rounded-lg bg-green-700 px-5 py-3 text-sm font-semibold text-white hover:bg-green-800"
                  >
                    Browse Products
                  </Link>

                  {(search || category !== "All") && (
                    <button
                      type="button"
                      onClick={() => {
                        setSearch("");
                        setCategory("All");
                      }}
                      className="rounded-lg border border-gray-300 px-5 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                    >
                      Clear Filters
                    </button>
                  )}
                </div>
              </section>
            )}

            <footer className="py-6 text-center text-sm text-gray-500">
              © {new Date().getFullYear()} EthioPoultry. Connecting buyers
              with poultry farmers.
            </footer>
          </main>
        </div>
      </div>
    </div>
  );
}