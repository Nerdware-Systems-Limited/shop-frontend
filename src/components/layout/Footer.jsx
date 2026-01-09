import { Link } from 'react-router-dom';
import { Instagram, Facebook, Twitter, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-zinc-900 border-t border-zinc-800 mt-20 shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-light tracking-[0.2em] uppercase text-white">
              Sounds Ltd
            </h3>
            <p className="text-xs leading-relaxed text-zinc-400">
              Crafting exceptional audio experiences through timeless design and
              uncompromising quality.
            </p>
          </div>

          {/* Shop Links */}
          <div className="space-y-4">
            <h4 className="text-xs uppercase tracking-widest font-medium text-zinc-300">Shop</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/products"
                  className="text-xs text-zinc-400 hover:text-white transition-colors"
                >
                  All Products
                </Link>
              </li>
              <li>
                <Link
                  to="/products?category=portable-speakers"
                  className="text-xs text-zinc-400 hover:text-white transition-colors"
                >
                  Portable Speakers
                </Link>
              </li>
              <li>
                <Link
                  to="/products?category=home-theater"
                  className="text-xs text-zinc-400 hover:text-white transition-colors"
                >
                  Home Theater
                </Link>
              </li>
              <li>
                <Link
                  to="/products?on_sale=true"
                  className="text-xs text-zinc-400 hover:text-white transition-colors"
                >
                  On Sale
                </Link>
              </li>
            </ul>
          </div>

          {/* Information */}
          <div className="space-y-4">
            <h4 className="text-xs uppercase tracking-widest font-medium text-zinc-300">
              Information
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/about"
                  className="text-xs text-zinc-400 hover:text-white transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-xs text-zinc-400 hover:text-white transition-colors"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  to="/shipping-policy"
                  className="text-xs text-zinc-400 hover:text-white transition-colors"
                >
                  Shipping Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/returns"
                  className="text-xs text-zinc-400 hover:text-white transition-colors"
                >
                  Returns & Exchanges
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h4 className="text-xs uppercase tracking-widest font-medium text-zinc-300">
              Newsletter
            </h4>
            <p className="text-xs text-zinc-400">
              Subscribe to receive updates and exclusive offers.
            </p>
            <form className="space-y-2">
              <input
                type="email"
                placeholder="Email address"
                className="w-full px-3 py-2 text-xs bg-zinc-800 border border-zinc-700 text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-zinc-500 transition-colors"
              />
              <button
                type="submit"
                className="w-full px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs uppercase tracking-widest transition-colors shadow-lg shadow-emerald-600/20"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 pt-8 border-t border-zinc-800">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            {/* Copyright */}
            <p className="text-[10px] text-zinc-500 uppercase tracking-widest">
              © 2024 Sounds Ltd. All rights reserved.
            </p>

            {/* Social Links */}
            <div className="flex items-center space-x-6">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-emerald-400 transition-colors text-zinc-400"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-emerald-400 transition-colors text-zinc-400"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-emerald-400 transition-colors text-zinc-400"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="mailto:info@soundsltd.com"
                className="hover:text-emerald-400 transition-colors text-zinc-400"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>

            {/* Legal Links */}
            <div className="flex items-center space-x-4">
              <Link
                to="/privacy"
                className="text-[10px] text-zinc-500 uppercase tracking-widest hover:text-white transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                to="/terms"
                className="text-[10px] text-zinc-500 uppercase tracking-widest hover:text-white transition-colors"
              >
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;