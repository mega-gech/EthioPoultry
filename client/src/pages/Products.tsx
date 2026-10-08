import { useState } from "react";
import Topbar from "../components/Topbar";
import Navbar from "../components/Navbar";
import freshEggs30 from "../assets/EthioPoultry_Product_Images/01_fresh_eggs_30pcs.jpg";
import localChicken from "../assets/EthioPoultry_Product_Images/02_local_chicken.jpg";
import dayOldChicks from "../assets/EthioPoultry_Product_Images/03_day_old_chicks.jpg";
import freshEggs60 from "../assets/EthioPoultry_Product_Images/04_fresh_eggs_60pcs.jpg";

type Product = {
  id: number;
  image: string;
  name: string;
  price: string;
  location: string;
  category: string;
};

const products: Product[] = [
  {
    id: 1,
    image: freshEggs30,
    name: "Fresh Eggs (30 pcs)",
    price: "240 ETB",
    location: "Addis Ababa",
    category: "Eggs",
  },
  {
    id: 2,
    image: localChicken,
    name: "Brown Layer Chicken",
    price: "850 ETB",
    location: "Bole, Addis Ababa",
    category: "Chickens",
  },
  {
    id: 3,
    image: dayOldChicks,
    name: "White Layer Chicken",
    price: "900 ETB",
    location: "Megenagna, Addis Ababa",
    category: "Chickens",
  },
  {
    id: 4,
    image: freshEggs60,
    name: "Eggs (60 pcs)",
    price: "480 ETB",
    location: "Addis Ababa",
    category: "Eggs",
  },
];

function Products() {
  const [selectedCategory, setSelectedCategory] = useState("Eggs");

  const [favorites, setFavorites] = useState<number[]>([]);

  const toggleFavorite = (id: number) => {
    setFavorites((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id]
    );
  };

  return (
    <>
    <Topbar />
    <Navbar />
    <main className="min-h-screen bg-[#f3fbfa]">

      {/* =====================================================
          PRODUCTS PAGE
      ====================================================== */}
      <div className="mx-auto max-w-[1280px] px-4 py-5 sm:px-6 lg:px-8">

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[225px_minmax(0,1fr)]">

          {/* =================================================
              LEFT FILTER SIDEBAR
          ================================================== */}
          <aside className="h-fit rounded-lg border border-gray-200 bg-white p-4 shadow-sm">

            {/* Filter Header */}
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

            {/* Category */}
            <div className="mt-4">

              <h3 className="mb-2 text-xs font-bold text-gray-700">
                Category
              </h3>

              <div className="space-y-2">

                {[
                  "Eggs",
                  "Chickens",
                  "Ducks",
                  "Feed",
                  "Equipment",
                  "Medicine",
                ].map((category) => (
                  <label
                    key={category}
                    className="flex cursor-pointer items-center gap-2 text-xs text-gray-600"
                  >

                    <input
                      type="checkbox"
                      checked={selectedCategory === category}
                      onChange={() =>
                        setSelectedCategory(
                          selectedCategory === category ? "" : category
                        )
                      }
                      className="h-3.5 w-3.5 cursor-pointer accent-green-600"
                    />

                    <span>{category}</span>

                  </label>
                ))}

              </div>

            </div>

            {/* Location */}
            <div className="mt-5">

              <h3 className="mb-2 text-xs font-bold text-gray-700">
                Location
              </h3>

              <div className="relative">

                <select
                  className="h-9 w-full appearance-none rounded-md border border-gray-200 bg-white px-3 pr-8 text-[11px] text-gray-500 outline-none focus:border-green-500"
                  defaultValue=""
                >
                  <option value="" disabled>
                    All Locations
                  </option>

                  <option>Addis Ababa</option>
                  <option>Bahir Dar</option>
                  <option>Gondar</option>
                  <option>Debre Markos</option>
                  <option>Hawassa</option>
                  <option>Mekelle</option>
                </select>

                <svg
                  className="pointer-events-none absolute right-2.5 top-1/2 h-3 w-3 -translate-y-1/2 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>

              </div>

            </div>

            {/* Price Range */}
            <div className="mt-5">

              <h3 className="mb-3 text-xs font-bold text-gray-700">
                Price Range
              </h3>

              <div className="relative h-1 rounded-full bg-gray-200">

                <div className="absolute left-0 right-0 top-0 h-1 rounded-full bg-green-600" />

                <span className="absolute -left-1.5 -top-1.5 h-3 w-3 rounded-full border-2 border-green-600 bg-white" />

                <span className="absolute -right-1.5 -top-1.5 h-3 w-3 rounded-full border-2 border-green-600 bg-white" />

              </div>

              <div className="mt-3 flex justify-between text-[10px] text-gray-500">

                <span>0 ETB</span>

                <span>5,000+ ETB</span>

              </div>

            </div>

            {/* Apply */}
            <button className="mt-5 flex h-9 w-full items-center justify-center gap-2 rounded-md bg-green-600 text-xs font-semibold text-white transition hover:bg-green-700">

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

            <button className="mt-3 block w-full text-center text-[10px] font-medium text-green-600 hover:text-green-700">
              Clear All
            </button>

          </aside>

          {/* =================================================
              RIGHT CONTENT
          ================================================== */}
          <section>

            {/* PAGE TITLE */}
            <div>

              <h1 className="text-2xl font-bold text-gray-800">
                Products Marketplace
              </h1>

              <p className="mt-1 text-xs text-gray-500">
                Find fresh poultry and egg products from trusted farmers.
              </p>

            </div>

            {/* SEARCH + FILTER TOOLBAR */}
            <div className="mt-3 grid grid-cols-1 gap-2.5 md:grid-cols-[minmax(0,1fr)_150px_150px_160px]">

              {/* Search */}
              <div className="relative">

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
                  type="text"
                  placeholder="Search products..."
                  className="h-9 w-full rounded-md border border-gray-200 bg-white pl-9 pr-3 text-[11px] text-gray-700 outline-none placeholder:text-gray-400 focus:border-green-500 focus:ring-1 focus:ring-green-100"
                />

              </div>

              {/* Category */}
              <div className="relative">

                <select
                  className="h-9 w-full appearance-none rounded-md border border-gray-200 bg-white px-3 pr-8 text-[11px] text-gray-600 outline-none focus:border-green-500"
                  defaultValue="all"
                >
                  <option value="all">All Categories</option>
                  <option>Eggs</option>
                  <option>Chickens</option>
                  <option>Ducks</option>
                  <option>Feed</option>
                  <option>Equipment</option>
                  <option>Medicine</option>
                </select>

                <svg
                  className="pointer-events-none absolute right-3 top-1/2 h-3 w-3 -translate-y-1/2 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m6 9 6 6 6-6"
                  />
                </svg>

              </div>

              {/* Location */}
              <div className="relative">

                <select
                  className="h-9 w-full appearance-none rounded-md border border-gray-200 bg-white px-3 pr-8 text-[11px] text-gray-600 outline-none focus:border-green-500"
                  defaultValue="all"
                >
                  <option value="all">All Locations</option>
                  <option>Addis Ababa</option>
                  <option>Bahir Dar</option>
                  <option>Gondar</option>
                  <option>Debre Markos</option>
                  <option>Hawassa</option>
                  <option>Mekelle</option>
                </select>

                <svg
                  className="pointer-events-none absolute right-3 top-1/2 h-3 w-3 -translate-y-1/2 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m6 9 6 6 6-6"
                  />
                </svg>

              </div>

              {/* Sort */}
              <div className="relative">

                <select
                  className="h-9 w-full appearance-none rounded-md border border-gray-200 bg-white px-3 pr-8 text-[11px] text-gray-600 outline-none focus:border-green-500"
                  defaultValue="newest"
                >
                  <option value="newest">
                    Sort by: Newest
                  </option>

                  <option value="price-low">
                    Price: Low to High
                  </option>

                  <option value="price-high">
                    Price: High to Low
                  </option>

                </select>

                <svg
                  className="pointer-events-none absolute right-3 top-1/2 h-3 w-3 -translate-y-1/2 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m6 9 6 6 6-6"
                  />
                </svg>

              </div>

            </div>

            {/* =================================================
                PRODUCT GRID
            ================================================== */}
            <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">

              {products.map((product) => {

                const isFavorite = favorites.includes(product.id);

                return (
                  <article
                    key={product.id}
                    className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                  >

                    {/* IMAGE */}
                    <div className="relative h-[120px] bg-gray-100">

                      <img
                        src={product.image}
                        alt={product.name}
                        className="h-full w-full object-cover"
                      />

                      {/* Favorite */}
                      <button
                        onClick={() => toggleFavorite(product.id)}
                        aria-label={`Favorite ${product.name}`}
                        className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/30 text-white backdrop-blur-sm transition hover:bg-white hover:text-red-500"
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
                            d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 000-7.78z"
                          />
                        </svg>
                      </button>

                    </div>

                    {/* CARD CONTENT */}
                    <div className="p-2.5">

                      {/* Product Name */}
                      <h2 className="truncate text-[12px] font-bold text-gray-800">
                        {product.name}
                      </h2>

                      {/* Price */}
                      <p className="mt-1 text-sm font-bold text-green-600">
                        {product.price}
                      </p>

                      {/* Location */}
                      <div className="mt-1 flex items-center gap-1 text-[10px] text-gray-500">

                        <svg
                          className="h-3 w-3 text-green-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 11a3 3 0 100-6 3 3 0 000 6z"
                          />

                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1114 0z"
                          />
                        </svg>

                        <span className="truncate">
                          {product.location}
                        </span>

                      </div>

                      {/* Category */}
                      <div className="mt-2">

                        <span className="inline-flex rounded-full bg-green-50 px-2 py-1 text-[9px] font-medium text-green-700">
                          {product.category}
                        </span>

                      </div>

                      {/* ACTION BUTTONS */}
                      <div className="mt-2 grid grid-cols-2 gap-2">

                        {/* Call */}
                        <button className="flex h-7 items-center justify-center gap-1 rounded-md bg-green-600 text-[9px] font-semibold text-white transition hover:bg-green-700">

                          <svg
                            className="h-3 w-3"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M6.62 10.79a15.46 15.46 0 006.59 6.59l2.2-2.2a1 1 0 011.02-.24c1.12.37 2.33.57 3.57.57a1 1 0 011 1V20a1 1 0 01-1 1C10.16 21 3 13.84 3 5a1 1 0 011-1h3.5a1 1 0 011 1c0 1.25.2 2.45.57 3.57a1 1 0 01-.25 1.02l-2.2 2.2z" />
                          </svg>

                          Call Seller

                        </button>

                        {/* WhatsApp */}
                        <button className="flex h-7 items-center justify-center gap-1 rounded-md border border-green-500 bg-white text-[9px] font-semibold text-green-600 transition hover:bg-green-50">

                          <svg
                            className="h-3 w-3"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M20.52 3.48A11.86 11.86 0 0012.07 0C5.52 0 .2 5.32.2 11.87c0 2.09.55 4.13 1.6 5.93L.1 24l6.34-1.66a11.86 11.86 0 005.63 1.43h.01c6.55 0 11.87-5.32 11.87-11.87 0-3.17-1.23-6.15-3.43-8.42zM12.08 21.78h-.01a9.88 9.88 0 01-5.03-1.38l-.36-.21-3.76.99 1-3.66-.23-.38a9.9 9.9 0 01-1.52-5.27c0-5.47 4.45-9.92 9.92-9.92 2.65 0 5.14 1.03 7.02 2.91a9.87 9.87 0 012.9 7.03c0 5.47-4.45 9.92-9.93 9.92z" />
                          </svg>

                          WhatsApp

                        </button>

                      </div>

                    </div>

                  </article>
                );
              })}

            </div>

          </section>

        </div>

      </div>

    </main>
    </>
  );
}

export default Products;