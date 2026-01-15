import { Link } from 'react-router-dom';
import { Instagram, Facebook, Twitter, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-zinc-900 shadow-2xl">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-16 lg:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16">
          {/* Brand Section */}
          <div className="space-y-4 text-center md:text-left">
            <h3 className="text-xl md:text-lg font-light tracking-[0.2em] uppercase text-white">
              SoundWave Audio
            </h3>
            <p className="text-sm md:text-xs leading-relaxed text-zinc-400 max-w-xs mx-auto md:mx-0">
              Crafting exceptional audio experiences through timeless design and
              uncompromising quality.
            </p>
          </div>

          {/* Shop Links */}
          <div className="space-y-4 text-center md:text-left">
            <h4 className="text-sm md:text-xs uppercase tracking-widest font-medium text-zinc-300">Shop</h4>
            <ul className="space-y-3 md:space-y-2">
              <li>
                <Link
                  to="/products"
                  className="text-sm md:text-xs text-zinc-400 hover:text-white transition-colors inline-block"
                >
                  All Products
                </Link>
              </li>
              <li>
                <Link
                  to="/products?category=portable-speakers"
                  className="text-sm md:text-xs text-zinc-400 hover:text-white transition-colors inline-block"
                >
                  Portable Speakers
                </Link>
              </li>
              <li>
                <Link
                  to="/products?category=home-theater"
                  className="text-sm md:text-xs text-zinc-400 hover:text-white transition-colors inline-block"
                >
                  Home Theater
                </Link>
              </li>
              <li>
                <Link
                  to="/products?on_sale=true"
                  className="text-sm md:text-xs text-zinc-400 hover:text-white transition-colors inline-block"
                >
                  On Sale
                </Link>
              </li>
            </ul>
          </div>

          {/* Information */}
          <div className="space-y-4 text-center md:text-left">
            <h4 className="text-sm md:text-xs uppercase tracking-widest font-medium text-zinc-300">
              Information
            </h4>
            <ul className="space-y-3 md:space-y-2">
              <li>
                <Link
                  to="/about"
                  className="text-sm md:text-xs text-zinc-400 hover:text-white transition-colors inline-block"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-sm md:text-xs text-zinc-400 hover:text-white transition-colors inline-block"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  to="/shipping-policy"
                  className="text-sm md:text-xs text-zinc-400 hover:text-white transition-colors inline-block"
                >
                  Shipping Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/returns"
                  className="text-sm md:text-xs text-zinc-400 hover:text-white transition-colors inline-block"
                >
                  Returns & Exchanges
                </Link>
              </li>
            </ul>
          </div>

          {/* Location Map */}
          <div className="space-y-4 text-center md:text-left">
            <h4 className="text-sm md:text-xs uppercase tracking-widest font-medium text-zinc-300">
              Our Location
            </h4>

            <p className="text-sm md:text-xs text-zinc-400">
              Park Road Business Center, Ngara
            </p>

            <div className="w-full max-w-sm mx-auto md:mx-0 md:max-w-none h-48 md:h-40 overflow-hidden border border-zinc-700 rounded-sm shadow-lg">
              <iframe
                title="Sound Wave Audio Location"
                src="https://www.google.com/maps?q=-1.2784174,36.8306438&z=17&output=embed"
                className="w-full h-full grayscale contrast-125"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-16 lg:mt-20 pt-8 border-t border-zinc-800">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0 gap-6">
            {/* Copyright */}
            <p className="text-xs md:text-[10px] text-zinc-500 uppercase tracking-widest order-2 md:order-1">
              © {new Date().getFullYear()} SoundWave Audio. All rights reserved.
            </p>

            {/* Social Links */}
            <div className="flex items-center space-x-8 md:space-x-6 order-1 md:order-2">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-emerald-400 transition-all duration-300 text-zinc-400 hover:scale-110"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5 md:w-4 md:h-4" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-emerald-400 transition-all duration-300 text-zinc-400 hover:scale-110"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5 md:w-4 md:h-4" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-emerald-400 transition-all duration-300 text-zinc-400 hover:scale-110"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5 md:w-4 md:h-4" />
              </a>
              <a
                href="mailto:info@soundwaveaudio.co.ke"
                className="hover:text-emerald-400 transition-all duration-300 text-zinc-400 hover:scale-110"
                aria-label="Email"
              >
                <Mail className="w-5 h-5 md:w-4 md:h-4" />
              </a>
            </div>

            {/* Legal Links */}
            <div className="flex items-center space-x-6 md:space-x-4 order-3">
              <Link
                to="/privacy"
                className="text-xs md:text-[10px] text-zinc-500 uppercase tracking-widest hover:text-white transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                to="/terms"
                className="text-xs md:text-[10px] text-zinc-500 uppercase tracking-widest hover:text-white transition-colors"
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