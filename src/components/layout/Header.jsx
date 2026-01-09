import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Search, ShoppingBag, User, Menu } from 'lucide-react';
import { useState } from 'react';
import logo from '../../assets/logo.png';
import MiniCart from '../products/MiniCart';
import PromoBanner from './PromoBanner'

const Header = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const navigate = useNavigate();

  const { cartItems } = useSelector((state) => state.cart);
  const cartCount = cartItems.reduce((acc, item) => acc + item.qty, 0);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${searchQuery}`);
    }
  };

  return (
    <header className="bg-zinc-900 border-b border-zinc-800 sticky top-0 z-50 shadow-lg shadow-black/20">
      {/* Top promo bar */}
      <PromoBanner />
      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 hover:bg-zinc-800 rounded transition-colors"
          >
            <Menu className="w-5 h-5 text-zinc-300" />
          </button>

          {/* Logo */}
          <Link to="/" className="flex-shrink-0">
            <img
                src={logo}
                alt="Sounds Wave Audio Logo"
                className="h-10 w-auto object-contain brightness-50 invert"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            <Link
              to="/"
              className="text-xs uppercase tracking-widest text-zinc-300 hover:text-white transition-colors"
            >
              Home
            </Link>
            <Link
              to="/products"
              className="text-xs uppercase tracking-widest text-zinc-300 hover:text-white transition-colors"
            >
              Products
            </Link>
            <Link
              to="/about"
              className="text-xs uppercase tracking-widest text-zinc-300 hover:text-white transition-colors"
            >
              About
            </Link>
            <Link
              to="/contact"
              className="text-xs uppercase tracking-widest text-zinc-300 hover:text-white transition-colors"
            >
              Contact
            </Link>
          </nav>

          {/* Right Section */}
          <div className="flex items-center space-x-4">
            {/* Search Bar - Desktop */}
            <form onSubmit={handleSearch} className="hidden md:flex items-center">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-32 lg:w-48 pl-3 pr-8 py-1.5 text-xs bg-zinc-800 border border-zinc-700 text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-zinc-500 focus:bg-zinc-750 transition-colors"
                />
                <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2">
                  <Search className="w-3.5 h-3.5 text-zinc-400" />
                </button>
              </div>
            </form>

            {/* Icons */}
            <Link to="/profile" className="hidden md:block">
              <button className="p-2 hover:bg-zinc-800 rounded transition-colors">
                <User className="w-5 h-5 text-zinc-300" />
              </button>
            </Link>
            <button onClick={() => setIsCartOpen(true)} className="p-2 hover:bg-zinc-800 rounded transition-colors relative">
              <ShoppingBag className="w-5 h-5 text-zinc-300" />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 w-4 h-4 bg-emerald-500 text-white text-[9px] flex items-center justify-center rounded-full shadow-lg shadow-emerald-500/50">
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Search */}
        <form onSubmit={handleSearch} className="md:hidden pb-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Search products"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-3 pr-8 py-2 text-xs bg-zinc-800 border border-zinc-700 text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-zinc-500 transition-colors"
            />
            <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2">
              <Search className="w-4 h-4 text-zinc-400" />
            </button>
          </div>
        </form>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-zinc-800 bg-zinc-900">
          <nav className="flex flex-col max-w-7xl mx-auto px-4 py-4 space-y-4">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="text-xs uppercase tracking-widest text-zinc-300 hover:text-white transition-colors"
            >
              Home
            </Link>
            <Link
              to="/products"
              onClick={() => setMobileMenuOpen(false)}
              className="text-xs uppercase tracking-widest text-zinc-300 hover:text-white transition-colors"
            >
              Products
            </Link>
            <Link
              to="/about"
              onClick={() => setMobileMenuOpen(false)}
              className="text-xs uppercase tracking-widest text-zinc-300 hover:text-white transition-colors"
            >
              About
            </Link>
            <Link
              to="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="text-xs uppercase tracking-widest text-zinc-300 hover:text-white transition-colors"
            >
              Contact
            </Link>
            <Link
              to="/profile"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center space-x-2 text-xs uppercase tracking-widest text-zinc-300 hover:text-white transition-colors pt-4 border-t border-zinc-800"
            >
              <User className="w-4 h-4" />
              <span>Profile</span>
            </Link>
          </nav>
        </div>
      )}

      <MiniCart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </header>
  );
};

export default Header;