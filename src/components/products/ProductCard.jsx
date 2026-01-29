import { Link } from 'react-router-dom';
import AddToCartButton from './AddToCartButton';

const ProductCard = ({ product }) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'KSH',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="group relative flex flex-col h-full">
      <Link to={`/product/${product.slug}`} className="flex-1 flex flex-col">
        {/* Image Container - Properly centered and contained */}
        <div className="relative aspect-[3/4] overflow-hidden mb-3">
          <img
            src={product.primary_image || '/placeholder.jpg'}
            alt={product.name}
            className="absolute inset-0 w-[100%] h-auto object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
            loading="lazy"
          />
          
          {/* Badges */}
          <div className="absolute top-3 left-3 right-3 flex items-start justify-between gap-2 pointer-events-none">
            {!product.is_in_stock && (
              <div className="px-2.5 py-1 bg-white/95 backdrop-blur-sm shadow-sm">
                <span className="text-[10px] font-medium uppercase tracking-wider">
                  Out of Stock
                </span>
              </div>
            )}
            
            {product.discount_percentage > 0 && (
              <div className="ml-auto px-2.5 py-1 bg-black text-white shadow-sm">
                <span className="text-[10px] font-medium uppercase tracking-wider">
                  -{product.discount_percentage}%
                </span>
              </div>
            )}
          </div>

          {/* Add to Cart Button - Appears on Hover (Desktop) */}
          <div className="absolute inset-x-3 bottom-3 opacity-0 md:group-hover:opacity-100 transition-opacity duration-300 pointer-events-none group-hover:pointer-events-auto">
            <AddToCartButton 
              product={product}
              quantity={1}
              variant="card-hover"
            />
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-1.5 flex-1 flex flex-col">
          {/* Brand */}
          {product.brand_name && (
            <p className="text-[10px] uppercase tracking-widest text-gray-500 font-medium">
              {product.brand_name}
            </p>
          )}

          {/* Name */}
          <h3 className="text-sm font-normal leading-snug group-hover:opacity-70 transition-opacity line-clamp-2 flex-1">
            {product.name}
          </h3>

          {/* Price */}
          <div className="flex items-baseline gap-2 pt-1">
            {product.discount_percentage > 0 ? (
              <>
                <span className="text-sm font-semibold">
                  {formatPrice(product.final_price)}
                </span>
                <span className="text-xs text-gray-400 line-through">
                  {formatPrice(product.price)}
                </span>
              </>
            ) : (
              <span className="text-sm font-semibold">
                {formatPrice(product.price)}
              </span>
            )}
          </div>
        </div>
      </Link>

      {/* Quick Add for Mobile - Below Card */}
      <div className="md:hidden mt-3">
        <AddToCartButton 
          product={product}
          quantity={1}
          variant="card-mobile"
        />
      </div>
    </div>
  );
};

export default ProductCard;