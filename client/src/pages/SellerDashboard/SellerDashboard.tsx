import DashboardStats from "./DashboardStats";
import RecentProducts from "./RecentProducts";

type LoggedInUser = {
  id?: string;
  name: string;
  email: string;
  role: "buyer" | "seller" | "admin";
};

export default function SellerDashboard() {
  const storedUser = localStorage.getItem("user");

  let sellerName = "Seller";

  if (storedUser) {
    try {
      const user = JSON.parse(storedUser) as LoggedInUser;
      sellerName = user.name || "Seller";
    } catch {
      sellerName = "Seller";
    }
  }

  return (
    <div>
      <div>
        <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">
          Welcome back, {sellerName}!
        </h2>

        <p className="mt-2 text-sm text-gray-500">
          Here is what is happening with your poultry business today.
        </p>
      </div>

      {/* Summary cards */}
      <DashboardStats />

      {/* Recent products */}
      <RecentProducts />
    </div>
  );
}