import { Link, NavLink } from "react-router-dom";
import {
  Egg,
  LogOut,
  X,
  type LucideIcon,
} from "lucide-react";

export type DashboardMenuItem = {
  label: string;
  to: string;
  icon: LucideIcon;
};

type SidebarProps = {
  role: "buyer" | "seller";
  menuItems: DashboardMenuItem[];
  userName: string;
  userEmail?: string;
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
};


export default function Sidebar({
  role,
  menuItems,
  userName,
  userEmail,
  isOpen,
  onClose,
  onLogout,
}: SidebarProps) {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <button
          type="button"
          aria-label="Close navigation menu"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col
          bg-emerald-950 text-white transition-transform duration-300
          md:static md:min-h-screen md:w-60 md:shrink-0 md:translate-x-0
          ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-5">
          <Link to="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-700">
              <Egg size={24} />
            </div>

            <div>
              <h1 className="text-lg font-bold">Enqulale</h1>
              <p className="text-xs text-emerald-200">
                {role === "buyer" ? "Buyer Center" : "Seller Center"}
              </p>
            </div>
          </Link>

          <button
            type="button"
            aria-label="Close menu"
            onClick={onClose}
            className="rounded-lg p-2 hover:bg-emerald-900 md:hidden"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-5">
          <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-emerald-300">
            Menu
          </p>

          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.to}
                to={item.to}
                end
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-3 py-3 text-sm transition ${
                    isActive
                      ? "bg-emerald-700 font-semibold text-white"
                      : "text-emerald-100 hover:bg-emerald-900"
                  }`
                }
              >
                <Icon size={19} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}

          <div className="pt-5">
            <button
              type="button"
              onClick={onLogout}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-sm text-red-200 transition hover:bg-red-500/10"
            >
              <LogOut size={19} />
              <span>Logout</span>
            </button>
          </div>
        </nav>

        {/* User information */}
        <div className="border-t border-white/10 px-5 py-4">
          <div className="mb-3 flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-700 font-bold">
              {userName.charAt(0).toUpperCase()}
            </div>

            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">{userName}</p>

              {userEmail && (
                <p className="truncate text-xs text-emerald-200">
                  {userEmail}
                </p>
              )}
            </div>
          </div>

          <p className="text-xs text-emerald-300">
            Growing together with Ethiopian farmers
          </p>
        </div>
      </aside>
    </>
  );
}