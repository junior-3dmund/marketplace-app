import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Footer from './components/Footer';
import Header from './components/Header';
import ProtectedRoute from './components/ProtectedRoute';
import SellerProfile from './pages/SellerProfile';
import EditListing from './pages/EditListing';
import CartPage from './pages/CartPage';
import Checkout from './pages/Checkout';
import AdminDashboard from './pages/AdminDashboard';
import BuyerDashboard from './pages/BuyerDashboard';
import HelpCenter from './pages/HelpCenter';
import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail';
import Sellers from './pages/Sellers';
import CategoryPage from './pages/CategoryPage';
import NotFound from './pages/NotFound';
import Login from './pages/Login';
import Register from './pages/Register';
import SellerDashboard from './pages/SellerDashboard';
import CreateListing from './pages/CreateListing';
import { CartProvider } from './context/CartContext';

const App = () => (
  <Router>
    <CartProvider>
      <div className="app-shell">
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/p/:id" element={<ProductDetail />} />
          <Route path="/sellers" element={<Sellers />} />
          <Route
            path="/seller"
            element={
              <ProtectedRoute allowedRoles={["seller","admin"]}>
                <SellerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/seller/profile"
            element={
              <ProtectedRoute allowedRoles={["seller","admin"]}>
                <SellerProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/seller/edit/:id"
            element={
              <ProtectedRoute allowedRoles={["seller","admin"]}>
                <EditListing />
              </ProtectedRoute>
            }
          />
          <Route
            path="/create-listing"
            element={
              <ProtectedRoute allowedRoles={["seller","admin"]}>
                <CreateListing />
              </ProtectedRoute>
            }
          />
          <Route path="/categories/:category" element={<CategoryPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route
            path="/buyer"
            element={
              <ProtectedRoute allowedRoles={["buyer", "admin"]}>
                <BuyerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route path="/help" element={<HelpCenter />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Footer />
      </div>
    </CartProvider>
  </Router>
);

export default App;
