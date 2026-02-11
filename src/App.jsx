import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/customer/Cart';
import Login from './pages/customer/Login';
import Profile from './pages/customer/Profile';
import Register from './pages/customer/Register';
import Shipping from './pages/customer/Shipping';
import Payment from './pages/customer/Payment';
import PlaceOrder from './pages/customer/PlaceOrder';
import About from './pages/About';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';
import MyOrders from './pages/customer/MyOrders';
import OrderDetails from './pages/OrderDetails';
import OrderSuccess from './pages/customer/OrderSuccess';
import ForgotPassword from './pages/customer/ForgotPassword';
import TermsOfService from './pages/TermsOfService';
import PrivacyPolicy from './pages/PrivacyPolicy';
import ResetPassword from './pages/customer/ResetPassword';
import ShippingPolicy from './pages/ShippingPolicy';
import ReturnsExchanges from './pages/ReturnsExchanges';
import DefaultSEO from './pages/DefaultSEO';

/**
 * App Component with Consolidated SEO Strategy
 * 
 * SEO ROUTING RULES:
 * 1. DefaultSEO: Used ONLY on static pages (/, /about, /contact, etc.)
 * 2. CategoryBrandSEO: Automatically used in Products component for /products/* routes
 * 3. ProductSEO: Automatically used in ProductDetails component for /product/* routes
 * 
 * DO NOT wrap <DefaultSEO /> around product/category routes - it will cause conflicts!
 */

function App() {
  const [completed, setCompleted] = useState({});

  useEffect(() => {
    const handleOrderSuccess = () => {
      setCompleted({});
    };

    window.addEventListener('orderSuccess', handleOrderSuccess);
    return () => window.removeEventListener('orderSuccess', handleOrderSuccess);
  }, []);

  return (
    <Provider store={store}>
      <Router>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-1">
            <Routes>
              {/* ========== HOME (uses DefaultSEO) ========== */}
              <Route 
                path="/" 
                element={
                  <>
                    <DefaultSEO />
                    <Home />
                  </>
                } 
              />

              {/* ========== PRODUCTS (uses CategoryBrandSEO internally) ========== */}
              {/* DO NOT add DefaultSEO here - Products.jsx handles its own SEO */}
              <Route path="/products">
                <Route index element={<Products />} />
                <Route path="brand/:brandSlug" element={<Products />} />
                <Route path=":categorySlug" element={<Products />} />
              </Route>

              {/* ========== PRODUCT DETAILS (uses ProductSEO internally) ========== */}
              {/* DO NOT add DefaultSEO here - ProductDetails.jsx handles its own SEO */}
              <Route path="/product/:slug" element={<ProductDetails />} />

              {/* ========== STATIC PAGES (use DefaultSEO) ========== */}
              <Route 
                path="/about" 
                element={
                  <>
                    <DefaultSEO />
                    <About />
                  </>
                } 
              />
              
              <Route 
                path="/contact" 
                element={
                  <>
                    <DefaultSEO />
                    <Contact />
                  </>
                } 
              />

              {/* ========== CART & CHECKOUT (use DefaultSEO with noindex) ========== */}
              <Route 
                path="/cart" 
                element={
                  <>
                    <DefaultSEO />
                    <Cart />
                  </>
                } 
              />

              {/* ========== AUTH PAGES (use DefaultSEO with noindex) ========== */}
              <Route 
                path="/login" 
                element={
                  <>
                    <DefaultSEO />
                    <Login />
                  </>
                } 
              />
              
              <Route 
                path="/register" 
                element={
                  <>
                    <DefaultSEO />
                    <Register />
                  </>
                } 
              />

              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />

              {/* ========== ACCOUNT PAGES (noindex, internal use) ========== */}
              <Route path="/profile" element={<Profile />} />
              <Route path="/myorders" element={<MyOrders />} />
              <Route path="/order/:id" element={<OrderDetails />} />
              <Route path="/order/:orderNumber/success" element={<OrderSuccess />} />

              {/* ========== CHECKOUT FLOW (noindex) ========== */}
              <Route 
                path="/shipping" 
                element={
                  <Shipping setCompleted={setCompleted} completed={completed} />
                } 
              />
              <Route 
                path="/payment" 
                element={
                  <Payment setCompleted={setCompleted} completed={completed} />
                } 
              />
              <Route 
                path="/placeorder" 
                element={
                  <PlaceOrder setCompleted={setCompleted} completed={completed} />
                } 
              />

              {/* ========== POLICY PAGES (use DefaultSEO, indexed) ========== */}
              <Route 
                path="/terms" 
                element={
                  <>
                    <DefaultSEO />
                    <TermsOfService />
                  </>
                } 
              />
              
              <Route 
                path="/privacy" 
                element={
                  <>
                    <DefaultSEO />
                    <PrivacyPolicy />
                  </>
                } 
              />
              
              <Route 
                path="/shipping-policy" 
                element={
                  <>
                    <DefaultSEO />
                    <ShippingPolicy />
                  </>
                } 
              />
              
              <Route 
                path="/returns" 
                element={
                  <>
                    <DefaultSEO />
                    <ReturnsExchanges />
                  </>
                } 
              />

              {/* ========== 404 (use DefaultSEO with noindex) ========== */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </Provider>
  );
}

export default App;