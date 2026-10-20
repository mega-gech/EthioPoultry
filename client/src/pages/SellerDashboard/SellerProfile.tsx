
import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  MapPin,
  BadgeCheck,
  Phone,
  MessageCircle,
  Package,
  Star,
  ArrowLeft,
  ArrowUpRight,
  ShoppingBag,
  ShieldCheck,
  Clock,
  Sprout,
  ChevronRight,
  Search,
  Store,
} from "lucide-react";

import { products } from "../../data/products";

type ProfileTab = "About" | "Products" | "Reviews";

const tabs: ProfileTab[] = ["About", "Products", "Reviews"];

function formatPrice(price: number) {
  return `${price.toLocaleString("en-ET")} ETB`;
}

function getPhoneNumber(phone?: string) {
  if (!phone) return "";

  let number = phone.replace(/\D/g, "");

  if (number.startsWith("0")) {
    number = `251${number.slice(1)}`;
  } else if (number.startsWith("9") && number.length === 9) {
    number = `251${number}`;
  }

  return number.length >= 12 && number.length <= 15 ? number : "";
}

export default function SellerProfile() {
  const params = useParams();

  // Supports either /sellerProfile/:id or /sellerProfile/:sellerId.
  const rawId = params.sellerId ?? params.id;
  const sellerId = Number(rawId);

  const [activeTab, setActiveTab] = useState<ProfileTab>("About");
  const [productSearch, setProductSearch] = useState("");
  const [productCategory, setProductCategory] = useState("All");

  // Find all products belonging to this seller.
  const sellerProducts = useMemo(
    () =>
      products.filter(
        (product) =>
          Number(product.sellerId) === sellerId,
      ),
    [sellerId],
  );

  const firstProduct = sellerProducts[0];
  const farmName = firstProduct?.seller;

  // Calculate profile statistics from the shared product data.
  const averageRating = sellerProducts.length
    ? (
        sellerProducts.reduce(
          (total, product) => total + Number(product.rating || 0),
          0,
        ) / sellerProducts.length
      ).toFixed(1)
    : "0.0";

  const totalReviews = sellerProducts.reduce(
    (total, product) => total + Number(product.reviews || 0),
    0,
  );

  const availableProducts = sellerProducts.filter(
    (product) => product.status !== "Out of Stock",
  ).length;

  const categories = [
    "All",
    ...new Set(sellerProducts.map((product) => product.category)),
  ];

  const filteredProducts = sellerProducts.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(productSearch.trim().toLowerCase());

    const matchesCategory =
      productCategory === "All" ||
      product.category === productCategory;

    return matchesSearch && matchesCategory;
  });

  if (
    !rawId ||
    !Number.isInteger(sellerId) ||
    sellerId <= 0 ||
    !farmName
  ) {
    return (
      <main className="flex min-h-[80vh] items-center justify-center bg-[#f6f8f5] px-4 py-16">
        <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-green-50 text-green-700">
            <Store size={30} />
          </div>

          <h1 className="mt-5 text-2xl font-bold tracking-tight text-gray-900">
            Seller not found
          </h1>

          <p className="mt-2 text-sm leading-6 text-gray-500">
            We couldn't find this farm. It may not have any listed
            products yet, or the profile link may be incorrect.
          </p>

          <Link
            to="/products"
            className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-green-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-green-800"
          >
            <ArrowLeft size={17} />
            Browse marketplace
          </Link>
        </div>
      </main>
    );
  }

  const phoneNumber = getPhoneNumber(firstProduct.sellerPhone);

  const handleCall = () => {
    if (!phoneNumber) {
      window.alert(
        "The seller's phone number is not available. Please update sellerPhone in your product data.",
      );
      return;
    }

    window.location.href = `tel:+${phoneNumber}`;
  };

  const handleWhatsApp = () => {
    if (!phoneNumber) {
      window.alert(
        "The seller's WhatsApp number is not available. Please update sellerPhone in your product data.",
      );
      return;
    }

    const message = encodeURIComponent(
      `Hello ${farmName}, I found your farm on EthioPoultry and would like to know more about your products.`,
    );

    window.open(
      `https://wa.me/${phoneNumber}?text=${message}`,
      "_blank",
      "noopener,noreferrer",
    );
  };

  return (
    <main className="min-h-screen bg-[#f6f8f5] pb-12 text-gray-800">
      <div className="mx-auto max-w-7xl px-4 pt-5 sm:px-6 lg:px-8">
        {/* Breadcrumb navigation */}
        <nav
          aria-label="Breadcrumb"
          className="mb-5 flex flex-wrap items-center gap-2 text-xs text-gray-500 sm:text-sm"
        >
          <Link
            to="/"
            className="transition hover:text-green-700"
          >
            Home
          </Link>

          <ChevronRight size={14} />

          <Link
            to="/products"
            className="transition hover:text-green-700"
          >
            Marketplace
          </Link>

          <ChevronRight size={14} />

          <span className="font-medium text-gray-800">
            Farm Profile
          </span>
        </nav>

        {/* Farm cover */}
        <section className="relative isolate h-56 overflow-hidden rounded-2xl bg-green-950 shadow-sm sm:h-72 lg:h-[330px]">
          <img
            src={firstProduct.image}
            alt={`${farmName} poultry farm`}
            className="absolute inset-0 -z-20 h-full w-full object-cover"
          />

          <div className="absolute inset-0 -z-10 bg-gradient-to-r from-gray-950/85 via-gray-950/45 to-gray-950/10" />
          <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black/45 to-transparent" />

          <Link
            to="/products"
            className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full border border-white/25 bg-black/25 px-3 py-2 text-xs font-medium text-white backdrop-blur-md transition hover:bg-black/45 sm:left-6 sm:top-6 sm:text-sm"
          >
            <ArrowLeft size={16} />
            Marketplace
          </Link>

          <div className="absolute inset-x-5 bottom-6 text-white sm:inset-x-8 sm:bottom-9 lg:inset-x-10">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.15em] text-white backdrop-blur-md sm:text-xs">
              <Sprout size={14} />
              Local poultry farm
            </div>

            <h1 className="max-w-3xl text-2xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
              {farmName}
            </h1>

            <p className="mt-3 flex items-center gap-2 text-xs text-white/85 sm:text-sm">
              <MapPin size={16} className="shrink-0" />
              {firstProduct.location}, Ethiopia
            </p>
          </div>
        </section>

        {/* Farm identity card */}
        <section className="relative z-10 mx-2 -mt-5 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:mx-5 sm:p-6 lg:mx-8 lg:p-7">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex min-w-0 items-start gap-4">
              <div className="-mt-8 flex h-[76px] w-[76px] shrink-0 items-center justify-center rounded-2xl border-4 border-white bg-green-50 text-4xl shadow-sm sm:h-24 sm:w-24">
                🐔
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-lg font-bold tracking-tight text-gray-900 sm:text-2xl">
                    {farmName}
                  </h2>

                  <span className="inline-flex items-center gap-1 rounded-full border border-green-100 bg-green-50 px-2.5 py-1 text-[10px] font-semibold text-green-800 sm:text-xs">
                    <BadgeCheck size={14} />
                    Verified seller
                  </span>
                </div>

                <p className="mt-2 text-xs leading-5 text-gray-500 sm:text-sm">
                  Connecting buyers with poultry and fresh farm
                  products.
                </p>

                <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-gray-500 sm:text-sm">
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin size={15} className="text-green-700" />
                    {firstProduct.location}
                  </span>

                  <span className="inline-flex items-center gap-1.5">
                    <Star
                      size={15}
                      className="fill-amber-400 text-amber-400"
                    />
                    <strong className="text-gray-800">
                      {averageRating}
                    </strong>
                    <span>({totalReviews} reviews)</span>
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-row lg:shrink-0">
              <button
                type="button"
                onClick={handleCall}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-green-700 px-4 py-3 text-xs font-semibold text-white shadow-sm transition hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2 sm:px-5 sm:text-sm"
              >
                <Phone size={17} />
                Call seller
              </button>

              <button
                type="button"
                onClick={handleWhatsApp}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-green-200 bg-white px-4 py-3 text-xs font-semibold text-green-800 transition hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2 sm:px-5 sm:text-sm"
              >
                <MessageCircle size={17} />
                WhatsApp
                <ArrowUpRight size={14} />
              </button>
            </div>
          </div>
        </section>

        {/* Statistics */}
        <section
          aria-label="Farm statistics"
          className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4"
        >
          <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:p-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50 text-green-700">
              <Package size={21} />
            </div>

            <p className="mt-4 text-xs text-gray-500 sm:text-sm">
              Listed products
            </p>

            <p className="mt-1 text-2xl font-bold tracking-tight text-gray-900">
              {sellerProducts.length}
            </p>

            <p className="mt-1 text-[11px] text-gray-400 sm:text-xs">
              Products in the marketplace
            </p>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:p-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
              <ShoppingBag size={21} />
            </div>

            <p className="mt-4 text-xs text-gray-500 sm:text-sm">
              Available now
            </p>

            <p className="mt-1 text-2xl font-bold tracking-tight text-gray-900">
              {availableProducts}
            </p>

            <p className="mt-1 text-[11px] text-gray-400 sm:text-xs">
              Products marked available
            </p>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:p-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
              <Star size={21} />
            </div>

            <p className="mt-4 text-xs text-gray-500 sm:text-sm">
              Average rating
            </p>

            <p className="mt-1 flex items-center gap-1.5 text-2xl font-bold tracking-tight text-gray-900">
              {averageRating}
              <span className="text-sm font-normal text-gray-400">
                / 5
              </span>
            </p>

            <p className="mt-1 text-[11px] text-gray-400 sm:text-xs">
              From listed product ratings
            </p>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:p-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-700">
              <ShieldCheck size={21} />
            </div>

            <p className="mt-4 text-xs text-gray-500 sm:text-sm">
              Seller status
            </p>

            <p className="mt-1 text-xl font-bold tracking-tight text-gray-900">
              Registered
            </p>

            <p className="mt-1 text-[11px] text-gray-400 sm:text-xs">
              Demo profile status
            </p>
          </div>
        </section>

        {/* Profile tabs */}
        <section className="mt-7 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
          <div className="border-b border-gray-100 px-4 sm:px-7">
            <div className="flex gap-6 overflow-x-auto sm:gap-9">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  type="button"
                  role="tab"
                  aria-selected={activeTab === tab}
                  onClick={() => setActiveTab(tab)}
                  className={`relative shrink-0 py-4 text-sm font-semibold transition ${
                    activeTab === tab
                      ? "text-green-800"
                      : "text-gray-500 hover:text-gray-800"
                  }`}
                >
                  {tab}

                  {tab === "Products" && (
                    <span className="ml-2 rounded-full bg-gray-100 px-2 py-0.5 text-[10px] text-gray-600">
                      {sellerProducts.length}
                    </span>
                  )}

                  {activeTab === tab && (
                    <span className="absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-green-700" />
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="p-5 sm:p-7 lg:p-8">
            {/* ABOUT */}
            {activeTab === "About" && (
              <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_300px]">
                <div>
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50 text-green-700">
                      <Sprout size={21} />
                    </div>

                    <div>
                      <h3 className="text-lg font-bold text-gray-900">
                        About our farm
                      </h3>

                      <p className="mt-0.5 text-xs text-gray-500">
                        Get to know the seller
                      </p>
                    </div>
                  </div>

                  <p className="mt-5 max-w-3xl text-sm leading-7 text-gray-600">
                    Welcome to {farmName}. We offer poultry and
                    farm products to households, retailers, and
                    poultry businesses. Browse our listings to
                    see available products, compare prices, and
                    contact us directly for product information.
                  </p>

                  <h4 className="mt-7 text-sm font-bold text-gray-900">
                    What we offer
                  </h4>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {[...new Set(sellerProducts.map((p) => p.category))].map(
                      (category) => (
                        <span
                          key={category}
                          className="rounded-lg border border-green-100 bg-green-50 px-3 py-2 text-xs font-medium text-green-800"
                        >
                          {category}
                        </span>
                      ),
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => setActiveTab("Products")}
                    className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-green-700 transition hover:text-green-900"
                  >
                    Explore farm products
                    <ArrowUpRight size={17} />
                  </button>
                </div>

                <aside className="h-fit rounded-2xl border border-gray-100 bg-[#f8faf7] p-5">
                  <h3 className="text-sm font-bold text-gray-900">
                    Farm information
                  </h3>

                  <div className="mt-5 space-y-5">
                    <div className="flex items-start gap-3">
                      <MapPin
                        size={18}
                        className="mt-0.5 shrink-0 text-green-700"
                      />

                      <div>
                        <p className="text-xs text-gray-500">
                          Location
                        </p>
                        <p className="mt-1 text-sm font-semibold text-gray-800">
                          {firstProduct.location}, Ethiopia
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Package
                        size={18}
                        className="mt-0.5 shrink-0 text-green-700"
                      />

                      <div>
                        <p className="text-xs text-gray-500">
                          Products listed
                        </p>
                        <p className="mt-1 text-sm font-semibold text-gray-800">
                          {sellerProducts.length} products
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Clock
                        size={18}
                        className="mt-0.5 shrink-0 text-green-700"
                      />

                      <div>
                        <p className="text-xs text-gray-500">
                          Contact
                        </p>
                        <p className="mt-1 text-sm font-semibold text-gray-800">
                          Contact seller for availability
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <ShieldCheck
                        size={18}
                        className="mt-0.5 shrink-0 text-green-700"
                      />

                      <div>
                        <p className="text-xs text-gray-500">
                          Profile status
                        </p>
                        <p className="mt-1 text-sm font-semibold text-gray-800">
                          Demo seller profile
                        </p>
                      </div>
                    </div>
                  </div>
                </aside>
              </div>
            )}

            {/* PRODUCTS */}
            {activeTab === "Products" && (
              <div>
                <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">
                      Products from {farmName}
                    </h3>

                    <p className="mt-1 text-xs leading-5 text-gray-500 sm:text-sm">
                      Browse this farm's listings and open a product
                      to view its full details.
                    </p>
                  </div>

                  <div className="relative w-full sm:max-w-xs">
                    <Search
                      size={17}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    />

                    <input
                      type="search"
                      value={productSearch}
                      onChange={(event) =>
                        setProductSearch(event.target.value)
                      }
                      placeholder="Search farm products..."
                      aria-label="Search farm products"
                      className="h-10 w-full rounded-xl border border-gray-200 bg-white pl-9 pr-3 text-sm outline-none transition placeholder:text-gray-400 focus:border-green-500 focus:ring-2 focus:ring-green-100"
                    />
                  </div>
                </div>

                <div className="mt-5 flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <button
                      key={category}
                      type="button"
                      onClick={() => setProductCategory(category)}
                      className={`rounded-full px-3.5 py-2 text-xs font-semibold transition ${
                        productCategory === category
                          ? "bg-green-700 text-white shadow-sm"
                          : "border border-gray-200 bg-white text-gray-600 hover:border-green-300 hover:text-green-800"
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>

                {filteredProducts.length > 0 ? (
                  <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    {filteredProducts.map((product) => {
                      const available =
                        product.status !== "Out of Stock";

                      return (
                        <Link
                          key={product.id}
                          to={`/product/${product.id}`}
                          className="group overflow-hidden rounded-2xl border border-gray-100 bg-white transition duration-200 hover:-translate-y-1 hover:border-green-200 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                        >
                          <div className="relative h-44 overflow-hidden bg-gray-100 sm:h-48">
                            <img
                              src={product.image}
                              alt={product.name}
                              loading="lazy"
                              className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                            />

                            <span
                              className={`absolute left-3 top-3 rounded-full px-3 py-1.5 text-[10px] font-semibold ${
                                available
                                  ? "bg-green-50 text-green-800"
                                  : "bg-red-50 text-red-700"
                              }`}
                            >
                              {available
                                ? "Available"
                                : "Out of Stock"}
                            </span>

                            <span className="absolute bottom-3 right-3 rounded-lg bg-white/95 px-3 py-1.5 text-xs font-semibold text-gray-800 shadow-sm">
                              {product.category}
                            </span>
                          </div>

                          <div className="p-4">
                            <div className="flex items-start justify-between gap-3">
                              <h4 className="line-clamp-2 min-h-10 flex-1 text-sm font-bold leading-5 text-gray-900 transition group-hover:text-green-800">
                                {product.name}
                              </h4>

                              <ArrowUpRight
                                size={17}
                                className="mt-0.5 shrink-0 text-gray-400 transition group-hover:text-green-700"
                              />
                            </div>

                            <p className="mt-2 text-lg font-bold text-green-800">
                              {formatPrice(product.price)}
                            </p>

                            <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-gray-100 pt-3 text-xs text-gray-500">
                              <span className="flex items-center gap-1.5">
                                <Package
                                  size={14}
                                  className="text-gray-400"
                                />
                                {product.quantity}
                              </span>

                              <span className="flex items-center gap-1.5">
                                <MapPin
                                  size={14}
                                  className="text-gray-400"
                                />
                                {product.location}
                              </span>
                            </div>

                            <div className="mt-4 flex items-center justify-between">
                              <span className="text-xs text-gray-500">
                                <Star
                                  size={13}
                                  className="mr-1 inline fill-amber-400 text-amber-400"
                                />
                                {product.rating || "New"}
                                {Number(product.reviews) > 0 &&
                                  ` (${product.reviews})`}
                              </span>

                              <span className="text-xs font-semibold text-green-700">
                                View details
                                <ChevronRight
                                  size={14}
                                  className="ml-0.5 inline"
                                />
                              </span>
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                ) : (
                  <div className="mt-6 rounded-2xl border border-dashed border-gray-300 bg-gray-50 px-5 py-12 text-center">
                    <Package
                      size={32}
                      className="mx-auto text-gray-300"
                    />

                    <h4 className="mt-3 text-sm font-bold text-gray-800">
                      No matching products
                    </h4>

                    <p className="mt-1 text-xs text-gray-500">
                      Try another search term or category.
                    </p>

                    <button
                      type="button"
                      onClick={() => {
                        setProductSearch("");
                        setProductCategory("All");
                      }}
                      className="mt-4 text-xs font-semibold text-green-700 hover:text-green-900"
                    >
                      Clear product filters
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* REVIEWS */}
            {activeTab === "Reviews" && (
              <div>
                <h3 className="text-lg font-bold text-gray-900">
                  Customer ratings
                </h3>

                <p className="mt-1 text-sm text-gray-500">
                  An overview of the ratings associated with this
                  farm's product listings.
                </p>

                <div className="mt-6 grid gap-5 rounded-2xl border border-gray-100 bg-[#f8faf7] p-5 sm:grid-cols-[180px_minmax(0,1fr)] sm:p-7">
                  <div className="flex flex-col justify-center border-b border-gray-200 pb-5 sm:border-b-0 sm:border-r sm:pb-0">
                    <p className="text-4xl font-bold tracking-tight text-gray-900">
                      {averageRating}
                      <span className="text-lg font-medium text-gray-400">
                        /5
                      </span>
                    </p>

                    <div className="mt-2 flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          size={16}
                          className={
                            star <= Math.round(Number(averageRating))
                              ? "fill-amber-400 text-amber-400"
                              : "text-gray-300"
                          }
                        />
                      ))}
                    </div>

                    <p className="mt-2 text-xs text-gray-500">
                      {totalReviews} ratings/reviews recorded
                    </p>
                  </div>

                  <div className="flex flex-col justify-center">
                    <h4 className="text-sm font-semibold text-gray-900">
                      Product rating summary
                    </h4>

                    <p className="mt-2 text-sm leading-6 text-gray-600">
                      The score above is calculated from the ratings
                      stored with this seller's sample product data.
                      Individual written customer reviews are not
                      connected yet.
                    </p>
                  </div>
                </div>

                <div className="mt-6 overflow-hidden rounded-xl border border-gray-100">
                  <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-3 bg-gray-50 px-4 py-3 text-xs font-semibold text-gray-600 sm:px-5">
                    <span>Product</span>
                    <span>Rating</span>
                  </div>

                  {sellerProducts.map((product) => (
                    <div
                      key={product.id}
                      className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 border-t border-gray-100 px-4 py-4 sm:px-5"
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <img
                          src={product.image}
                          alt=""
                          className="h-12 w-12 shrink-0 rounded-lg object-cover"
                          loading="lazy"
                        />

                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-gray-800">
                            {product.name}
                          </p>

                          <p className="mt-1 text-xs text-gray-500">
                            {product.reviews} recorded reviews
                          </p>
                        </div>
                      </div>

                      <span className="inline-flex items-center gap-1 text-sm font-semibold text-gray-800">
                        <Star
                          size={14}
                          className="fill-amber-400 text-amber-400"
                        />
                        {product.rating || "—"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Bottom call to action */}
        <section className="mt-7 overflow-hidden rounded-2xl bg-green-900 px-5 py-7 text-white sm:px-8 sm:py-9">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-green-200">
                Shop with confidence
              </p>

              <h2 className="mt-2 text-xl font-bold tracking-tight sm:text-2xl">
                Looking for poultry products?
              </h2>

              <p className="mt-2 max-w-xl text-xs leading-6 text-green-100 sm:text-sm">
                Explore the farm's listings or contact the seller
                directly to confirm prices and availability.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setActiveTab("Products")}
              className="inline-flex shrink-0 items-center justify-center gap-2 self-start rounded-xl bg-white px-5 py-3 text-sm font-semibold text-green-900 transition hover:bg-green-50 sm:self-auto"
            >
              Browse farm products
              <ArrowUpRight size={17} />
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}
