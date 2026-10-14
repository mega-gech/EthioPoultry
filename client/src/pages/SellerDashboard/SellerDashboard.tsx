
import {
  LayoutDashboard,
  Package,
  PlusCircle,
  MessageSquare,
  ShoppingBag,
  UserRound,
  Settings,
  LogOut,
  Egg,
  Menu,
  Bell,
} from "lucide-react";

const navigation = [
  { name: "Dashboard", icon: LayoutDashboard, href: "/seller/dashboard" },
  { name: "My Products", icon: Package, href: "/seller/products" },
  { name: "Add Product", icon: PlusCircle, href: "/seller/products/add" },
  { name: "Messages", icon: MessageSquare, href: "/seller/messages" },
  { name: "Orders", icon: ShoppingBag, href: "/seller/orders" },
  { name: "Profile", icon: UserRound, href: "/seller/profile" },
  { name: "Settings", icon: Settings, href: "/seller/settings" },
];

export default function SellerDashboard() {
  return (
    <div className="min-h-screen bg-gray-50 md:flex">
      {/* Sidebar */}
      <aside className="flex w-full flex-col bg-emerald-950 text-white md:min-h-screen md:w-60 md:shrink-0">
        {/* Logo */}
        <div className="flex items-center gap-3 border-b border-white/10 px-5 py-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-700">
            <Egg size={24} />
          </div>

          <div>
            <h1 className="text-lg font-bold">EthioPoultry</h1>
            <p className="text-xs text-emerald-200">
              Seller Center
            </p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 px-3 py-5">
          <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-emerald-300">
            Menu
          </p>

          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = item.name === "Dashboard";

            return (
              <a
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 rounded-lg px-3 py-3 text-sm transition ${
                  isActive
                    ? "bg-emerald-700 font-semibold text-white"
                    : "text-emerald-100 hover:bg-emerald-900"
                }`}
              >
                <Icon size={19} />
                <span>{item.name}</span>
              </a>
            );
          })}

          {/* Logout */}
          <div className="pt-5">
            <button
              type="button"
              onClick={() => {
                localStorage.removeItem("token");
                window.location.href = "/login";
              }}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-sm text-red-200 transition hover:bg-red-500/10 hover:text-red-100"
            >
              <LogOut size={19} />
              <span>Logout</span>
            </button>
          </div>
        </nav>

        <div className="border-t border-white/10 px-5 py-4">
          <p className="text-xs text-emerald-300">
            Growing together with Ethiopian farmers
          </p>
        </div>
      </aside>

      {/* Main content */}
      <main className="min-w-0 flex-1">
        {/* Topbar */}
        <header className="flex h-[72px] items-center justify-between border-b border-gray-200 bg-white px-5 md:px-8">
          <div>
            <p className="text-sm text-gray-500">
              Seller Workspace
            </p>
            <h2 className="text-lg font-semibold text-gray-900">
              Dashboard
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <button
              type="button"
              aria-label="Notifications"
              className="rounded-full p-2 text-gray-600 hover:bg-gray-100"
            >
              <Bell size={20} />
            </button>

            <div className="flex items-center gap-3 border-l border-gray-200 pl-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 font-bold text-emerald-800">
                A
              </div>

              <div className="hidden sm:block">
                <p className="text-sm font-semibold text-gray-900">
                  Abebe
                </p>
                <p className="text-xs text-gray-500">
                  Seller Account
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard content placeholder */}
        <section className="p-5 md:p-8">
          <h2 className="text-2xl font-bold text-gray-900">
            Welcome back, Abebe!
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            Here is what is happening with your poultry business today.
          </p>

          <div className="mt-8 rounded-xl border border-dashed border-gray-300 bg-white p-10 text-center">
            <LayoutDashboard
              size={40}
              className="mx-auto text-emerald-700"
            />

            <h3 className="mt-4 font-semibold text-gray-800">
              Your dashboard starts here
            </h3>

            <p className="mt-2 text-sm text-gray-500">
              Next, we will add the summary cards and recent products.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
