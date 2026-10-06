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
    seller: "Abebe Poultry Farm",
  },
  {
    id: 2,
    image: brownHen,
    name: "Brown Layer Chicken",
    location: "Addis Ababa",
    price: "850 ETB",
    seller: "Gojjam Poultry Farm",
  },
  {
    id: 3,
    image: whiteHens,
    name: "White Layer Chicken",
    location: "Addis Ababa",
    price: "900 ETB",
    seller: "Ethio Chicken Farm",
  },
  {
    id: 4,
    image: stackedEggTrays,
    name: "Eggs (60 pcs)",
    location: "Addis Ababa",
    price: "480 ETB",
    seller: "Gojjam Egg Farm",
  },
];

const statistics = [
  {
    icon: "♙",
    number: "12,450+",
    label: "Registered Farmers",
  },
  {
    icon: "♧",
    number: "8,750+",
    label: "Available Products",
  },
  {
    icon: "♡",
    number: "25,300+",
    label: "Successful Connections",
  },
  {
    icon: "⌖",
    number: "120+",
    label: "Covered Locations",
  },
];

function FeaturedProducts() {
  return (
    <section className="bg-white py-7">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* =====================================================
            HEADER
        ====================================================== */}
        <div className="mb-4 flex items-center gap-4">
          <h2 className="text-xl font-bold text-gray-800 sm:text-2xl">
            Featured Products
          </h2>

          <button className="text-sm font-semibold text-green-600 transition hover:text-green-700">
            View All →
          </button>
        </div>

        {/* =====================================================
            MAIN GRID
            LEFT  = PRODUCTS + STATISTICS
            RIGHT = PROMOTIONAL CARDS
        ====================================================== */}
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1fr)_295px]">

          {/* =================================================
              LEFT SIDE
          ================================================== */}
          <div>

            {/* PRODUCT CARDS */}
            <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">

              {products.map((product) => (
                <div
                  key={product.id}
                  className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition hover:shadow-md"
                >

                  {/* Product Image */}
                  <div className="h-40 overflow-hidden bg-gray-100 sm:h-44">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  {/* Product Details */}
                  <div className="p-3">

                    {/* Name */}
                    <h3 className="truncate text-sm font-semibold text-gray-800">
                      {product.name}
                    </h3>

                    {/* Location */}
                    <p className="mt-1 flex items-center gap-1 text-xs text-gray-500">
                      <span className="text-green-600">📍</span>
                      {product.location}
                    </p>

                    {/* Price */}
                    <p className="mt-2 text-lg font-bold text-green-600">
                      {product.price}
                    </p>

                    {/* Buttons */}
                    <div className="mt-2 flex gap-2">

                      <button className="flex-1 rounded-md bg-green-600 px-2 py-2 text-xs font-semibold text-white transition hover:bg-green-700">
                        WhatsApp
                      </button>

                      <button className="flex-1 rounded-md border border-gray-200 bg-white px-2 py-2 text-xs font-semibold text-green-700 transition hover:bg-green-50">
                        View Details
                      </button>

                    </div>
                  </div>
                </div>
              ))}

            </div>

            {/* =================================================
                STATISTICS BAR
            ================================================== */}
            <div className="mt-5 rounded-lg border border-green-100 bg-green-50/40 px-4 py-5">

              <div className="grid grid-cols-2 gap-y-5 sm:grid-cols-4">

                {statistics.map((stat, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-center gap-2 border-gray-200 sm:border-r last:border-r-0"
                  >

                    {/* Icon */}
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xl text-green-600">
                      {stat.icon}
                    </div>

                    {/* Text */}
                    <div>
                      <p className="text-sm font-bold text-green-600 sm:text-base">
                        {stat.number}
                      </p>

                      <p className="text-[9px] text-gray-500 sm:text-[10px]">
                        {stat.label}
                      </p>
                    </div>

                  </div>
                ))}

              </div>
            </div>

          </div>

          {/* =================================================
              RIGHT SIDE PROMOTIONS
          ================================================== */}
          <div className="flex flex-col gap-3">

            {/* =================================================
                SELL YOUR PRODUCTS
            ================================================== */}
            <div className="relative h-[150px] overflow-hidden rounded-lg bg-green-50">

              {/* Text */}
              <div className="relative z-10 flex h-full w-[65%] flex-col justify-center p-4">

                <p className="text-[10px] font-semibold uppercase tracking-wide text-green-700">
                  For Farmers & Sellers
                </p>

                <h3 className="mt-1 text-lg font-bold leading-tight text-gray-800">
                  Want to Sell Your Products?
                </h3>

                <p className="mt-1 text-[10px] text-gray-500">
                  Reach more customers across Ethiopia.
                </p>

                <button className="mt-3 w-fit rounded-md bg-green-600 px-3 py-2 text-[10px] font-bold text-white transition hover:bg-green-700">
                  Start Selling +
                </button>

              </div>

              {/* Image */}
              <div className="absolute right-0 top-0 h-full w-[38%]">
                <img
                  src={eggBasket}
                  alt="Sell your products"
                  className="h-full w-full object-cover"
                />
              </div>

            </div>

            {/* =================================================
                POULTRY FARMING GUIDE
            ================================================== */}
            <div className="relative h-[145px] overflow-hidden rounded-lg bg-amber-50">

              {/* Text */}
              <div className="relative z-10 flex h-full w-[63%] flex-col justify-center p-4">

                <p className="text-[10px] font-semibold uppercase tracking-wide text-amber-700">
                  Learn
                </p>

                <h3 className="mt-1 text-base font-bold leading-tight text-gray-800">
                  Poultry Farming Guide
                </h3>

                <p className="mt-1 text-[10px] leading-relaxed text-gray-500">
                  Learn about poultry farming and care.
                </p>

                <button className="mt-3 w-fit rounded-md border border-amber-300 bg-white px-3 py-1.5 text-[10px] font-semibold text-gray-700">
                  Read Guide →
                </button>

              </div>

              {/* Image */}
              <div className="absolute right-2 top-3 h-[120px] w-[35%] overflow-hidden rounded-md rotate-2">
                <img
                  src={farmBrochure}
                  alt="Poultry farming guide"
                  className="h-full w-full object-cover"
                />
              </div>

            </div>

            {/* =================================================
                POULTRY HEALTH
            ================================================== */}
            <div className="relative h-[145px] overflow-hidden rounded-lg bg-blue-50">

              {/* Text */}
              <div className="relative z-10 flex h-full w-[65%] flex-col justify-center p-4">

                <p className="text-[10px] font-semibold uppercase tracking-wide text-blue-600">
                  Health
                </p>

                <h3 className="mt-1 text-base font-bold leading-tight text-gray-800">
                  Poultry Health
                </h3>

                <p className="mt-1 text-[10px] leading-relaxed text-gray-500">
                  Learn about common diseases and care.
                </p>

                <button className="mt-3 w-fit rounded-md border border-blue-300 bg-white px-3 py-1.5 text-[10px] font-semibold text-blue-600">
                  Health Guide →
                </button>

              </div>

              {/* Image */}
              <div className="absolute right-2 top-1 h-[140px] w-[34%]">
                <img
                  src={veterinaryKit}
                  alt="Poultry health"
                  className="h-full w-full object-contain"
                />
              </div>

            </div>

          </div>
        </div>
      </div>
    </section>
  );
}

export default FeaturedProducts;