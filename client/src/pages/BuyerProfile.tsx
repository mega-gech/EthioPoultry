
import { useState } from "react";
import {
  LayoutDashboard,
  UserRound,
  ShoppingBag,
  Heart,
  Settings,
  LogOut,
  Pencil,
} from "lucide-react";

function BuyerProfile() {
  const [isEditing, setIsEditing] = useState(false);

  const [buyer, setBuyer] = useState({
    name: "Megabi Getaneh",
    email: "megabi@example.com",
    phone: "+251 91 234 5678",
    location: "Addis Ababa",
    memberSince: "April 2026",
  });

  const menuItems = [
    { label: "Dashboard", icon: LayoutDashboard },
    { label: "My Profile", icon: UserRound },
    { label: "My Orders", icon: ShoppingBag },
    { label: "Favorites", icon: Heart },
    { label: "Settings", icon: Settings },
    { label: "Logout", icon: LogOut },
  ];

  return (
    <div className="min-h-screen bg-white px-4 py-6 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <h1 className="mb-6 text-2xl font-bold text-gray-900">
          Buyer Profile
        </h1>

        <div className="grid min-h-[650px] grid-cols-1 overflow-hidden rounded-xl border border-gray-200 md:grid-cols-[260px_1fr]">

          {/* Left Sidebar */}
          <aside className="border-b border-gray-200 bg-white p-5 md:border-b-0 md:border-r">
            {/* Logo */}
            <div className="mb-8 flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-green-100">
                <span className="text-xl">🐔</span>
              </div>

              <div>
                <h2 className="font-bold text-green-800">
                  EthioPoultry
                </h2>
                <p className="text-xs text-gray-500">
                  Poultry Marketplace
                </p>
              </div>
            </div>

            {/* Buyer information */}
            <div className="mb-7 flex flex-col items-center text-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-2xl font-bold text-green-800">
                {buyer.name.charAt(0)}
              </div>

              <h3 className="mt-3 font-semibold text-gray-900">
                {buyer.name}
              </h3>

              <p className="mt-1 break-all text-xs text-gray-500">
                {buyer.email}
              </p>
            </div>

            {/* Sidebar navigation */}
            <nav className="space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = item.label === "My Profile";

                return (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => {
                      if (item.label === "Logout") {
                        alert("Logout functionality will be added later.");
                      } else if (!isActive) {
                        alert(`${item.label} page will be added later.`);
                      }
                    }}
                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left text-sm transition ${
                      isActive
                        ? "border-l-4 border-green-700 bg-green-50 font-semibold text-green-800"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <Icon size={19} />
                    {item.label}
                  </button>
                );
              })}
            </nav>
          </aside>

          {/* Right Profile Information */}
          <main className="bg-white p-5 sm:p-8">
            <div className="rounded-xl border border-gray-200 p-5 sm:p-7">
              <div className="flex items-center justify-between border-b border-gray-100 pb-5">
                <h2 className="text-lg font-semibold text-gray-900">
                  Profile Information
                </h2>

                <button
                  type="button"
                  onClick={() => setIsEditing(!isEditing)}
                  className="flex items-center gap-2 rounded-lg border border-green-200 px-4 py-2 text-sm font-medium text-green-800 transition hover:bg-green-50"
                >
                  <Pencil size={15} />
                  {isEditing ? "Cancel" : "Edit"}
                </button>
              </div>

              <div className="space-y-6 py-6">
                {/* Full Name */}
                <div>
                  <p className="text-sm text-gray-500">Full Name</p>
                  {isEditing ? (
                    <input
                      value={buyer.name}
                      onChange={(e) =>
                        setBuyer({ ...buyer, name: e.target.value })
                      }
                      className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-green-600"
                    />
                  ) : (
                    <p className="mt-2 font-medium text-gray-800">
                      {buyer.name}
                    </p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  {isEditing ? (
                    <input
                      value={buyer.phone}
                      onChange={(e) =>
                        setBuyer({ ...buyer, phone: e.target.value })
                      }
                      className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-green-600"
                    />
                  ) : (
                    <p className="mt-2 font-medium text-gray-800">
                      {buyer.phone}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  {isEditing ? (
                    <input
                      type="email"
                      value={buyer.email}
                      onChange={(e) =>
                        setBuyer({ ...buyer, email: e.target.value })
                      }
                      className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-green-600"
                    />
                  ) : (
                    <p className="mt-2 break-words font-medium text-gray-800">
                      {buyer.email}
                    </p>
                  )}
                </div>

                {/* Location */}
                <div>
                  <p className="text-sm text-gray-500">Location</p>
                  {isEditing ? (
                    <input
                      value={buyer.location}
                      onChange={(e) =>
                        setBuyer({ ...buyer, location: e.target.value })
                      }
                      className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-green-600"
                    />
                  ) : (
                    <p className="mt-2 font-medium text-gray-800">
                      {buyer.location}
                    </p>
                  )}
                </div>

                {/* Membership */}
                <div>
                  <p className="text-sm text-gray-500">Member Since</p>
                  <p className="mt-2 font-medium text-gray-800">
                    {buyer.memberSince}
                  </p>
                </div>

                {isEditing && (
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="rounded-lg bg-green-700 px-5 py-3 font-medium text-white hover:bg-green-800"
                  >
                    Save Changes
                  </button>
                )}
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

export default BuyerProfile;