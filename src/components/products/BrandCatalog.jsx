import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { listBrands } from '../../actions/productActions';
import { ChevronRight } from 'lucide-react';
import { Skeleton } from "@/components/ui/skeleton";

const BrandCatalog = () => {
  const dispatch = useDispatch();
  const { brands, loading, error } = useSelector((state) => state.brandList);

  useEffect(() => {
    dispatch(listBrands());
  }, [dispatch]);

  // Extract brands array from API response
  const brandsList = Array.isArray(brands?.results) ? brands.results : 
                     Array.isArray(brands) ? brands : [];

  // Filter out "Others" brand and limit to first 8 brands
  const displayBrands = brandsList
    .filter(brand => brand.slug !== 'others')
    .slice(0, 100);

  return (
    <div>
      {/* Section Header */}
      <div className="flex items-center justify-between mb-12">
        <div>
          <h2 className="text-2xl md:text-3xl font-light tracking-[0.2em] uppercase mb-2">
            Brands
          </h2>
          <p className="text-xs tracking-widest uppercase text-gray-600">
            Premium Audio Partners
          </p>
        </div>
      </div>

      {/* Brands Grid */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <BrandSkeleton key={i} />
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <p className="text-xs text-gray-500">{error}</p>
        </div>
      ) : displayBrands.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-xs text-gray-500">No brands available</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {displayBrands.map((brand) => (
            <BrandCard key={brand.id} brand={brand} />
          ))}
        </div>
      )}
    </div>
  );
};

// Brand Card Component
const BrandCard = ({ brand }) => {
  return (
    <Link
      to={`/products/brand/${brand.slug}`}
      className="group relative aspect-square border border-black overflow-hidden bg-white hover:shadow-lg transition-all duration-300"
    >
      {/* Brand Logo/Image Container */}
      <div className="absolute inset-0 flex items-center justify-center p-8">
        {brand.logo ? (
          <img
            src={brand.logo}
            alt={brand.name}
            className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="text-center">
            <span className="text-xl font-light tracking-[0.2em] uppercase">
              {brand.name}
            </span>
          </div>
        )}
      </div>

      {/* Overlay on Hover */}
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />

      {/* Product Count Badge */}
      {brand.product_count > 0 && (
        <div className="absolute bottom-0 left-0 right-0 bg-black/90 backdrop-blur-sm py-2 px-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <p className="text-xs text-white text-center tracking-wider">
            {brand.product_count} {brand.product_count === 1 ? 'Product' : 'Products'}
          </p>
        </div>
      )}
    </Link>
  );
};

// Skeleton Loader
const BrandSkeleton = () => {
  return (
    <div className="relative aspect-square border border-black overflow-hidden bg-white">
      <div className="absolute inset-0 flex items-center justify-center p-8">
        <Skeleton className="w-full h-full rounded-none" />
      </div>
    </div>
  );
};

export default BrandCatalog;