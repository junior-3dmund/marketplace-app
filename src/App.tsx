import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Footer from './components/Footer';
import Header from './components/Header';
import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail';
import Sellers from './pages/Sellers';
import CategoryPage from './pages/CategoryPage';
import NotFound from './pages/NotFound';

const App = () => (
  <Router>
    <div className="app-shell">
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/p/:id" element={<ProductDetail />} />
        <Route path="/sellers" element={<Sellers />} />
        <Route path="/categories/:category" element={<CategoryPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </div>
  </Router>
);

export default App;
