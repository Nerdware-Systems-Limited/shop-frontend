import { useState, useEffect } from 'react';
import { Flame, MapPin, Phone, Mail, ChevronRight, Sparkles } from 'lucide-react';

const PromoBanner = () => {
  const [currentPromo, setCurrentPromo] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  const promos = [
    {
      icon: Flame,
      text: "Car Stereo Dealer in Nairobi - Sound Wave Audio",
      highlight: "Premium Audio Systems"
    },
    {
      icon: Sparkles,
      text: "Hot Deals! Up to 50% off on selected audio gear",
      highlight: "Limited Time Offer"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPromo((prev) => (prev + 1) % promos.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  if (!isVisible) return null;

  const CurrentIcon = promos[currentPromo].icon;

  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-orange-950 via-red-950 to-orange-950">
      {/* Animated background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(255,100,50,0.3),transparent_50%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,150,100,0.1)_50%,transparent_75%)] bg-[length:60px_60px] animate-[shimmer_3s_linear_infinite]" />
      </div>

      {/* Glowing top border */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-orange-500 to-transparent animate-pulse" />

      <div className="relative max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between py-2.5">
          {/* Left side - Contact info */}
          <div className="hidden lg:flex items-center space-x-6 text-xs">
            <a 
              href="https://maps.app.goo.gl/4r9SPMBFot4PyRsE8"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-1.5 text-orange-200 hover:text-orange-100 transition-colors group"
            >
              <MapPin className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
              <span className="font-medium">Park Road Business Center, Ngara</span>
            </a>
            <div className="w-px h-4 bg-orange-700/50" />
            <a 
              href="tel:+254724013583"
              className="flex items-center space-x-1.5 text-orange-200 hover:text-orange-100 transition-colors group"
            >
              <Phone className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
              <span className="font-medium">+254 724 013583</span>
            </a>
          </div>

          {/* Center - Main promo with animation */}
          <div className="flex-1 lg:flex-initial flex items-center justify-center space-x-3 min-w-0">
            <div className="relative">
              <CurrentIcon className="w-5 h-5 text-orange-400 animate-pulse" />
              <div className="absolute inset-0 bg-orange-500 blur-md opacity-50 animate-pulse" />
            </div>
            
            <div className="flex flex-col items-center">
              <p className="text-sm lg:text-base font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-200 via-orange-100 to-orange-200 whitespace-nowrap animate-[glow_2s_ease-in-out_infinite]">
                {promos[currentPromo].text}
              </p>
              <span className="text-[10px] text-orange-400 font-semibold tracking-wider uppercase">
                {promos[currentPromo].highlight}
              </span>
            </div>

            <ChevronRight className="w-4 h-4 text-orange-400 animate-[bounce-x_1s_ease-in-out_infinite]" />
          </div>

          {/* Right side - Email */}
          <div className="hidden lg:flex items-center">
            <a 
              href="mailto:info@soundwaveaudio.co.ke"
              className="flex items-center space-x-1.5 text-orange-200 hover:text-orange-100 transition-colors group"
            >
              <Mail className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-medium">info@soundwaveaudio.co.ke</span>
            </a>
          </div>

          {/* Close button */}
          <button
            onClick={() => setIsVisible(false)}
            className="ml-4 p-1 hover:bg-orange-900/50 rounded transition-colors"
            aria-label="Close banner"
          >
            <svg className="w-4 h-4 text-orange-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Progress indicator dots */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex space-x-1.5 pb-1">
        {promos.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentPromo(idx)}
            className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
              idx === currentPromo 
                ? 'bg-orange-400 w-4' 
                : 'bg-orange-700/50 hover:bg-orange-600/50'
            }`}
            aria-label={`Show promo ${idx + 1}`}
          />
        ))}
      </div>

      <style jsx>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes glow {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.8; }
        }
        @keyframes bounce-x {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(4px); }
        }
      `}</style>
    </div>
  );
};

export default PromoBanner;