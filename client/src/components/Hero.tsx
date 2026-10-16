
import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import hero from "../assets/01_hen_egg_basket.jpg";

const popularSearches = [
  "Eggs",
  "Chickens",
  "Layers",
  "Broilers",
  "Chicks",
];

const locations = [
  "Addis Ababa",
  "Amhara",
  "Oromia",
  "Tigray",
];

const Hero = () => {
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [location, setLocation] = useState("");

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const params = new URLSearchParams();

    if (searchTerm.trim()) {
      params.set("search", searchTerm.trim());
    }

    if (location) {
      params.set("location", location);
    }

    navigate(`/products?${params.toString()}`);
  };

  const handlePopularSearch = (category: string) => {
    const params = new URLSearchParams();
    params.set("category", category.toLowerCase());

    navigate(`/products?${params.toString()}`);
  };

  return (
    <section
      aria-label="Find poultry products"
      className="relative isolate overflow-hidden bg-gray-900"
    >
      {/* Background image */}
      <img
        src={hero}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 -z-20 h-full w-full object-cover object-center"
      />

      {/* Image overlay */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-gradient-to-r from-black/75 via-black/50 to-black/20"
      />

      {/* Hero content */}
      <div className="mx-auto flex min-h-[390px] max-w-7xl items-center px-4 py-10 sm:min-h-[420px] sm:px-6 sm:py-12 lg:min-h-[450px] lg:px-8">
        <div className="w-full max-w-2xl text-white">

          {/* Heading */}
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-green-300 sm:text-sm">
            Ethiopia's Poultry Marketplace
          </p>

          <h1 className="max-w-xl text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
            Find Fresh Poultry
            <br className="hidden sm:block" /> Products Easily!
          </h1>

          <p className="mt-4 max-w-lg text-sm leading-6 text-white/90 sm:text-base sm:leading-7">
            Connect directly with farmers and suppliers to find quality
            poultry products at competitive prices.
          </p>

          {/* Search form */}
          <form
            onSubmit={handleSearch}
            role="search"
            className="mt-6 grid grid-cols-1 gap-2 rounded-xl bg-white p-2 shadow-xl sm:grid-cols-[minmax(0,1fr)_175px_auto] sm:gap-2"
          >
            {/* Product search */}
            <div className="flex min-w-0 items-center rounded-lg border border-gray-200 px-3 transition focus-within:border-green-600 focus-within:ring-2 focus-within:ring-green-100">
              <svg
                aria-hidden="true"
                className="mr-2 h-5 w-5 shrink-0 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <circle
                  cx="11"
                  cy="11"
                  r="7"
                  strokeWidth="1.8"
                />
                <path
                  d="m16 16 4 4"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </svg>

              <label className="sr-only" htmlFor="hero-search">
                Search poultry products
              </label>

              <input
                id="hero-search"
                type="search"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Eggs, chickens, chicks..."
                className="min-w-0 w-full bg-transparent py-3 text-sm text-gray-800 outline-none placeholder:text-gray-400"
              />
            </div>

            {/* Location selector */}
            <div className="flex items-center rounded-lg border border-gray-200 px-3 transition focus-within:border-green-600 focus-within:ring-2 focus-within:ring-green-100">
              <svg
                aria-hidden="true"
                className="mr-2 h-5 w-5 shrink-0 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z"
                  strokeWidth="1.8"
                  strokeLinejoin="round"
                />
                <circle cx="12" cy="10" r="2.5" strokeWidth="1.8" />
              </svg>

              <label className="sr-only" htmlFor="hero-location">
                Filter by location
              </label>

              <select
                id="hero-location"
                value={location}
                onChange={(event) => setLocation(event.target.value)}
                className="min-w-0 w-full cursor-pointer bg-transparent py-3 text-sm text-gray-700 outline-none"
              >
                <option value="">All locations</option>

                {locations.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            {/* Search button */}
            <button
              type="submit"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-green-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-green-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-600 focus-visible:ring-offset-2 active:scale-[0.98]"
            >
              Search
              <svg
                aria-hidden="true"
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M5 12h14m-6-6 6 6-6 6"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </form>

          {/* Popular searches */}
          <div className="mt-5 flex flex-wrap items-center gap-2 text-xs sm:text-sm">
            <span className="mr-1 font-medium text-white/90">
              Popular:
            </span>

            {popularSearches.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => handlePopularSearch(category)}
                className="rounded-full border border-white/30 bg-white/10 px-3 py-1.5 font-medium text-white backdrop-blur-sm transition hover:border-green-300 hover:bg-green-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                {category}
              </button>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
};

export default Hero;
