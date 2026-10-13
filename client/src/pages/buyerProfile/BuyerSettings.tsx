
import { useState } from "react";

export default function BuyerSettings() {
  const [name, setName] = useState("Abebe Kebede");
  const [email, setEmail] = useState("abebe@example.com");
  const [phone, setPhone] = useState("0912345678");
  const [location, setLocation] = useState("Addis Ababa");

  const [notifications, setNotifications] = useState({
    orders: true,
    promotions: false,
    marketPrices: true,
  });

  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Temporary: later, save these settings to the backend.
    alert("Settings saved successfully!");
  };

  const handleNotificationChange = (
    key: keyof typeof notifications
  ) => {
    setNotifications((previous) => ({
      ...previous,
      [key]: !previous[key],
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-4xl">
        {/* Page heading */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            Account Settings
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Manage your personal information and notification preferences.
          </p>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          {/* Account information */}
          <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm sm:p-7">
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900">
                Personal Information
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Update the information associated with your buyer account.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Preferred Location
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  required
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
                />
              </div>
            </div>
          </section>

          {/* Notifications */}
          <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm sm:p-7">
            <div className="mb-5">
              <h2 className="text-lg font-semibold text-gray-900">
                Notification Preferences
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Choose which updates you want to receive.
              </p>
            </div>

            <div className="divide-y divide-gray-100">
              <NotificationOption
                title="Order Updates"
                description="Receive updates about your purchases and deliveries."
                checked={notifications.orders}
                onChange={() => handleNotificationChange("orders")}
              />

              <NotificationOption
                title="Promotions and Offers"
                description="Hear about special offers from poultry sellers."
                checked={notifications.promotions}
                onChange={() => handleNotificationChange("promotions")}
              />

              <NotificationOption
                title="Market Price Alerts"
                description="Receive updates about poultry and egg prices."
                checked={notifications.marketPrices}
                onChange={() => handleNotificationChange("marketPrices")}
              />
            </div>
          </section>

          {/* Security */}
          <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm sm:p-7">
            <h2 className="text-lg font-semibold text-gray-900">
              Security
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              Keep your account secure by changing your password regularly.
            </p>

            <button
              type="button"
              onClick={() =>
                alert("Password change will be connected to authentication.")
              }
              className="mt-5 rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:border-green-600 hover:text-green-700"
            >
              Change Password
            </button>
          </section>

          {/* Save button */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="rounded-lg bg-green-700 px-6 py-3 text-sm font-semibold text-white transition hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

type NotificationOptionProps = {
  title: string;
  description: string;
  checked: boolean;
  onChange: () => void;
};

function NotificationOption({
  title,
  description,
  checked,
  onChange,
}: NotificationOptionProps) {
  return (
    <div className="flex items-center justify-between gap-4 py-5">
      <div>
        <h3 className="text-sm font-medium text-gray-900">
          {title}
        </h3>
        <p className="mt-1 text-sm leading-5 text-gray-500">
          {description}
        </p>
      </div>

      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={title}
        onClick={onChange}
        className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${
          checked ? "bg-green-600" : "bg-gray-300"
        }`}
      >
        <span
          className={`inline-block h-4 w-4 rounded-full bg-white shadow transition-transform ${
            checked ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </button>
    </div>
  );
}
