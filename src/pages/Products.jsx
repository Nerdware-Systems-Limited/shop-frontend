import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams, useParams, useNavigate  } from 'react-router-dom';
import { listProducts, setFilters, clearFilters } from '../actions/productActions';
import ProductGrid from '../components/products/ProductGrid';
import FilterSidebar from '../components/products/FilterSidebar';
import { SlidersHorizontal, ChevronLeft, ChevronRight } from 'lucide-react';
import CategoryBrandSEO from '../components/products/CategoryBrandSEO';

const Products = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { products, loading, error, count, next, previous } = useSelector((state) => state.productList);
  const { categories } = useSelector((state) => state.categoryList);
  const { brands } = useSelector((state) => state.brandList);
  const filters = useSelector((state) => state.filters);

  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [sortBy, setSortBy] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const { categorySlug, brandSlug } = useParams();


  // Extract lists safely
  const categoriesList = Array.isArray(categories?.results) ? categories.results : 
                        Array.isArray(categories) ? categories : [];
  const brandsList = Array.isArray(brands?.results) ? brands.results : 
                    Array.isArray(brands) ? brands : [];
  window.scrollTo(0, 0);
  // Find current category/brand objects
  const currentCategory = categorySlug ? categoriesList.find(c => c.slug === categorySlug) : null;
  const currentBrand = brandSlug ? brandsList.find(b => b.slug === brandSlug) : null;


  useEffect(() => {
    const params = {
      category: categorySlug || filters.category,
      brand: brandSlug  || filters.brand,
      min_price: filters.minPrice || 0,
      max_price: filters.maxPrice || 1000000,
      in_stock: filters.inStock,
      on_sale: filters.onSale,
      ordering: sortBy,
      search: searchParams.get('search') || '',
    };

    dispatch(listProducts(params));
  }, [dispatch, categorySlug, brandSlug, filters, sortBy, searchParams]);

  const handleFilterChange = (newFilters) => {
    // Get current values
    const currentCategory = categorySlug || filters.category;
    const currentBrand = brandSlug || filters.brand;
    
    // Check if category or brand changed
    if (newFilters.category !== currentCategory || newFilters.brand !== currentBrand) {
      // Build new path
      let newPath = '/products';
      
      if (newFilters.category && newFilters.brand) {
        // Both filters - category in path, brand in query
        newPath = `/products/${newFilters.category}`;
        const params = new URLSearchParams(searchParams);
        params.set('brand', newFilters.brand);
        navigate(`${newPath}?${params.toString()}`);
      } else if (newFilters.category) {
        // Only category
        navigate(`/products/${newFilters.category}`);
      } else if (newFilters.brand) {
        // Only brand
        navigate(`/products/brand/${newFilters.brand}`);
      } else {
        // No filters
        navigate('/products');
      }
    }
    
    dispatch(setFilters(newFilters));
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    dispatch(clearFilters());
    setSearchParams({});
    setSortBy('');
    setCurrentPage(1);
    navigate('/products');
  };

  const handleSortChange = (value) => {
    setSortBy(value);
    setCurrentPage(1);
  };

  const handlePageChange = async (url) => {
    if (!url) return;
    
    try {
      // Extract cursor from the URL
      const urlObj = new URL(url);
      const cursor = urlObj.searchParams.get('cursor');
      
      // Determine if next or previous
      const isNext = url === next;
      
      // Update page number for display
      setCurrentPage(prev => isNext ? prev + 1 : prev - 1);
      
      // Build params with cursor
      const params = {
        category: searchParams.get('category') || filters.category,
        brand: searchParams.get('brand') || filters.brand,
        min_price: filters.minPrice || 0,
        max_price: filters.maxPrice || 10000,
        in_stock: filters.inStock,
        on_sale: filters.onSale,
        ordering: sortBy,
        search: searchParams.get('search') || '',
        cursor: cursor,
      };

      dispatch(listProducts(params));
      
      // Scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error('Pagination error:', err);
    }
  };

  const sortOptions = [
    { label: 'Newest', value: '-created_at' },
    { label: 'Price: Low to High', value: 'price' },
    { label: 'Price: High to Low', value: '-price' },
    { label: 'Name: A to Z', value: 'name' },
    { label: 'Name: Z to A', value: '-name' },
  ];

  const getPageTitle = () => {
    if (categorySlug) {
      return categorySlug.split('-').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' ');
    }
    if (brandSlug) {
      return brandSlug.split('-').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' ');
    }
    return 'Products';
  };


  return (
    <div className="min-h-screen">
      {/* SEO Component */}
      <CategoryBrandSEO
        categorySlug={categorySlug}
        brandSlug={brandSlug}
        category={currentCategory}
        brand={currentBrand}
        productCount={count || products.length}
        siteName="Sound Wave Audio"
        siteUrl="https://soundwaveaudio.co.ke"
      />
      {/* Page Header */}
      <div className="border-b border-black bg-white sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-light tracking-[0.2em] uppercase mb-2">
                {getPageTitle()}
              </h1>
              <p className="text-xs text-gray-600">
                {products.length || 0} total {products.length === 1 ? 'item' : 'items'}
              </p>
            </div>

            <div className="flex items-center space-x-4">
              {/* Sort Dropdown */}
              <div className="hidden md:block">
                <select
                  value={sortBy}
                  onChange={(e) => handleSortChange(e.target.value)}
                  className="px-3 py-2 text-xs border border-black focus:outline-none focus:border-gray-600 bg-white"
                >
                  <option value="">Sort By</option>
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Mobile Filter Button */}
              <button
                onClick={() => setMobileFilterOpen(true)}
                className="lg:hidden flex items-center space-x-2 px-4 py-2 border border-black hover:bg-black hover:text-white transition-colors"
              >
                <SlidersHorizontal className="w-4 h-4" />
                <span className="text-xs uppercase tracking-widest">Filters</span>
              </button>
            </div>
          </div>

          {/* Mobile Sort */}
          <div className="md:hidden mt-4">
            <select
              value={sortBy}
              onChange={(e) => handleSortChange(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-black focus:outline-none focus:border-gray-600 bg-white"
            >
              <option value="">Sort By</option>
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Desktop Filter Sidebar */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-32">
              <FilterSidebar
                filters={filters}
                onFilterChange={handleFilterChange}
                onClearFilters={handleClearFilters}
              />
            </div>
          </aside>

          {/* Products Grid */}
          <main className="flex-1">
            <ProductGrid 
              products={products} 
              loading={loading} 
              error={error} 
              next={next} 
              previous={previous} 
            />

            {/* Pagination Controls */}
            {!loading && !error && products && products.length > 0 && (previous || next) && (
              <div className="mt-12 flex items-center justify-between border-t border-gray-200 pt-6">
                {/* Previous Button */}
                <button
                  onClick={() => handlePageChange(previous)}
                  disabled={!previous}
                  className={`flex items-center space-x-2 px-4 py-2 text-sm border transition-colors ${
                    previous
                      ? 'border-black hover:bg-black hover:text-white cursor-pointer'
                      : 'border-gray-300 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span className="uppercase tracking-wider">Previous</span>
                </button>

                {/* Page Info */}
                <div className="text-sm text-gray-600">
                  Page <span className="font-semibold">{currentPage}</span>
                  {count && (
                    <span className="ml-2 text-xs">
                      ({products.length} of {count} items)
                    </span>
                  )}
                </div>

                {/* Next Button */}
                <button
                  onClick={() => handlePageChange(next)}
                  disabled={!next}
                  className={`flex items-center space-x-2 px-4 py-2 text-sm border transition-colors ${
                    next
                      ? 'border-black hover:bg-black hover:text-white cursor-pointer'
                      : 'border-gray-300 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  <span className="uppercase tracking-wider">Next</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Mobile Filter Overlay */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setMobileFilterOpen(false)}
          />
          <div className="absolute right-0 top-0 bottom-0 w-80 max-w-[85vw] bg-white">
            <FilterSidebar
              filters={filters}
              onFilterChange={handleFilterChange}
              onClearFilters={handleClearFilters}
              onClose={() => setMobileFilterOpen(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;