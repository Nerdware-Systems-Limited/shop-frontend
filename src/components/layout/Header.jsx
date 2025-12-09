import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Search, ShoppingBag, User, Menu } from 'lucide-react';
import { useState } from 'react';
import logo from '../../assets/logo.png';
import MiniCart from '../products/MiniCart';

const Header = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const navigate = useNavigate();

  const { cartItems } = useSelector((state) => state.cart);
  const cartCount = cartItems.reduce((acc, item) => acc + item.qty, 0);

  // console.log('Cart Items in Header:', cartItems);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${searchQuery}`);
    }
  };

  return (
    <header className="bg-white border-b border-black sticky top-0 z-50">
      {/* Top Bar */}
      {/* <div className="border-b border-black">
        <div className="max-w-7xl mx-auto px-4 py-2">
          <p className="text-[10px] uppercase tracking-widest text-center">
            Free shipping on orders over $500
          </p>
        </div>
      </div> */}

      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Logo */}
          <Link to="/" className="flex-shrink-0">
            <img
                src={logo}
                alt="Sounds Wave Audio Logo"
                className="h-10 w-auto object-contain"
            />
            </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            <Link
              to="/"
              className="text-xs uppercase tracking-widest hover:opacity-60 transition-opacity"
            >
              Home
            </Link>
            <Link
              to="/products"
              className="text-xs uppercase tracking-widest hover:opacity-60 transition-opacity"
            >
              Products
            </Link>
            <Link
              to="/about"
              className="text-xs uppercase tracking-widest hover:opacity-60 transition-opacity"
            >
              About
            </Link>
            <Link
              to="/contact"
              className="text-xs uppercase tracking-widest hover:opacity-60 transition-opacity"
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
                  className="w-32 lg:w-48 pl-3 pr-8 py-1.5 text-xs border border-black focus:outline-none focus:border-gray-600"
                />
                <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2">
                  <Search className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>

            {/* Icons */}
            <Link to="/profile" className="hidden md:block">
            <button className="p-2 hover:opacity-60 transition-opacity">
              <User className="w-5 h-5" />
            </button>
            </Link>
            <button onClick={() => setIsCartOpen(true)} className="p-2 hover:opacity-60 transition-opacity relative">
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 w-4 h-4 bg-black text-white text-[9px] flex items-center justify-center">
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
              className="w-full pl-3 pr-8 py-2 text-xs border border-black focus:outline-none focus:border-gray-600"
            />
            <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2">
              <Search className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-black bg-white">
          <nav className="flex flex-col max-w-7xl mx-auto px-4 py-4 space-y-4">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="text-xs uppercase tracking-widest hover:opacity-60 transition-opacity"
            >
              Home
            </Link>
            <Link
              to="/products"
              onClick={() => setMobileMenuOpen(false)}
              className="text-xs uppercase tracking-widest hover:opacity-60 transition-opacity"
            >
              Products
            </Link>
            <Link
              to="/about"
              onClick={() => setMobileMenuOpen(false)}
              className="text-xs uppercase tracking-widest hover:opacity-60 transition-opacity"
            >
              About
            </Link>
            <Link
              to="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="text-xs uppercase tracking-widest hover:opacity-60 transition-opacity"
            >
              Contact
            </Link>
          </nav>
        </div>
      )}
      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-black bg-white">
          {/* ... existing mobile menu code ... */}
        </div>
      )}

      {/* Add MiniCart - Import from your components */}
      <MiniCart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </header>
  );
};

export default Header;