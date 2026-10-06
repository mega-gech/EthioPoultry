import hero from "../assets/01_hen_egg_basket.jpg";

const Hero = () => {
  return (
    <section className="relative overflow-hidden">
      {/* Hero Background Image */}
      <div className="relative h-[320px] w-full sm:h-[350px] lg:h-[380px]">
        <img
          src={hero}
          alt="Hen and eggs"
          className="absolute inset-0 h-full w-full object-cover object-center"
        />

        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/35"></div>

        {/* Hero Content */}
        <div className="relative z-10 mx-auto flex h-full max-w-7xl items-center px-5 sm:px-8 lg:px-10">
          <div className="max-w-xl text-white">

            {/* Heading */}
            <h1 className="text-3xl font-bold leading-tight sm:text-4xl lg:text-[42px]">
              Find Fresh Poultry
              <br />
              Products Easily!
            </h1>

            {/* Description */}
            <p className="mt-3 max-w-md text-sm leading-5 text-white/90 sm:text-base">
              Connect directly with farmers and suppliers
              <br className="hidden sm:block" />
              and get quality poultry products.
            </p>

            {/* Search Box */}
            <div className="mt-5 flex max-w-[570px] flex-col gap-2 rounded-lg bg-white p-2 shadow-lg sm:flex-row">

              {/* Product Search */}
              <div className="flex flex-1 items-center rounded-md border border-gray-200 bg-white px-3">
                <svg
                  className="mr-2 h-5 w-5 shrink-0 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m21 21-4.35-4.35m2.35-5.65a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z"
                  />
                </svg>

                <input
                  type="text"
                  placeholder="What are you looking for?"
                  className="w-full bg-transparent py-2 text-sm text-gray-700 outline-none placeholder:text-gray-400"
                />
              </div>

              {/* Location */}
              <div className="flex items-center rounded-md border border-gray-200 bg-white px-3 sm:w-40">
                <svg
                  className="mr-2 h-5 w-5 shrink-0 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 21s7-5.5 7-12a7 7 0 1 0-14 0c0 6.5 7 12 7 12Z"
                  />
                  <circle
                    cx="12"
                    cy="9"
                    r="2.5"
                    strokeWidth="2"
                  />
                </svg>

                <select className="w-full bg-transparent py-2 text-sm text-gray-600 outline-none">
                  <option>Location</option>
                  <option>Addis Ababa</option>
                  <option>Amhara</option>
                  <option>Oromia</option>
                  <option>Tigray</option>
                </select>
              </div>

              {/* Search Button */}
              <button
                type="button"
                className="rounded-md bg-green-600 px-6 py-2 text-sm font-semibold text-white transition hover:bg-green-700"
              >
                Search
              </button>
            </div>

            {/* Popular Searches */}
            <div className="mt-4 flex flex-wrap items-center gap-2 text-xs sm:text-sm">
              <span className="font-medium text-white">
                Popular:
              </span>

              <button className="rounded-full bg-white/20 px-3 py-1 backdrop-blur-sm transition hover:bg-white/30">
                Eggs
              </button>

              <button className="rounded-full bg-white/20 px-3 py-1 backdrop-blur-sm transition hover:bg-white/30">
                Chickens
              </button>

              <button className="rounded-full bg-white/20 px-3 py-1 backdrop-blur-sm transition hover:bg-white/30">
                Layers
              </button>

              <button className="rounded-full bg-white/20 px-3 py-1 backdrop-blur-sm transition hover:bg-white/30">
                Broilers
              </button>

              <button className="rounded-full bg-white/20 px-3 py-1 backdrop-blur-sm transition hover:bg-white/30">
                Chicks
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;