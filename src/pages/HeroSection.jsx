import { Button } from "@/components/ui/button";
import heroBanner from "@/assets/hero-banner.jpg";
import heroBanner2 from "@/assets/hero-banner-2.jpg";
import heroBanner3 from "@/assets/hero-banner-3.jpg";
import heroBanner4 from "@/assets/hero-banner-4.jpg";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";

const slides = [
  {
    title: "Sound. Style. Soul.",
    subtitle: "Premium Car Audio",
    description: "Experience the ultimate in car audio excellence",
    cta: "Shop Now",
    image: heroBanner,
  },
  {
    title: "Feel Every Beat",
    subtitle: "Premium Speakers",
    description: "Crystal clear audio that transforms your drive",
    cta: "Explore Speakers",
    image: heroBanner2,
  },
  {
    title: "Wireless Freedom",
    subtitle: "Headphones & Earbuds",
    description: "Immersive sound wherever you go",
    cta: "Shop Audio",
    image: heroBanner3,
  },
  {
    title: "Power Your Sound",
    subtitle: "Amplifiers & Components",
    description: "Professional-grade audio equipment for enthusiasts",
    cta: "View Collection",
    image: heroBanner4,
  },
];

const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [direction, setDirection] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      handleNext();
    }, 6000);
    return () => clearInterval(timer);
  }, [currentSlide]);

  const handleNext = () => {
    if (isTransitioning) return;
    setDirection(1);
    setIsTransitioning(true);
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    setTimeout(() => setIsTransitioning(false), 800);
  };

  const handlePrev = () => {
    if (isTransitioning) return;
    setDirection(-1);
    setIsTransitioning(true);
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    setTimeout(() => setIsTransitioning(false), 800);
  };

  const handleDotClick = (index) => {
    if (isTransitioning || index === currentSlide) return;
    setDirection(index > currentSlide ? 1 : -1);
    setIsTransitioning(true);
    setCurrentSlide(index);
    setTimeout(() => setIsTransitioning(false), 800);
  };

  const navigateToProducts = () => {
    window.location.href = '/products';
  };

  return (
    <section className="relative h-screen w-full overflow-hidden bg-black">
      <style>
        {`
          @keyframes slideInRight {
            from { transform: translateX(100%) scale(1.1); opacity: 0; }
            to { transform: translateX(0) scale(1); opacity: 1; }
          }
          @keyframes slideInLeft {
            from { transform: translateX(-100%) scale(1.1); opacity: 0; }
            to { transform: translateX(0) scale(1); opacity: 1; }
          }
          @keyframes slideOutRight {
            from { transform: translateX(0) scale(1); opacity: 1; }
            to { transform: translateX(100%) scale(0.9); opacity: 0; }
          }
          @keyframes slideOutLeft {
            from { transform: translateX(0) scale(1); opacity: 1; }
            to { transform: translateX(-100%) scale(0.9); opacity: 0; }
          }
          @keyframes fadeInUp {
            from { transform: translateY(60px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
          }
          @keyframes fadeInDown {
            from { transform: translateY(-60px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
          }
          @keyframes scaleIn {
            from { transform: scale(0.8); opacity: 0; }
            to { transform: scale(1); opacity: 1; }
          }
          @keyframes shimmer {
            0% { background-position: -1000px 0; }
            100% { background-position: 1000px 0; }
          }
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-20px); }
          }
          @keyframes glow {
            0%, 100% { box-shadow: 0 0 20px rgba(255,255,255,0.3), 0 0 40px rgba(255,255,255,0.2); }
            50% { box-shadow: 0 0 40px rgba(255,255,255,0.6), 0 0 80px rgba(255,255,255,0.4); }
          }
          .slide-enter-right { animation: slideInRight 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
          .slide-enter-left { animation: slideInLeft 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
          .slide-exit-right { animation: slideOutRight 0.8s cubic-bezier(0.7, 0, 0.84, 0) forwards; }
          .slide-exit-left { animation: slideOutLeft 0.8s cubic-bezier(0.7, 0, 0.84, 0) forwards; }
          .fade-in-up { animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
          .fade-in-down { animation: fadeInDown 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
          .scale-in { animation: scaleIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
          .float { animation: float 3s ease-in-out infinite; }
          .glow { animation: glow 2s ease-in-out infinite; }
          .shimmer {
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
            background-size: 1000px 100%;
            animation: shimmer 3s infinite;
          }
          .glass-effect {
            background: rgba(0, 0, 0, 0.4);
            backdrop-filter: blur(20px) saturate(180%);
            border: 1px solid rgba(255, 255, 255, 0.1);
          }
          .text-gradient {
            background: linear-gradient(135deg, #fff 0%, #888 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
          }
          .parallax-slow { transform: translateZ(-1px) scale(1.5); }
        `}
      </style>

      {/* Background Images with Parallax */}
      <div className="absolute inset-0">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-all duration-1000 ${
              index === currentSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-110'
            }`}
          >
            {/* Multiple layers for depth */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent z-10" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent z-10" />
            
            <img
              src={slide.image}
              alt={slide.title}
              className="h-full w-full object-cover transition-transform duration-[2000ms] ease-out"
              style={{
                transform: index === currentSlide ? 'scale(1)' : 'scale(1.1)',
              }}
            />
            
            {/* Animated overlay effects */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-blue-500/10 animate-pulse z-10" />
          </div>
        ))}
      </div>

      {/* Floating particles effect */}
      <div className="absolute inset-0 z-20 pointer-events-none overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${3 + Math.random() * 4}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      {/* Main Content Container */}
      <div className="relative z-30 h-full flex items-center">
        <div className="container mx-auto px-4 md:px-8">
          <div className="max-w-3xl">
            {slides.map((slide, index) => (
              <div
                key={index}
                className={`${
                  index === currentSlide ? 'block' : 'hidden'
                }`}
              >
                {/* Subtitle */}
                <div className="fade-in-down opacity-0" style={{ animationDelay: '0.1s', animationFillMode: 'forwards' }}>
                  <span className="inline-block px-6 py-2 mb-6 text-sm font-semibold tracking-widest uppercase glass-effect rounded-full text-white/90 border border-white/20 shimmer">
                    {slide.subtitle}
                  </span>
                </div>

                {/* Title */}
                <h1 
                  className="fade-in-up opacity-0 text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight"
                  style={{ animationDelay: '0.3s', animationFillMode: 'forwards' }}
                >
                  <span className="block text-gradient drop-shadow-2xl">
                    {slide.title.split(' ').map((word, i) => (
                      <span
                        key={i}
                        className="inline-block mr-4 hover:scale-110 transition-transform duration-300"
                        style={{
                          animation: `fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards`,
                          animationDelay: `${0.3 + i * 0.1}s`,
                          opacity: 0,
                        }}
                      >
                        {word}
                      </span>
                    ))}
                  </span>
                </h1>

                {/* Description */}
                <p 
                  className="fade-in-up opacity-0 text-xl md:text-2xl text-white/80 mb-10 max-w-2xl font-light leading-relaxed"
                  style={{ animationDelay: '0.5s', animationFillMode: 'forwards' }}
                >
                  {slide.description}
                </p>

                {/* CTA Button */}
                <div 
                  className="scale-in opacity-0 flex gap-4"
                  style={{ animationDelay: '0.7s', animationFillMode: 'forwards' }}
                >
                  <Button
                    onClick={navigateToProducts}
                    size="lg"
                    className="group relative px-8 py-6 text-lg font-semibold overflow-hidden bg-white text-black hover:bg-white/90 transform hover:scale-105 transition-all duration-300 glow"
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      {slide.cta}
                      <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </span>
                    <div className="absolute inset-0 shimmer" />
                  </Button>
                  
                  <Button
                    onClick={navigateToProducts}
                    size="lg"
                    variant="outline"
                    className="px-8 py-6 text-lg font-semibold glass-effect border-white/30 text-white hover:bg-white/10 transform hover:scale-105 transition-all duration-300"
                  >
                    Learn More
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={handlePrev}
        disabled={isTransitioning}
        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-40 group disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Previous slide"
      >
        <div className="glass-effect p-4 rounded-full hover:bg-white/20 transition-all duration-300 group-hover:scale-110 border border-white/20">
          <ChevronLeft className="h-6 w-6 md:h-8 md:w-8 text-white group-hover:-translate-x-1 transition-transform" />
        </div>
      </button>

      <button
        onClick={handleNext}
        disabled={isTransitioning}
        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-40 group disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Next slide"
      >
        <div className="glass-effect p-4 rounded-full hover:bg-white/20 transition-all duration-300 group-hover:scale-110 border border-white/20">
          <ChevronRight className="h-6 w-6 md:h-8 md:w-8 text-white group-hover:translate-x-1 transition-transform" />
        </div>
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-40 flex gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => handleDotClick(index)}
            disabled={isTransitioning}
            className={`group relative h-3 rounded-full transition-all duration-500 disabled:cursor-not-allowed ${
              index === currentSlide 
                ? "w-12 bg-white" 
                : "w-3 bg-white/40 hover:bg-white/70 hover:w-8"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          >
            {index === currentSlide && (
              <span className="absolute inset-0 rounded-full bg-white animate-pulse" />
            )}
          </button>
        ))}
      </div>

      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10 z-40">
        <div 
          className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 transition-all duration-300"
          style={{
            width: `${((currentSlide + 1) / slides.length) * 100}%`,
          }}
        />
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-40 hidden md:block float">
        <div className="flex flex-col items-center gap-2 text-white/60">
          <span className="text-xs uppercase tracking-wider">Scroll</span>
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2">
            <div className="w-1 h-3 bg-white/60 rounded-full animate-bounce" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;