import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, UserRound, Plus, ChevronRight } from "lucide-react";

import logo from "../assets/hen_logo.png";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Products", href: "/products" },
  { name: "About Us", href: "/#about" },
  { name: "Learn", href: "/#learn" },
  { name: "Health & Tips", href: "/#health" },
  { name: "Market Prices", href: "/#prices" },
  { name: "Contact", href: "/#contact" },
];

const LOGIN_ROUTE = "/login";
const POST_AD_ROUTE = "/seller/dashboard";

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("");

  const navRef = useRef<HTMLElement>(null);
  const location = useLocation();

  const closeMenu = () => setIsMenuOpen(false);

  // Scroll to the correct section after navigation.
  useEffect(() => {
    let frame = 0;

    const scrollToTarget = () => {
      cancelAnimationFrame(frame);

      frame = requestAnimationFrame(() => {
        // Normal page links, such as Home or Products.
        if (!location.hash) {
          if (location.pathname === "/") {
            window.scrollTo({ top: 0, left: 0, behavior: "auto" });
          }
          return;
        }

        // Section links only apply to the Home page.
        if (location.pathname !== "/") return;

        const id = decodeURIComponent(location.hash.slice(1));
        const element = document.getElementById(id);

        // Wait briefly for the target section to exist in the DOM.
        if (!element) return;

        const navHeight = navRef.current?.offsetHeight ?? 64;
        const top =
          element.getBoundingClientRect().top +
          window.scrollY -
          navHeight -
          8;

        window.scrollTo({
          top: Math.max(0, top),
          left: 0,
          behavior: "smooth",
        });
      });
    };

    scrollToTarget();

    return () => cancelAnimationFrame(frame);
  }, [location.pathname, location.hash, location.key]);

  // Close the mobile menu when the route changes.
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname, location.hash]);

  // Update navbar shadow when scrolling.
  useEffect(() => {
    const onScroll = () => {
      setIsScrolled(window.scrollY > 8);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Support Escape and lock background scrolling while the mobile menu is open.
  useEffect(() => {
    if (!isMenuOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeMenu();
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isMenuOpen]);

  // Track the current section for the active navigation style.
  useEffect(() => {
    if (location.pathname !== "/") {
      setActiveSection("");
      return;
    }

    let frame = 0;

    const updateActiveSection = () => {
      cancelAnimationFrame(frame);

      frame = requestAnimationFrame(() => {
        const navHeight = navRef.current?.offsetHeight ?? 64;
        const trackingLine = navHeight + 100;

        const sectionIds = navLinks
          .filter((link) => link.href.startsWith("/#"))
          .map((link) => link.href.slice(2));

        let currentSection = "";

        for (const id of sectionIds) {
          const element = document.getElementById(id);

          if (
            element &&
            element.getBoundingClientRect().top <= trackingLine
          ) {
            currentSection = id;
          }
        }

        const atBottom =
          window.innerHeight + window.scrollY >=
          document.documentElement.scrollHeight - 4;

        if (atBottom) {
          for (let i = sectionIds.length - 1; i >= 0; i--) {
            if (document.getElementById(sectionIds[i])) {
              currentSection = sectionIds[i];
              break;
            }
          }
        }

        setActiveSection(currentSection);
      });
    };

    updateActiveSection();
    window.addEventListener("scroll", updateActiveSection, {
      passive: true,
    });
    window.addEventListener("resize", updateActiveSection);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", updateActiveSection);
      window.removeEventListener("resize", updateActiveSection);
    };
  }, [location.pathname]);

  const isActive = (href: string) => {
    if (href === "/") {
      return location.pathname === "/" && !activeSection;
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
        activeSection === href.slice(2)
      );
    }

    return location.pathname === href;
  };

  return (
    <nav
      ref={navRef}
      aria-label="Main navigation"
      className={`sticky top-0 z-50 border-b bg-white/95 backdrop-blur-md transition-shadow duration-200 ${
        isScrolled
          ? "border-gray-200 shadow-md"
          : "border-transparent shadow-none"
      }`}
    >
      <div className="mx-auto w-full max-w-7xl px-3 sm:px-5 lg:px-6 xl:px-8">
        {/* Main navbar */}
        <div className="flex h-14 items-center justify-between gap-2 sm:h-16 lg:gap-3">
          {/* Logo and brand */}
          <Link
            to="/"
            aria-label="Enqulalie home"
            onClick={closeMenu}
            className="flex shrink-0 items-center gap-2 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-700"
          >
            <img
              src={logo}
              alt="Enqulalie chicken logo"
              className="h-8 w-8 shrink-0 object-contain sm:h-10 sm:w-10"
            />

            <div className="leading-none">
              <div className="text-base font-extrabold tracking-tight sm:text-lg lg:text-xl">
                <span className="text-green-800">Enqu</span>
                <span className="text-orange-500">lalie</span>
              </div>

              <p className="mt-0.5 hidden text-[10px] text-gray-500 sm:block lg:text-[11px]">
                Your Poultry Partner
              </p>
            </div>
          </Link>

          {/* Desktop navigation */}
          <div className="hidden min-w-0 flex-1 items-center justify-center lg:flex">
            <ul className="flex items-center gap-0.5 xl:gap-1">
              {navLinks.map((link) => {
                const active = isActive(link.href);

                return (
                  <li key={link.name}>
                    <Link
                      to={link.href}
                      aria-current={
                        active
                          ? link.href.startsWith("/#")
                            ? "location"
                            : "page"
                          : undefined
                      }
                      className={`relative block whitespace-nowrap rounded-lg px-1.5 py-2 text-[11px] font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-700 sm:px-2 sm:text-xs xl:px-2.5 xl:text-sm ${
                        active
                          ? "bg-green-50 text-green-800"
                          : "text-gray-600 hover:bg-gray-50 hover:text-green-800"
                      }`}
                    >
                      {link.name}

                      {active && (
                        <span
                          aria-hidden="true"
                          className="absolute inset-x-2 bottom-0 h-0.5 rounded-full bg-green-700"
                        />
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Desktop actions */}
          <div className="hidden shrink-0 items-center gap-1.5 lg:flex xl:gap-2">
            <Link
              to={LOGIN_ROUTE}
              className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-lg border border-gray-300 px-2 py-2 text-xs font-semibold text-gray-700 transition hover:border-green-700 hover:bg-green-50 hover:text-green-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-700 xl:gap-2 xl:px-3 xl:text-sm"
            >
              <UserRound size={16} />
              Login / Register
            </Link>

            <Link
              to={POST_AD_ROUTE}
              className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-lg bg-green-700 px-2 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-green-800 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-700 focus-visible:ring-offset-2 xl:gap-2 xl:px-3 xl:text-sm"
            >
              Post an Ad
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white text-green-700">
                <Plus size={14} strokeWidth={3} />
              </span>
            </Link>
          </div>

          {/* Mobile menu toggle */}
          <button
            type="button"
            aria-label={
              isMenuOpen ? "Close navigation menu" : "Open navigation menu"
            }
            aria-expanded={isMenuOpen}
            aria-controls="mobile-navigation"
            onClick={() => setIsMenuOpen((open) => !open)}
            className="rounded-lg p-2 text-gray-700 transition hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-700 lg:hidden"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile and tablet navigation */}
        {isMenuOpen && (
          <div
            id="mobile-navigation"
            className="max-h-[calc(100dvh-3.5rem)] overflow-y-auto border-t border-gray-100 pb-4 lg:hidden"
          >
            <ul className="flex flex-col gap-1 pt-3">
              {navLinks.map((link) => {
                const active = isActive(link.href);

                return (
                  <li key={link.name}>
                    <Link
                      to={link.href}
                      onClick={closeMenu}
                      aria-current={
                        active
                          ? link.href.startsWith("/#")
                            ? "location"
                            : "page"
                          : undefined
                      }
                      className={`flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-700 ${
                        active
                          ? "bg-green-50 text-green-800"
                          : "text-gray-700 hover:bg-gray-50 hover:text-green-800"
                      }`}
                    >
                      {link.name}

                      {active && (
                        <ChevronRight size={17} className="text-green-700" />
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>

            {/* Mobile actions */}
            <div className="mt-3 flex flex-col gap-2 border-t border-gray-100 pt-3">
              <Link
                to={LOGIN_ROUTE}
                onClick={closeMenu}
                className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:border-green-700 hover:bg-green-50 hover:text-green-800"
              >
                <UserRound size={18} />
                Login / Register
              </Link>

              <Link
                to={POST_AD_ROUTE}
                onClick={closeMenu}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-green-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-green-800"
              >
                Post an Ad
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white text-green-700">
                  <Plus size={14} strokeWidth={3} />
                </span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
