import { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import logo from "../assets/hen_logo.png";
import {
  Menu,
  X,
  UserRound,
  Plus,
} from "lucide-react";


function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Products", href: "/products" },
    { name: "About Us", href: "/#about" },
    { name: "Learn", href: "/#learn" },
    { name: "Health & Tips", href: "/#health" },
    { name: "Market Prices", href: "/#prices" },
    { name: "Contact", href: "/#contact" },
  ];

  const handleNavClick = (
  e: React.MouseEvent<HTMLAnchorElement>,
  href: string
) => {
  e.preventDefault();
  setIsMenuOpen(false)

  if (href === "/") { navigate("/"); 
     window.scrollTo({
       top: 0,
       behavior: "smooth", }); 
       return; }

  if (!href.startsWith("/#")) 
    { navigate(href); 
      return; }
}






  return (
    <nav className="border-b border-gray-200 bg-white shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* ================================================= */}
        {/* DESKTOP / MAIN NAVBAR */}
        {/* ================================================= */}

        <div className="flex h-15 items-center justify-between">

          {/* ================= LOGO ================= */}

          <a
            href="#"
            className="flex items-center "
           >

            {/*Ethiopoltry Logo */}
            <div className="flex h-14 w-14 items-center justify-center">
            <img
            src={logo}
            alt="Ethiohen - Your Poultry Partner"
            className="h-[65px] w-auto object-contain"
            />
            </div>

            {/* Logo Text */}
            <div className="leading-tight">

              <div className="text-[16px] font-bold tracking-tight sm:text-3xl">
                <span className="text-green-800">
                  Ethio
                </span>

                <span className="text-orange-500">
                  Poultry
                </span>
              </div>

              <p className="text-xs text-gray-600 sm:text-sm">
                Your Poultry Partner
              </p>

            </div>

          </a>


          {/* ================= DESKTOP NAVIGATION ================= */}

          <div className="hidden items-center lg:flex">

            <div className="flex items-center gap-4">

              {navLinks.map((link, index) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className={`relative py-7 text-sm font-medium transition ${
                    index === 0
                      ? "text-green-800"
                      : "text-gray-800 hover:text-green-700"
                  }`}
                >

                  {link.name}

                  {/* Active Home underline */}
                  {index === 0 && (
                    <span className="absolute bottom-0 left-0 h-[3px] w-full rounded-full bg-green-800" />
                  )}

                </a>
              ))}

            </div>

          </div>


          {/* ================= DESKTOP ACTIONS ================= */}

          <div className="hidden items-center gap-3 lg:flex">

            {/* Login */}
            <button
              type="button"
              className="flex items-center gap-2 whitespace-nowrap rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-800 transition hover:border-green-700 hover:text-green-700"
            >
              <UserRound size={18} />

              <span>
                Login / Register
              </span>
            </button>


            {/* Post an Ad */}
            <button
              type="button"
              className="flex items-center gap-2 whitespace-nowrap rounded-lg bg-green-700 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-green-800"
            >
              <span>
                Post an Ad
              </span>

              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white text-green-700">
                <Plus size={14} strokeWidth={3} />
              </span>

            </button>

          </div>


          {/* ================= MOBILE MENU BUTTON ================= */}

          <button
            type="button"
            aria-label={
              isMenuOpen
                ? "Close navigation menu"
                : "Open navigation menu"
            }
            aria-expanded={isMenuOpen}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="rounded-lg p-2 text-gray-700 transition hover:bg-gray-100 lg:hidden"
          >

            {isMenuOpen ? (
              <X size={28} />
            ) : (
              <Menu size={28} />
            )}

          </button>

        </div>


        {/* ================================================= */}
        {/* MOBILE MENU */}
        {/* ================================================= */}

        {isMenuOpen && (
          <div className="border-t border-gray-100 pb-5 lg:hidden">

            {/* Navigation links */}
            <div className="flex flex-col pt-3">

              {navLinks.map((link, index) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`border-b border-gray-100 px-2 py-3.5 text-sm font-medium transition ${
                    index === 0
                      ? "text-green-800"
                      : "text-gray-700 hover:bg-gray-50 hover:text-green-700"
                  }`}
                >
                  {link.name}
                </a>
              ))}

            </div>


            {/* Mobile actions */}
            <div className="mt-4 flex flex-col gap-3">

              {/* Login */}
              <button
                type="button"
                className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 px-4 py-3 text-sm font-medium text-gray-800 transition hover:border-green-700 hover:text-green-700"
              >
                <UserRound size={18} />

                <span>
                  Login / Register
                </span>
              </button>


              {/* Post an Ad */}
              <button
                type="button"
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-green-700 px-4 py-3 text-sm font-semibold text-white transition hover:bg-green-800"
              >

                <span>
                  Post an Ad
                </span>

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