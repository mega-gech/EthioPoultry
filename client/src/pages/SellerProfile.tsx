
import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  MapPin,
  BadgeCheck,
  Phone,
  MessageCircle,
  CalendarDays,
  Package,
  Star,
  ArrowLeft,
} from "lucide-react";

import eggTray from "../assets/02_egg_tray.jpg";
import brownHen from "../assets/03_brown_hen.jpg";
import whiteHens from "../assets/04_white_hens.jpg";
import stackedEggTrays from "../assets/05_stacked_egg_trays.jpg";
import eggBasket from "../assets/06_egg_basket.jpg";

// Adjust this import path to the location of your existing products file.
type Product = {
  id: number;
  sellerId:number;
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
    sellerId:1234,
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
    sellerId:1236,
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
    sellerId:1237,
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
    sellerId:1239,
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




export default function SellerProfile() {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("About");

  // Convert the URL ID from a string into a number.
  const sellerId = Number(id);

  // Find all products belonging to this seller.
  const sellerProducts = products.filter(
    (product) => product.sellerId === sellerId
  );

  // Get the farm name from its existing product data.
  const farmName = sellerProducts[0]?.seller;

  // Handle invalid IDs and sellers without products.
  if (!id || !Number.isInteger(sellerId) || !farmName) {
    return (
      <main className="min-h-screen bg-gray-50 px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-gray-900">
          Seller Not Found
        </h1>
        <p className="mt-2 text-gray-600">
          We couldn't find this farm or its products.
        </p>
        <Link
          to="/products"
          className="mt-5 inline-flex items-center gap-2 rounded-lg bg-green-700 px-5 py-3 text-white hover:bg-green-800"
        >
          <ArrowLeft size={18} />
          Browse Products
        </Link>
      </main>
    );
  }

  const tabs = ["About", "Products", "Reviews"];

  return (
    <main className="min-h-screen bg-gray-50 pb-12">
      <div className="mx-auto max-w-7xl px-4 pt-5 sm:px-6 lg:px-8">

        {/* Farm cover banner */}
        <div className="relative h-48 overflow-hidden rounded-xl sm:h-64 lg:h-72">
          <img
            src={sellerProducts[0].image}
            alt={`${farmName} farm cover`}
            className="h-full w-full object-cover"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

          <div className="absolute bottom-5 left-5 text-white sm:bottom-8 sm:left-8">
            <p className="mb-2 text-sm font-medium">
              Welcome to
            </p>
            <h1 className="text-2xl font-bold sm:text-3xl">
              {farmName}
            </h1>
            <p className="mt-2 flex items-center gap-2 text-sm">
              <MapPin size={16} />
              {sellerProducts[0].location}
            </p>
          </div>
        </div>

        {/* Farm identity and contact information */}
        <section className="relative -mt-6 mx-2 rounded-xl border border-gray-100 bg-white p-5 shadow-sm sm:mx-5 sm:p-6">
          <div className="flex flex-col gap-5 md:flex-row md:items-center">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full border-4 border-white bg-green-50 text-4xl shadow">
              🐔
            </div>

            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-xl font-bold text-gray-900">
                  {farmName}
                </h2>

                <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-800">
                  <BadgeCheck size={15} />
                  Verified Seller
                </span>
              </div>

              <p className="mt-2 flex items-center gap-2 text-sm text-gray-500">
                <MapPin size={16} />
                {sellerProducts[0].location}, Ethiopia
              </p>

              <p className="mt-2 text-sm text-gray-600">
                Fresh eggs and healthy poultry products
                from a local poultry farm.
              </p>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row md:flex-col lg:flex-row">
              <a
                href="tel:+251912345678"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-green-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-green-800"
              >
                <Phone size={17} />
                Call Seller
              </a>

              <a
                href="https://wa.me/251912345678"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-green-700 px-5 py-3 text-sm font-semibold text-green-800 transition hover:bg-green-50"
              >
                <MessageCircle size={17} />
                WhatsApp
              </a>
            </div>
          </div>
        </section>

        {/* Farm statistics */}
        <section className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-4">
          <div className="rounded-xl border border-gray-100 bg-white p-4">
            <CalendarDays className="text-green-700" size={22} />
            <p className="mt-3 text-sm text-gray-500">
              Established
            </p>
            <p className="mt-1 font-semibold text-gray-900">
              2018
            </p>
          </div>

          <div className="rounded-xl border border-gray-100 bg-white p-4">
            <Package className="text-green-700" size={22} />
            <p className="mt-3 text-sm text-gray-500">
              Products
            </p>
            <p className="mt-1 font-semibold text-gray-900">
              {sellerProducts.length}
            </p>
          </div>

          <div className="rounded-xl border border-gray-100 bg-white p-4">
            <BadgeCheck className="text-green-700" size={22} />
            <p className="mt-3 text-sm text-gray-500">
              Seller Status
            </p>
            <p className="mt-1 font-semibold text-green-700">
              Verified
            </p>
          </div>

          <div className="rounded-xl border border-gray-100 bg-white p-4">
            <Star className="text-yellow-500" size={22} />
            <p className="mt-3 text-sm text-gray-500">
              Average Rating
            </p>
            <p className="mt-1 font-semibold text-gray-900">
              4.8 / 5
            </p>
          </div>
        </section>

        {/* Profile tabs */}
        <section className="mt-6 overflow-hidden rounded-xl border border-gray-100 bg-white">
          <div className="flex gap-7 border-b border-gray-200 px-5 sm:px-7">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`border-b-2 py-4 text-sm font-medium transition ${
                  activeTab === tab
                    ? "border-green-700 text-green-800"
                    : "border-transparent text-gray-500 hover:text-green-700"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="p-5 sm:p-7">
            {/* About tab */}
            {activeTab === "About" && (
              <div>
                <h3 className="text-lg font-bold text-gray-900">
                  About Our Farm
                </h3>
                <p className="mt-3 max-w-3xl text-sm leading-7 text-gray-600">
                  We are a poultry farm offering fresh eggs
                  and healthy chickens for households,
                  retailers, and poultry businesses. Our goal
                  is to provide quality poultry products and
                  reliable service to our customers.
                </p>

                <h4 className="mt-6 font-semibold text-gray-900">
                  Products we offer
                </h4>
                <p className="mt-2 text-sm text-gray-600">
                  Eggs, layer chickens, and other poultry
                  products as available.
                </p>
              </div>
            )}

            {/* Products tab */}
            {activeTab === "Products" && (
              <div>
                <h3 className="mb-5 text-lg font-bold text-gray-900">
                  Products from {farmName}
                </h3>

                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                  {sellerProducts.map((product) => (
                    <Link
                      key={product.id}
                      to={`/products/${product.id}`}
                      className="group overflow-hidden rounded-xl border border-gray-100 bg-white transition hover:-translate-y-1 hover:shadow-md"
                    >
                      <img
                        src={product.image}
                        alt={product.name}
                        className="h-36 w-full object-cover sm:h-44"
                      />

                      <div className="p-3">
                        <h4 className="line-clamp-2 text-sm font-semibold text-gray-900 group-hover:text-green-700">
                          {product.name}
                        </h4>

                        <p className="mt-2 font-bold text-green-700">
                          {product.price.toLocaleString()} ETB
                        </p>

                        <p className="mt-1 text-xs text-gray-500">
                          {product.quantity}
                        </p>

                        <span className="mt-3 inline-block rounded-md bg-green-700 px-3 py-2 text-xs font-medium text-white">
                          View Details
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Reviews tab */}
            {activeTab === "Reviews" && (
              <div>
                <h3 className="text-lg font-bold text-gray-900">
                  Customer Reviews
                </h3>

                <div className="mt-4 flex items-center gap-3">
                  <Star className="fill-yellow-400 text-yellow-400" size={28} />
                  <div>
                    <p className="font-bold text-gray-900">
                      4.8 out of 5
                    </p>
                    <p className="text-sm text-gray-500">
                      Based on sample product ratings
                    </p>
                  </div>
                </div>

                <p className="mt-5 text-sm text-gray-600">
                  Customer reviews will be displayed here
                  when review data is available.
                </p>
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}