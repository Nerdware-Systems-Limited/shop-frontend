import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetails from './pages/ProductDetails';

function App() {
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
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </Provider>
  );
}


const About = () => (
  <div className="max-w-4xl mx-auto px-4 py-20">
    <h1 className="text-3xl font-light tracking-[0.2em] uppercase mb-8 text-center">About Us</h1>
    <div className="space-y-6 text-xs leading-relaxed text-gray-600">
      <p>
        Sounds Ltd was founded with a singular vision: to create audio equipment that
        transcends the ordinary. Each piece in our collection is a testament to our
        unwavering commitment to quality, design, and acoustic excellence.
      </p>
      <p>
        Our design philosophy draws inspiration from the world's most prestigious
        luxury brands, combining minimalist aesthetics with uncompromising functionality.
        We believe that exceptional sound should be experienced in its purest form,
        unencumbered by unnecessary complexity.
      </p>
      <p>
        Every product undergoes rigorous testing and refinement to ensure it meets our
        exacting standards. From portable speakers to complete home theater systems,
        we craft experiences that resonate with audiophiles and design enthusiasts alike.
      </p>
    </div>
  </div>
);

const Contact = () => (
  <div className="max-w-2xl mx-auto px-4 py-20">
    <h1 className="text-3xl font-light tracking-[0.2em] uppercase mb-8 text-center">Contact</h1>
    <div className="space-y-6">
      <div className="border border-black p-6 space-y-4">
        <h2 className="text-xs uppercase tracking-widest font-medium">Get in Touch</h2>
        <div className="space-y-2 text-xs text-gray-600">
          <p>Email: info@soundsltd.com</p>
          <p>Phone: +254 (0) 700 000 000</p>
          <p>Address: Nairobi, Kenya</p>
        </div>
      </div>
      
      <form className="space-y-4">
        <input
          type="text"
          placeholder="Name"
          className="w-full px-4 py-3 text-xs border border-black focus:outline-none focus:border-gray-600"
        />
        <input
          type="email"
          placeholder="Email"
          className="w-full px-4 py-3 text-xs border border-black focus:outline-none focus:border-gray-600"
        />
        <textarea
          placeholder="Message"
          rows="6"
          className="w-full px-4 py-3 text-xs border border-black focus:outline-none focus:border-gray-600"
        />
        <button
          type="submit"
          className="w-full px-6 py-3 bg-black text-white text-xs uppercase tracking-widest hover:bg-gray-800 transition-colors"
        >
          Send Message
        </button>
      </form>
    </div>
  </div>
);

const NotFound = () => (
  <div className="max-w-7xl mx-auto px-4 py-20 text-center">
    <h1 className="text-6xl font-light mb-4">404</h1>
    <p className="text-xs uppercase tracking-widest text-gray-600">Page not found</p>
  </div>
);

export default App;