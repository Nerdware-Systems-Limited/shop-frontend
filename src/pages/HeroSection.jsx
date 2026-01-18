import { Button } from "@/components/ui/button";
import heroBanner from "@/assets/hero-banner.jpg";
import heroBanner2 from "@/assets/hero-banner-2.jpg";
import heroBanner3 from "@/assets/hero-banner-3.jpg";
import heroBanner4 from "@/assets/hero-banner-4.jpg";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { useState, useEffect, useRef, useCallback } from "react";

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
    cta: "Explore",
    image: heroBanner2,
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
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const autoplayRef = useRef(null);

  // Auto-advance slides
  const startAutoplay = useCallback(() => {
    autoplayRef.current = setInterval(() => {
      handleNext();
    }, 6000);
  }, []);

  const stopAutoplay = useCallback(() => {
    if (autoplayRef.current) {
      clearInterval(autoplayRef.current);
    }
  }, []);

  useEffect(() => {
    startAutoplay();
    return () => stopAutoplay();
  }, [startAutoplay, stopAutoplay]);

  const handleNext = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    setTimeout(() => setIsTransitioning(false), 600);
  }, [isTransitioning]);

  const handlePrev = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    setTimeout(() => setIsTransitioning(false), 600);
  }, [isTransitioning]);

  const handleDotClick = useCallback((index) => {
    if (isTransitioning || index === currentSlide) return;
    setIsTransitioning(true);
    setCurrentSlide(index);
    setTimeout(() => setIsTransitioning(false), 600);
    stopAutoplay();
    startAutoplay();
  }, [isTransitioning, currentSlide, stopAutoplay, startAutoplay]);

  // Touch handlers for mobile swipe
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
    stopAutoplay();
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const swipeThreshold = 50;
    const diff = touchStartX.current - touchEndX.current;

    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }
    startAutoplay();
  };

  const navigateToProducts = () => {
    window.location.href = '/products';
  };

  return (
    <section 
      className="relative h-screen w-full overflow-hidden bg-black"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Slide Images */}
      <div className="absolute inset-0">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            {/* Gradient Overlays for better text readability */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80 z-10" />
            
            {/* Image with Ken Burns effect */}
            <img
              src={slide.image}
              alt={slide.title}
              className={`h-full w-full object-cover transition-transform duration-[8000ms] ease-out ${
                index === currentSlide ? 'scale-110' : 'scale-100'
              }`}
            />
          </div>
        ))}
      </div>

      {/* Centered Content */}
      <div className="relative z-30 h-full flex items-center justify-center">
        <div className="container mx-auto px-6 md:px-8">
          {slides.map((slide, index) => (
            <div
              key={index}
              className={`text-center max-w-4xl mx-auto transition-all duration-700 ${
                index === currentSlide 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-8 absolute inset-0 pointer-events-none'
              }`}
            >
              {/* Subtitle Badge */}
              <div className="mb-6 animate-fade-in-down">
                <span className="inline-block px-6 py-2 text-xs md:text-sm font-semibold tracking-[0.2em] uppercase bg-white/10 backdrop-blur-md rounded-full text-white/90 border border-white/20">
                  {slide.subtitle}
                </span>
              </div>

              {/* Main Title */}
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-[1.1] text-white animate-fade-in-up">
                {slide.title}
              </h1>

              {/* Description */}
              <p className="text-lg md:text-xl lg:text-2xl text-white/80 mb-10 max-w-2xl mx-auto font-light leading-relaxed animate-fade-in-up animation-delay-200">
                {slide.description}
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-up animation-delay-400">
                <Button
                  onClick={navigateToProducts}
                  size="lg"
                  className="group px-8 py-6 text-base md:text-lg font-semibold bg-white text-black hover:bg-white/90 transform hover:scale-105 transition-all duration-300 shadow-2xl"
                >
                  <span className="flex items-center gap-2">
                    {slide.cta}
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Button>
                
                <Button
                  onClick={navigateToProducts}
                  size="lg"
                  variant="outline"
                  className="px-8 py-6 text-base md:text-lg font-semibold bg-white/5 backdrop-blur-md border-white/30 text-white hover:bg-white/10 transform hover:scale-105 transition-all duration-300"
                >
                  Learn More
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Desktop Navigation Arrows - Hidden on Mobile */}
      <button
        onClick={handlePrev}
        disabled={isTransitioning}
        className="hidden md:flex absolute left-8 top-1/2 -translate-y-1/2 z-40 group disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Previous slide"
      >
        <div className="bg-white/10 backdrop-blur-md p-4 rounded-full hover:bg-white/20 transition-all duration-300 group-hover:scale-110 border border-white/20">
          <ChevronLeft className="h-8 w-8 text-white group-hover:-translate-x-1 transition-transform" />
        </div>
      </button>

      <button
        onClick={handleNext}
        disabled={isTransitioning}
        className="hidden md:flex absolute right-8 top-1/2 -translate-y-1/2 z-40 group disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Next slide"
      >
        <div className="bg-white/10 backdrop-blur-md p-4 rounded-full hover:bg-white/20 transition-all duration-300 group-hover:scale-110 border border-white/20">
          <ChevronRight className="h-8 w-8 text-white group-hover:translate-x-1 transition-transform" />
        </div>
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-40 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => handleDotClick(index)}
            disabled={isTransitioning}
            className={`h-2 rounded-full transition-all duration-500 disabled:cursor-not-allowed ${
              index === currentSlide 
                ? "w-8 bg-white" 
                : "w-2 bg-white/40 hover:bg-white/70 hover:w-4"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Mobile Swipe Indicator - Only visible on touch devices */}
      <div className="md:hidden absolute bottom-20 left-1/2 -translate-x-1/2 z-40 text-white/50 text-xs uppercase tracking-wider animate-pulse">
        Swipe to navigate
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in-up {
          animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        .animate-fade-in-down {
          animation: fadeInDown 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        .animation-delay-200 {
          animation-delay: 0.2s;
          opacity: 0;
        }

        .animation-delay-400 {
          animation-delay: 0.4s;
          opacity: 0;
        }

        /* Smooth transitions */
        * {
          -webkit-tap-highlight-color: transparent;
        }
      `}</style>
    </section>
  );
};

export default HeroSection;