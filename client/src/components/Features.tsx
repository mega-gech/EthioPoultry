const Features = () => {
  return (
    <section className="border-b border-gray-200 bg-white">
      <div className="mx-auto grid max-w-7xl grid-cols-2 md:grid-cols-4">

        {/* Trusted Sellers */}
        <div className="flex items-center gap-3 border-b border-gray-200 px-4 py-4 md:border-b-0 md:border-r md:px-6">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-100">
            <svg
              className="h-5 w-5 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12l2 2 4-4"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 3l7 4v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V7l7-4z"
              />
            </svg>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-800">
              Trusted Sellers
            </h3>

            <p className="mt-0.5 text-xs text-gray-500">
              Verified poultry sellers
            </p>
          </div>
        </div>

        {/* Location Based */}
        <div className="flex items-center gap-3 border-b border-gray-200 px-4 py-4 md:border-b-0 md:border-r md:px-6">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-100">
            <svg
              className="h-5 w-5 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 21s7-5.5 7-12a7 7 0 1 0-14 0c0 6.5 7 12 7 12z"
              />

              <circle
                cx="12"
                cy="9"
                r="2.5"
                strokeWidth="2"
              />
            </svg>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-800">
              Location Based
            </h3>

            <p className="mt-0.5 text-xs text-gray-500">
              Find products near you
            </p>
          </div>
        </div>

        {/* Direct Contact */}
        <div className="flex items-center gap-3 px-4 py-4 md:border-r md:border-gray-200 md:px-6">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-orange-100">
            <svg
              className="h-5 w-5 text-orange-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M22 16.92v3a2 2 0 01-2.18 2 19.8 19.8 0 01-8.63-3.07 19.5 19.5 0 01-6-6A19.8 19.8 0 012.12 4.18 2 2 0 014.11 2h3a2 2 0 012 1.72c.12.9.33 1.78.62 2.63a2 2 0 01-.45 2.11L8 9.73a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.85.29 1.73.5 2.63.62A2 2 0 0122 16.92z"
              />
            </svg>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-800">
              Direct Contact
            </h3>

            <p className="mt-0.5 text-xs text-gray-500">
              Talk directly to sellers
            </p>
          </div>
        </div>

        {/* Poultry Knowledge */}
        <div className="flex items-center gap-3 px-4 py-4 md:px-6">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-orange-100">
            <svg
              className="h-5 w-5 text-orange-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 18h.01M8.2 9a4 4 0 117.6 0c0 1.5-.7 2.3-1.7 3.1-.8.6-1.3 1.2-1.3 2.4h-1.6c0-1.2-.5-1.8-1.3-2.4C8.9 11.3 8.2 10.5 8.2 9z"
              />

              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 21h6"
              />
            </svg>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-800">
              Poultry Knowledge
            </h3>

            <p className="mt-0.5 text-xs text-gray-500">
              Learn and grow
            </p>
          </div>
        </div>

      </div>
    </section>
  );
};

export default Features;