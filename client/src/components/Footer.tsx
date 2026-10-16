
import { Link } from "react-router-dom";

const marketplaceLinks = [
  { label: "Browse Products", to: "/products" },
  { label: "Find Farmers", to: "/products" },
  { label: "Find Sellers", to: "/products" },
  { label: "Post a Product", to: "/seller/dashboard" },
  { label: "Poultry Categories", to: "/products" },
];

const informationLinks = [
  { label: "About Us", to: "/#about" },
  { label: "Poultry Farming Guide", to: "/#learn" },
  { label: "Poultry Health", to: "/#health" },
  { label: "Contact Us", to: "/#contact" },
];

const socialLinks = [
  {
    label: "Facebook",
    symbol: "f",
    url: "https://www.facebook.com/",
  },
  {
    label: "Instagram",
    symbol: "◎",
    url: "https://www.instagram.com/",
  },
  {
    label: "Telegram",
    symbol: "✈",
    url: "https://telegram.org/",
  },
];

const Footer = () => {
  return (
    <footer
      id="contact"
      className="bg-green-950 text-white"
    >
      {/* Main footer */}
      <div className="mx-auto max-w-7xl px-5 py-10 sm:px-6 sm:py-12 lg:px-8">

        <div className="grid grid-cols-1 gap-9 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">

          {/* Brand */}
          <div>
            <Link
              to="/"
              aria-label="EthioPoultry home"
              className="inline-flex items-center gap-3 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-300"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-2xl shadow-sm">
                🐔
              </span>

              <span>
                <span className="block text-lg font-bold tracking-tight">
                  Enqulalie
                </span>

                <span className="block text-[11px] text-green-200">
                  Ethiopia's Poultry Marketplace
                </span>
              </span>
            </Link>

            <p className="mt-4 max-w-xs text-sm leading-6 text-green-100/90">
              Connecting poultry farmers, buyers, and sellers
              across Ethiopia. Find quality poultry products
              and connect directly with suppliers.
            </p>

            {/* Social links: replace these URLs with your
                actual business profiles before deployment. */}
            <div className="mt-5 flex items-center gap-2">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Visit ${social.label}`}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/5 text-sm font-semibold text-white transition-colors hover:border-green-300 hover:bg-white hover:text-green-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-300"
                >
                  {social.symbol}
                </a>
              ))}
            </div>
          </div>

          {/* Marketplace navigation */}
          <div>
            <h2 className="text-sm font-bold tracking-wide">
              Marketplace
            </h2>

            <ul className="mt-4 space-y-3">
              {marketplaceLinks.map((item) => (
                <li key={item.label}>
                  <Link
                    to={item.to}
                    className="inline-block text-sm text-green-100/85 transition-colors hover:translate-x-0.5 hover:text-white focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-300"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Information navigation */}
          <div>
            <h2 className="text-sm font-bold tracking-wide">
              Information
            </h2>

            <ul className="mt-4 space-y-3">
              {informationLinks.map((item) => (
                <li key={item.label}>
                  <Link
                    to={item.to}
                    className="inline-block text-sm text-green-100/85 transition-colors hover:translate-x-0.5 hover:text-white focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-300"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}

              <li>
                <a
                  href="mailto:info@ethiopoultry.com?subject=EthioPoultry%20Help"
                  className="inline-block text-sm text-green-100/85 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-300"
                >
                  Help Center
                </a>
              </li>
            </ul>
          </div>

          {/* Contact information */}
          <div>
            <h2 className="text-sm font-bold tracking-wide">
              Contact Us
            </h2>

            <div className="mt-4 space-y-4">

              {/* Location */}
              <div className="flex items-start gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/10 text-green-200">
                  <svg
                    aria-hidden="true"
                    className="h-4 w-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z"
                    />
                    <circle cx="12" cy="10" r="2.5" />
                  </svg>
                </span>

                <div>
                  <h3 className="text-xs font-semibold text-white">
                    Location
                  </h3>
                  <p className="mt-1 text-sm leading-5 text-green-100/85">
                    Addis Ababa, Ethiopia
                  </p>
                </div>
              </div>

              {/* Phone: replace with your real number */}
              <div className="flex items-start gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/10 text-green-200">
                  <svg
                    aria-hidden="true"
                    className="h-4 w-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.12 4.2 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.96.35 1.9.69 2.8a2 2 0 0 1-.45 2.11L8.08 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.84.57 2.8.69A2 2 0 0 1 22 16.92Z"
                    />
                  </svg>
                </span>

                <div>
                  <h3 className="text-xs font-semibold text-white">
                    Phone
                  </h3>
                  <a
                    href="tel:+251900000000"
                    className="mt-1 inline-block text-sm text-green-100/85 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-300"
                  >
                    +251 9XX XXX XXX
                  </a>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/10 text-green-200">
                  <svg
                    aria-hidden="true"
                    className="h-4 w-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  >
                    <rect x="3" y="5" width="18" height="14" rx="2" />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m3 7 9 6 9-6"
                    />
                  </svg>
                </span>

                <div>
                  <h3 className="text-xs font-semibold text-white">
                    Email
                  </h3>
                  <a
                    href="mailto:info@ethiopoultry.com"
                    className="mt-1 break-all text-sm text-green-100/85 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-300"
                  >
                    info@ethiopoultry.com
                  </a>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10 bg-black/15">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-5 py-4 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">

          <p className="text-xs leading-5 text-green-100/75">
            © {new Date().getFullYear()} EthioPoultry. All rights reserved.
          </p>

          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <Link
              to="/privacy"
              className="text-xs text-green-100/75 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-300"
            >
              Privacy Policy
            </Link>

            <Link
              to="/terms"
              className="text-xs text-green-100/75 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-300"
            >
              Terms of Service
            </Link>

            <Link
              to="/"
              className="inline-flex items-center gap-1 text-xs text-green-100/75 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-300"
            >
              Back to top
              <span aria-hidden="true">↑</span>
            </Link>
          </div>

        </div>
      </div>
    </footer>
  );
};

export default Footer;
