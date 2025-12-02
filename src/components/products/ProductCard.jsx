import { Link } from 'react-router-dom';

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
    <Link to={`/products/${product.slug}`} className="group block">
      <div className="space-y-3">
        {/* Image Container */}
        <div className="relative aspect-[3/4] bg-gray-50 border border-black overflow-hidden">
          <img
            src={product.primary_image || '/placeholder.jpg'}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
          
          {/* Stock Badge */}
          {!product.is_in_stock && (
            <div className="absolute top-2 left-2 px-2 py-1 bg-white border border-black">
              <span className="text-[9px] uppercase tracking-widest">
                Out of Stock
              </span>
            </div>
          )}

          {/* Sale Badge */}
          {product.discount_percentage > 0 && (
            <div className="absolute top-2 right-2 px-2 py-1 bg-black text-white">
              <span className="text-[9px] uppercase tracking-widest">
                Sale
              </span>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-1.5">
          {/* Brand */}
          <p className="text-[9px] uppercase tracking-widest text-gray-500">
            {product.brand_name}
          </p>

          {/* Name */}
          <h3 className="text-xs font-light leading-tight group-hover:opacity-60 transition-opacity line-clamp-2">
            {product.name}
          </h3>

          {/* Price */}
          <div className="flex items-center space-x-2">
            {product.discount_percentage > 0 ? (
              <>
                <span className="text-xs font-medium">
                  {formatPrice(product.final_price)}
                </span>
                <span className="text-[10px] text-gray-400 line-through">
                  {formatPrice(product.price)}
                </span>
              </>
            ) : (
              <span className="text-xs font-medium">
                {formatPrice(product.price)}
              </span>
            )}
          </div>

          {/* Stock Status */}
          <p className="text-[9px] uppercase tracking-widest text-gray-500">
            {product.is_in_stock ? 'In Stock' : 'Out of Stock'}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;