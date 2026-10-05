import { Phone, Mail, Globe } from "lucide-react";
import {
  FaFacebookF,
  FaTelegramPlane,
  FaWhatsapp,
} from "react-icons/fa";

function Topbar() {
  return (
    <div className="bg-green-950 text-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2 sm:px-6 lg:px-8">

        {/* ================= LEFT SIDE ================= */}
        <div className="flex items-center gap-4 text-sm">

          {/* Phone */}
          <a
            href="tel:+251912345678"
            className="flex items-center gap-2 transition hover:text-green-300"
          >
            <Phone size={15} />

            <span className="hidden sm:inline">
              +251 912 345 678
            </span>
          </a>

          {/* Email */}
          <a
            href="mailto:info@henethio.com"
            className="hidden items-center gap-2 transition hover:text-green-300 md:flex"
          >
            <Mail size={15} />

            <span>
              info@henethio.com
            </span>
          </a>

        </div>


        {/* ================= RIGHT SIDE ================= */}
        <div className="flex items-center gap-3 text-sm">

          {/* Language */}
          <button
            type="button"
            className="flex items-center gap-1 transition hover:text-green-300"
          >
            <Globe size={15} />

            <span className="hidden sm:inline">
              አማርኛ
            </span>
          </button>

          {/* Divider */}
          <span className="hidden h-4 w-px bg-white/30 sm:block"></span>

          {/* English */}
          <button
            type="button"
            className="hidden transition hover:text-green-300 sm:block"
          >
            English
          </button>

          {/* Divider */}
          <span className="hidden h-4 w-px bg-white/30 sm:block"></span>


          {/* ================= SOCIAL ICONS ================= */}

          {/* Facebook */}
          <a
            href="#"
            aria-label="Facebook"
            className="flex h-7 w-7 items-center justify-center rounded-full transition hover:bg-white/10 hover:text-green-300"
          >
            <FaFacebookF size={14} />
          </a>

          {/* Telegram */}
          <a
            href="#"
            aria-label="Telegram"
            className="flex h-7 w-7 items-center justify-center rounded-full transition hover:bg-white/10 hover:text-green-300"
          >
            <FaTelegramPlane size={15} />
          </a>

          {/* WhatsApp */}
          <a
            href="#"
            aria-label="WhatsApp"
            className="flex h-7 w-7 items-center justify-center rounded-full transition hover:bg-white/10 hover:text-green-300"
          >
            <FaWhatsapp size={16} />
          </a>

        </div>

      </div>
    </div>
  );
}

export default Topbar;