import { BrowserRouter as Routes, Route } from 'react-router-dom';
import Home from "./pages/Home";
import Products from './pages/Products';
import ProductDetails from './pages/ProductDetails';
import SellerProfile from './pages/SellerDashboard/SellerProfile';
import Login from './pages/Login'
import Register from './pages/Register'
import BuyerProfile from "./pages/buyerProfile/BuyerProfile";
import BuyerDashboard from './pages/buyerProfile/BuyerDashboard';
import BuyerOrders from './pages/buyerProfile/BuyerOrders';
import BuyerFavorites from './pages/buyerProfile/BuyerFavorites';
import BuyerSettings from './pages/buyerProfile/BuyerSettings';
import SellerDashboard from "./pages/SellerDashboard/SellerDashboard";
import SellerProducts from './pages/SellerDashboard/SellerProducts';
import AddProduct from './pages/SellerDashboard/AddProduct';
import EditProduct from './pages/SellerDashboard/EditProduct';

function App() {
  return (
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element = {<Products/>} />
        <Route path="/products/:id" element={<ProductDetails />} />
        <Route path='/sellerProfile/:id' element={<SellerProfile />}/>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/buyerprofile" element={<BuyerProfile />} />
        <Route path="/buyer/dashboard" element={<BuyerDashboard />} />
        <Route path="/buyer/orders" element={<BuyerOrders />} />
        <Route path='/buyer/favorites' element={<BuyerFavorites/>} />
        <Route path='/buyer/settings' element={<BuyerSettings />} />
        <Route  path="/seller/dashboard"  element={<SellerDashboard />} />
        <Route  path="/seller/products"  element={<SellerProducts />} />
        <Route  path="/seller/products/add"  element={<AddProduct />} />
        <Route  path="/seller/products/edit/:id"  element={<EditProduct />}/>
        <Route  path='/seller/profile' element={< SellerProfile/>} />
      </Routes>
  );
}

export default App;