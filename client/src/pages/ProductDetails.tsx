
import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import eggTray from "../assets/02_egg_tray.jpg";
import brownHen from "../assets/03_brown_hen.jpg";
import whiteHens from "../assets/04_white_hens.jpg";
import stackedEggTrays from "../assets/05_stacked_egg_trays.jpg";
import eggBasket from "../assets/06_egg_basket.jpg";

type Product = {
  id: number;
  name: string;
  image: string;
  location: string;
  price: number;
  quantity: string;
  category: string;
  description: string;
  seller: string;
  rating: string;
  reviews: number;
  sellerProducts: number;
  images: string[];
};

const products: Product[] = [
  {
    id: 1,
    name: "Fresh Eggs (30 pcs)",
    image: eggTray,
    location: "Addis Ababa",
    price: 240,
    quantity: "30 pcs",
    category: "Eggs",
    description:
      "Fresh farm-produced eggs from healthy chickens. High quality, clean and nutritious. Perfect for home use or business.",
    seller: "Abebe Poultry Farm",
    rating: "4.8",
    reviews: 24,
    sellerProducts: 120,
    images: [eggTray, stackedEggTrays, eggBasket, brownHen],
  },
  {
    id: 2,
    name: "Brown Layer Chicken",
    image: brownHen,
    location: "Addis Ababa",
    price: 850,
    quantity: "1 chicken",
    category: "Chickens",
    description:
      "Healthy brown layer chicken suitable for poultry farming and egg production. Contact the seller for availability and further details.",
    seller: "Abebe Poultry Farm",
    rating: "4.8",
    reviews: 18,
    sellerProducts: 120,
    images: [brownHen, whiteHens, eggTray, eggBasket],
  },
  {
    id: 3,
    name: "White Layer Chicken",
    image: whiteHens,
    location: "Addis Ababa",
    price: 900,
    quantity: "1 chicken",
    category: "Chickens",
    description:
      "White layer chicken offered by a local poultry seller. Contact the seller to confirm the current stock and suitable farming conditions.",
    seller: "Abebe Poultry Farm",
    rating: "4.7",
    reviews: 16,
    sellerProducts: 120,
    images: [whiteHens, brownHen, eggTray, eggBasket],
  },
  {
    id: 4,
    name: "Eggs (60 pcs)",
    image: stackedEggTrays,
    location: "Addis Ababa",
    price: 480,
    quantity: "60 pcs",
    category: "Eggs",
    description:
      "A larger pack of fresh eggs for households, shops and food businesses. Contact the seller to confirm availability before ordering.",
    seller: "Abebe Poultry Farm",
    rating: "4.8",
    reviews: 21,
    sellerProducts: 120,
    images: [stackedEggTrays, eggTray, eggBasket, brownHen],
  },
];

type TabName = "Description" | "Specifications" | "Seller Info";

export default function ProductDetails() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const product = products.find((item) => item.id === Number(id));

  const [activeImage, setActiveImage] = useState(0);
  const [activeTab, setActiveTab] =
    useState<TabName>("Description");

  if (!product) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-gray-800">
          Product not found
        </h1>
        <p className="mt-2 text-gray-500">
          This product does not exist or is no longer available.
        </p>
        <Link
          to="/products"
          className="mt-5 inline-block rounded-md bg-green-700 px-5 py-2 text-sm font-semibold text-white hover:bg-green-800"
        >
          Back to Products
        </Link>
      </div>
    );
  }

  const handleWhatsApp = () => {
    const message = `Hello, I am interested in ${product.name} listed for ${product.price} ETB on EthioPoultry. Is it available?`;
    const url = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleCall = () => {
    // Replace this placeholder with the seller's real phone number.
    window.location.href = "tel:+251900000000";
  };

  return (
    <main className="min-h-screen bg-white">
      <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">

        {/* BREADCRUMB */}
        <nav className="mb-5 flex flex-wrap items-center gap-2 text-xs text-gray-500 sm:text-sm">
          <Link to="/" className="hover:text-green-700">
            Home
          </Link>
          <span>›</span>
          <Link to="/products" className="hover:text-green-700">
            Products
          </Link>
          <span>›</span>
          <span className="text-gray-700">
            {product.name}
          </span>
        </nav>

        {/* PRODUCT OVERVIEW */}
        <section className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">

          {/* LEFT: PRODUCT GALLERY */}
          <div className="min-w-0">
            <div className="flex h-[300px] items-center justify-center overflow-hidden rounded-lg bg-gray-50 sm:h-[380px] lg:h-[410px]">
              <img
                src={product.images[activeImage]}
                alt={product.name}
                className="h-full w-full object-contain"
              />
            </div>

            {/* THUMBNAILS */}
            <div className="mt-3 grid grid-cols-4 gap-3">
              {product.images.map((image, index) => (
                <button
                  key={`${product.id}-${index}`}
                  type="button"
                  onClick={() => setActiveImage(index)}
                  aria-label={`View product image ${index + 1}`}
                  aria-pressed={activeImage === index}
                  className={`h-16 overflow-hidden rounded-md border-2 bg-white sm:h-20 ${
                    activeImage === index
                      ? "border-green-700"
                      : "border-gray-200 hover:border-green-400"
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.name} view ${index + 1}`}
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* RIGHT: PRODUCT INFORMATION */}
          <div className="min-w-0">
            <h1 className="text-2xl font-bold leading-tight text-gray-900 sm:text-3xl">
              {product.name}
            </h1>

            {/* RATING */}
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span
                className="text-sm tracking-wide text-amber-500"
                aria-label={`${product.rating} out of 5 stars`}
              >
                ★★★★★
              </span>
              <span className="text-sm text-gray-600">
                {product.rating} ({product.reviews} reviews)
              </span>
            </div>

            {/* PRICE */}
            <p className="mt-4 text-3xl font-bold text-gray-900">
              {product.price} ETB
            </p>

            {/* LOCATION */}
            <p className="mt-3 flex items-center gap-2 text-sm text-gray-600">
              <span className="text-green-700">●</span>
              {product.location}
            </p>

            {/* AVAILABILITY */}
            <p className="mt-2 flex items-center gap-2 text-sm text-green-700">
              <span>✓</span>
              Available ({product.quantity})
            </p>

            {/* SELLER SUMMARY */}
            <div className="mt-5 flex items-center gap-3 border-t border-gray-200 pt-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-green-100 text-lg font-bold text-green-800">
                A
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-xs text-gray-500">
                  Seller:{" "}
                  <span className="font-semibold text-gray-800">
                    {product.seller}
                  </span>
                </p>
                <p className="mt-1 text-xs text-gray-500">
                  ★ {product.rating} · {product.sellerProducts} products
                </p>
              </div>

              <span className="shrink-0 rounded-full bg-green-50 px-2 py-1 text-[10px] font-semibold text-green-700">
                Seller
              </span>
            </div>

            {/* CONTACT BUTTONS */}
            <div className="mt-5 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={()=>navigate(`/sellerProfile/${product.id}`)}
                className="flex items-center justify-center gap-2 rounded-md bg-green-700 px-3 py-3 text-sm font-semibold text-white transition hover:bg-green-800"
              >
                <span>☎</span>
                Call Seller
              </button>

              <button
                type="button"
                onClick={handleWhatsApp}
                className="flex items-center justify-center gap-2 rounded-md bg-green-600 px-3 py-3 text-sm font-semibold text-white transition hover:bg-green-700"
              >
                <span>◉</span>
                WhatsApp
              </button>
            </div>

            <button
              type="button"
              onClick={handleWhatsApp}
              className="mt-3 w-full rounded-md border border-green-700 bg-white px-4 py-3 text-sm font-semibold text-green-800 transition hover:bg-green-50"
            >
              Contact Seller
            </button>
          </div>
        </section>

        {/* PRODUCT INFORMATION TABS */}
        <section className="mt-8 border-t border-gray-200">
          <div className="flex flex-wrap gap-6 border-b border-gray-200">
            {(
              [
                "Description",
                "Specifications",
                "Seller Info",
              ] as TabName[]
            ).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`border-b-2 px-1 py-4 text-sm font-semibold transition ${
                  activeTab === tab
                    ? "border-green-700 text-green-800"
                    : "border-transparent text-gray-500 hover:text-green-700"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="min-h-[180px] py-5 text-sm leading-7 text-gray-600">
            {activeTab === "Description" && (
              <div>
                <p>{product.description}</p>

                <ul className="mt-3 list-disc space-y-1 pl-5">
                  <li>Quantity: {product.quantity}</li>
                  <li>Type: {product.category}</li>
                  <li>Location: {product.location}</li>
                </ul>
              </div>
            )}

            {activeTab === "Specifications" && (
              <div className="max-w-xl space-y-3">
                <div className="flex justify-between gap-4 border-b border-gray-100 pb-2">
                  <span>Product name</span>
                  <span className="text-right font-medium text-gray-800">
                    {product.name}
                  </span>
                </div>
                <div className="flex justify-between gap-4 border-b border-gray-100 pb-2">
                  <span>Category</span>
                  <span className="font-medium text-gray-800">
                    {product.category}
                  </span>
                </div>
                <div className="flex justify-between gap-4 border-b border-gray-100 pb-2">
                  <span>Quantity</span>
                  <span className="font-medium text-gray-800">
                    {product.quantity}
                  </span>
                </div>
                <div className="flex justify-between gap-4 border-b border-gray-100 pb-2">
                  <span>Price</span>
                  <span className="font-medium text-gray-800">
                    {product.price} ETB
                  </span>
                </div>
                <div className="flex justify-between gap-4">
                  <span>Location</span>
                  <span className="font-medium text-gray-800">
                    {product.location}
                  </span>
                </div>
              </div>
            )}

            {activeTab === "Seller Info" && (
              <div>
                <h3 className="text-base font-semibold text-gray-800">
                  {product.seller}
                </h3>
                <p className="mt-2">
                  Location: {product.location}
                </p>
                <p>
                  Seller rating: {product.rating} / 5
                </p>
                <p>
                  Listed products: {product.sellerProducts}
                </p>
                <button
                  type="button"
                  onClick={handleWhatsApp}
                  className="mt-4 rounded-md bg-green-700 px-4 py-2 font-semibold text-white hover:bg-green-800"
                >
                  Contact Seller
                </button>
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}