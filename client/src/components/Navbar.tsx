
import { useEffect, useState } from "react";
import type { MouseEvent } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Menu,
  X,
  UserRound,
  Plus,
  ChevronRight,
} from "lucide-react";

import logo from "../assets/hen_logo.png";

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Products", href: "/products" },
    { name: "About Us", href: "/#about" },
    { name: "Learn", href: "/#learn" },
    { name: "Health & Tips", href: "/#health" },
    { name: "Market Prices", href: "/#prices" },
    { name: "Contact", href: "/#contact" },
  ];

  // Close the mobile menu whenever the route changes.
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname, location.hash]);

  // Scroll after the Home page and its sections have rendered.
  useEffect(() => {
    if (location.pathname !== "/") return;

    const frame = window.requestAnimationFrame(() => {
      if (location.hash) {
        const sectionId = location.hash.slice(1);
        const element = document.getElementById(sectionId);

        element?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      } else {
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      }
    });

    return () => window.cancelAnimationFrame(frame);
  }, [location.pathname, location.hash]);

  // Handle desktop and mobile navigation consistently.
  const handleNavClick = (
    e: MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    e.preventDefault();
    setIsMenuOpen(false);
    navigate(href);
  };

  // Determine which link should appear active.
  const isActive = (href: string) => {
    if (href === "/") {
      return (
        location.pathname === "/" &&
        !location.hash
      );
    }

    if (href === "/products") {
      return (
        location.pathname === "/products" ||
        location.pathname.startsWith("/product/")
      );
    }

    if (href.startsWith("/#")) {
      return (
        location.pathname === "/" &&
        location.hash === href.slice(1)
      );
    }

    return location.pathname === href;
  };

  // Shared login navigation for both layouts.
  const handleLogin = () => {
    setIsMenuOpen(false);
    navigate("/login");
  };

  // Temporary destination until the create-listing route is ready.
  const handlePostAd = () => {
    setIsMenuOpen(false);
    navigate("/seller/products/add");
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 shadow-sm backdrop-blur-md">
     <div className="mx-auto w-full max-w-7xl px-3 sm:px-5 lg:px-6 xl:px-8">

        {/* Main navbar */}
        <div className="flex min-h-[68px] items-center justify-between gap-2 sm:min-h-[72px] lg:gap-3">

          {/* Brand / Logo */}
          <a
            href="/"
            onClick={(e) => handleNavClick(e, "/")}
            aria-label="Enqulalie home"
            className="flex shrink-0 items-center gap-2"
          >
            <img
              src={logo}
              alt="Enqulalie chicken logo"
              className="h-10 w-10 shrink-0 object-contain sm:h-12 sm:w-12 lg:h-14 lg:w-14"
            />

            <div className="leading-tight">
              <div className="text-lg font-extrabold tracking-tight sm:text-xl lg:text-2xl">
                <span className="text-green-800">Enqu</span>
                <span className="text-orange-500">lalie</span>
              </div>

               <p className="mt-1 text-[9px] text-gray-500 sm:text-[10px] lg:text-xs">
                Your Poultry Partner
              </p>
            </div>
          </a>

          {/* Desktop navigation */}
          <div className="hidden flex-1 items-center justify-center lg:flex">
            <div className="flex items-center gap-1 xl:gap-2">
              {navLinks.map((link) => {
                const active = isActive(link.href);

                return (
                  <a
                    key={link.name}
                    href={link.href}
                    onClick={(e) =>
                      handleNavClick(e, link.href)
                    }
                    aria-current={active ? "page" : undefined}
                    className={`relative whitespace-nowrap rounded-lg px-2 py-3 text-[13px] font-semibold transition-colors xl:px-2.5 xl:text-sm ${
                      active
                        ? "bg-green-50 text-green-800"
                        : "text-gray-600 hover:bg-gray-50 hover:text-green-800"
                    }`}
                  >
                    {link.name}

                    {active && (
                      <span className="absolute inset-x-2 -bottom-1 h-[3px] rounded-full bg-green-700" />
                    )}
                  </a>
                );
              })}
            </div>
          </div>

          {/* Desktop actions */}
          <div className="hidden shrink-0 items-center gap-2 xl:gap-3 lg:flex">

            <button
              type="button"
              onClick={handleLogin}
              className="inline-flex items-center gap-2 whitespace-nowrap rounded-lg border border-gray-300 px-3 py-2.5 text-sm font-semibold text-gray-700 transition hover:border-green-700 hover:bg-green-50 hover:text-green-800 xl:px-4"
            >
              <UserRound size={17} />
              Login / Register
            </button>

            <button
              type="button"
              onClick={handlePostAd}
              className="inline-flex items-center gap-2 whitespace-nowrap rounded-lg bg-green-700 px-3 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-green-800 hover:shadow-md xl:px-4"
            >
              Post an Ad

              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white text-green-700">
                <Plus size={14} strokeWidth={3} />
              </span>
            </button>
          </div>

          {/* Mobile menu toggle */}
          <button
            type="button"
            aria-label={
              isMenuOpen
                ? "Close navigation menu"
                : "Open navigation menu"
            }
            aria-expanded={isMenuOpen}
            aria-controls="mobile-navigation"
            onClick={() => setIsMenuOpen((open) => !open)}
            className="rounded-lg p-2 text-gray-700 transition hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-green-700 lg:hidden"
          >
            {isMenuOpen ? (
              <X size={26} />
            ) : (
              <Menu size={26} />
            )}
          </button>
        </div>

        {/* Mobile navigation */}
        {isMenuOpen && (
          <div
            id="mobile-navigation"
            className="border-t border-gray-100 pb-5 lg:hidden"
          >
            <div className="flex flex-col gap-1 pt-3">
              {navLinks.map((link) => {
                const active = isActive(link.href);

                return (
                  <a
                    key={link.name}
                    href={link.href}
                    onClick={(e) =>
                      handleNavClick(e, link.href)
                    }
                    aria-current={active ? "page" : undefined}
                    className={`flex items-center justify-between rounded-lg px-3 py-3 text-sm font-semibold transition ${
                      active
                        ? "bg-green-50 text-green-800"
                        : "text-gray-700 hover:bg-gray-50 hover:text-green-800"
                    }`}
                  >
                    {link.name}

                    {active && (
                      <ChevronRight
                        size={17}
                        className="text-green-700"
                      />
                    )}
                  </a>
                );
              })}
            </div>

            {/* Mobile actions */}
            <div className="mt-4 flex flex-col gap-3 border-t border-gray-100 pt-4">
              <button
                type="button"
                onClick={handleLogin}
                className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 px-4 py-3 text-sm font-semibold text-gray-700 transition hover:border-green-700 hover:bg-green-50 hover:text-green-800"
              >
                <UserRound size={18} />
                Login / Register
              </button>

              <button
                type="button"
                onClick={handlePostAd}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-green-700 px-4 py-3 text-sm font-semibold text-white transition hover:bg-green-800"
              >
                Post an Ad

                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white text-green-700">
                  <Plus size={14} strokeWidth={3} />
                </span>
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
