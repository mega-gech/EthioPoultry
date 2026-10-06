import hero from "../assets/01_hen_egg_basket.jpg";

const Hero = () => {
  return (
    <section className="relative h-[700px] overflow-hidden">
      {/* Background Image */}
      <img
        src={hero}
        alt="Hen and fresh eggs"
        className="absolute inset-0 h-full w-full object-cover object-center"
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/45"></div>

      {/* Hero Content */}
      <div className="relative z-10 mx-auto flex min-h-[650px] max-w-7xl items-center px-6 py-16 lg:px-8">
        <div className="max-w-3xl text-white">

          {/* Small Badge */}
          <div className="mb-6 inline-flex items-center rounded-full bg-white/15 px-5 py-2 backdrop-blur-sm">
            <span className="mr-2 text-lg">🐔</span>
            <span className="text-sm font-medium">
              Ethiopia's Poultry Marketplace
            </span>
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
            Connecting Ethiopian
            <span className="block text-green-300">
              Poultry Farmers & Buyers
            </span>
          </h1>

          {/* Description */}
          <p className="mt-6 max-w-2xl text-lg leading-8 text-gray-100 sm:text-xl">
            Find fresh eggs, chickens, chicks, poultry feed and more
            directly from trusted farmers and poultry sellers across
            Ethiopia.
          </p>

          {/* Search Box */}
          <div className="mt-8 rounded-2xl bg-white p-3 shadow-2xl sm:flex sm:items-center">

            {/* Product Search */}
            <div className="flex flex-1 items-center px-3 py-2">
              <svg
                className="mr-3 h-6 w-6 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-4.35-4.35m2.35-5.65a8 8 0 11-16 0 8 8 0 0116 0z"
                />
              </svg>

              <input
                type="text"
                placeholder="What are you looking for?"
                className="w-full border-none bg-transparent text-gray-700 outline-none placeholder:text-gray-400"
              />
            </div>

            {/* Divider */}
            <div className="hidden h-10 w-px bg-gray-200 sm:block"></div>

            {/* Location */}
            <div className="flex flex-1 items-center px-3 py-2">
              <svg
                className="mr-3 h-6 w-6 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 21s8-6.5 8-12a8 8 0 10-16 0c0 5.5 8 12 8 12z"
                />
                <circle cx="12" cy="9" r="2.5" />
              </svg>

              <select className="w-full bg-transparent text-gray-600 outline-none">
                <option>All Locations</option>
                <option>Addis Ababa</option>
                <option>Amhara</option>
                <option>Oromia</option>
                <option>Tigray</option>
                <option>SNNPR</option>
              </select>
            </div>

            {/* Search Button */}
            <button
              type="button"
              className="mt-2 w-full rounded-xl bg-green-600 px-7 py-3 font-semibold text-white transition hover:bg-green-700 sm:mt-0 sm:w-auto"
            >
              Search
            </button>
          </div>

          {/* Popular Searches */}
          <div className="mt-5 flex flex-wrap items-center gap-2 text-sm">
            <span className="font-medium text-white">
              Popular:
            </span>

            <button className="rounded-full bg-white/15 px-4 py-1.5 backdrop-blur-sm transition hover:bg-white/25">
              Fresh Eggs
            </button>

            <button className="rounded-full bg-white/15 px-4 py-1.5 backdrop-blur-sm transition hover:bg-white/25">
              Layer Chickens
            </button>

            <button className="rounded-full bg-white/15 px-4 py-1.5 backdrop-blur-sm transition hover:bg-white/25">
              Broiler
            </button>

            <button className="rounded-full bg-white/15 px-4 py-1.5 backdrop-blur-sm transition hover:bg-white/25">
              Chicks
            </button>

            <button className="rounded-full bg-white/15 px-4 py-1.5 backdrop-blur-sm transition hover:bg-white/25">
              Poultry Feed
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Feature Bar */}
      <div className="absolute bottom-0 left-0 right-0 z-20 bg-white/95 backdrop-blur-md">
        <div className="mx-auto grid max-w-7xl grid-cols-2 divide-x divide-gray-200 md:grid-cols-4">

          {/* Feature 1 */}
          <div className="flex items-center gap-3 px-4 py-5 sm:px-6">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-green-100 text-xl">
              ✓
            </div>

            <div>
              <h3 className="font-semibold text-gray-800">
                Trusted Sellers
              </h3>
              <p className="hidden text-sm text-gray-500 sm:block">
                Verified poultry sellers
              </p>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="flex items-center gap-3 px-4 py-5 sm:px-6">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-green-100 text-xl">
              📍
            </div>

            <div>
              <h3 className="font-semibold text-gray-800">
                Find Nearby
              </h3>
              <p className="hidden text-sm text-gray-500 sm:block">
                Products near you
              </p>
            </div>
          </div>

          {/* Feature 3 */}
          <div className="flex items-center gap-3 px-4 py-5 sm:px-6">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-orange-100 text-xl">
              📞
            </div>

            <div>
              <h3 className="font-semibold text-gray-800">
                Direct Contact
              </h3>
              <p className="hidden text-sm text-gray-500 sm:block">
                Talk directly to sellers
              </p>
            </div>
          </div>

          {/* Feature 4 */}
          <div className="flex items-center gap-3 px-4 py-5 sm:px-6">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-orange-100 text-xl">
              🐣
            </div>

            <div>
              <h3 className="font-semibold text-gray-800">
                Poultry Knowledge
              </h3>
              <p className="hidden text-sm text-gray-500 sm:block">
                Learn and grow
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Hero;