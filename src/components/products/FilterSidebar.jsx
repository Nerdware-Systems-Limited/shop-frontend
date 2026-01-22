import { useEffect, useState, useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { X, Search, TrendingUp, Package, DollarSign } from 'lucide-react';
import { listCategories, listBrands } from '../../actions/productActions';

const FilterSidebar = ({ filters, onFilterChange, onClearFilters, onClose }) => {
  const dispatch = useDispatch();
  const { categories, loading: categoriesLoading } = useSelector((state) => state.categoryList);
  const { brands, loading: brandsLoading } = useSelector((state) => state.brandList);

  const [localFilters, setLocalFilters] = useState(filters);
  const [categorySearch, setCategorySearch] = useState('');
  const [brandSearch, setBrandSearch] = useState('');
  const [priceError, setPriceError] = useState('');

  console.log(brands)

  // Load categories and brands on mount
  useEffect(() => {
    dispatch(listCategories());
    dispatch(listBrands());
  }, [dispatch]);

  // Sync local filters with prop changes
  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  // Process categories and brands data
  const categoriesList = useMemo(() => {
    return Array.isArray(categories?.results) ? categories.results : 
           Array.isArray(categories) ? categories : [];
  }, [categories]);

  const brandsList = useMemo(() => {
    return Array.isArray(brands?.results) ? brands.results : 
           Array.isArray(brands) ? brands : [];
  }, [brands]);

  // Filtered categories based on search
  const filteredCategories = useMemo(() => {
    if (!categorySearch.trim()) return categoriesList;
    return categoriesList.filter(cat => 
      cat.name.toLowerCase().includes(categorySearch.toLowerCase())
    );
  }, [categoriesList, categorySearch]);

  // Filtered brands based on search
  const filteredBrands = useMemo(() => {
    if (!brandSearch.trim()) return brandsList;
    return brandsList.filter(brand => 
      brand.name.toLowerCase().includes(brandSearch.toLowerCase())
    );
  }, [brandsList, brandSearch]);

  // Calculate active filters count
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (localFilters.category) count++;
    if (localFilters.brand) count++;
    if (localFilters.minPrice > 0) count++;
    if (localFilters.maxPrice < 1000000) count++;
    if (localFilters.inStock) count++;
    if (localFilters.onSale) count++;
    return count;
  }, [localFilters]);

  // Debounced filter change handler
  const handleFilterChange = useCallback((key, value) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
    onFilterChange(newFilters);
  }, [localFilters, onFilterChange]);

  // Price validation
  const handlePriceChange = useCallback((key, value) => {
    const numValue = parseInt(value) || 0;
    const minPrice = key === 'minPrice' ? numValue : localFilters.minPrice;
    const maxPrice = key === 'maxPrice' ? numValue : localFilters.maxPrice;

    if (minPrice > maxPrice && maxPrice > 0) {
      setPriceError('Min price cannot exceed max price');
      return;
    }

    setPriceError('');
    handleFilterChange(key, numValue);
  }, [localFilters, handleFilterChange]);

  // Clear all filters
  const handleClearFilters = useCallback(() => {
    const resetFilters = {
      category: '',
      brand: '',
      minPrice: 0,
      maxPrice: 1000000,
      inStock: false,
      onSale: false,
    };
    setLocalFilters(resetFilters);
    setCategorySearch('');
    setBrandSearch('');
    setPriceError('');
    onClearFilters();
  }, [onClearFilters]);

  return (
    <div className="w-full h-full bg-white flex flex-col">
      {/* Header with Active Filter Badge */}
      <div className="flex items-center justify-between p-4 border-b border-black flex-shrink-0">
        <div className="flex items-center gap-2">
          <h2 className="text-sm uppercase tracking-widest font-medium">Filters</h2>
          {activeFiltersCount > 0 && (
            <span className="px-2 py-0.5 bg-black text-white text-[10px] font-medium rounded-full">
              {activeFiltersCount}
            </span>
          )}
        </div>
        {onClose && (
          <button 
            onClick={onClose} 
            className="lg:hidden hover:bg-gray-100 p-1 rounded transition-colors"
            aria-label="Close filters"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Filter Content - Scrollable */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-6">
          {/* Category Filter */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Package className="w-3.5 h-3.5" />
              <h3 className="text-xs uppercase tracking-widest font-medium">Category</h3>
              {localFilters.category && (
                <span className="ml-auto text-[10px] text-gray-500">
                  {categoriesList.find(c => c.slug === localFilters.category)?.name}
                </span>
              )}
            </div>

            {/* Category Search */}
            {categoriesList.length > 5 && (
              <div className="relative">
                <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search categories..."
                  value={categorySearch}
                  onChange={(e) => setCategorySearch(e.target.value)}
                  className="w-full pl-7 pr-2 py-1.5 text-xs border border-gray-300 focus:border-black focus:outline-none rounded"
                />
              </div>
            )}

            <div className="space-y-2 max-h-48 overflow-y-auto">
              <label className="flex items-center space-x-2 cursor-pointer group">
                <input
                  type="radio"
                  name="category"
                  value=""
                  checked={localFilters.category === ''}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                  className="w-3 h-3 border-black accent-black cursor-pointer"
                />
                <span className="text-xs group-hover:text-gray-600 transition-colors">
                  All Categories
                </span>
              </label>

              {categoriesLoading ? (
                <div className="text-xs text-gray-400 py-2">Loading categories...</div>
              ) : filteredCategories.length === 0 ? (
                <div className="text-xs text-gray-400 py-2">No categories found</div>
              ) : (
                filteredCategories.map((category) => (
                  <label key={category.id} className="flex items-center space-x-2 cursor-pointer group">
                    <input
                      type="radio"
                      name="category"
                      value={category.slug}
                      checked={localFilters.category === category.slug}
                      onChange={(e) => handleFilterChange('category', e.target.value)}
                      className="w-3 h-3 border-black accent-black cursor-pointer"
                    />
                    <span className="text-xs group-hover:text-gray-600 transition-colors">
                      {category.name}
                    </span>
                  </label>
                ))
              )}
            </div>
          </div>

          {/* Brand Filter */}
          <div className="space-y-3 pt-4 border-t border-gray-200">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-3.5 h-3.5" />
              <h3 className="text-xs uppercase tracking-widest font-medium">Brand</h3>
              {localFilters.brand && (
                <span className="ml-auto text-[10px] text-gray-500">
                  {brandsList.find(b => b.slug === localFilters.brand)?.name}
                </span>
              )}
            </div>

            {/* Brand Search */}
            {brandsList.length > 5 && (
              <div className="relative">
                <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search brands..."
                  value={brandSearch}
                  onChange={(e) => setBrandSearch(e.target.value)}
                  className="w-full pl-7 pr-2 py-1.5 text-xs border border-gray-300 focus:border-black focus:outline-none rounded"
                />
              </div>
            )}

            <div className="space-y-2 max-h-48 overflow-y-auto">
              <label className="flex items-center space-x-2 cursor-pointer group">
                <input
                  type="radio"
                  name="brand"
                  value=""
                  checked={localFilters.brand === ''}
                  onChange={(e) => handleFilterChange('brand', e.target.value)}
                  className="w-3 h-3 border-black accent-black cursor-pointer"
                />
                <span className="text-xs group-hover:text-gray-600 transition-colors">
                  All Brands
                </span>
              </label>

              {brandsLoading ? (
                <div className="text-xs text-gray-400 py-2">Loading brands...</div>
              ) : filteredBrands.length === 0 ? (
                <div className="text-xs text-gray-400 py-2">No brands found</div>
              ) : (
                filteredBrands.map((brand) => (
                  <label key={brand.id} className="flex items-center space-x-2 cursor-pointer group">
                    <input
                      type="radio"
                      name="brand"
                      value={brand.slug}
                      checked={localFilters.brand === brand.slug}
                      onChange={(e) => handleFilterChange('brand', e.target.value)}
                      className="w-3 h-3 border-black accent-black cursor-pointer"
                    />
                    <span className="text-xs group-hover:text-gray-600 transition-colors">
                      {brand.name}
                    </span>
                  </label>
                ))
              )}
            </div>
          </div>

          {/* Price Range */}
          <div className="space-y-3 pt-4 border-t border-gray-200">
            <div className="flex items-center gap-2">
              <DollarSign className="w-3.5 h-3.5" />
              <h3 className="text-xs uppercase tracking-widest font-medium">Price Range</h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={localFilters.minPrice || ''}
                  onChange={(e) => handlePriceChange('minPrice', e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-gray-300 focus:border-black focus:outline-none rounded"
                  min="0"
                />
                <span className="text-xs text-gray-400">—</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={localFilters.maxPrice || ''}
                  onChange={(e) => handlePriceChange('maxPrice', e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-gray-300 focus:border-black focus:outline-none rounded"
                  min="0"
                />
              </div>
              {priceError && (
                <p className="text-[10px] text-red-600">{priceError}</p>
              )}
              {localFilters.minPrice > 0 || localFilters.maxPrice < 1000000 ? (
                <p className="text-[10px] text-gray-500">
                  KSH {localFilters.minPrice.toLocaleString()} - KSH {localFilters.maxPrice.toLocaleString()}
                </p>
              ) : null}
            </div>
          </div>

          {/* Availability */}
          <div className="space-y-3 pt-4 border-t border-gray-200">
            <h3 className="text-xs uppercase tracking-widest font-medium">Availability</h3>
            <label className="flex items-center space-x-2 cursor-pointer group">
              <input
                type="checkbox"
                checked={localFilters.inStock}
                onChange={(e) => handleFilterChange('inStock', e.target.checked)}
                className="w-4 h-4 border-black accent-black cursor-pointer rounded"
              />
              <span className="text-xs group-hover:text-gray-600 transition-colors">
                In Stock Only
              </span>
            </label>
          </div>

          {/* Special Offers */}
          <div className="space-y-3 pt-4 border-t border-gray-200">
            <h3 className="text-xs uppercase tracking-widest font-medium">Special Offers</h3>
            <label className="flex items-center space-x-2 cursor-pointer group">
              <input
                type="checkbox"
                checked={localFilters.onSale}
                onChange={(e) => handleFilterChange('onSale', e.target.checked)}
                className="w-4 h-4 border-black accent-black cursor-pointer rounded"
              />
              <span className="text-xs group-hover:text-gray-600 transition-colors">
                On Sale Items
              </span>
            </label>
          </div>
        </div>
      </div>

      {/* Footer - Fixed at Bottom */}
      <div className="flex-shrink-0 p-4 border-t border-gray-200 bg-white space-y-2">
        {activeFiltersCount > 0 && (
          <div className="text-[10px] text-gray-500 text-center mb-2">
            {activeFiltersCount} active {activeFiltersCount === 1 ? 'filter' : 'filters'}
          </div>
        )}
        <button
          onClick={handleClearFilters}
          disabled={activeFiltersCount === 0}
          className={`w-full px-4 py-2.5 text-xs uppercase tracking-widest border transition-all ${
            activeFiltersCount > 0
              ? 'border-black hover:bg-black hover:text-white cursor-pointer'
              : 'border-gray-300 text-gray-400 cursor-not-allowed'
          }`}
        >
          Clear All Filters
        </button>
      </div>
    </div>
  );
};

export default FilterSidebar;