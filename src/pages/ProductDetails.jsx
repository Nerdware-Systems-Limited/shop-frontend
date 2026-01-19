import { useEffect, useState, useMemo, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getProductDetails } from '../actions/productActions';
import { ChevronRight, Star, Truck, Shield, Package, Share2, Heart, AlertCircle, Check, ZoomIn } from 'lucide-react';
import ProductImageGallery from '../components/products/ProductImageGallery';
import ProductSpecifications from '../components/products/ProductSpecifications';
import ProductReviews from '../components/products/ProductReviews';
import RelatedProducts from '../components/products/RelatedProducts';
import ProductSEO from '../components/products/ProductSEO';
import AddToCartButton from '../components/products/AddToCartButton';

const ProductDetails = () => {
  const { slug } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { product, loading, error } = useSelector((state) => state.productDetails);
  const { cartItems } = useSelector((state) => state.cart);
  
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  const [isWishlisted, setIsWishlisted] = useState(false);
  const tabsSectionRef = useRef(null);

  useEffect(() => {
    dispatch(getProductDetails(slug));
    window.scrollTo(0, 0);
  }, [dispatch, slug]);

  // Enhanced price formatting with proper KES symbol
  const formatPrice = (price) => {
    if (!price) return 'KES 0';
    return `KES ${new Intl.NumberFormat('en-KE', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price)}`;
  };

  // Calculate savings amount
  const savingsAmount = useMemo(() => {
    if (!product || product.discount_percentage <= 0) return 0;
    return product.price - product.final_price;
  }, [product]);

  // Stock level indicator with colors
  const getStockStatus = () => {
    if (!product) return { status: 'Unknown', color: 'gray', available: 0 };
    
    const availableQty = product.available_quantity || product.stock_quantity || 0;
    
    if (availableQty === 0) {
      return { status: 'Out of Stock', color: 'red', available: 0 };
    } else if (availableQty <= (product.low_stock_threshold || 5)) {
      return { status: `Only ${availableQty} left!`, color: 'orange', available: availableQty };
    } else if (availableQty <= 20) {
      return { status: `${availableQty} in stock`, color: 'yellow', available: availableQty };
    } else {
      return { status: 'In Stock', color: 'green', available: availableQty };
    }
  };

  const stockStatus = getStockStatus();

  // Warehouse stock display
  const warehouseStockInfo = useMemo(() => {
    if (!product?.warehouse_stock_summary) return null;
    const summary = product.warehouse_stock_summary;
    return {
      total: summary.total_quantity || 0,
      available: summary.total_available || 0,
      reserved: summary.total_reserved || 0,
      warehouses: summary.warehouse_count || 0
    };
  }, [product]);

  // Parse features from specifications
  const parsedFeatures = useMemo(() => {
    if (!product?.specifications?.key_features) return [];
    
    const features = product.specifications.key_features;
    
    if (typeof features === 'string') {
      return features
        .split('\n')
        .map(f => f.replace(/^[•\-*]\s*/, '').trim())
        .filter(f => f.length > 0);
    }
    
    if (Array.isArray(features)) {
      return features;
    }
    
    return [];
  }, [product]);

  // Description rendering
  const renderDescription = () => {
    if (!product?.description) return null;
    
    // Normalize line breaks (handle \r\n, \n, etc.)
    const content = product.description.replace(/\r\n/g, '\n').trim();
    
    // Split by double line breaks for major sections
    const sections = content.split('\n\n').filter(s => s.trim());
    
    return (
      <div className="max-w-none prose prose-sm sm:prose lg:prose-lg">
        {sections.map((section, sectionIdx) => {
          const trimmed = section.trim();
          const lines = trimmed.split('\n').map(l => l.trim()).filter(l => l);
          
          // CASE 1: Multi-line bulleted/numbered list
          const listPattern = /^(?:[-•*●◦▪▸→]|\d+[\.):])\s+/;
          const listLines = lines.filter(l => listPattern.test(l));
          
          if (listLines.length > 1 && listLines.length === lines.length) {
            return (
              <ul 
                key={sectionIdx} 
                className="space-y-2 sm:space-y-2.5 lg:space-y-3 mb-4 sm:mb-6 lg:mb-8 ml-0 sm:ml-1 pl-0"
              >
                {lines.map((item, i) => {
                  const cleanItem = item.replace(listPattern, '').trim();
                  return (
                    <li 
                      key={i} 
                      className="text-[11px] sm:text-xs md:text-sm lg:text-base leading-relaxed sm:leading-relaxed lg:leading-loose text-gray-700 flex items-start gap-2 sm:gap-2.5 lg:gap-3"
                    >
                      <span className="mt-[0.2em] text-black font-bold text-xs sm:text-sm lg:text-base flex-shrink-0">
                        •
                      </span>
                      <span className="flex-1 min-w-0 break-words">
                        {cleanItem}
                      </span>
                    </li>
                  );
                })}
              </ul>
            );
          }
          
          // CASE 2: Single line that's a heading
          if (lines.length === 1) {
            const line = lines[0];
            
            // Heading patterns: ends with colon, all caps (>4 chars), or short and bold-worthy
            const isHeading = (
              line.endsWith(':') ||
              (line === line.toUpperCase() && line.length > 4 && line.length < 60) ||
              (line.length < 50 && /^[A-Z][A-Za-z\s]+:?$/.test(line))
            );
            
            if (isHeading) {
              return (
                <h3 
                  key={sectionIdx} 
                  className="text-xs sm:text-sm md:text-base lg:text-lg font-semibold uppercase tracking-wider mt-6 sm:mt-8 lg:mt-10 mb-2 sm:mb-3 lg:mb-4 first:mt-0 text-black break-words"
                >
                  {line.replace(/:$/, '')}
                </h3>
              );
            }
          }
          
          // CASE 3: Multiple paragraphs within a section (split by single \n)
          if (lines.length > 1 && listLines.length === 0) {
            // Check if these are actually separate thoughts or one flowing paragraph
            const avgLength = lines.reduce((sum, l) => sum + l.length, 0) / lines.length;
            
            // If lines are short, they're likely separate paragraphs
            if (avgLength < 100) {
              return (
                <div 
                  key={sectionIdx} 
                  className="space-y-2 sm:space-y-3 lg:space-y-4 mb-4 sm:mb-6 lg:mb-8"
                >
                  {lines.map((para, i) => (
                    <p 
                      key={i} 
                      className="text-[11px] sm:text-xs md:text-sm lg:text-base leading-relaxed sm:leading-relaxed lg:leading-loose text-gray-600 break-words"
                    >
                      {para}
                    </p>
                  ))}
                </div>
              );
            }
            
            // Otherwise, join them as one paragraph
            return (
              <p 
                key={sectionIdx} 
                className="text-[11px] sm:text-xs md:text-sm lg:text-base leading-relaxed sm:leading-relaxed lg:leading-loose text-gray-600 mb-3 sm:mb-4 lg:mb-6 break-words"
              >
                {lines.join(' ')}
              </p>
            );
          }
          
          // CASE 4: Regular single paragraph
          return (
            <p 
              key={sectionIdx} 
              className="text-[11px] sm:text-xs md:text-sm lg:text-base leading-relaxed sm:leading-relaxed lg:leading-loose text-gray-600 mb-3 sm:mb-4 lg:mb-6 break-words hyphens-auto"
            >
              {trimmed}
            </p>
          );
        })}
      </div>
    );
  };
  // Notification system
  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: '', type: '' });
    }, 3000);
  };

  const handleToggleWishlist = () => {
    setIsWishlisted(!isWishlisted);
    showNotification(
      isWishlisted ? 'Removed from wishlist' : 'Added to wishlist',
      'success'
    );
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: product.meta_description || product.description?.substring(0, 160),
          url: window.location.href,
        });
      } catch (err) {
        console.log('Share failed:', err);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      showNotification('Link copied to clipboard!', 'success');
    }
  };

  const handleCallNow = () => {
    // Trigger phone call using tel: link
    window.location.href = 'tel:+254724013583';
  };


  // Get proper image URL
  const getImageUrl = (imageObj) => {
    if (!imageObj) return null;
    
    if (typeof imageObj === 'string' && imageObj.startsWith('http')) {
      return imageObj;
    }
    
    if (imageObj.image) {
      const imgPath = imageObj.image;
      if (imgPath.startsWith('http')) return imgPath;
      return `${import.meta.env.VITE_API_URL || 'https://shop-backend-9dtg.onrender.com'}/media/${imgPath}`;
    }
    
    return null;
  };

  // Check if product is in cart
  const cartItem = cartItems?.find(item => item.product === product?.id);

  if (loading) {
    return <ProductDetailsSkeleton />;
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <AlertCircle className="w-12 h-12 mx-auto mb-4 text-gray-400" />
        <p className="text-sm text-gray-600 mb-4">{error}</p>
        <Link 
          to="/products" 
          className="text-xs uppercase tracking-widest hover:opacity-60 inline-block px-6 py-3 border border-black"
        >
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
  const primaryImage = product.images?.find(img => img.is_primary) || product.images?.[0];
  const mainImageUrl = getImageUrl(primaryImage);

  console.log(product)

  return (
    <>
      {/* SEO Meta Tags */}
      <ProductSEO
        product={product}
        imageUrl={mainImageUrl}
      />

      <div className="min-h-screen bg-white">
        {/* Notification Toast */}
        {notification.show && (
          <div className={`fixed top-4 right-4 z-50 px-6 py-3 rounded shadow-lg flex items-center space-x-2 animate-in slide-in-from-top duration-300 ${
            notification.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
          }`}>
            {notification.type === 'success' ? <Check className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
            <span className="text-xs font-medium">{notification.message}</span>
          </div>
        )}

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
            {/* Left: Image Gallery - Using imported component */}
            <div className="w-full">
              <ProductImageGallery 
                images={product.images}
                productName={product.name}
              />
            </div>

            {/* Right: Product Info */}
            <div className="w-full space-y-4 sm:space-y-6">
              {/* Action Buttons (Share & Wishlist) */}
              <div className="flex justify-between items-start">
                <div>
                  {product.brand?.name && (
                    <p className="text-[9px] sm:text-[10px] uppercase tracking-widest text-gray-500">
                      {product.brand.name}
                    </p>
                  )}
                  {product.sku && (
                    <p className="text-[8px] sm:text-[9px] text-gray-400 mt-1">
                      SKU: {product.sku}
                    </p>
                  )}
                </div>
                
                <div>
                  {/* <button
                  className="flex space-x-2"
                    onClick={handleToggleWishlist}
                    className="p-2 border border-black hover:bg-black hover:text-white transition-colors"
                    aria-label="Add to wishlist"
                  >
                    <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
                  </button> */}
                  <button
                    onClick={handleShare}
                    className="p-2 border border-black hover:bg-black hover:text-white transition-colors"
                    aria-label="Share product"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

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
                  <div className="space-y-2">
                    <div className="flex items-baseline space-x-2 sm:space-x-3 flex-wrap">
                      <span className="text-2xl sm:text-3xl font-light">{formatPrice(product.final_price)}</span>
                      <span className="text-base sm:text-lg text-gray-400 line-through">
                        {formatPrice(product.price)}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="px-2 py-1 bg-red-500 text-white text-[8px] sm:text-[9px] uppercase tracking-widest font-medium">
                        Save {product.discount_percentage}%
                      </span>
                      <span className="text-[9px] sm:text-[10px] text-green-600 font-medium">
                        You save {formatPrice(savingsAmount)}
                      </span>
                    </div>
                  </div>
                ) : (
                  <span className="text-2xl sm:text-3xl font-light">{formatPrice(product.price)}</span>
                )}
              </div>

              {/* Enhanced Stock Status */}
              <div className="flex items-center justify-between p-3 border border-black">
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${
                    stockStatus.color === 'green' ? 'bg-green-500' :
                    stockStatus.color === 'yellow' ? 'bg-yellow-500' :
                    stockStatus.color === 'orange' ? 'bg-orange-500' :
                    'bg-red-500'
                  }`} />
                  <span className="text-[10px] sm:text-xs uppercase tracking-widest">
                    {stockStatus.status}
                  </span>
                </div>
                
                {warehouseStockInfo && warehouseStockInfo.warehouses > 0 && (
                  <span className="text-[8px] sm:text-[9px] text-gray-500">
                    Available in {warehouseStockInfo.warehouses} {warehouseStockInfo.warehouses === 1 ? 'location' : 'locations'}
                  </span>
                )}
              </div>

              {/* Key Features Preview */}
              {parsedFeatures.length > 0 && (
                <div className="space-y-2 p-4 bg-gray-50">
                  <p className="text-[9px] sm:text-[10px] uppercase tracking-widest font-medium mb-2">Key Features</p>
                  <ul className="space-y-1.5">
                    {parsedFeatures.slice(0, 3).map((feature, idx) => (
                      <li key={idx} className="flex items-start space-x-2 text-[9px] sm:text-[10px] text-gray-700">
                        <Check className="w-3 h-3 flex-shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  {parsedFeatures.length > 3 && (
                    <button
                      onClick={() => {
                          setActiveTab('specifications');
                          setTimeout(() => {
                            tabsSectionRef.current?.scrollIntoView({ 
                              behavior: 'smooth', 
                              block: 'start' 
                            });
                          }, 100);
                        }}
                        className="text-[9px] text-black hover:opacity-60 underline mt-2"
                      >
                      View all features →
                    </button>
                  )}
                </div>
              )}

              {/* Short Description */}
              {product.description && (
                <div className="border-t border-black pt-4 sm:pt-6">
                  <p className="text-[10px] sm:text-xs leading-relaxed text-gray-600">
                    {product.description.substring(0, 250)}
                    {product.description.length > 250 && '...'}
                  </p>
                  {product.description.length > 250 && (
                    <button
                      onClick={() => {
                        setActiveTab('description');
                        setTimeout(() => {
                          tabsSectionRef.current?.scrollIntoView({ 
                            behavior: 'smooth', 
                            block: 'start' 
                          });
                        }, 100);
                      }}
                      className="text-[9px] sm:text-[10px] text-black hover:opacity-60 underline mt-2 uppercase tracking-widest"
                    >
                      Read Full Description →
                    </button>
                  )}
                </div>
              )}

              {/* Weight and Dimensions */}
              {(product.weight || product.dimensions) && (
                <div className="grid grid-cols-2 gap-3 p-4 bg-gray-50 border border-gray-200">
                  {product.weight && (
                    <div>
                      <p className="text-[9px] sm:text-[10px] uppercase tracking-widest text-gray-500 mb-1">
                        Weight
                      </p>
                      <p className="text-xs sm:text-sm font-medium">
                        {product.weight} kg
                      </p>
                    </div>
                  )}
                  
                  {product.dimensions && (
                    <div>
                      <p className="text-[9px] sm:text-[10px] uppercase tracking-widest text-gray-500 mb-1">
                        Dimensions
                      </p>
                      <p className="text-xs sm:text-sm font-medium">
                        {product.dimensions.length} × {product.dimensions.width} × {product.dimensions.height} cm
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Add to Cart Section - Using imported component */}
              {product.is_in_stock && stockStatus.available > 0 && (
                <div className="space-y-3 sm:space-y-4 border-t border-black pt-4 sm:pt-6">
                  <AddToCartButton
                    product={product}
                    quantity={quantity}
                    showQuantitySelector={true}
                    variant="default"
                  />

                  {/* Call Now Button */}
                  <button 
                    onClick={handleCallNow}
                    className="w-full px-4 sm:px-6 py-3 sm:py-4 border-2 border-black text-[10px] sm:text-xs uppercase tracking-widest hover:bg-black hover:text-white transition-colors"
                  >
                    Call Now
                  </button>

                  {/* Cart Status */}
                  {cartItem && (
                    <div className="flex items-center justify-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-lg border border-blue-200">
                      <Check className="w-3.5 h-3.5" strokeWidth={2.5} />
                      <p className="text-xs font-semibold">
                        {cartItem.qty} {cartItem.qty === 1 ? 'item' : 'items'} in cart
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Out of Stock Action */}
              {!product.is_in_stock && (
                <div className="border-t border-black pt-4 sm:pt-6">
                  <button 
                    onClick={() => showNotification('You will be notified when this product is back in stock', 'success')}
                    className="w-full px-4 sm:px-6 py-3 sm:py-4 border border-black text-[10px] sm:text-xs uppercase tracking-widest hover:bg-gray-50 transition-colors"
                  >
                    Notify Me When Available
                  </button>
                </div>
              )}

              {/* Features */}
              <div className="space-y-2.5 sm:space-y-3 border-t border-black pt-4 sm:pt-6">
                <div className="flex items-start space-x-2.5 sm:space-x-3">
                  <Truck className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[10px] sm:text-xs font-medium uppercase tracking-widest">Free Shipping</p>
                    <p className="text-[9px] sm:text-[10px] text-gray-600 mt-0.5 sm:mt-1">On orders over KES 50,000</p>
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
          <div ref={tabsSectionRef} className="mt-12 sm:mt-16 lg:mt-20 border-t border-black">
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
            <div className="py-6 sm:py-8 lg:py-12 px-2 sm:px-4 lg:px-6">
            {activeTab === 'description' && (
              <div className="max-w-4xl mx-auto">
                {renderDescription()}
              </div>
            )}

            {activeTab === 'specifications' && (
              <div className="max-w-4xl mx-auto">
                <ProductSpecifications 
                  specifications={product.specifications}
                  parsedFeatures={parsedFeatures}
                />
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="max-w-5xl mx-auto">
                <ProductReviews 
                  reviews={product.reviews} 
                  productId={product.id} 
                />
              </div>
            )}
          </div>
          </div>

          {/* Related Products */}
          <RelatedProducts 
            category={product.category?.slug} 
            currentProductId={product.id} 
          />
        </div>
      </div>
    </>
  );
};

// Skeleton Loader Component
const ProductDetailsSkeleton = () => {
  return (
    <div className="min-h-screen bg-white">
      <div className="border-b border-black">
        <div className="w-full px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto py-3 sm:py-4">
          <div className="h-3 sm:h-4 w-48 sm:w-96 bg-gray-200 animate-pulse rounded" />
        </div>
      </div>

      <div className="w-full px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto py-6 sm:py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12">
          {/* Image Gallery Skeleton */}
          <div className="space-y-3 sm:space-y-4">
            <div className="aspect-square w-full bg-gray-200 animate-pulse rounded" />
            <div className="grid grid-cols-4 gap-2 sm:gap-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="aspect-square w-full bg-gray-200 animate-pulse rounded" />
              ))}
            </div>
          </div>

          {/* Product Info Skeleton */}
          <div className="space-y-4 sm:space-y-6">
            <div className="h-2.5 sm:h-3 w-20 sm:w-24 bg-gray-200 animate-pulse rounded" />
            <div className="h-6 sm:h-8 w-full bg-gray-200 animate-pulse rounded" />
            <div className="h-3 sm:h-4 w-24 sm:w-32 bg-gray-200 animate-pulse rounded" />
            <div className="h-6 sm:h-8 w-32 sm:w-40 bg-gray-200 animate-pulse rounded" />
            <div className="h-3 sm:h-4 w-20 sm:w-24 bg-gray-200 animate-pulse rounded" />
            <div className="space-y-2 pt-4 sm:pt-6">
              <div className="h-2.5 sm:h-3 w-full bg-gray-200 animate-pulse rounded" />
              <div className="h-2.5 sm:h-3 w-full bg-gray-200 animate-pulse rounded" />
              <div className="h-2.5 sm:h-3 w-3/4 bg-gray-200 animate-pulse rounded" />
            </div>
            <div className="h-10 sm:h-12 w-full bg-gray-200 animate-pulse rounded" />
            <div className="h-10 sm:h-12 w-full bg-gray-200 animate-pulse rounded" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;