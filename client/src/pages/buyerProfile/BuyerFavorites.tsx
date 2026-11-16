import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Heart,
  LoaderCircle,
  MapPin,
  Search,
  Store,
  Trash2,
} from "lucide-react";
import type { SellerProduct } from "../../services/sellerService";
import { getMyFavorites, removeFavorite } from "../../services/favoriteService";

const categories = ["All", "Eggs", "Chickens", "Equipment", "Feed"] as const;
type FavoriteCategory = (typeof categories)[number];

function formatPrice(price: number) {
  return `${price.toLocaleString()} ETB`;
}

function getSellerName(product: SellerProduct) {
  return typeof product.sellerId === "object" && product.sellerId
    ? product.sellerId.name
    : "Seller";
}

export default function BuyerFavorites() {
  const [favorites, setFavorites] = useState<SellerProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<FavoriteCategory>("All");
  const [removingIds, setRemovingIds] = useState<string[]>([]);

  const loadFavorites = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      setFavorites(await getMyFavorites());
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Unable to load your favorites",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    getMyFavorites()
      .then((loadedFavorites) => {
        if (!cancelled) {
          setFavorites(loadedFavorites);
        }
      })
      .catch((loadError: unknown) => {
        if (!cancelled) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "Unable to load your favorites",
          );
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const filteredFavorites = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();
    return favorites.filter((product) => {
      const matchesCategory =
        category === "All" || product.category === category;
      const matchesSearch =
        !normalizedSearch ||
        product.name.toLowerCase().includes(normalizedSearch) ||
        product.category.toLowerCase().includes(normalizedSearch) ||
        product.location.toLowerCase().includes(normalizedSearch) ||
        product.description.toLowerCase().includes(normalizedSearch) ||
        getSellerName(product).toLowerCase().includes(normalizedSearch);

      return matchesCategory && matchesSearch;
    });
  }, [favorites, search, category]);

  const removeFromFavorites = async (productId: string) => {
    setRemovingIds((current) => [...current, productId]);
    setError("");

    try {
      await removeFavorite(productId);
      setFavorites((current) =>
        current.filter((product) => product._id !== productId),
      );
    } catch (removeError) {
      setError(
        removeError instanceof Error
          ? removeError.message
          : "Unable to remove this favorite",
      );
    } finally {
      setRemovingIds((current) =>
        current.filter((id) => id !== productId),
      );
    }
  };

  const categoryCount = new Set(favorites.map((product) => product.category))
    .size;

  return (
    <main className="min-w-0 space-y-6 bg-slate-50/60 p-4 sm:p-6 lg:p-8">
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

      <section className="grid grid-cols-2 gap-4 lg:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-500">Total Favorites</p>
            <Heart size={18} className="text-emerald-700" />
          </div>
          <p className="mt-2 text-2xl font-semibold text-slate-900">
            {favorites.length}
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-sm text-slate-500">Egg Products</p>
          <p className="mt-2 text-2xl font-semibold text-slate-900">
            {favorites.filter((product) => product.category === "Eggs").length}
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-sm text-slate-500">Categories</p>
          <p className="mt-2 text-2xl font-semibold text-slate-900">
            {categoryCount}
          </p>
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
        <label className="relative block w-full sm:max-w-md">
          <span className="sr-only">Search favorite products</span>
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search favorite products..."
            className="w-full rounded-lg border border-slate-200 py-3 pl-10 pr-4 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
          />
        </label>

        <div className="mt-4 flex flex-wrap gap-2">
          {categories.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setCategory(item)}
              aria-pressed={category === item}
              className={`rounded-lg px-4 py-2 text-sm font-medium ${
                category === item
                  ? "bg-emerald-700 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-emerald-50"
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </section>

      {error && (
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
        >
          <p>{error}</p>
          {loading && (
            <LoaderCircle size={16} className="mt-2 animate-spin" />
          )}
          {!loading && favorites.length === 0 && (
            <button
              type="button"
              onClick={() => void loadFavorites()}
              className="mt-2 font-semibold underline"
            >
              Try again
            </button>
          )}
        </div>
      )}

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
            {filteredFavorites.length} products
          </span>
        </div>

        {loading ? (
          <div role="status" className="py-16 text-center text-slate-500">
            <LoaderCircle
              size={32}
              className="mx-auto mb-3 animate-spin text-emerald-700"
            />
            Loading your favorites...
          </div>
        ) : filteredFavorites.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 bg-white px-5 py-14 text-center">
            <Heart size={34} className="mx-auto mb-3 text-slate-300" />
            <h3 className="font-semibold text-slate-800">
              {favorites.length === 0
                ? "No favorites yet"
                : "No matching favorites"}
            </h3>
            <p className="mt-2 text-sm text-slate-500">
              {favorites.length === 0
                ? "Save products from the marketplace and they will appear here."
                : "Try another search or category filter."}
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {filteredFavorites.map((product) => (
              <article
                key={product._id}
                className="overflow-hidden rounded-xl border border-slate-200 bg-white transition-shadow hover:shadow-md"
              >
                <div className="relative">
                  <img
                    src={product.image || product.images?.[0] || ""}
                    alt={product.name}
                    className="h-48 w-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => void removeFromFavorites(product._id)}
                    disabled={removingIds.includes(product._id)}
                    aria-label={`Remove ${product.name} from favorites`}
                    className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white text-red-500 shadow-sm hover:bg-red-50 disabled:opacity-50"
                  >
                    {removingIds.includes(product._id) ? (
                      <LoaderCircle size={18} className="animate-spin" />
                    ) : (
                      <Heart size={18} fill="currentColor" />
                    )}
                  </button>
                  <span className="absolute bottom-3 left-3 rounded-full bg-white px-3 py-1 text-xs font-medium text-emerald-800 shadow-sm">
                    {product.category}
                  </span>
                </div>

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
                      {getSellerName(product)}
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin size={15} />
                      {product.location}
                    </div>
                  </div>

                  <div className="mt-4 flex gap-2 border-t border-slate-100 pt-4">
                    <Link
                      to={`/products/${product._id}`}
                      className="flex flex-1 items-center justify-center rounded-lg border border-emerald-700 px-3 py-2.5 text-sm font-medium text-emerald-700 transition-colors hover:bg-emerald-50"
                    >
                      View Product
                    </Link>
                    <button
                      type="button"
                      onClick={() => void removeFromFavorites(product._id)}
                      disabled={removingIds.includes(product._id)}
                      aria-label={`Delete ${product.name} from favorites`}
                      className="rounded-lg border border-slate-200 px-3 text-slate-500 hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
                    >
                      <Trash2 size={17} />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <footer className="pt-2 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} EthioPoultry. Connecting buyers with
        poultry farmers.
      </footer>
    </main>
  );
}
