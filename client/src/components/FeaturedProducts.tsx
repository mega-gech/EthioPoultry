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
  },
  {
    id: 2,
    image: brownHen,
    name: "Brown Layer Chicken",
    location: "Addis Ababa",
    price: "850 ETB",
  },
  {
    id: 3,
    image: whiteHens,
    name: "White Layer Chicken",
    location: "Addis Ababa",
    price: "900 ETB",
  },
  {
    id: 4,
    image: stackedEggTrays,
    name: "Eggs (60 pcs)",
    location: "Addis Ababa",
    price: "480 ETB",
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
    <section className="bg-white py-6">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* HEADER */}
        <div className="mb-4 flex items-center gap-4">
          <h2 className="text-xl font-bold text-gray-800 sm:text-2xl">
            Featured Products
          </h2>

          <button className="text-xs font-semibold text-green-600 hover:text-green-700 sm:text-sm">
            View All →
          </button>
        </div>

        {/* MAIN LAYOUT */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_300px]">

          {/* =========================================
              LEFT SIDE
          ========================================== */}
          <div>

            {/* PRODUCTS */}
            <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">

              {products.map((product) => (
                <div
                  key={product.id}
                  className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm"
                >

                  {/* IMAGE */}
                  <div className="h-28 overflow-hidden bg-gray-100 sm:h-32">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  {/* CONTENT */}
                  <div className="p-2.5">

                    <h3 className="truncate text-xs font-semibold text-gray-800 sm:text-sm">
                      {product.name}
                    </h3>

                    <p className="mt-1 text-[10px] text-gray-500 sm:text-xs">
                      📍 {product.location}
                    </p>

                    <p className="mt-2 text-sm font-bold text-green-600 sm:text-base">
                      {product.price}
                    </p>

                    {/* BUTTONS */}
                    <div className="mt-2 flex gap-1.5">

                      <button className="flex-1 rounded-md bg-green-600 px-1 py-1.5 text-[9px] font-semibold text-white hover:bg-green-700 sm:text-[10px]">
                        WhatsApp
                      </button>

                      <button className="flex-1 rounded-md border border-gray-200 bg-white px-1 py-1.5 text-[9px] font-semibold text-green-700 hover:bg-green-50 sm:text-[10px]">
                        View Details
                      </button>

                    </div>
                  </div>
                </div>
              ))}

            </div>

            {/* =========================================
                STATISTICS
            ========================================== */}
            <div className="mt-12 rounded-lg border border-green-100 bg-green-50/40 px-3 py-4">

              <div className="grid grid-cols-2 sm:grid-cols-4">

                {statistics.map((stat, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-center gap-2 border-gray-200 py-2 sm:border-r last:border-r-0"
                  >

                    <div className="text-lg text-green-600">
                      {stat.icon}
                    </div>

                    <div>
                      <p className="text-xs font-bold text-green-600 sm:text-sm">
                        {stat.number}
                      </p>

                      <p className="text-[8px] text-gray-500 sm:text-[9px]">
                        {stat.label}
                      </p>
                    </div>

                  </div>
                ))}

              </div>
            </div>

          </div>

          {/* =========================================
              RIGHT PROMOTIONS
          ========================================== */}
          <div className="flex flex-col gap-3">

            {/* SELL PRODUCTS */}
            <div className="relative h-[135px] overflow-hidden rounded-lg bg-green-50">

              <div className="relative z-10 flex h-full w-[64%] flex-col justify-center p-3.5">

                <p className="text-[9px] font-semibold uppercase text-green-700">
                  For Farmers & Sellers
                </p>

                <h3 className="mt-1 text-base font-bold leading-tight text-gray-800">
                  Want to Sell Your Products?
                </h3>

                <p className="mt-1 text-[9px] leading-relaxed text-gray-500">
                  Reach more customers across Ethiopia.
                </p>

                <button className="mt-2.5 w-fit rounded-md bg-green-600 px-3 py-1.5 text-[9px] font-bold text-white hover:bg-green-700">
                  Start Selling +
                </button>

              </div>

              <div className="absolute right-0 top-0 h-full w-[40%]">
                <img
                  src={eggBasket}
                  alt="Sell products"
                  className="h-full w-full object-cover"
                />
              </div>

            </div>

            {/* FARMING GUIDE */}
            <div className="relative h-[135px] overflow-hidden rounded-lg bg-amber-50">

              <div className="relative z-10 flex h-full w-[62%] flex-col justify-center p-3.5">

                <p className="text-[9px] font-semibold uppercase text-amber-700">
                  Learn
                </p>

                <h3 className="mt-1 text-base font-bold leading-tight text-gray-800">
                  Poultry Farming Guide
                </h3>

                <p className="mt-1 text-[9px] leading-relaxed text-gray-500">
                  Learn about poultry farming and care.
                </p>

                <button className="mt-2.5 w-fit rounded-md border border-amber-300 bg-white px-2.5 py-1.5 text-[9px] font-semibold text-gray-700">
                  Read Guide →
                </button>

              </div>

              <div className="absolute right-2 top-2 h-[115px] w-[36%] overflow-hidden rounded-md">
                <img
                  src={farmBrochure}
                  alt="Poultry farming guide"
                  className="h-full w-full object-cover"
                />
              </div>

            </div>

            {/* POULTRY HEALTH */}
            <div className="relative h-[135px] overflow-hidden rounded-lg bg-blue-50">

              <div className="relative z-10 flex h-full w-[63%] flex-col justify-center p-3.5">

                <p className="text-[9px] font-semibold uppercase text-blue-600">
                  Health
                </p>

                <h3 className="mt-1 text-base font-bold leading-tight text-gray-800">
                  Poultry Health
                </h3>

                <p className="mt-1 text-[9px] leading-relaxed text-gray-500">
                  Learn about common diseases and care.
                </p>

                <button className="mt-2.5 w-fit rounded-md border border-blue-300 bg-white px-2.5 py-1.5 text-[9px] font-semibold text-blue-600">
                  Health Guide →
                </button>

              </div>

              <div className="absolute right-2 top-2 h-[120px] w-[35%]">
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