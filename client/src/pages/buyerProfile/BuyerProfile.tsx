
import { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  UserRound,
  ShoppingBag,
  Heart,
  Settings,
  LogOut,
  Pencil,
  Mail,
  Phone,
  MapPin,
  CalendarDays,
  ShieldCheck,
  Menu,
  X,
} from "lucide-react";

type Buyer = {
  fullName: string;
  phone: string;
  email: string;
  location: string;
  memberSince: string;
};

const defaultBuyer: Buyer = {
  fullName: "Megabi Getaneh",
  phone: "+251 91 234 5678",
  email: "megabi@example.com",
  location: "Addis Ababa",
  memberSince: "October 2026",
};

const menuItems = [
  { label: "Dashboard", to: "/buyer/dashboard", icon: LayoutDashboard },
  { label: "My Profile", to: "/buyer/profile", icon: UserRound },
  { label: "My Orders", to: "/buyer/orders", icon: ShoppingBag },
  { label: "Favorites", to: "/buyer/favorites", icon: Heart },
  { label: "Settings", to: "/buyer/settings", icon: Settings },
];

export default function BuyerProfile() {
  const navigate = useNavigate();

  const [buyer, setBuyer] = useState<Buyer>(defaultBuyer);
  const [formData, setFormData] = useState<Buyer>(defaultBuyer);
  const [isEditing, setIsEditing] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [savedMessage, setSavedMessage] = useState("");

  // Load the saved buyer information when the page opens.
  useEffect(() => {
    try {
      const savedBuyer = localStorage.getItem("ethiopoultry_buyer");

      if (savedBuyer) {
        const parsedBuyer = JSON.parse(savedBuyer) as Buyer;
        setBuyer({ ...defaultBuyer, ...parsedBuyer });
        setFormData({ ...defaultBuyer, ...parsedBuyer });
      }
    } catch {
      console.error("Could not load the saved buyer profile.");
    }
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      localStorage.setItem(
        "ethiopoultry_buyer",
        JSON.stringify(formData)
      );

      setBuyer({ ...formData });
      setIsEditing(false);
      setSavedMessage("Your profile has been saved.");

      window.setTimeout(() => setSavedMessage(""), 3000);
    } catch {
      setSavedMessage("Could not save your profile. Please try again.");
    }
  };

  const handleCancel = () => {
    setFormData({ ...buyer });
    setIsEditing(false);
  };

  const handleLogout = () => {
    navigate("/login");
  };

  const initials = buyer.fullName
    .trim()
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="min-h-screen bg-white px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Page heading */}
        <div className="mb-7 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
            Buyer Profile
          </h1>

          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-lg border border-gray-200 p-2 text-gray-700 lg:hidden"
            aria-label="Toggle buyer navigation"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Main profile container */}
        <div className="grid overflow-hidden rounded-2xl border border-gray-200 bg-white lg:grid-cols-[285px_minmax(0,1fr)]">
          {/* Sidebar */}
          <aside
            className={`border-b border-gray-200 p-5 sm:p-6 lg:border-b-0 lg:border-r ${
              mobileMenuOpen ? "block" : "hidden lg:block"
            }`}
          >
            {/* Brand */}
            <Link to="/" className="mb-9 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 text-xl">
                🐔
              </div>

              <div>
                <p className="font-bold text-green-800">
                  EthioPoultry
                </p>
                <p className="text-xs text-gray-500">
                  Poultry Marketplace
                </p>
              </div>
            </Link>

            {/* Buyer summary */}
            <div className="mb-8 text-center">
              <div className="mx-auto mb-4 flex h-22 w-22 items-center justify-center rounded-full bg-green-100 text-3xl font-bold text-green-800"
                style={{ width: 88, height: 88 }}
              >
                {initials || "B"}
              </div>

              <h2 className="font-semibold text-gray-900">
                {buyer.fullName}
              </h2>

              <p className="mt-1 break-all text-sm text-gray-500">
                {buyer.email}
              </p>
            </div>

            {/* Navigation */}
            <nav className="space-y-2" aria-label="Buyer navigation">
              {menuItems.map(({ label, to, icon: Icon }) => (
                <NavLink
                  key={to}
                  to={to}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-lg border-l-4 px-3 py-3 text-sm transition ${
                      isActive
                        ? "border-green-700 bg-green-50 font-semibold text-green-800"
                        : "border-transparent text-gray-600 hover:bg-gray-50 hover:text-green-800"
                    }`
                  }
                >
                  <Icon size={21} />
                  <span>{label}</span>
                </NavLink>
              ))}

              <button
                type="button"
                onClick={handleLogout}
                className="flex w-full items-center gap-3 rounded-lg border-l-4 border-transparent px-3 py-3 text-left text-sm text-gray-600 transition hover:bg-red-50 hover:text-red-700"
              >
                <LogOut size={21} />
                <span>Logout</span>
              </button>
            </nav>
          </aside>

          {/* Main content */}
          <main className="min-w-0 p-4 sm:p-6 lg:p-8">
            <section className="rounded-2xl border border-gray-200 p-5 sm:p-7 lg:p-8">
              {/* Section heading */}
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 pb-5">
                <h2 className="text-xl font-semibold text-slate-800">
                  Profile Information
                </h2>

                {!isEditing && (
                  <button
                    type="button"
                    onClick={() => {
                      setFormData({ ...buyer });
                      setIsEditing(true);
                      setSavedMessage("");
                    }}
                    className="inline-flex items-center gap-2 rounded-xl border border-green-200 px-5 py-2.5 text-sm font-medium text-green-800 transition hover:bg-green-50"
                  >
                    <Pencil size={17} />
                    Edit
                  </button>
                )}
              </div>

              {/* Success/error message */}
              {savedMessage && (
                <p
                  role="status"
                  className="mt-4 rounded-lg bg-green-50 px-4 py-3 text-sm text-green-800"
                >
                  {savedMessage}
                </p>
              )}

              {/* Editable form */}
              {isEditing ? (
                <form onSubmit={handleSave} className="mt-6 space-y-5">
                  <div>
                    <label
                      htmlFor="fullName"
                      className="mb-2 block text-sm font-medium text-gray-600"
                    >
                      Full Name
                    </label>
                    <input
                      id="fullName"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      required
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="phone"
                      className="mb-2 block text-sm font-medium text-gray-600"
                    >
                      Phone
                    </label>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="mb-2 block text-sm font-medium text-gray-600"
                    >
                      Email
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="location"
                      className="mb-2 block text-sm font-medium text-gray-600"
                    >
                      Location
                    </label>
                    <input
                      id="location"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      required
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
                    />
                  </div>

                  <div className="flex flex-wrap gap-3 pt-2">
                    <button
                      type="submit"
                      className="rounded-lg bg-green-700 px-6 py-3 text-sm font-semibold text-white transition hover:bg-green-800"
                    >
                      Save Changes
                    </button>

                    <button
                      type="button"
                      onClick={handleCancel}
                      className="rounded-lg border border-gray-300 px-6 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                /* Read-only profile information */
                <div className="divide-y divide-gray-100">
                  <ProfileField
                    label="Full Name"
                    value={buyer.fullName}
                  />
                  <ProfileField
                    label="Phone"
                    value={buyer.phone}
                  />
                  <ProfileField
                    label="Email"
                    value={buyer.email}
                  />
                  <ProfileField
                    label="Location"
                    value={buyer.location}
                  />
                  <ProfileField
                    label="Member Since"
                    value={buyer.memberSince}
                  />
                </div>
              )}
            </section>

            {/* Additional account information */}
            <section className="mt-6 rounded-2xl border border-gray-200 p-5 sm:p-7">
              <h2 className="mb-5 text-lg font-semibold text-slate-800">
                Account Details
              </h2>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex items-start gap-3 rounded-xl bg-gray-50 p-4">
                  <ShieldCheck className="mt-1 text-green-700" size={22} />
                  <div>
                    <p className="font-medium text-gray-800">
                      Account Type
                    </p>
                    <p className="mt-1 text-sm text-gray-500">
                      Buyer
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 rounded-xl bg-gray-50 p-4">
                  <CalendarDays className="mt-1 text-green-700" size={22} />
                  <div>
                    <p className="font-medium text-gray-800">
                      Member Since
                    </p>
                    <p className="mt-1 text-sm text-gray-500">
                      {buyer.memberSince}
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Quick contact details */}
            <section className="mt-6 rounded-2xl border border-gray-200 p-5 sm:p-7">
              <h2 className="mb-4 text-lg font-semibold text-slate-800">
                Contact Information
              </h2>

              <div className="flex flex-wrap gap-x-8 gap-y-4 text-sm text-gray-600">
                <p className="flex items-center gap-2">
                  <Phone size={17} className="text-green-700" />
                  {buyer.phone}
                </p>

                <p className="flex items-center gap-2">
                  <Mail size={17} className="text-green-700" />
                  <span className="break-all">{buyer.email}</span>
                </p>

                <p className="flex items-center gap-2">
                  <MapPin size={17} className="text-green-700" />
                  {buyer.location}
                </p>
              </div>
            </section>
          </main>
        </div>

        <footer className="py-6 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} EthioPoultry. Connecting buyers
          with poultry farmers.
        </footer>
      </div>
    </div>
  );
}

type ProfileFieldProps = {
  label: string;
  value: string;
};

function ProfileField({ label, value }: ProfileFieldProps) {
  return (
    <div className="py-5">
      <p className="mb-2 text-sm text-gray-500">{label}</p>
      <p className="break-words font-semibold text-slate-700">
        {value || "Not provided"}
      </p>
    </div>
  );
}