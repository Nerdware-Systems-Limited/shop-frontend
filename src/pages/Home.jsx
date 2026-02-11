import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { getNewArrivalProducts, getFeaturedProducts, listCategories } from '../actions/productActions';
import ProductGrid from '../components/products/ProductGrid';
import { ChevronRight } from 'lucide-react';
import { Skeleton } from "@/components/ui/skeleton"
import AddToCartButton from '../components/products/AddToCartButton'
import HeroSection from './HeroSection';
import BrandCatalog from '../components/products/BrandCatalog';

const Home = () => {
  const dispatch = useDispatch();
  const { products: featuredProducts, loading, error } = useSelector((state) => state.featuredProducts);
  const { categories, loading: CategoryLoading } = useSelector((state) => state.categoryList);
  const { loading: newArrivalProductsloading, products: newArrivalProducts, error: newArrivalProductserror } = useSelector(state => state.newArrivalProducts);

  useEffect(() => {
    dispatch(getFeaturedProducts());
    dispatch(getNewArrivalProducts());
    dispatch(listCategories());
  }, [dispatch]);

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
      {/* Premium Hero Section */}
      <HeroSection 
        featuredProducts={newArrivalProducts?.results || []}
        loading={loading}
        AddToCartButton={AddToCartButton}
        LinkComponent={Link}
      />

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
                  to={`/products/${category.slug}`}
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

        <ProductGrid products={featuredProducts?.results} loading={loading} error={error} />
      </section>

      {/* Brands Preview */}
      <section className="max-w-7xl mx-auto px-4 py-20 border-t border-black">
        <BrandCatalog />
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