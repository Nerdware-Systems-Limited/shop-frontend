import { useState } from 'react';
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
import { InventoryDashboard } from './pages/admin/inventory/InventoryDashboard';
import { WarehouseManager } from './pages/admin/inventory/WarehouseManager';
import AdminProductsPage from './pages/admin/products/AdminProductsPage';
import OrderSuccess from './pages/customer/OrderSuccess'

function App() {
  const [completed, setCompleted] = useState({});
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
              <Route path="/profile" element={<Profile />} />
              <Route path="/register" element={<Register />} />
              <Route path="/shipping" element={<Shipping setCompleted={setCompleted} completed={completed} />} />
              <Route path="/payment" element={<Payment setCompleted={setCompleted} completed={completed}/>} />
              <Route path="/placeorder" element={<PlaceOrder setCompleted={setCompleted} completed={completed}/>} />
              <Route path="/myorders" element={<MyOrders />} />
              <Route path="/order/:id" element={<OrderDetails />} />
              <Route path="/order/:orderNumber/success" element={<OrderSuccess />} />
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