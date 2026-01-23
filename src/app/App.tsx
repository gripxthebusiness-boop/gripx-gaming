import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

import Navigation from './components/Navigation';
import Footer from './components/Footer';

import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Login from './pages/Login';
import Register from './pages/Register';
import About from './pages/About';
import Contact from './pages/Contact';
import AdminProducts from './pages/AdminProducts';
import Account from './pages/Account';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <Navigation />

          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/admin/products" element={<AdminProducts />} />
            <Route path="/account" element={<Account />} />
          </Routes>

          <Footer />
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;

