import { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { listBrands, getBrandProducts } from '../../actions/productActions';
import ProductGrid from './ProductGrid';
import { Search, ChevronRight, Package, TrendingUp, Loader2 } from 'lucide-react';

// Navigation helper (you can replace this with your router's navigate function)
const navigate = (path) => {
  window.location.href = path;
};

const BrandCatalog = () => {
  const dispatch = useDispatch();

  // Redux state
  const { brands, loading: brandsLoading, error: brandsError } = useSelector((state) => state.brandList);
  const { products: brandProducts, loading: productsLoading } = useSelector((state) => state.brandProducts);

  // Local state
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name'); // name, product_count
  const [loadedBrandProducts, setLoadedBrandProducts] = useState({});
  const [expandedBrand, setExpandedBrand] = useState(null);

  // Fetch brands on mount
  useEffect(() => {
    dispatch(listBrands());
  }, [dispatch]);

  // Process brands data
  const brandsList = useMemo(() => {
    const list = Array.isArray(brands?.results) ? brands.results : 
                 Array.isArray(brands) ? brands : [];
    return list;
  }, [brands]);

  // Filter and sort brands
  const filteredAndSortedBrands = useMemo(() => {
    let filtered = brandsList;

    // Filter by search term
    if (searchTerm.trim()) {
      filtered = filtered.filter(brand =>
        brand.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        brand.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort brands
    const sorted = [...filtered].sort((a, b) => {
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      } else if (sortBy === '-name') {
        return b.name.localeCompare(a.name);
      } else if (sortBy === 'product_count') {
        return (a.product_count || 0) - (b.product_count || 0);
      } else if (sortBy === '-product_count') {
        return (b.product_count || 0) - (a.product_count || 0);
      }
      return 0;
    });

    return sorted;
  }, [brandsList, searchTerm, sortBy]);

  // Load products for a specific brand
  const loadBrandProducts = async (brandSlug) => {
    if (loadedBrandProducts[brandSlug]) return; // Already loaded

    try {
      await dispatch(getBrandProducts(brandSlug));
      
      // The response will be in Redux state, we'll get it from there
      // No need to store in local state immediately
    } catch (err) {
      console.error(`Failed to load products for brand ${brandSlug}:`, err);
    }
  };

  // Update loaded products when Redux state changes
  useEffect(() => {
    if (brandProducts && expandedBrand) {
      const products = Array.isArray(brandProducts?.results) 
        ? brandProducts.results 
        : Array.isArray(brandProducts) 
        ? brandProducts 
        : [];
      
      setLoadedBrandProducts(prev => ({
        ...prev,
        [expandedBrand]: products
      }));
    }
  }, [brandProducts, expandedBrand]);

  // Handle brand card expansion (load products on first expand)
  const handleBrandExpand = (brandSlug) => {
    if (expandedBrand === brandSlug) {
      setExpandedBrand(null);
    } else {
      setExpandedBrand(brandSlug);
      loadBrandProducts(brandSlug);
    }
  };

  // Navigate to brand page
  const handleViewAllProducts = (brandSlug) => {
    navigate(`/products?brand=${brandSlug}`);
  };

  // Navigate to product detail
  const handleProductClick = (productSlug) => {
    navigate(`/products/${productSlug}`);
  };

  // Navigate to brand detail if clicking brand name/logo
  const handleBrandClick = (brandSlug) => {
    navigate(`/products?brand=${brandSlug}`);
  };

  // Sort options
  const sortOptions = [
    { label: 'Name: A to Z', value: 'name' },
    { label: 'Name: Z to A', value: '-name' },
    { label: 'Most Products', value: '-product_count' },
    { label: 'Least Products', value: 'product_count' },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Page Header */}
      <div className="border-b border-black bg-white sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-light tracking-[0.2em] uppercase mb-2">
                Brand Catalog
              </h1>
              <p className="text-xs text-gray-600">
                {filteredAndSortedBrands.length} {filteredAndSortedBrands.length === 1 ? 'brand' : 'brands'}
              </p>
            </div>

            {/* Search and Sort */}
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Search */}
              <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search brands..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 text-sm border border-black focus:outline-none focus:border-gray-600"
                />
              </div>

              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 text-xs border border-black focus:outline-none focus:border-gray-600 bg-white"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {brandsLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
          </div>
        ) : brandsError ? (
          <div className="text-center py-20">
            <p className="text-red-600 text-sm">{brandsError}</p>
          </div>
        ) : filteredAndSortedBrands.length === 0 ? (
          <div className="text-center py-20">
            <Package className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500 text-sm">
              {searchTerm ? 'No brands found matching your search' : 'No brands available'}
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredAndSortedBrands.map((brand) => (
              <BrandCard
                key={brand.id}
                brand={brand}
                products={loadedBrandProducts[brand.slug] || []}
                isExpanded={expandedBrand === brand.slug}
                isLoadingProducts={productsLoading && expandedBrand === brand.slug}
                onExpand={() => handleBrandExpand(brand.slug)}
                onViewAll={() => handleViewAllProducts(brand.slug)}
                onProductClick={handleProductClick}
                onBrandClick={() => handleBrandClick(brand.slug)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Brand Card Component
const BrandCard = ({
  brand,
  products,
  isExpanded,
  isLoadingProducts,
  onExpand,
  onViewAll,
  onProductClick,
  onBrandClick
}) => {
  // Get first 4 products for preview
  const previewProducts = useMemo(() => {
    if (!Array.isArray(products)) return [];
    return products.slice(0, 4);
  }, [products]);

  console.log("Brand Card - products:", products);
  console.log("Brand Card - previewProducts:", previewProducts);return (
    <div className="border border-gray-200 hover:border-black transition-colors">
      {/* Brand Header */}
      <div className="p-6 bg-gray-50 border-b border-gray-200">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4 flex-1">
            {/* Brand Logo */}
            {brand.logo ? (
              <div 
                className="w-16 h-16 flex-shrink-0 bg-white border border-gray-200 rounded overflow-hidden cursor-pointer hover:border-black transition-colors"
                onClick={onBrandClick}
              >
                <img
                  src={brand.logo}
                  alt={brand.name}
                  className="w-full h-full object-contain p-2"
                />
              </div>
            ) : (
              <div 
                className="w-16 h-16 flex-shrink-0 bg-white border border-gray-200 rounded flex items-center justify-center cursor-pointer hover:border-black transition-colors"
                onClick={onBrandClick}
              >
                <TrendingUp className="w-8 h-8 text-gray-300" />
              </div>
            )}

            {/* Brand Info */}
            <div className="flex-1">
              <h2 
                className="text-xl font-light tracking-wide mb-1 cursor-pointer hover:text-gray-600 transition-colors"
                onClick={onBrandClick}
              >
                {brand.name}
              </h2>
              {brand.description && (
                <p className="text-xs text-gray-600 line-clamp-2 mb-2">
                  {brand.description}
                </p>
              )}
              <div className="flex items-center gap-4 text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <Package className="w-3 h-3" />
                  {brand.product_count || 0} {brand.product_count === 1 ? 'product' : 'products'}
                </span>
              </div>
            </div>
          </div>

          {/* Expand/Collapse Button */}
          <button
            onClick={onExpand}
            className="px-4 py-2 text-xs uppercase tracking-wider border border-black hover:bg-black hover:text-white transition-colors"
          >
            {isExpanded ? 'Hide Products' : 'Show Products'}
          </button>
        </div>
      </div>

      {/* Products Preview (Collapsible) */}
      {isExpanded && (
        <div className="p-6">
          {isLoadingProducts ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
            </div>
          ) : (
            <>
              {/* Products Grid - Using ProductGrid component */}
              <div className="mb-6">
                <ProductGrid 
                  products={previewProducts}
                  loading={false}
                  error={null}
                />
              </div>

              {/* View All Button */}
              {products.length > 0 && (
                <div className="text-center pt-4 border-t border-gray-200">
                  <button
                    onClick={onViewAll}
                    className="inline-flex items-center gap-2 px-6 py-3 text-xs uppercase tracking-wider border border-black hover:bg-black hover:text-white transition-colors"
                  >
                    <span>View All {brand.product_count || products.length} Products</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default BrandCatalog;