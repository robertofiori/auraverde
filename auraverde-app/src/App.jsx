import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import MainLayout from './components/MainLayout';
import Home from './pages/Home';
import Favorites from './pages/Favorites';
import Catalog from './pages/Catalog';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Profile from './pages/Profile';
import Orders from './pages/Orders';
import Addresses from './pages/Addresses';
import Checkout from './pages/Checkout';
import Success from './pages/Success';
import Login from './pages/Login';
import Register from './pages/Register';
import Migration from './pages/Migration';
import AdminDashboard from './pages/AdminDashboard';

import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';

function App() {
  return (
    <HashRouter>
      <ToastProvider>
        <ThemeProvider>
          <AuthProvider>
            <CartProvider>
              <Routes>
                <Route element={<MainLayout />}>
                  <Route path="/" element={<Home />} />
                  <Route path="/catalog" element={<Catalog />} />
                  <Route path="/product/:id" element={<ProductDetail />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/orders" element={<Orders />} />
                  <Route path="/addresses" element={<Addresses />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/success" element={<Success />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/migrate" element={<Migration />} />
                  <Route path="/favorites" element={<Favorites />} />
                  <Route path="/admin" element={<AdminDashboard />} />
                </Route>
              </Routes>
            </CartProvider>
          </AuthProvider>
        </ThemeProvider>
      </ToastProvider>
    </HashRouter>
  );
}

export default App;
