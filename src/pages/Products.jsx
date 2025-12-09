import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { listProducts, setFilters, clearFilters } from '../actions/productActions';
import ProductGrid from '../components/products/ProductGrid';
import FilterSidebar from '../components/products/FilterSidebar';
import { SlidersHorizontal, X } from 'lucide-react';

const Products = () => {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const { products, loading, error } = useSelector((state) => state.productList);
  const filters = useSelector((state) => state.filters);

  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [sortBy, setSortBy] = useState('');

  useEffect(() => {
    const params = {
      category: searchParams.get('category') || filters.category,
      brand: searchParams.get('brand') || filters.brand,
      min_price: filters.minPrice || 0,
      max_price: filters.maxPrice || 10000,
      in_stock: filters.inStock,
      on_sale: filters.onSale,
      ordering: sortBy,
      search: searchParams.get('search') || '',
    };

    dispatch(listProducts(params));
  }, [dispatch, filters, sortBy, searchParams]);

  const handleFilterChange = (newFilters) => {
    dispatch(setFilters(newFilters));
  };

  const handleClearFilters = () => {
    dispatch(clearFilters());
    setSearchParams({});
    setSortBy('');
  };

  const handleSortChange = (value) => {
    setSortBy(value);
  };

  const sortOptions = [
    { label: 'Newest', value: '-created_at' },
    { label: 'Price: Low to High', value: 'price' },
    { label: 'Price: High to Low', value: '-price' },
    { label: 'Name: A to Z', value: 'name' },
    { label: 'Name: Z to A', value: '-name' },
  ];

  return (
    <div className="min-h-screen">
      {/* Page Header */}
      <div className="border-b border-black bg-white sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-light tracking-[0.2em] uppercase mb-2">
                Products
              </h1>
              <p className="text-xs text-gray-600">
                {products?.length || 0} {products?.length === 1 ? 'item' : 'items'}
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
            <ProductGrid products={products} loading={loading} error={error} />
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