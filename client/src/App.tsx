import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from "./pages/Home";
import Products from './pages/Products';
import ProductDetails from './pages/ProductDetails';
import SellerProfile from './pages/SellerProfile';
import Login from './pages/Login'
import Register from './pages/Register'
import BuyerProfile from "./pages/buyerProfile/BuyerProfile";
import BuyerDashboard from './pages/buyerProfile/BuyerDashboard';
import BuyerOrders from './pages/buyerProfile/BuyerOrders';
import BuyerFavorites from './pages/buyerProfile/BuyerFavorites';

function App() {
  return (
    <Router>
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
      </Routes>
     
    </Router>
  );
}

export default App;