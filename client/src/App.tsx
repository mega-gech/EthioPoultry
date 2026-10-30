import {
  LayoutDashboard,
  ShoppingBag,
  Heart,
  Settings,
  Package,
  PlusCircle,
} from "lucide-react";



import DashboardLayout from "./layout/DashboardLayout";
import type { DashboardMenuItem } from "./components/dashboard/Sidebar";

import { BrowserRouter as Router,  Routes, Route } from 'react-router-dom';
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
  
];

type LoggedInUser = {
  id?: string;
  name: string;
  email: string;
  role: "buyer" | "seller" | "admin";
};

function getLoggedInUser(): LoggedInUser | null {
  const storedUser = localStorage.getItem("user");

  if (!storedUser) return null;

  try {
    return JSON.parse(storedUser) as LoggedInUser;
  } catch {
    return null;
  }
}

function App() {

  const user = getLoggedInUser();

  return (
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element = {<Products/>} />
        <Route path="/health" element = {<HealthTips/>} />
        <Route path="/market" element = {<MarketPrice />} />
        <Route path="/products/:id" element={<ProductDetails />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        
{/* Buyer-only pages */}
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
  </Route>
</Route>


      </Routes>
  );
}

export default App;