import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getProductDetails } from '../actions/productActions';
import { ChevronRight, Star, Truck, Shield, Package } from 'lucide-react';
import ProductImageGallery from '../components/products/ProductImageGallery';
import ProductSpecifications from '../components/products/ProductSpecifications';
import ProductReviews from '../components/products/ProductReviews';
import RelatedProducts from '../components/products/RelatedProducts';

const ProductDetails = () => {
  const { slug } = useParams();
  const dispatch = useDispatch();
  
  const { product, loading, error } = useSelector((state) => state.productDetails);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [selectedImage, setSelectedImage] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    dispatch(getProductDetails(slug));
    window.scrollTo(0, 0);
  }, [dispatch, slug]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'KSH',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleAddToCart = () => {
    // Add to cart logic here
    console.log('Adding to cart:', { product, quantity });
  };

  const handleMouseMove = (e) => {
    if (!isZoomed) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePosition({ x, y });
  };

  if (loading) {
    return <ProductDetailsSkeleton />;
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <p className="text-sm text-gray-600">{error}</p>
        <Link to="/products" className="text-xs uppercase tracking-widest hover:opacity-60 mt-4 inline-block">
          Return to Products
        </Link>
      </div>
    );
  }

  if (!product) {
    return null;
  }

  const averageRating = product.average_rating || 0;
  const reviewCount = product.review_count || 0;

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="border-b border-black">
        <div className="w-full px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto py-3 sm:py-4">
          <div className="flex items-center space-x-1 sm:space-x-2 text-[9px] sm:text-xs overflow-x-auto">
            <Link to="/" className="hover:opacity-60 transition-opacity uppercase tracking-widest whitespace-nowrap">
              Home
            </Link>
            <ChevronRight className="w-2.5 h-2.5 sm:w-3 sm:h-3 flex-shrink-0" />
            <Link to="/products" className="hover:opacity-60 transition-opacity uppercase tracking-widest whitespace-nowrap">
              Products
            </Link>
            <ChevronRight className="w-2.5 h-2.5 sm:w-3 sm:h-3 flex-shrink-0" />
            <Link 
              to={`/products?category=${product.category?.slug}`} 
              className="hover:opacity-60 transition-opacity uppercase tracking-widest whitespace-nowrap"
            >
              {product.category?.name}
            </Link>
            <ChevronRight className="w-2.5 h-2.5 sm:w-3 sm:h-3 flex-shrink-0" />
            <span className="text-gray-500 uppercase tracking-widest whitespace-nowrap truncate">{product.name}</span>
          </div>
        </div>
      </div>

      {/* Product Details Section */}
      <div className="w-full px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto py-6 sm:py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12">
          {/* Left: Image Gallery */}
          <div className="w-full">
            <div className="space-y-3 sm:space-y-4">
              {/* Main Image */}
              <div 
                className="relative w-full aspect-square bg-gray-50 overflow-hidden cursor-zoom-in"
                onMouseEnter={() => setIsZoomed(true)}
                onMouseLeave={() => setIsZoomed(false)}
                onMouseMove={handleMouseMove}
              >
                {product.images && product.images.length > 0 ? (
                  <img
                    src={product.images[selectedImage]?.image || product.images[selectedImage]}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-300 ease-out"
                    style={isZoomed ? {
                      transform: 'scale(2)',
                      transformOrigin: `${mousePosition.x}% ${mousePosition.y}%`
                    } : {}}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    No image available
                  </div>
                )}
              </div>

              {/* Thumbnail Grid */}
              {product.images && product.images.length > 1 && (
                <div className="grid grid-cols-4 gap-2 sm:gap-3">
                  {product.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(idx)}
                      className={`aspect-square bg-gray-50 overflow-hidden border-2 transition-all ${
                        selectedImage === idx ? 'border-black' : 'border-transparent hover:border-gray-300'
                      }`}
                    >
                      <img
                        src={img?.image || img}
                        alt={`${product.name} ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right: Product Info */}
          <div className="w-full space-y-4 sm:space-y-6">
            {/* Brand */}
            {product.brand?.name && (
              <p className="text-[9px] sm:text-[10px] uppercase tracking-widest text-gray-500">
                {product.brand.name}
              </p>
            )}

            {/* Product Name */}
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-light tracking-wide leading-tight">
              {product.name}
            </h1>

            {/* Rating */}
            {reviewCount > 0 && (
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="flex items-center space-x-0.5 sm:space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3 h-3 sm:w-4 sm:h-4 ${
                        i < Math.floor(averageRating)
                          ? 'fill-black stroke-black'
                          : 'fill-none stroke-black'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-[10px] sm:text-xs text-gray-600">
                  {averageRating.toFixed(1)} ({reviewCount} {reviewCount === 1 ? 'review' : 'reviews'})
                </span>
              </div>
            )}

            {/* Price */}
            <div className="space-y-2">
              {product.discount_percentage > 0 ? (
                <div className="flex items-baseline space-x-2 sm:space-x-3 flex-wrap">
                  <span className="text-xl sm:text-2xl font-light">{formatPrice(product.final_price)}</span>
                  <span className="text-base sm:text-lg text-gray-400 line-through">
                    {formatPrice(product.price)}
                  </span>
                  <span className="px-2 py-1 bg-black text-white text-[8px] sm:text-[9px] uppercase tracking-widest">
                    Save {product.discount_percentage}%
                  </span>
                </div>
              ) : (
                <span className="text-xl sm:text-2xl font-light">{formatPrice(product.price)}</span>
              )}
            </div>

            {/* Stock Status */}
            <div className="flex items-center space-x-2">
              {product.is_in_stock ? (
                <>
                  <div className="w-2 h-2 bg-black" />
                  <span className="text-[10px] sm:text-xs uppercase tracking-widest">In Stock</span>
                </>
              ) : (
                <>
                  <div className="w-2 h-2 bg-gray-400" />
                  <span className="text-[10px] sm:text-xs uppercase tracking-widest text-gray-500">Out of Stock</span>
                </>
              )}
            </div>

            {/* Short Description */}
            <p className="text-[10px] sm:text-xs leading-relaxed text-gray-600 border-t border-black pt-4 sm:pt-6">
              {product.description}
            </p>

            {/* Quantity Selector */}
            {product.is_in_stock && (
              <div className="space-y-3 sm:space-y-4 border-t border-black pt-4 sm:pt-6">
                <div className="flex items-center space-x-3 sm:space-x-4">
                  <label className="text-[10px] sm:text-xs uppercase tracking-widest whitespace-nowrap">Quantity</label>
                  <div className="flex items-center border border-black">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3 sm:px-4 py-2 border-r border-black hover:bg-black hover:text-white transition-colors text-sm sm:text-base"
                    >
                      −
                    </button>
                    <span className="px-4 sm:px-6 py-2 text-[10px] sm:text-xs min-w-[40px] sm:min-w-[50px] text-center">{quantity}</span>
                    <button
                      onClick={() => setQuantity(Math.min(product.stock_quantity, quantity + 1))}
                      className="px-3 sm:px-4 py-2 border-l border-black hover:bg-black hover:text-white transition-colors text-sm sm:text-base"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Add to Cart Button */}
                <button
                  onClick={handleAddToCart}
                  className="w-full px-4 sm:px-6 py-3 sm:py-4 bg-black text-white text-[10px] sm:text-xs uppercase tracking-widest hover:bg-gray-800 transition-colors"
                >
                  Add to Cart
                </button>

                {/* Add to Wishlist */}
                <button className="w-full px-4 sm:px-6 py-2.5 sm:py-3 border border-black text-[10px] sm:text-xs uppercase tracking-widest hover:bg-black hover:text-white transition-colors">
                  Add to Wishlist
                </button>
              </div>
            )}

            {/* Features */}
            <div className="space-y-2.5 sm:space-y-3 border-t border-black pt-4 sm:pt-6">
              <div className="flex items-start space-x-2.5 sm:space-x-3">
                <Truck className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-[10px] sm:text-xs font-medium uppercase tracking-widest">Free Shipping</p>
                  <p className="text-[9px] sm:text-[10px] text-gray-600 mt-0.5 sm:mt-1">On orders over $500</p>
                </div>
              </div>
              <div className="flex items-start space-x-2.5 sm:space-x-3">
                <Shield className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-[10px] sm:text-xs font-medium uppercase tracking-widest">2 Year Warranty</p>
                  <p className="text-[9px] sm:text-[10px] text-gray-600 mt-0.5 sm:mt-1">Full manufacturer warranty</p>
                </div>
              </div>
              <div className="flex items-start space-x-2.5 sm:space-x-3">
                <Package className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-[10px] sm:text-xs font-medium uppercase tracking-widest">30 Day Returns</p>
                  <p className="text-[9px] sm:text-[10px] text-gray-600 mt-0.5 sm:mt-1">Free returns within 30 days</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="mt-12 sm:mt-16 lg:mt-20 border-t border-black">
          {/* Tab Headers */}
          <div className="flex border-b border-black overflow-x-auto">
            <button
              onClick={() => setActiveTab('description')}
              className={`px-4 sm:px-6 py-3 sm:py-4 text-[10px] sm:text-xs uppercase tracking-widest transition-colors whitespace-nowrap ${
                activeTab === 'description'
                  ? 'bg-black text-white'
                  : 'hover:bg-gray-50'
              }`}
            >
              Description
            </button>
            <button
              onClick={() => setActiveTab('specifications')}
              className={`px-4 sm:px-6 py-3 sm:py-4 text-[10px] sm:text-xs uppercase tracking-widest transition-colors border-l border-black whitespace-nowrap ${
                activeTab === 'specifications'
                  ? 'bg-black text-white'
                  : 'hover:bg-gray-50'
              }`}
            >
              Specifications
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`px-4 sm:px-6 py-3 sm:py-4 text-[10px] sm:text-xs uppercase tracking-widest transition-colors border-l border-black whitespace-nowrap ${
                activeTab === 'reviews'
                  ? 'bg-black text-white'
                  : 'hover:bg-gray-50'
              }`}
            >
              Reviews ({reviewCount})
            </button>
          </div>

          {/* Tab Content */}
          <div className="py-6 sm:py-8 lg:py-12">
            {activeTab === 'description' && (
              <div className="max-w-4xl">
                <p className="text-[10px] sm:text-xs leading-relaxed text-gray-600 whitespace-pre-line">
                  {product.description}
                </p>
              </div>
            )}

            {activeTab === 'specifications' && (
              <ProductSpecifications specifications={product.specifications} />
            )}

            {activeTab === 'reviews' && (
              <ProductReviews reviews={product.reviews} productId={product.id} />
            )}
          </div>
        </div>

        {/* Related Products */}
        <RelatedProducts category={product.category?.slug} currentProductId={product.id} />
      </div>
    </div>
  );
};

// Skeleton Loader Component
const ProductDetailsSkeleton = () => {
  return (
    <div className="min-h-screen bg-white">
      <div className="border-b border-black">
        <div className="w-full px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto py-3 sm:py-4">
          <div className="h-3 sm:h-4 w-48 sm:w-96 bg-gray-200 animate-pulse" />
        </div>
      </div>

      <div className="w-full px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto py-6 sm:py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12">
          {/* Image Gallery Skeleton */}
          <div className="space-y-3 sm:space-y-4">
            <div className="aspect-square w-full bg-gray-200 animate-pulse" />
            <div className="grid grid-cols-4 gap-2 sm:gap-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="aspect-square w-full bg-gray-200 animate-pulse" />
              ))}
            </div>
          </div>

          {/* Product Info Skeleton */}
          <div className="space-y-4 sm:space-y-6">
            <div className="h-2.5 sm:h-3 w-20 sm:w-24 bg-gray-200 animate-pulse" />
            <div className="h-6 sm:h-8 w-full bg-gray-200 animate-pulse" />
            <div className="h-3 sm:h-4 w-24 sm:w-32 bg-gray-200 animate-pulse" />
            <div className="h-6 sm:h-8 w-32 sm:w-40 bg-gray-200 animate-pulse" />
            <div className="h-3 sm:h-4 w-20 sm:w-24 bg-gray-200 animate-pulse" />
            <div className="space-y-2 pt-4 sm:pt-6">
              <div className="h-2.5 sm:h-3 w-full bg-gray-200 animate-pulse" />
              <div className="h-2.5 sm:h-3 w-full bg-gray-200 animate-pulse" />
              <div className="h-2.5 sm:h-3 w-3/4 bg-gray-200 animate-pulse" />
            </div>
            <div className="h-10 sm:h-12 w-full bg-gray-200 animate-pulse" />
            <div className="h-10 sm:h-12 w-full bg-gray-200 animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;