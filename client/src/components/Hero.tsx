
import { Link } from "react-router-dom";
import {
  ArrowRight,
  CheckCircle2,
  Store,
} from "lucide-react";
import hero from "../assets/01_hen_egg_basket.jpg";

type PopularSearch = {
  label: string;
  category: string;
};

const popularSearches: PopularSearch[] = [
  { label: "Eggs", category: "Eggs" },
  { label: "Chickens", category: "Chickens" },
  { label: "Poultry Feed", category: "Feed" },
  { label: "Equipment", category: "Equipment" },
];

const trustPoints = [
  "Discover poultry products",
  "Connect with local suppliers",
  "Compare available products",
];

const buildProductsUrl = (params: Record<string, string>) => {
  const query = new URLSearchParams(params).toString();
  return query ? `/products?${query}` : "/products";
};

const Hero = () => {
  return (
    <section
      aria-labelledby="hero-heading"
      className="relative isolate overflow-hidden bg-gray-950"
    >
      {/* Background image */}
      <img
        src={hero}
        alt=""
        aria-hidden="true"
        fetchPriority="high"
        decoding="async"
        className="absolute inset-0 -z-20 h-full w-full object-cover object-center"
      />

      {/* Background overlay */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-gradient-to-r from-gray-950/90 via-gray-950/65 to-gray-950/25"
      />

      {/* Compact hero container */}
      <div className="mx-auto flex min-h-[320px] max-w-7xl items-center px-4 py-6 sm:px-6 sm:py-8 lg:min-h-[350px] lg:px-8 lg:py-8">
        <div className="w-full max-w-2xl text-white">

          {/* Marketplace label */}
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-green-300/30 bg-green-400/10 px-3 py-1 text-xs font-semibold tracking-wide text-green-200">
            <span
              aria-hidden="true"
              className="h-2 w-2 rounded-full bg-green-400"
            />
            ETHIOPIA&apos;S POULTRY MARKETPLACE
          </div>

          {/* Main heading */}
          <h1
            id="hero-heading"
            className="max-w-xl text-3xl font-extrabold leading-[1.1] tracking-tight sm:text-4xl lg:text-[42px]"
          >
            Your Poultry Needs,
            <span className="mt-1 block text-green-300">
              All in One Place.
            </span>
          </h1>

          {/* Description */}
          <p className="mt-2 max-w-xl text-sm leading-6 text-gray-200 sm:text-base">
            Discover fresh eggs, healthy chickens, poultry feed, and
            equipment. Connect with poultry suppliers across Ethiopia.
          </p>

          {/* Popular categories */}
          <nav
            aria-label="Popular product categories"
            className="mt-3 flex flex-wrap items-center gap-2"
          >
            <span className="mr-1 text-xs font-medium text-gray-200 sm:text-sm">
              Explore:
            </span>

            {popularSearches.map(({ label, category }) => (
              <Link
                key={category}
                to={buildProductsUrl({ category })}
                className="rounded-full border border-white/25 bg-white/10 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm transition hover:border-green-300 hover:bg-green-600/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white sm:text-sm"
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* Main actions */}
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <Link
              to="/products"
              className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-green-600 px-5 py-2 text-sm font-bold text-white transition hover:bg-green-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-400 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900"
            >
              Browse Products
              <ArrowRight
                aria-hidden="true"
                className="h-4 w-4"
              />
            </Link>

            <Link
              to="/login"
              className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-white/35 bg-white/5 px-5 py-2 text-sm font-semibold text-white backdrop-blur-sm transition hover:border-green-300 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              <Store aria-hidden="true" className="h-4 w-4" />
              Start Selling
            </Link>
          </div>

          {/* Trust points */}
          <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-1 border-t border-white/20 pt-3 text-xs text-gray-200 sm:text-sm">
            {trustPoints.map((point) => (
              <li key={point} className="flex items-center gap-1.5">
                <CheckCircle2
                  aria-hidden="true"
                  className="h-3.5 w-3.5 shrink-0 text-green-300"
                />
                <span>{point}</span>
              </li>
            ))}
          </ul>

        </div>
      </div>
    </section>
  );
};

export default Hero;
