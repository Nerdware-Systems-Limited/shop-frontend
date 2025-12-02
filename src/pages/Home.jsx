import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { listProducts } from '../actions/productActions';
import ProductGrid from '../components/products/ProductGrid';
import { ChevronRight } from 'lucide-react';

const Home = () => {
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state) => state.productList);

  useEffect(() => {
    dispatch(listProducts({ ordering: '-created_at' }));
  }, [dispatch]);

  const featuredProducts = products?.filter(p => p.is_featured).slice(0, 4) || [];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[70vh] min-h-[500px] bg-gray-50 border-b border-black">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center space-y-6 px-4">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-light tracking-[0.3em] uppercase">
              Sounds Ltd
            </h1>
            <p className="text-xs md:text-sm tracking-[0.2em] uppercase text-gray-600 max-w-md mx-auto">
              Where precision engineering meets timeless design
            </p>
            <Link
              to="/products"
              className="inline-flex items-center space-x-2 px-8 py-3 bg-black text-white text-xs uppercase tracking-widest hover:bg-gray-800 transition-colors mt-8"
            >
              <span>Explore Collection</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
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
          <Link
            to="/products?category=portable-speakers"
            className="group relative aspect-square bg-gray-50 border border-black overflow-hidden"
          >
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
            <div className="absolute inset-0 flex items-center justify-center">
              <h3 className="text-lg uppercase tracking-[0.2em] font-light">
                Portable
              </h3>
            </div>
          </Link>

          <Link
            to="/products?category=home-theater"
            className="group relative aspect-square bg-gray-50 border border-black overflow-hidden"
          >
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
            <div className="absolute inset-0 flex items-center justify-center">
              <h3 className="text-lg uppercase tracking-[0.2em] font-light">
                Home Theater
              </h3>
            </div>
          </Link>

          <Link
            to="/products?category=studio-monitors"
            className="group relative aspect-square bg-gray-50 border border-black overflow-hidden"
          >
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
            <div className="absolute inset-0 flex items-center justify-center">
              <h3 className="text-lg uppercase tracking-[0.2em] font-light">
                Studio
              </h3>
            </div>
          </Link>
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