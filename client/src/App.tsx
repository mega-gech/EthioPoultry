import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from "./pages/Home";
import Products from './pages/Products';
import ProductDetails from './pages/ProductDetails';
import SellerProfile from './pages/SellerProfile';
import Login from './pages/Login'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element = {<Products/>} />
        <Route path="/products/:id" element={<ProductDetails />} />
        <Route path='/sellerProfile/:id' element={<SellerProfile />}/>
        <Route path="/login" element={<Login />} />
      </Routes>
     
    </Router>
  );
}

export default App;