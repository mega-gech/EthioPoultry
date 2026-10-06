function Footer() {
  return (
    <footer className="bg-green-800 text-white">

      {/* =====================================================
          MAIN FOOTER
      ====================================================== */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">

          {/* =================================================
              BRAND
          ================================================== */}
          <div>

            {/* Logo */}
            <div className="flex items-center gap-2.5">

              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white shadow-sm">
                <span className="text-xl">🐔</span>
              </div>

              <div>
                <h2 className="text-lg font-bold text-white">
                  EthioPoultry
                </h2>

                <p className="text-[10px] text-green-100">
                  Ethiopia's Poultry Marketplace
                </p>
              </div>

            </div>

            {/* Description */}
            <p className="mt-4 max-w-xs text-sm leading-6 text-green-100">
              Connect with poultry farmers, buyers, and sellers
              across Ethiopia. Find fresh poultry products easily.
            </p>

            {/* Social Icons */}
            <div className="mt-4 flex items-center gap-2">

              <button
                aria-label="Facebook"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-sm font-bold text-white transition hover:bg-white hover:text-green-700"
              >
                f
              </button>

              <button
                aria-label="Telegram"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-xs font-bold text-white transition hover:bg-white hover:text-green-700"
              >
                ✈
              </button>

              <button
                aria-label="Instagram"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-sm text-white transition hover:bg-white hover:text-green-700"
              >
                ◎
              </button>

              <button
                aria-label="WhatsApp"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-sm font-bold text-white transition hover:bg-white hover:text-green-700"
              >
                ☎
              </button>

            </div>

          </div>

          {/* =================================================
              MARKETPLACE
          ================================================== */}
          <div>

            <h3 className="text-sm font-bold text-white">
              Marketplace
            </h3>

            <ul className="mt-4 space-y-2.5">

              <li>
                <button className="text-sm text-green-100 transition hover:text-white">
                  Browse Products
                </button>
              </li>

              <li>
                <button className="text-sm text-green-100 transition hover:text-white">
                  Find Farmers
                </button>
              </li>

              <li>
                <button className="text-sm text-green-100 transition hover:text-white">
                  Find Sellers
                </button>
              </li>

              <li>
                <button className="text-sm text-green-100 transition hover:text-white">
                  Post a Product
                </button>
              </li>

              <li>
                <button className="text-sm text-green-100 transition hover:text-white">
                  Poultry Categories
                </button>
              </li>

            </ul>

          </div>

          {/* =================================================
              INFORMATION
          ================================================== */}
          <div>

            <h3 className="text-sm font-bold text-white">
              Information
            </h3>

            <ul className="mt-4 space-y-2.5">

              <li>
                <button className="text-sm text-green-100 transition hover:text-white">
                  About Us
                </button>
              </li>

              <li>
                <button className="text-sm text-green-100 transition hover:text-white">
                  Poultry Farming Guide
                </button>
              </li>

              <li>
                <button className="text-sm text-green-100 transition hover:text-white">
                  Poultry Health
                </button>
              </li>

              <li>
                <button className="text-sm text-green-100 transition hover:text-white">
                  Contact Us
                </button>
              </li>

              <li>
                <button className="text-sm text-green-100 transition hover:text-white">
                  Help Center
                </button>
              </li>

            </ul>

          </div>

          {/* =================================================
              CONTACT
          ================================================== */}
          <div>

            <h3 className="text-sm font-bold text-white">
              Contact Us
            </h3>

            <div className="mt-4 space-y-3.5">

              {/* Location */}
              <div className="flex items-start gap-3">

                <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/10 text-white">

                  <svg
                    className="h-3.5 w-3.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 11a3 3 0 100-6 3 3 0 000 6z"
                    />

                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1114 0z"
                    />
                  </svg>

                </div>

                <div>
                  <p className="text-xs font-semibold text-white">
                    Location
                  </p>

                  <p className="mt-0.5 text-sm text-green-100">
                    Addis Ababa, Ethiopia
                  </p>
                </div>

              </div>

              {/* Phone */}
              <div className="flex items-start gap-3">

                <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/10 text-white">

                  <svg
                    className="h-3.5 w-3.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 5a2 2 0 012-2h3.28a2 2 0 011.94 1.515l.6 2.4a2 2 0 01-.45 1.85L9.12 10.12a16 16 0 004.76 4.76l1.36-1.25a2 2 0 011.85-.45l2.4.6A2 2 0 0121 15.72V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>

                </div>

                <div>
                  <p className="text-xs font-semibold text-white">
                    Phone
                  </p>

                  <p className="mt-0.5 text-sm text-green-100">
                    +251 9XX XXX XXX
                  </p>
                </div>

              </div>

              {/* Email */}
              <div className="flex items-start gap-3">

                <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/10 text-white">

                  <svg
                    className="h-3.5 w-3.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 7l9 6 9-6"
                    />

                    <rect
                      x="3"
                      y="5"
                      width="18"
                      height="14"
                      rx="2"
                      strokeWidth="2"
                    />
                  </svg>

                </div>

                <div>
                  <p className="text-xs font-semibold text-white">
                    Email
                  </p>

                  <p className="mt-0.5 text-sm text-green-100">
                    info@ethiopoultry.com
                  </p>
                </div>

              </div>

            </div>

          </div>

        </div>
      </div>

      {/* =====================================================
          BOTTOM BAR
      ====================================================== */}
      <div className="border-t border-white/10 bg-green-900">

        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-3 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">

          <p className="text-[11px] text-green-100">
            © 2026 EthioPoultry. All rights reserved.
          </p>

          <div className="flex items-center gap-4">

            <button className="text-[11px] text-green-100 transition hover:text-white">
              Privacy Policy
            </button>

            <button className="text-[11px] text-green-100 transition hover:text-white">
              Terms of Service
            </button>

          </div>

        </div>

      </div>

    </footer>
  );
}

export default Footer;