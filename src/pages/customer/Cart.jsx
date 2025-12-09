import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
  ShoppingBag, 
  Trash2, 
  Plus, 
  Minus, 
  ArrowRight, 
  Tag,
  Truck,
  Shield,
  AlertCircle,
  Package,
  Heart,
  Share2,
  X,
  Check,
  Sparkles,
  Clock,
  TrendingUp
} from 'lucide-react';
import { 
  addToCart, 
  removeFromCart, 
  updateCartQty, 
  calculateTotals 
} from '../../actions/cartActions';
import { Skeleton } from '../../components/ui/skeleton';

const Cart = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [removingItems, setRemovingItems] = useState(new Set());
  const [showRemoveToast, setShowRemoveToast] = useState(false);
  const [lastRemovedItem, setLastRemovedItem] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const qty = Number(searchParams.get('qty')) || 1;
  const productId = Number(id);

  // const { userInfo } = useSelector((state) => state.User);
  const { 
    cartItems, 
    itemsPrice, 
    shippingPrice, 
    taxPrice, 
    totalPrice,
    totalDiscount 
  } = useSelector((state) => state.cart);

  useEffect(() => {
    if (productId) {
      dispatch(addToCart(productId, qty));
    }
    // Simulate loading for smooth transition
    setTimeout(() => setIsLoading(false), 300);
  }, [dispatch, productId, qty]);

  useEffect(() => {
    dispatch(calculateTotals());
  }, [dispatch, cartItems]);

  const handleIncrement = (item) => {
    if (item.qty < item.stock) {
      dispatch(updateCartQty(item.product, item.qty + 1));
    }
  };

  const handleDecrement = (item) => {
    if (item.qty > 1) {
      dispatch(updateCartQty(item.product, item.qty - 1));
    }
  };

  const handleRemove = (item) => {
    setRemovingItems(prev => new Set(prev).add(item.product));
    setLastRemovedItem(item);
    
    setTimeout(() => {
      dispatch(removeFromCart(item.product));
      setRemovingItems(prev => {
        const next = new Set(prev);
        next.delete(item.product);
        return next;
      });
      setShowRemoveToast(true);
      setTimeout(() => setShowRemoveToast(false), 3000);
    }, 300);
  };

  const handleCheckout = () => {
    if (!userInfo) {
      navigate('/login?redirect=/shipping');
    } else {
      navigate('/shipping');
    }
  };

  const shippingProgress = Math.min((itemsPrice / 5000) * 100, 100);
  const totalItems = cartItems.reduce((acc, item) => acc + item.qty, 0);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4">
          <Skeleton className="h-12 w-64 mb-8" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl shadow-sm p-6">
                  <div className="flex gap-6">
                    <Skeleton className="w-32 h-32 rounded-xl" />
                    <div className="flex-1 space-y-3">
                      <Skeleton className="h-6 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                      <Skeleton className="h-8 w-32" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="lg:col-span-1">
              <Skeleton className="h-96 rounded-2xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 pt-24 pb-16">
        <div className="max-w-2xl mx-auto px-4">
          <div className="bg-white rounded-3xl shadow-xl p-12 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-50 to-purple-50 rounded-full blur-3xl opacity-50 -z-10" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-pink-50 to-yellow-50 rounded-full blur-3xl opacity-50 -z-10" />
            
            <div className="relative">
              <div className="w-32 h-32 mx-auto mb-8 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
                <ShoppingBag className="w-16 h-16 text-gray-400" />
              </div>
              
              <h2 className="text-4xl font-bold tracking-tight mb-4 bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                Your Cart is Empty
              </h2>
              <p className="text-gray-600 mb-8 text-lg max-w-md mx-auto">
                Discover amazing products and start adding items to your cart
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/products"
                  className="inline-flex items-center justify-center gap-2 bg-black text-white px-8 py-4 rounded-xl hover:bg-gray-800 transition-all hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  <span className="text-sm tracking-wider uppercase font-semibold">Browse Products</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
                
                <Link
                  to="/deals"
                  className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  <Sparkles className="w-5 h-5" />
                  <span className="text-sm tracking-wider uppercase font-semibold">View Deals</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 pt-24 pb-16">
      {/* Remove Toast */}
      {showRemoveToast && lastRemovedItem && (
        <div className="fixed top-20 right-4 z-50 animate-in slide-in-from-top">
          <div className="bg-white rounded-xl shadow-2xl p-4 flex items-center gap-3 border border-gray-200 min-w-[320px]">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
              <Check className="w-5 h-5 text-green-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-900">Item removed</p>
              <p className="text-xs text-gray-600">{lastRemovedItem.name}</p>
            </div>
            <button 
              onClick={() => setShowRemoveToast(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4">
        {/* Enhanced Header */}
        <div className="mb-10">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-5xl font-bold tracking-tight mb-2 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-600 bg-clip-text text-transparent">
                Shopping Cart
              </h1>
              <div className="flex items-center gap-3 text-gray-600">
                <span className="flex items-center gap-2 text-sm">
                  <Package className="w-4 h-4" />
                  {totalItems} {totalItems === 1 ? 'item' : 'items'}
                </span>
                {totalDiscount > 0 && (
                  <>
                    <span className="text-gray-300">•</span>
                    <span className="flex items-center gap-2 text-sm text-green-600 font-medium">
                      <TrendingUp className="w-4 h-4" />
                      Saving Ksh {totalDiscount.toLocaleString()}
                    </span>
                  </>
                )}
              </div>
            </div>
            
            <Link
              to="/products"
              className="text-sm text-gray-600 hover:text-black transition-colors flex items-center gap-2 font-medium"
            >
              Continue Shopping
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item, index) => (
              <div
                key={item.product}
                className={`bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 ${
                  removingItems.has(item.product) ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
                }`}
                style={{ transitionDelay: `${index * 50}ms` }}
              >
                <div className="flex gap-6">
                  {/* Product Image */}
                  <Link
                    to={`/product/${item.slug}`}
                    className="flex-shrink-0 group relative"
                  >
                    <div className="relative w-32 h-32 rounded-xl overflow-hidden border border-gray-200 group-hover:border-gray-300 transition-all">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      {item.discount > 0 && (
                        <div className="absolute top-2 right-2 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">
                          -{item.discount}%
                        </div>
                      )}
                    </div>
                  </Link>

                  {/* Product Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1 min-w-0 pr-4">
                        <Link
                          to={`/product/${item.slug}`}
                          className="text-lg font-semibold hover:text-gray-600 transition-colors block mb-2 line-clamp-2"
                        >
                          {item.name}
                        </Link>
                        <div className="flex items-center gap-3 text-sm">
                          <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full font-medium">
                            {item.brand}
                          </span>
                          <span className="text-gray-400">•</span>
                          <span className="text-gray-600">{item.category}</span>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <button
                          className="p-2 text-gray-400 hover:text-pink-500 hover:bg-pink-50 rounded-lg transition-colors"
                          aria-label="Add to wishlist"
                        >
                          <Heart className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleRemove(item)}
                          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>

                    {/* Price and Discount */}
                    <div className="mb-4">
                      <div className="flex items-center gap-3 flex-wrap">
                        <span className="text-3xl font-bold text-gray-900">
                          Ksh {item.price.toLocaleString()}
                        </span>
                        {item.discount > 0 && (
                          <>
                            <span className="text-lg text-gray-400 line-through">
                              Ksh {item.originalPrice.toLocaleString()}
                            </span>
                            <span className="bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 text-xs px-3 py-1.5 rounded-full flex items-center gap-1 font-semibold">
                              <Tag className="w-3 h-3" />
                              Save Ksh {((item.originalPrice - item.price) * item.qty).toLocaleString()}
                            </span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center justify-between flex-wrap gap-4">
                      <div className="flex items-center border-2 border-gray-200 rounded-xl overflow-hidden hover:border-gray-300 transition-colors">
                        <button
                          onClick={() => handleDecrement(item)}
                          disabled={item.qty <= 1}
                          className="p-3 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-95"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="px-6 py-2 font-bold text-lg min-w-[70px] text-center">
                          {item.qty}
                        </span>
                        <button
                          onClick={() => handleIncrement(item)}
                          disabled={item.qty >= item.stock}
                          className="p-3 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-95"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="text-right">
                        <p className="text-xs text-gray-500 mb-1 uppercase tracking-wider">Subtotal</p>
                        <p className="text-2xl font-bold text-gray-900">
                          Ksh {(item.price * item.qty).toLocaleString()}
                        </p>
                      </div>
                    </div>

                    {/* Stock Warning */}
                    {item.qty >= item.stock && (
                      <div className="mt-3 flex items-center gap-2 text-xs text-amber-700 bg-amber-50 px-3 py-2 rounded-lg border border-amber-200">
                        <AlertCircle className="w-4 h-4 flex-shrink-0" />
                        <span className="font-medium">Maximum available stock reached</span>
                      </div>
                    )}
                    
                    {item.stock < 10 && item.qty < item.stock && (
                      <div className="mt-3 flex items-center gap-2 text-xs text-orange-700 bg-orange-50 px-3 py-2 rounded-lg border border-orange-200">
                        <Clock className="w-4 h-4 flex-shrink-0" />
                        <span className="font-medium">Only {item.stock - item.qty} left in stock</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl p-6 sticky top-24 border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold tracking-tight">
                  Order Summary
                </h2>
                <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
                  <Package className="w-5 h-5 text-blue-600" />
                </div>
              </div>

              {/* Free Shipping Progress */}
              {shippingPrice > 0 && itemsPrice < 5000 && (
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4 mb-6">
                  <div className="flex items-start gap-3 mb-3">
                    <Truck className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-blue-900 mb-1">
                        Almost there!
                      </p>
                      <p className="text-xs text-blue-700">
                        Add <span className="font-bold">Ksh {(5000 - itemsPrice).toLocaleString()}</span> more for FREE shipping
                      </p>
                    </div>
                  </div>
                  <div className="w-full bg-blue-200 rounded-full h-2.5 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2.5 rounded-full transition-all duration-500 ease-out"
                      style={{ width: `${shippingProgress}%` }}
                    />
                  </div>
                </div>
              )}

              {shippingPrice === 0 && (
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4 mb-6 flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Check className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-green-900">Free Shipping!</p>
                    <p className="text-xs text-green-700">Your order qualifies for free delivery</p>
                  </div>
                </div>
              )}

              <div className="space-y-4 mb-6 py-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal ({totalItems} items)</span>
                  <span className="font-semibold text-gray-900">Ksh {itemsPrice.toLocaleString()}</span>
                </div>

                {totalDiscount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-green-600 flex items-center gap-2">
                      <Tag className="w-4 h-4" />
                      Discount Savings
                    </span>
                    <span className="font-bold text-green-600">-Ksh {totalDiscount.toLocaleString()}</span>
                  </div>
                )}

                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 flex items-center gap-2">
                    <Truck className="w-4 h-4" />
                    Shipping
                  </span>
                  <span className="font-semibold">
                    {shippingPrice === 0 ? (
                      <span className="text-green-600 font-bold">FREE</span>
                    ) : (
                      <span className="text-gray-900">Ksh {shippingPrice.toLocaleString()}</span>
                    )}
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax (16% VAT)</span>
                  <span className="font-semibold text-gray-900">Ksh {taxPrice.toLocaleString()}</span>
                </div>

                <div className="border-t-2 border-gray-200 pt-4 flex justify-between items-center">
                  <span className="text-lg font-bold text-gray-900">Total</span>
                  <div className="text-right">
                    <span className="text-3xl font-bold text-gray-900">
                      Ksh {totalPrice.toLocaleString()}
                    </span>
                    {totalDiscount > 0 && (
                      <p className="text-xs text-green-600 font-medium mt-1">
                        You saved Ksh {totalDiscount.toLocaleString()}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full bg-gradient-to-r from-black to-gray-800 text-white py-4 rounded-xl hover:from-gray-800 hover:to-black transition-all flex items-center justify-center gap-3 mb-3 shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
              >
                <span className="text-sm tracking-widest uppercase font-bold">
                  Proceed to Checkout
                </span>
                <ArrowRight className="w-5 h-5" />
              </button>

              {/* Security Badges */}
              <div className="pt-6 border-t space-y-3">
                <div className="flex items-center gap-3 text-xs text-gray-600">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Shield className="w-4 h-4 text-green-600" />
                  </div>
                  <span className="font-medium">Secure checkout with SSL encryption</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-gray-600">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Truck className="w-4 h-4 text-blue-600" />
                  </div>
                  <span className="font-medium">Fast delivery within 2-5 business days</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-gray-600">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Package className="w-4 h-4 text-purple-600" />
                  </div>
                  <span className="font-medium">Easy returns within 30 days</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;