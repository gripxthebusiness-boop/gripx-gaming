import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navigation } from '@/app/components/Navigation';
import { Footer } from '@/app/components/Footer';
import { Home } from '@/app/pages/Home';
import { Products } from '@/app/pages/Products';
import { Cart } from '@/app/pages/Cart';
import { Contact } from '@/app/pages/Contact';
import { Login } from '@/app/pages/Login';
import { Register } from '@/app/pages/Register';
import { ForgotPassword } from '@/app/pages/ForgotPassword';
import { Dashboard } from '@/app/pages/Dashboard';
import { AdminEditor } from '@/app/pages/AdminEditor';
import { AuthProvider } from '@/app/context/AuthContext';
import { VisualBuilder } from '@/app/pages/VisualBuilder';


export default function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-black">
          <Navigation />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/admin/dashboard" element={<Dashboard />} />
            <Route path="/admin/editor" element={<AdminEditor />} />
            <Route path="/editor" element={<AdminEditor />} />
            <Route path="/visual-builder" element={<VisualBuilder />} />
            <Route path="/builder" element={<VisualBuilder />} />
          </Routes>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

