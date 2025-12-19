import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { getFeaturedProducts, listCategories } from '../actions/productActions';
import ProductGrid from '../components/products/ProductGrid';
import {  ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Skeleton } from "@/components/ui/skeleton"

const Home = () => {
  const dispatch = useDispatch();
  const { products: featuredProducts, loading, error } = useSelector((state) => state.featuredProducts);
  const { categories, loading: CategoryLoading } = useSelector((state) => state.categoryList);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  useEffect(() => {
    dispatch(getFeaturedProducts());
    dispatch(listCategories());
  }, [dispatch]);

  useEffect(() => {
    const interval = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prevIndex) => 
        prevIndex === (featuredProducts?.length || 4) - 1 ? 0 : prevIndex + 1
      );
    }, 7000);
    return () => clearInterval(interval);
  }, [featuredProducts]);


  const nextSlide = () => {
    setDirection(1);
    setCurrentIndex((prevIndex) => 
      prevIndex === (featuredProducts?.length || 4) - 1 ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setDirection(-1);
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? (featuredProducts?.length || 4) - 1 : prevIndex - 1
    );
  };

  const goToSlide = (index) => {
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
  };

  // Fallback products if API fails
  const fallbackProducts = [
    {
      id: 213,
      name: "3way Distribution Blocks",
      slug: "3way-distribution-blocks-3waydist",
      price: "1200.00",
      final_price: 1200,
      primary_image: "https://kiarie-bucket.s3.amazonaws.com/products/main_image_fPO4Dc9.jpg",
      is_in_stock: true
    },
    {
      id: 214,
      name: "Premium Headphones",
      slug: "premium-headphones",
      price: "2499.00",
      final_price: 2499,
      primary_image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e",
      is_in_stock: true
    },
    {
      id: 215,
      name: "Wireless Speaker System",
      slug: "wireless-speaker-system",
      price: "8999.00",
      final_price: 8999,
      primary_image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1",
      is_in_stock: true
    },
    {
      id: 216,
      name: "Studio Monitor Pro",
      slug: "studio-monitor-pro",
      price: "15999.00",
      final_price: 15999,
      primary_image: "https://images.unsplash.com/photo-1597933320860-10515eb0d3d1",
      is_in_stock: true
    }
  ];

  const productsToShow = featuredProducts?.length ? featuredProducts : fallbackProducts;

  const slideVariants = {
    hiddenRight: {
      x: "100%",
      opacity: 0,
    },
    hiddenLeft: {
      x: "-100%",
      opacity: 0,
    },
    visible: {
      x: "0",
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: "easeInOut",
      },
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      transition: {
        duration: 0.5,
      },
    },
  };

  const [randomCategories, setRandomCategories] = useState([]);

  useEffect(() => {
    // Select 3 random categories
    if (categories?.results && Array.isArray(categories.results)) {
      const shuffled = [...categories.results].sort(() => 0.5 - Math.random());
      setRandomCategories(shuffled.slice(0, 3));
    }
  }, [categories]);

  const CategorySkeleton = () => {
    return (
      <div className="relative aspect-square border border-black overflow-hidden">
        {/* Image placeholder */}
        <Skeleton className="absolute inset-0 h-full w-full rounded-none" />

        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/20" />

        {/* Text placeholders */}
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
          <Skeleton className="h-4 w-32 bg-white/80" />
          <Skeleton className="h-3 w-20 bg-white/60" />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[70vh] min-h-[700px] overflow-hidden">
        {/* Navigation Arrows */}
        <button 
          onClick={prevSlide}
          className="absolute left-4 top-1/2 z-20 rounded-full bg-transparent p-2 text-white backdrop-blur-sm transition-all opacity-0 hover:opacity-100 hover:bg-black/50 md:left-6"
          aria-label="Previous slide"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        
        <button 
          onClick={nextSlide}
          className="absolute left-4 top-1/2 z-20 rounded-full bg-transparent p-2 text-white backdrop-blur-sm transition-all opacity-0 hover:opacity-100 hover:bg-black/50 md:left-6"
          aria-label="Next slide"
        >
          <ChevronRight className="h-6 w-6" />
        </button>

        {/* Slide Indicators */}
        <div className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 space-x-2">
          {productsToShow.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`h-2 w-2 rounded-full transition-all ${index === currentIndex ? 'w-6 bg-white' : 'bg-white/50'}`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        {/* Slides Container */}
        <div className="relative h-full w-full">
          <AnimatePresence initial={false} custom={direction}>
            {productsToShow.map((product, index) => (
              index === currentIndex && (
                <motion.div
                  key={product.id}
                  custom={direction}
                  variants={slideVariants}
                  initial={direction > 0 ? "hiddenRight" : "hiddenLeft"}
                  animate="visible"
                  exit={direction > 0 ? "exit" : "exit"}
                  className="absolute inset-0 flex items-center justify-center bg-gradient-to-r from-black/70 to-black/30"
                >
                  {/* Background Image */}
                  <div className="absolute inset-0 -z-10">
                    <img 
                      src={product.primary_image} 
                      alt={product.name}
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-black/30"></div>
                  </div>

                  {/* Content */}
                  <div className="container relative z-10 mx-auto px-4 text-white md:px-8">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3, duration: 0.7 }}
                      className="max-w-lg"
                    >
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6, duration: 0.5 }}
                        className="mb-2 inline-block rounded-full bg-white/10 px-3 py-1 text-xs font-medium backdrop-blur-sm"
                      >
                        {product.is_in_stock ? 'In Stock' : 'Out of Stock'}
                      </motion.div>
                      
                      <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.7 }}
                        className="mb-4 text-3xl font-bold md:text-5xl"
                      >
                        {product.name}
                      </motion.h1>
                      
                      <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 0.7 }}
                        className="mb-6 text-lg md:text-xl"
                      >
                        KSh {product.final_price.toLocaleString()}
                      </motion.p>
                      
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7, duration: 0.7 }}
                        className="flex flex-wrap gap-4"
                      >
                        <Link
                          to={`/products/${product.slug}`}
                          className="inline-flex items-center justify-center rounded-md bg-white px-6 py-3 text-sm font-medium text-black transition-colors hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black"
                        >
                          View Details
                        </Link>
                        
                        <button
                          className="inline-flex items-center justify-center rounded-md border border-white bg-transparent px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black"
                        >
                          Add to Cart
                        </button>
                      </motion.div>
                    </motion.div>
                  </div>
                </motion.div>
              )
            ))}
          </AnimatePresence>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-light tracking-[0.2em] uppercase mb-4">
            Discover
          </h2>
          <p className="text-xs tracking-widest uppercase text-gray-600">
            Curated Audio Excellence
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {CategoryLoading
            ? Array.from({ length: 3 }).map((_, i) => (
                <CategorySkeleton key={i} />
              ))
            : randomCategories.map((category) => (
                <Link
                  key={category.id}
                  to={`/products?category=${category.slug}`}
                  className="group relative aspect-square border border-black overflow-hidden"
                >
                  {category.image ? (
                    <img
                      src={category.image}
                      alt={category.name}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200" />
                  )}

                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300" />

                  <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                    <h3 className="text-lg uppercase tracking-[0.2em] font-light text-white drop-shadow-lg mb-2">
                      {category.name}
                    </h3>
                    <p className="text-xs text-white/90 tracking-wider">
                      {category.product_count} Products
                    </p>
                  </div>
                </Link>
              ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 py-20 border-t border-black">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-2xl md:text-3xl font-light tracking-[0.2em] uppercase mb-2">
              Featured
            </h2>
            <p className="text-xs tracking-widest uppercase text-gray-600">
              Handpicked Selection
            </p>
          </div>
          <Link
            to="/products"
            className="text-xs uppercase tracking-widest hover:opacity-60 transition-opacity flex items-center space-x-1"
          >
            <span>View All</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <ProductGrid products={featuredProducts} loading={loading} error={error} />
      </section>

      {/* About Section */}
      <section className="border-t border-black bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-20">
          <div className="max-w-2xl mx-auto text-center space-y-6">
            <h2 className="text-2xl md:text-3xl font-light tracking-[0.2em] uppercase">
              Craftsmanship
            </h2>
            <p className="text-xs leading-relaxed text-gray-600">
              Each piece in our collection represents a commitment to exceptional audio
              quality and timeless design. We believe that great sound should be
              experienced, not just heard.
            </p>
            <Link
              to="/about"
              className="inline-flex items-center space-x-2 text-xs uppercase tracking-widest hover:opacity-60 transition-opacity mt-4"
            >
              <span>Our Story</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="border-t border-black">
        <div className="max-w-7xl mx-auto px-4 py-20">
          <div className="max-w-md mx-auto text-center space-y-6">
            <h2 className="text-xl font-light tracking-[0.2em] uppercase">
              Stay Connected
            </h2>
            <p className="text-xs tracking-widest uppercase text-gray-600">
              Subscribe for exclusive updates
            </p>
            <form className="space-y-3">
              <input
                type="email"
                placeholder="Email address"
                className="w-full px-4 py-3 text-xs border border-black focus:outline-none focus:border-gray-600"
              />
              <button
                type="submit"
                className="w-full px-6 py-3 bg-black text-white text-xs uppercase tracking-widest hover:bg-gray-800 transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};
export default Home;