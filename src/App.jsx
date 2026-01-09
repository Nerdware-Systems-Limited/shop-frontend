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
import OrderSuccess from './pages/customer/OrderSuccess'
import ForgotPassword from './pages/customer/ForgotPassword';
import TermsOfService from './pages/TermsOfService';
import PrivacyPolicy from './pages/PrivacyPolicy';
import ResetPassword from './pages/customer/ResetPassword';
import ShippingPolicy from './pages/ShippingPolicy';
import ReturnsExchanges from './pages/ReturnsExchanges';

function App() {
  // ✅ UPDATE THIS: Persist completion state
  const [completed, setCompleted] = useState(() => {
    const saved = localStorage.getItem('checkoutCompleted');
    return saved ? JSON.parse(saved) : {};
  });

  // ✅ ADD THIS: Save to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('checkoutCompleted', JSON.stringify(completed));
  }, [completed]);

  // ✅ ADD THIS: Clear completion state when order is successful
  useEffect(() => {
    const handleOrderSuccess = () => {
      setCompleted({});
      localStorage.removeItem('checkoutCompleted');
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
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<Products />} />
              <Route path="/products/:slug" element={<ProductDetails />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/login" element={<Login />} />
              <Route path='forgot-password' element={<ForgotPassword />} />
              <Route path='reset-password' element={<ResetPassword />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/register" element={<Register />} />
              <Route path="/shipping" element={<Shipping setCompleted={setCompleted} completed={completed} />} />
              <Route path="/payment" element={<Payment setCompleted={setCompleted} completed={completed}/>} />
              <Route path="/placeorder" element={<PlaceOrder setCompleted={setCompleted} completed={completed}/>} />
              <Route path="/myorders" element={<MyOrders />} />
              <Route path="/order/:id" element={<OrderDetails />} />
              <Route path="/order/:orderNumber/success" element={<OrderSuccess />} />
              <Route path="/terms" element={<TermsOfService />} />
              <Route path="/privacy" element={<PrivacyPolicy />} />
              <Route path="/shipping-policy" element={<ShippingPolicy />} />
              <Route path="/returns" element={<ReturnsExchanges />} />  
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