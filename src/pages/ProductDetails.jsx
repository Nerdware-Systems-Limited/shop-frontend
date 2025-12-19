import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getProductDetails, listProducts } from '../actions/productActions';
import { ChevronRight, Star, Truck, Shield, Package } from 'lucide-react';
import ProductImageGallery from '../components/products/ProductImageGallery';
import ProductSpecifications from '../components/products/ProductSpecifications';
import ProductReviews from '../components/products/ProductReviews';
import RelatedProducts from '../components/products/RelatedProducts';
import { Skeleton } from '../components/ui/skeleton';

const ProductDetails = () => {
  const { slug } = useParams();
  const dispatch = useDispatch();
  
  const { product, loading, error } = useSelector((state) => state.productDetails);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');

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
    <div className="min-h-screen">
      {/* Breadcrumb */}
      <div className="border-b border-black">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center space-x-2 text-xs">
            <Link to="/" className="hover:opacity-60 transition-opacity uppercase tracking-widest">
              Home
            </Link>
            <ChevronRight className="w-3 h-3" />
            <Link to="/products" className="hover:opacity-60 transition-opacity uppercase tracking-widest">
              Products
            </Link>
            <ChevronRight className="w-3 h-3" />
            <Link 
              to={`/products?category=${product.category?.slug}`} 
              className="hover:opacity-60 transition-opacity uppercase tracking-widest"
            >
              {product.category?.name}
            </Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-gray-500 uppercase tracking-widest">{product.name}</span>
          </div>
        </div>
      </div>

      {/* Product Details Section */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left: Image Gallery */}
          <ProductImageGallery images={product.images} productName={product.name} />

          {/* Right: Product Info */}
          <div className="space-y-6">
            {/* Brand */}
            <p className="text-[10px] uppercase tracking-widest text-gray-500">
              {product.brand?.name}
            </p>

            {/* Product Name */}
            <h1 className="text-2xl md:text-3xl font-light tracking-wide">
              {product.name}
            </h1>

            {/* Rating */}
            {reviewCount > 0 && (
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(averageRating)
                          ? 'fill-black stroke-black'
                          : 'fill-none stroke-black'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs text-gray-600">
                  {averageRating.toFixed(1)} ({reviewCount} {reviewCount === 1 ? 'review' : 'reviews'})
                </span>
              </div>
            )}

            {/* Price */}
            <div className="space-y-2">
              {product.discount_percentage > 0 ? (
                <div className="flex items-baseline space-x-3">
                  <span className="text-2xl font-light">{formatPrice(product.final_price)}</span>
                  <span className="text-lg text-gray-400 line-through">
                    {formatPrice(product.price)}
                  </span>
                  <span className="px-2 py-1 bg-black text-white text-[9px] uppercase tracking-widest">
                    Save {product.discount_percentage}%
                  </span>
                </div>
              ) : (
                <span className="text-2xl font-light">{formatPrice(product.price)}</span>
              )}
            </div>

            {/* Stock Status */}
            <div className="flex items-center space-x-2">
              {product.is_in_stock ? (
                <>
                  <div className="w-2 h-2 bg-black" />
                  <span className="text-xs uppercase tracking-widest">In Stock</span>
                </>
              ) : (
                <>
                  <div className="w-2 h-2 bg-gray-400" />
                  <span className="text-xs uppercase tracking-widest text-gray-500">Out of Stock</span>
                </>
              )}
            </div>

            {/* Short Description */}
            <p className="text-xs leading-relaxed text-gray-600 border-t border-black pt-6">
              {product.description}
            </p>

            {/* Quantity Selector */}
            {product.is_in_stock && (
              <div className="space-y-4 border-t border-black pt-6">
                <div className="flex items-center space-x-4">
                  <label className="text-xs uppercase tracking-widest">Quantity</label>
                  <div className="flex items-center border border-black">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-4 py-2 border-r border-black hover:bg-black hover:text-white transition-colors"
                    >
                      −
                    </button>
                    <span className="px-6 py-2 text-xs">{quantity}</span>
                    <button
                      onClick={() => setQuantity(Math.min(product.stock_quantity, quantity + 1))}
                      className="px-4 py-2 border-l border-black hover:bg-black hover:text-white transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Add to Cart Button */}
                <button
                  onClick={handleAddToCart}
                  className="w-full px-6 py-4 bg-black text-white text-xs uppercase tracking-widest hover:bg-gray-800 transition-colors"
                >
                  Add to Cart
                </button>

                {/* Add to Wishlist */}
                <button className="w-full px-6 py-3 border border-black text-xs uppercase tracking-widest hover:bg-black hover:text-white transition-colors">
                  Add to Wishlist
                </button>
              </div>
            )}

            {/* Features */}
            <div className="space-y-3 border-t border-black pt-6">
              <div className="flex items-start space-x-3">
                <Truck className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-medium uppercase tracking-widest">Free Shipping</p>
                  <p className="text-[10px] text-gray-600 mt-1">On orders over $500</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Shield className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-medium uppercase tracking-widest">2 Year Warranty</p>
                  <p className="text-[10px] text-gray-600 mt-1">Full manufacturer warranty</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Package className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-medium uppercase tracking-widest">30 Day Returns</p>
                  <p className="text-[10px] text-gray-600 mt-1">Free returns within 30 days</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="mt-20 border-t border-black">
          {/* Tab Headers */}
          <div className="flex border-b border-black">
            <button
              onClick={() => setActiveTab('description')}
              className={`px-6 py-4 text-xs uppercase tracking-widest transition-colors ${
                activeTab === 'description'
                  ? 'bg-black text-white'
                  : 'hover:bg-gray-50'
              }`}
            >
              Description
            </button>
            <button
              onClick={() => setActiveTab('specifications')}
              className={`px-6 py-4 text-xs uppercase tracking-widest transition-colors border-l border-black ${
                activeTab === 'specifications'
                  ? 'bg-black text-white'
                  : 'hover:bg-gray-50'
              }`}
            >
              Specifications
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`px-6 py-4 text-xs uppercase tracking-widest transition-colors border-l border-black ${
                activeTab === 'reviews'
                  ? 'bg-black text-white'
                  : 'hover:bg-gray-50'
              }`}
            >
              Reviews ({reviewCount})
            </button>
          </div>

          {/* Tab Content */}
          <div className="py-12">
            {activeTab === 'description' && (
              <div className="max-w-4xl">
                <p className="text-xs leading-relaxed text-gray-600 whitespace-pre-line">
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
    <div className="min-h-screen">
      <div className="border-b border-black">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <Skeleton className="h-4 w-96" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image Gallery Skeleton */}
          <div className="space-y-4">
            <Skeleton className="aspect-square w-full" />
            <div className="grid grid-cols-4 gap-2">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="aspect-square w-full" />
              ))}
            </div>
          </div>

          {/* Product Info Skeleton */}
          <div className="space-y-6">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-8 w-40" />
            <Skeleton className="h-4 w-24" />
            <div className="space-y-2 pt-6">
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-3/4" />
            </div>
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;