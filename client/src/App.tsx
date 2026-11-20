import {
  LayoutDashboard,
  ShoppingBag,
  Heart,
  Settings,
  Package,
  PlusCircle,
  CreditCard,
  Tag,
} from "lucide-react";

import DashboardLayout from "./layout/DashboardLayout";
import type { DashboardMenuItem } from "./components/dashboard/Sidebar";
import { useAuth } from "./context/AuthContext";

import { Routes, Route } from 'react-router-dom';
import Home from "./pages/Home";
import Products from './pages/Products';
import ProductDetails from './pages/ProductDetails';
import Login from './pages/Login'
import Register from './pages/Register'
import BuyerDashboard from './pages/buyerProfile/BuyerDashboard';
import BuyerOrders from './pages/buyerProfile/BuyerOrders';
import BuyerFavorites from './pages/buyerProfile/BuyerFavorites';
import BuyerSettings from './pages/buyerProfile/BuyerSettings';
import SellerDashboard from "./pages/SellerDashboard/SellerDashboard";
import SellerProducts from './pages/SellerDashboard/SellerProducts';
import AddProduct from './pages/SellerDashboard/AddProduct';
import EditProduct from './pages/SellerDashboard/EditProduct';
import ProtectedRoute from './components/ProtectedRoute';
import HealthTips from "./pages/HealthTips";
import MarketPrice from "./pages/MarketPrice"
import GoogleCallback from "./components/GoogleCallback"
import BuyerPayments from "./pages/buyerProfile/BuyerPayments";
import PaymentReturn from "./pages/PaymentReturn"
import AdminLayout from "./layout/AdminLayout";
import AdminOverview from "./pages/Admin/AdminOverview";
import {
  AdminOrders,
  AdminProducts,
  AdminSellers,
  AdminUsers,
} from "./pages/Admin/AdminManagement";
import AdminMarketPrices from "./pages/Admin/AdminMarketPrices";
import AdminReports from "./pages/Admin/AdminReports";
import AdminSettings from "./pages/Admin/AdminSettings";
import SubmitMarketPrice from "./pages/SellerDashboard/SubmitMarketPrice";

const buyerMenuItems: DashboardMenuItem[] = [
  {
    label: "Dashboard",
    to: "/buyer/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "My Orders",
    to: "/buyer/orders",
    icon: ShoppingBag,
  },
  {
    label: "Favorites",
    to: "/buyer/favorites",
    icon: Heart,
  },
  {
  label: "Payment History",
  to: "/buyer/payments",
  icon: CreditCard,
},
  {
    label: "Settings",
    to: "/buyer/settings",
    icon: Settings,
  },
];

const sellerMenuItems: DashboardMenuItem[] = [
  {
    label: "Dashboard",
    to: "/seller/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "My Products",
    to: "/seller/products",
    icon: Package,
  },
  {
    label: "Add Product",
    to: "/seller/products/add",
    icon: PlusCircle,
  },
  {
    label: "Submit Market Price",
    to: "/seller/market-prices/submit",
    icon: Tag,
  },
];


function App() {


  const { user } = useAuth();

  return (
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element = {<Products/>} />
        <Route path="/health" element = {<HealthTips/>} />
        <Route path="/market" element = {<MarketPrice />} />
        <Route path="/products/:id" element={<ProductDetails />} />
        <Route path="/payment/return" element={<PaymentReturn />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route  path="/auth/google/callback"  element={<GoogleCallback />}
/>


{/* Buyer-only pages */}
<Route element={<ProtectedRoute allowedRole="buyer" />}>
  <Route
    element={
      
      <DashboardLayout
        role="buyer"
        menuItems={buyerMenuItems}
        userName={user?.name || "Buyer"}
        userEmail={user?.email}
      />
    }
  >
    <Route path="/buyer/dashboard" element={<BuyerDashboard />} />
    <Route path="/buyer/orders" element={<BuyerOrders />} />
    <Route path="/buyer/payments" element={<BuyerPayments />} />
    <Route path="/buyer/favorites" element={<BuyerFavorites />} />
    <Route path="/buyer/settings" element={<BuyerSettings />} />
  </Route>
</Route>


{/* Seller-only pages */}
<Route element={<ProtectedRoute allowedRole="seller" />}>
  <Route
    element={
      <DashboardLayout
        role="seller"
        menuItems={sellerMenuItems}
        userName={user?.name || "Seller"}
        userEmail={user?.email}
      />
    }
  >
    <Route path="/seller/dashboard" element={<SellerDashboard />} />
    <Route path="/seller/products" element={<SellerProducts />} />
    <Route path="/seller/products/add" element={<AddProduct />} />
    <Route path="/seller/products/edit/:id" element={<EditProduct />} />
    <Route path="/seller/market-prices/submit" element={<SubmitMarketPrice />} />
  </Route>
</Route>

{/* Admin-only pages */}
<Route element={<ProtectedRoute allowedRole="admin" />}>
  <Route element={<AdminLayout />}>
    <Route path="/admin/dashboard" element={<AdminOverview />} />
    <Route path="/admin/users" element={<AdminUsers />} />
    <Route path="/admin/products" element={<AdminProducts />} />
    <Route path="/admin/sellers" element={<AdminSellers />} />
    <Route path="/admin/orders" element={<AdminOrders />} />
    <Route path="/admin/market-prices" element={<AdminMarketPrices />} />
    <Route path="/admin/reports" element={<AdminReports />} />
    <Route path="/admin/settings" element={<AdminSettings />} />
  </Route>
</Route>
      </Routes>
  );
}

export default App;