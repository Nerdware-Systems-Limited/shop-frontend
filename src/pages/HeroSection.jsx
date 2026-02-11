import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, ArrowRight, ShoppingCart, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import heroBanner2 from "@/assets/hero-banner-2.jpg";
import heroBanner from "@/assets/hero-banner.jpg";
import heroBanner4 from "@/assets/hero-banner-4.jpg";
import AddToCartButton from '../components/products/AddToCartButton'
import new_arrivals from "@/assets/new_arrivals.png"


// PropTypes can be added for validation if needed
// Default slides when no featured products
const defaultSlides = [
  {
    title: "Sound. Style. Soul.",
    subtitle: "Premium Car Audio",
    description: "Experience the ultimate in car audio excellence",
    cta: "Shop Now",
    image: heroBanner,
    slug: "complete-audio-setup", // from backend
  },
  {
    title: "Feel Every Beat",
    subtitle: "Premium Speakers",
    description: "Crystal clear audio that transforms your drive",
    cta: "Explore",
    image: heroBanner2,
    slug: "car-speakers", // from backend
  },
  {
    title: "Power Your Sound",
    subtitle: "Amplifiers & Components",
    description: "Professional-grade audio equipment for enthusiasts",
    cta: "View Collection",
    image: heroBanner4,
    slug: "car-booster-amplifiers", // from backend
  },
];


const HeroSection = ({ featuredProducts = [], Link }) => {
  const navigate = useNavigate();
  const hasProducts = featuredProducts.length > 0;
  const slideCount = hasProducts ? featuredProducts.length : defaultSlides.length;

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const autoplayRef = useRef(null);

  const startAutoplay = useCallback(() => {
    if (autoplayRef.current) clearInterval(autoplayRef.current);
    autoplayRef.current = setInterval(() => {
      setIsTransitioning(true);
      setCurrentSlide((prev) => (prev + 1) % slideCount);
      setTimeout(() => setIsTransitioning(false), 600);
    }, 6000);
  }, [slideCount]);

  const stopAutoplay = useCallback(() => {
    if (autoplayRef.current) clearInterval(autoplayRef.current);
  }, []);

  useEffect(() => {
    startAutoplay();
    return () => stopAutoplay();
  }, [startAutoplay, stopAutoplay]);

  const handleNext = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentSlide((prev) => (prev + 1) % slideCount);
    setTimeout(() => setIsTransitioning(false), 600);
    stopAutoplay();
    startAutoplay();
  }, [isTransitioning, slideCount, stopAutoplay, startAutoplay]);

  const handlePrev = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentSlide((prev) => (prev - 1 + slideCount) % slideCount);
    setTimeout(() => setIsTransitioning(false), 600);
    stopAutoplay();
    startAutoplay();
  }, [isTransitioning, slideCount, stopAutoplay, startAutoplay]);

  const handleDotClick = useCallback(
    (index) => {
      if (isTransitioning || index === currentSlide) return;
      setIsTransitioning(true);
      setCurrentSlide(index);
      setTimeout(() => setIsTransitioning(false), 600);
      stopAutoplay();
      startAutoplay();
    },
    [isTransitioning, currentSlide, stopAutoplay, startAutoplay]
  );

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
    stopAutoplay();
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) > 50) {
      diff > 0 ? handleNext() : handlePrev();
    }
    startAutoplay();
  };

  const formatPrice = (price) =>
    new Intl.NumberFormat("en-KE", { style: "currency", currency: "KES", minimumFractionDigits: 0 }).format(price);

  // ─── FEATURED PRODUCTS MODE ───
  if (hasProducts) {
    const product = featuredProducts[currentSlide];
    return (
      <section
        className="relative h-screen w-full overflow-hidden bg-background"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Static background */}
        <div className="absolute inset-0">
          {defaultSlides.map((slide, index) => (
            <div
                key={index}
                className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                  index === (currentSlide % defaultSlides.length) ? 'opacity-100' : 'opacity-0'
                }`}
              >
              <div className="hero-overlay absolute inset-0 z-10" />
              <img
                src={hasProducts ? new_arrivals : defaultSlides[currentSlide].image}
                alt={hasProducts ? "Hero background" : slide.title}
                className={`h-full w-full object-cover brightness-25 contrast-110 transition-transform duration-[8000ms] ease-out ${
                  hasProducts ? 'scale-110' : (currentSlide >= 0 ? 'scale-110' : 'scale-100')
                }`}
              />
            </div>
          ))}
        </div>

        {/* Content */}
        <div className="relative z-30 h-full flex items-center">
          <div className="container mx-auto px-6 md:px-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16"
              >
                {/* Product image - First on mobile, second on desktop */}
                <div className="flex-1 flex justify-center order-1 lg:order-2">
                  <div className="relative w-72 h-72 md:w-96 md:h-96 lg:w-[28rem] lg:h-[28rem]">
                    <div className="absolute inset-0 rounded-2xl bg-primary/10 blur-3xl" />
                    <img
                      src={product.primary_image}
                      alt={product.name}
                      className="relative w-full h-full object-contain drop-shadow-2xl"
                    />
                  </div>
                </div>

                {/* Text side - Second on mobile, first on desktop */}
                <div className="flex-1 text-center lg:text-left max-w-xl order-2 lg:order-1">
                  <span className="inline-block px-4 py-1.5 text-xs font-semibold tracking-[0.15em] uppercase glass rounded-full text-white mb-5">
                    {product.brand_name} · {product.category_name}
                  </span>
                  <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight text-white">
                    {product.name}
                  </h1>
                  {product.short_description && (
                    <p className="text-lg md:text-xl text-gray-200 mb-6 leading-relaxed">
                      {product.short_description}
                    </p>
                  )}
                  <p className="text-3xl md:text-4xl font-bold text-emerald-400 mb-8">
                    {formatPrice(product.final_price)}
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center items-center w-full">
                    <AddToCartButton
                      product={product}
                      quantity={1}
                      showQuantitySelector={false}
                      variant="default"
                    />
                    {Link ? (
                      <Link to={`/product/${product.slug}`}>
                        <Button
                          variant="heroOutline"
                          size="lg"
                          className="px-8 py-6 text-base"
                        >
                          <Eye className="w-5 h-5 mr-2" />
                          View Details
                        </Button>
                      </Link>
                    ) : (
                      <Button
                        variant="heroOutline"
                        size="lg"
                        className="px-8 py-6 text-base"
                        onClick={() => window.location.href = `/product/${product.slug}`}
                      >
                        <Eye className="w-5 h-5 mr-2" />
                        View Details
                      </Button>
                    )}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Nav arrows */}
        {slideCount > 1 && (
          <>
            <NavArrow direction="left" onClick={handlePrev} disabled={isTransitioning} />
            <NavArrow direction="right" onClick={handleNext} disabled={isTransitioning} />
          </>
        )}

        {/* Dots */}
        <SlideIndicators count={slideCount} current={currentSlide} onDot={handleDotClick} disabled={isTransitioning} />
      </section>
    );
  }

  // ─── DEFAULT SLIDES MODE ───
  return (
    <section
      className="relative h-screen w-full overflow-hidden bg-background"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Background - static banner */}
      <div className="absolute inset-0">
        <div className="hero-overlay absolute inset-0 z-10" />
        <img
          src={defaultSlides[currentSlide].image}
          alt={defaultSlides[currentSlide].title}
          className={`h-full w-full object-cover brightness-45 contrast-110 transition-transform duration-[8000ms] ease-out ${
            currentSlide >= 0 ? "scale-110" : "scale-100"
          }`}
        />
      </div>

      {/* Content */}
      <div className="relative z-30 h-full flex items-center justify-center">
        <div className="container mx-auto px-6 md:px-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="text-center max-w-4xl mx-auto"
            >
              <span className="inline-block px-6 py-2 text-xs md:text-sm font-semibold tracking-[0.2em] uppercase glass rounded-full text-white/90 mb-6">
                {defaultSlides[currentSlide].subtitle}
              </span>
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-[1.1] text-white">
                {defaultSlides[currentSlide].title}
              </h1>
              <p className="text-lg md:text-xl lg:text-2xl text-gray-200 mb-10 max-w-2xl mx-auto font-light leading-relaxed">
                {defaultSlides[currentSlide].description}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button variant="hero" size="lg" className="px-8 py-6 text-base md:text-lg"
                onClick={() =>
                  navigate(`/products/${defaultSlides[currentSlide].slug}`)
                }>
                  <span className="flex items-center gap-2">
                    {defaultSlides[currentSlide].cta}
                    <ArrowRight className="w-5 h-5" />
                  </span>
                </Button>
                <Button variant="heroOutline" size="lg" className="px-8 py-6 text-base md:text-lg" onClick={() => navigate("/products")}>
                  Learn More
                </Button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <NavArrow direction="left" onClick={handlePrev} disabled={isTransitioning} />
      <NavArrow direction="right" onClick={handleNext} disabled={isTransitioning} />
      <SlideIndicators count={slideCount} current={currentSlide} onDot={handleDotClick} disabled={isTransitioning} />

      <div className="md:hidden absolute bottom-20 left-1/2 -translate-x-1/2 z-40 text-muted-foreground text-xs uppercase tracking-wider animate-pulse">
        Swipe to navigate
      </div>
    </section>
  );
};

// ─── Sub-components ───

const NavArrow = ({ direction, onClick, disabled }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`hidden md:flex absolute ${
      direction === "left" ? "left-8" : "right-8"
    } top-1/2 -translate-y-1/2 z-40 group disabled:opacity-50 disabled:cursor-not-allowed`}
    aria-label={direction === "left" ? "Previous slide" : "Next slide"}
  >
    <div className="glass glass-hover p-4 rounded-full transition-all duration-300 group-hover:scale-110">
      {direction === "left" ? (
        <ChevronLeft className="h-7 w-7 text-foreground group-hover:-translate-x-0.5 transition-transform" />
      ) : (
        <ChevronRight className="h-7 w-7 text-foreground group-hover:translate-x-0.5 transition-transform" />
      )}
    </div>
  </button>
);

const SlideIndicators = ({ count, current, onDot, disabled }) => (
  <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-40 flex gap-2">
    {Array.from({ length: count }).map((_, i) => (
      <button
        key={i}
        onClick={() => onDot(i)}
        disabled={disabled}
        className={`h-2 rounded-full transition-all duration-500 disabled:cursor-not-allowed ${
          i === current ? "w-8 bg-primary" : "w-2 bg-foreground/30 hover:bg-foreground/60 hover:w-4"
        }`}
        aria-label={`Go to slide ${i + 1}`}
      />
    ))}
  </div>
);

export default HeroSection;