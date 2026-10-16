
import { Phone, Mail, Globe } from "lucide-react";
import {
  FaFacebookF,
  FaTelegramPlane,
  FaWhatsapp,
} from "react-icons/fa";

function Topbar() {
  return (
    <div className="bg-green-950 text-white">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-3 px-3 py-2 sm:px-5 lg:px-6 xl:px-8">

        {/* LEFT SIDE: Contact information */}
        <div className="flex min-w-0 items-center gap-2 sm:gap-4">

          {/* Phone */}
          <a
            href="tel:+251912345678"
            aria-label="Call Enqulalie"
            className="flex shrink-0 items-center gap-1.5 whitespace-nowrap transition hover:text-green-300 sm:gap-2"
          >
            <Phone size={15} className="shrink-0" />

            <span className="text-xs sm:text-sm">
              +251 912 345 678
            </span>
          </a>

          {/* Email: hidden on small screens */}
          <a
            href="mailto:info@enqulalie.com"
            className="hidden min-w-0 items-center gap-2 transition hover:text-green-300 md:flex"
          >
            <Mail size={15} className="shrink-0" />

            <span className="truncate text-sm">
              info@henethio.com
            </span>
          </a>
        </div>

        {/* RIGHT SIDE: Language and social links */}
        <div className="flex shrink-0 items-center gap-1.5 text-sm sm:gap-2.5">

          {/* Language controls */}
          <div className="flex shrink-0 items-center gap-1">
            <Globe size={15} className="shrink-0" />

            <button
              type="button"
              aria-label="Select Amharic language"
              className="whitespace-nowrap rounded px-1 py-1 text-xs transition hover:text-green-300 sm:text-sm"
            >
              አማርኛ
            </button>

            <span
              aria-hidden="true"
              className="mx-0.5 h-4 w-px bg-white/30"
            />

            <button
              type="button"
              aria-label="Select English language"
              className="whitespace-nowrap rounded px-1 py-1 text-xs transition hover:text-green-300 sm:text-sm"
            >
              English
            </button>
          </div>

          {/* Divider */}
          <span
            aria-hidden="true"
            className="hidden h-4 w-px bg-white/30 sm:block"
          />

          {/* Social media */}
          <div className="flex shrink-0 items-center gap-0.5 sm:gap-1">

            {/* Facebook */}
            <a
              href="#"
              aria-label="Facebook"
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition hover:bg-white/10 hover:text-green-300"
            >
              <FaFacebookF size={14} />
            </a>

            {/* Telegram */}
            <a
              href="#"
              aria-label="Telegram"
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition hover:bg-white/10 hover:text-green-300"
            >
              <FaTelegramPlane size={15} />
            </a>

            {/* WhatsApp */}
            <a
              href="#"
              aria-label="WhatsApp"
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition hover:bg-white/10 hover:text-green-300"
            >
              <FaWhatsapp size={16} />
            </a>

          </div>
        </div>
      </div>
    </div>
  );
}

export default Topbar;
