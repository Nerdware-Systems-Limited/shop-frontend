import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { X } from 'lucide-react';
import { listCategories, listBrands } from '../../actions/productActions';

const FilterSidebar = ({ filters, onFilterChange, onClearFilters, onClose }) => {
  const dispatch = useDispatch();
  const { categories } = useSelector((state) => state.categoryList);
  const { brands } = useSelector((state) => state.brandList);

  console.log(categories, brands)

  const [localFilters, setLocalFilters] = useState(filters);

  useEffect(() => {
    dispatch(listCategories());
    dispatch(listBrands());
  }, [dispatch]);

  const handleFilterChange = (key, value) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleClearFilters = () => {
    setLocalFilters({
      category: '',
      brand: '',
      minPrice: 0,
      maxPrice: 10000,
      inStock: false,
      onSale: false,
    });
    onClearFilters();
  };

  // Ensure categories and brands are arrays
  const categoriesList = Array.isArray(categories?.results) ? categories?.results : [];
  const brandsList = Array.isArray(brands?.results) ? brands?.results : [];
  console.log('Categories List:', categoriesList);
  console.log('Brands List:', brandsList);

  return (
    <div className="w-full h-full bg-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-black">
        <h2 className="text-sm uppercase tracking-widest font-medium">Filters</h2>
        <button onClick={onClose} className="lg:hidden">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Filter Content */}
      <div className="p-4 space-y-6 overflow-y-auto h-[calc(100%-140px)]">
        {/* Category Filter */}
        <div className="space-y-3">
          <h3 className="text-xs uppercase tracking-widest font-medium">Category</h3>
          <div className="space-y-2">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                name="category"
                value=""
                checked={localFilters.category === ''}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="w-3 h-3 border-black"
              />
              <span className="text-xs">All</span>
            </label>
            {categoriesList.map((category) => (
              <label key={category.id} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="category"
                  value={category.slug}
                  checked={localFilters.category === category.slug}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                  className="w-3 h-3 border-black"
                />
                <span className="text-xs">{category.name}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Brand Filter */}
        <div className="space-y-3 pt-4 border-t border-black">
          <h3 className="text-xs uppercase tracking-widest font-medium">Brand</h3>
          <div className="space-y-2">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                name="brand"
                value=""
                checked={localFilters.brand === ''}
                onChange={(e) => handleFilterChange('brand', e.target.value)}
                className="w-3 h-3 border-black"
              />
              <span className="text-xs">All</span>
            </label>
            {brandsList.map((brand) => (
              <label key={brand.id} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="brand"
                  value={brand.slug}
                  checked={localFilters.brand === brand.slug}
                  onChange={(e) => handleFilterChange('brand', e.target.value)}
                  className="w-3 h-3 border-black"
                />
                <span className="text-xs">{brand.name}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Price Range */}
        <div className="space-y-3 pt-4 border-t border-black">
          <h3 className="text-xs uppercase tracking-widest font-medium">Price Range</h3>
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <input
                type="number"
                placeholder="Min"
                value={localFilters.minPrice}
                onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                className="w-full px-2 py-1.5 text-xs border border-black focus:outline-none"
              />
              <span className="text-xs">—</span>
              <input
                type="number"
                placeholder="Max"
                value={localFilters.maxPrice}
                onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                className="w-full px-2 py-1.5 text-xs border border-black focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Availability */}
        <div className="space-y-3 pt-4 border-t border-black">
          <h3 className="text-xs uppercase tracking-widest font-medium">Availability</h3>
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={localFilters.inStock}
              onChange={(e) => handleFilterChange('inStock', e.target.checked)}
              className="w-3 h-3 border-black"
            />
            <span className="text-xs">In Stock Only</span>
          </label>
        </div>

        {/* Special Offers */}
        <div className="space-y-3 pt-4 border-t border-black">
          <h3 className="text-xs uppercase tracking-widest font-medium">Special Offers</h3>
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={localFilters.onSale}
              onChange={(e) => handleFilterChange('onSale', e.target.checked)}
              className="w-3 h-3 border-black"
            />
            <span className="text-xs">On Sale</span>
          </label>
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-black bg-white">
        <button
          onClick={handleClearFilters}
          className="w-full px-4 py-2 text-xs uppercase tracking-widest border border-black hover:bg-black hover:text-white transition-colors"
        >
          Clear All Filters
        </button>
      </div>
    </div>
  );
};

export default FilterSidebar;