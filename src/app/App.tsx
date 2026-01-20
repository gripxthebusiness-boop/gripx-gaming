import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Navigation } from '@/app/components/Navigation';
import { Footer } from '@/app/components/Footer';
import { Home } from '@/app/pages/Home';
import { Products } from '@/app/pages/Products';
import { Cart } from '@/app/pages/Cart';
import { Contact } from '@/app/pages/Contact';
import { Login } from '@/app/pages/Login';
import { Register } from '@/app/pages/Register';
import { ForgotPassword } from '@/app/pages/ForgotPassword';
import { VisualBuilder } from '@/app/pages/VisualBuilder';
import { AuthProvider } from '@/app/context/AuthContext';

function AppContent() {
  const location = useLocation();
  const isBuilderRoute = location.pathname === '/builder';

  return (
    <div className="min-h-screen bg-black">
      {!isBuilderRoute && <Navigation />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/builder" element={<VisualBuilder />} />
      </Routes>
      {!isBuilderRoute && <Footer />}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}
