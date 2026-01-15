import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
  createOrder, 
  resetOrderCreate,
  calculateShippingQuote,
  getShippingMethods 
} from '../../actions/orderActions';
import CheckoutSteps from '../../components/checkout/CheckoutSteps';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Separator } from '../../components/ui/separator';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { Skeleton } from '../../components/ui/skeleton';
import { initiateMpesaPayment } from '../../actions/paymentActions';
import { 
  Home, 
  CreditCard, 
  Package, 
  Truck, 
  Receipt,
  ShieldCheck,
  Loader2,
  MapPin,
  Mail,
  Phone,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

function PlaceOrder({ setCompleted, completed }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // Redux selectors with safe defaults
  const cart = useSelector(state => state.cart || {});
  const orderCreate = useSelector(state => state.orderCreate || {});
  const shippingQuote = useSelector(state => state.shippingQuote || {});
  const shippingMethods = useSelector(state => state.shippingMethods || {});

  // Local state
  const [loading, setLoading] = useState(false);
  const [selectedShipping, setSelectedShipping] = useState(null);
  const [shippingMethodsError, setShippingMethodsError] = useState(null);
  const [hasAttemptedMethodsFetch, setHasAttemptedMethodsFetch] = useState(false);
  
  // Destructure state with safe defaults
  const { order, error, success } = orderCreate;
  const { quote, loading: quoteLoading } = shippingQuote;
  const { methods, loading: methodsLoading, error: methodsError } = shippingMethods;

  // Safely normalize shipping methods data
  const normalizedMethods = useMemo(() => {
    if (!methods) return [];
    
    // Handle if methods is an array
    if (Array.isArray(methods)) return methods;
    
    // Handle if methods is an object with results array
    if (methods.results && Array.isArray(methods.results)) return methods.results;
    
    // Handle if methods has count property with data
    if (methods.count > 0 && Array.isArray(methods.data)) return methods.data;
    
    return [];
  }, [methods]);

  const hasShippingMethods = normalizedMethods.length > 0;
  
  // Calculate order summary with memoization
  const orderSummary = useMemo(() => {
    if (!cart.cartItems || cart.cartItems.length === 0) {
      return {
        itemsPrice: 0,
        shippingPrice: 0,
        taxPrice: 0,
        totalPrice: 0,
      };
    }

    const itemsPrice = cart.cartItems.reduce((acc, item) => {
      const effectivePrice = Number(item.originalPrice) || Number(item.price) || 0;
      return acc + effectivePrice * (item.qty || item.quantity || 1);
    }, 0);

    const shippingPrice = Number(selectedShipping?.cost || 0);
    const taxRate = 0.1; // 10% tax
    const taxPrice = itemsPrice * taxRate;
    const totalPrice = itemsPrice + shippingPrice + taxPrice;

    return {
      itemsPrice: Number(itemsPrice.toFixed(2)),
      shippingPrice: Number(shippingPrice.toFixed(2)),
      taxPrice: Number(taxPrice.toFixed(2)),
      totalPrice: Number(totalPrice.toFixed(2)),
    };
  }, [cart.cartItems, selectedShipping]);

  // Validate required data
  useEffect(() => {
    if (!cart.shippingAddress) {
      navigate('/shipping');
      return;
    }
    if (!cart.paymentMethod.method) {
      navigate('/payment');
      return;
    }
  }, [cart.shippingAddress, cart.paymentMethod.method, navigate]);
  
  // Fetch shipping methods on mount with error handling
  useEffect(() => {
    const fetchShippingMethods = async () => {
      if (hasAttemptedMethodsFetch) return;
      
      try {
        setHasAttemptedMethodsFetch(true);
        await dispatch(getShippingMethods());
        setShippingMethodsError(null);
      } catch (err) {
        console.error('Failed to fetch shipping methods:', err);
        setShippingMethodsError('Unable to load shipping methods. You can still place your order.');
      }
    };

    fetchShippingMethods();
  }, [dispatch, hasAttemptedMethodsFetch]);

  // Set default shipping method when methods load
  useEffect(() => {
    if (hasShippingMethods && !selectedShipping) {
      const defaultMethod = normalizedMethods.find(m => m.is_default) || normalizedMethods[0];
      if (defaultMethod) {
        setSelectedShipping(defaultMethod);
      }
    }
  }, [normalizedMethods, hasShippingMethods, selectedShipping]);

  // Calculate shipping quote when shipping method changes
  console.log("SSup Bloof", selectedShipping, cart.shippingAddress, cart.cartItems?.length);
  useEffect(() => {
    if (!selectedShipping || !cart.shippingAddress || !cart.cartItems?.length) return;
    console.log("SSup Bloof", selectedShipping);

    const calculateShipping = async () => {
      try {
        const items = cart.cartItems.map(item => ({
          product_id: item.product, // ✅ Get product ID, not cart item ID
          quantity: item.qty || item.quantity || 1,
        }));

        const quoteData = {
          shipping_method_id: selectedShipping.id,
          items,
          country: cart.shippingAddress.country,
          postal_code: cart.shippingAddress.postalCode || cart.shippingAddress.postal_code,
        };

        await dispatch(calculateShippingQuote(quoteData));
      } catch (err) {
        console.error('Failed to calculate shipping quote:', err);
      }
    };

    calculateShipping();
  }, [selectedShipping, cart.shippingAddress, cart.cartItems, dispatch]);

  // Handle success order creation
  useEffect(() => {
    if (success && order) {
      
      // Clear cart
      localStorage.removeItem('cartItems');
      
      // Redirect to order confirmation
      navigate(`/order/${order.order_number || order.id}/success`, {
        state: { order }
      });
      
      // Reset order create state after delay
      setTimeout(() => {
        dispatch(resetOrderCreate());
      }, 3000);
    }
  }, [success, order, navigate, dispatch]);

  const handleShippingChange = useCallback((method) => {
    setSelectedShipping(method);
  }, []);

  const placeOrder = async () => {
    if (!cart.cartItems?.length || !cart.shippingAddress || !cart.paymentMethod.method) {
      return;
    }

    if (typeof setCompleted === 'function') {
      setCompleted((prev) => ({
        ...prev,
        0: true, // shipping
        1: true, // payment  
        2: true  // place order
      }));
    }
    
    setLoading(true);
    
    const orderData = {
      items: cart.cartItems.map(item => ({
        product_id: item.product,
        quantity: item.qty || item.quantity || 1,
        variant: item.variant || {},
      })),
      shipping_method_id: selectedShipping?.id || null,
      use_default_address: false,
      customer_notes: cart.notes || '',
      payment_method: cart.paymentMethod.method,
      payment_number: cart.paymentMethod.mpesaNumber || null,
      discount_code: cart.discountCode || '',
      is_gift: cart.isGift || false,
      gift_message: cart.giftMessage || '',
      // Include shipping address for cases without method
      shipping_address: cart.shippingAddress,
      shipping_address_id: cart.shippingAddress.id,
      billing_address_id: cart.shippingAddress.id, 
    };

    // console.log('Cart items structure:', cart.cartItems);

    // console.log('Placing order with data:', orderData);
    
    try {
      const result = await dispatch(createOrder(orderData));
      if (result?.success) {
        setCompleted({
          shipping: true,
          payment: true,
          order: true,
        });
      }
    } catch (err) {
      console.error('Order creation failed:', err);
    } finally {
      setLoading(false);
    }
  };

  // Loading state for shipping methods
  if (methodsLoading && !hasAttemptedMethodsFetch) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <CheckoutSteps currentStep={3} completedSteps={['cart', 'shipping', 'payment']} />
          </div>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-center space-x-3 py-8">
                <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                <span className="text-gray-600">Loading checkout information...</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!cart.cartItems?.length) {
    return (
      <div className="min-h-screen pt-20 px-4">
        <div className="max-w-7xl mx-auto">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Your cart is empty. <Link to="/products" className="text-blue-600 hover:underline">Continue shopping</Link>
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Checkout Steps */}
        <div className="mb-8">
          <CheckoutSteps step_active={2} completed={completed || {}} />
        </div>

        {/* Shipping Methods Error Alert */}
        {shippingMethodsError && (
          <Alert className="mb-6 bg-yellow-50 border-yellow-200">
            <AlertCircle className="h-4 w-4 text-yellow-600" />
            <AlertDescription className="text-yellow-800">
              {shippingMethodsError} Shipping will be calculated based on your delivery address.
            </AlertDescription>
          </Alert>
        )}
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Order Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Shipping Information */}
            <Card>
              <CardHeader className="border-b">
                <div className="flex items-center space-x-3">
                  <Truck className="h-5 w-5 text-blue-600" />
                  <CardTitle className="text-lg">Shipping Information</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {/* Address */}
                  <div className="flex items-start space-x-3">
                    <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900">
                        {cart.shippingAddress?.address}
                      </p>
                      <p className="text-gray-600">
                        {cart.shippingAddress?.city}
                        {cart.shippingAddress?.state && `, ${cart.shippingAddress.state}`}
                        {" "}
                        {cart.shippingAddress?.postalCode || cart.shippingAddress?.postal_code}
                      </p>
                      <p className="text-gray-600">
                        {cart.shippingAddress?.country}
                      </p>
                    </div>
                  </div>

                  {/* Email */}
                  {cart.shippingAddress?.email && (
                    <div className="flex items-center space-x-3">
                      <Mail className="h-5 w-5 text-gray-400" />
                      <span className="text-gray-600">
                        {cart.shippingAddress.email}
                      </span>
                    </div>
                  )}

                  {/* Phone */}
                  {cart.shippingAddress?.phone && (
                    <div className="flex items-center space-x-3">
                      <Phone className="h-5 w-5 text-gray-400" />
                      <span className="text-gray-600">
                        {cart.shippingAddress.phone}
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
            
            {/* Payment Method */}
            <Card>
              <CardHeader className="border-b">
                <div className="flex items-center space-x-3">
                  <CreditCard className="h-5 w-5 text-green-600" />
                  <CardTitle className="text-lg">Payment Method</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-3">
                  <ShieldCheck className="h-5 w-5 text-green-500" />
                  <div>
                    <p className="font-medium text-gray-900">
                      {cart.paymentMethod.method === 'MPesa' && 'MPesa ' + cart.paymentMethod.mpesaNumber }
                      {cart.paymentMethod.method === 'PayPal' && 'PayPal'}
                      {cart.paymentMethod.method === 'OnDelivery' && 'Cash On Delivery'}
                    </p>
                    <p className="text-sm text-gray-500">Secured by SSL encryption</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Order Items */}
            <Card>
              <CardHeader className="border-b">
                <div className="flex items-center space-x-3">
                  <Package className="h-5 w-5 text-purple-600" />
                  <CardTitle className="text-lg">Order Items ({cart.cartItems.length})</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {cart.cartItems.map((item, index) => {
                    const quantity = item.qty || item.quantity || 1;
                    const price = item.final_price || item.price || 0;
                    
                    return (
                      <div key={item.id || index} className="flex items-center space-x-4 py-4 border-b last:border-0">
                        <div className="relative w-20 h-20 flex-shrink-0">
                          <img
                            src={item.image || item.images?.[0]?.image}
                            alt={item.name}
                            className="w-full h-full object-cover rounded-lg"
                          />
                          <Badge className="absolute -top-2 -right-2 bg-blue-600">
                            {quantity}
                          </Badge>
                        </div>
                        <div className="flex-1 min-w-0">
                          <Link
                            to={`/product/${item.slug || item.id}`}
                            className="font-medium text-gray-900 hover:text-blue-600 truncate block"
                          >
                            {item.name}
                          </Link>
                          {item.variant && Object.keys(item.variant).length > 0 && (
                            <p className="text-sm text-gray-500">
                              {Object.entries(item.variant).map(([key, value]) => 
                                `${key}: ${value}`
                              ).join(', ')}
                            </p>
                          )}
                          <p className="text-sm text-gray-500">{item.brand?.name || ''}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-gray-900">
                            KSH {(price * quantity).toFixed(2)}
                          </p>
                          <p className="text-sm text-gray-500">
                            KSH {price.toFixed(2)} each
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
            
            {/* Shipping Method Selection - Only show if methods available */}
            {hasShippingMethods && (
              <Card>
                <CardHeader className="border-b">
                  <div className="flex items-center space-x-3">
                    <Truck className="h-5 w-5 text-orange-600" />
                    <CardTitle className="text-lg">Shipping Method</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-3">
                    {normalizedMethods.map((method) => {
                      const isSelected = selectedShipping?.id === method.id;
                      const isFree =
                        method.free_shipping_threshold &&
                        orderSummary.itemsPrice >= method.free_shipping_threshold;

                      return (
                        <div
                          key={method.id}
                          onClick={() => handleShippingChange(method)}
                          className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-all ${
                            isSelected
                              ? "border-blue-500 bg-blue-50"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          <div className="flex items-center space-x-3">
                            {/* Radio Dot */}
                            <div
                              className={`w-4 h-4 rounded-full border-2 ${
                                isSelected ? "border-blue-500 bg-blue-500" : "border-gray-300"
                              }`}
                            />

                            {/* Text */}
                            <div>
                              <p className="font-medium text-gray-900">{method.name}</p>
                              <p className="text-sm text-gray-500">
                                {method.estimated_days_min}-{method.estimated_days_max} business days
                              </p>

                              {isFree && (
                                <Badge
                                  variant="outline"
                                  className="mt-1 bg-green-50 text-green-700 border-green-200"
                                >
                                  Free Shipping Eligible
                                </Badge>
                              )}
                            </div>
                          </div>

                          {/* Price */}
                          <div className="text-right">
                            {isFree ? (
                              <p className="font-bold text-green-600">FREE</p>
                            ) : (
                              <p className="font-medium text-gray-900">KSH {method.cost}</p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                    
                    {quoteLoading && (
                      <div className="flex items-center justify-center p-4">
                        <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
                        <span className="ml-2 text-gray-600">Calculating shipping...</span>
                      </div>
                    )}
                    
                    {quote && (
                      <Alert className="bg-blue-50 border-blue-200">
                        <Truck className="h-4 w-4 text-blue-600" />
                        <AlertDescription>
                          <p className="font-medium text-blue-800">Shipping Estimate</p>
                          <p className="text-blue-700">
                            KSH {quote.cost} • {quote.estimated_delivery_days?.min}-{quote.estimated_delivery_days?.max} days
                          </p>
                          {quote.free_shipping_eligible && (
                            <Badge className="mt-1 bg-green-100 text-green-800">Free Shipping Applied</Badge>
                          )}
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* No Shipping Methods Available */}
            {!hasShippingMethods && !methodsLoading && (
              <Card>
                <CardHeader className="border-b">
                  <div className="flex items-center space-x-3">
                    <Truck className="h-5 w-5 text-orange-600" />
                    <CardTitle className="text-lg">Shipping</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  <Alert className="bg-blue-50 border-blue-200">
                    <Truck className="h-4 w-4 text-blue-600" />
                    <AlertDescription>
                      <p className="font-medium text-blue-800">Standard Shipping</p>
                      <p className="text-blue-700">
                        Shipping cost will be calculated based on your delivery address and order details.
                        Our team will contact you with shipping information after your order is placed.
                      </p>
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            )}
          </div>
          
          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader className="border-b">
                <div className="flex items-center space-x-3">
                  <Receipt className="h-5 w-5 text-gray-700" />
                  <CardTitle className="text-lg">Order Summary</CardTitle>
                </div>
              </CardHeader>
              
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {/* Items */}
                  <div className="flex justify-between">
                    <span className="text-gray-600">Items ({cart.cartItems.length})</span>
                    <span className="font-medium">KSH {orderSummary.itemsPrice.toFixed(2)}</span>
                  </div>
                  
                  {/* Shipping */}
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-medium">
                      {!hasShippingMethods ? (
                        <span className="text-gray-500">TBD</span>
                      ) : selectedShipping?.free_shipping_threshold && 
                        orderSummary.itemsPrice >= selectedShipping.free_shipping_threshold ? (
                        <span className="text-green-600">FREE</span>
                      ) : (
                        `KSH ${orderSummary.shippingPrice.toFixed(2)}`
                      )}
                    </span>
                  </div>
                  
                  {/* Tax */}
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax (10%)</span>
                    <span className="font-medium">KSH {orderSummary.taxPrice.toFixed(2)}</span>
                  </div>
                  
                  <Separator />
                  
                  {/* Total */}
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>
                      KSH {orderSummary.totalPrice.toFixed(2)}
                      {!hasShippingMethods && (
                        <span className="text-sm font-normal text-gray-500"> + shipping</span>
                      )}
                    </span>
                  </div>
                  
                  {/* Security Badge */}
                  <div className="pt-4">
                    <div className="flex items-center justify-center space-x-2 p-3 bg-gray-50 rounded-lg">
                      <ShieldCheck className="h-4 w-4 text-green-600" />
                      <span className="text-sm text-gray-600">Secure 256-bit SSL Encryption</span>
                    </div>
                  </div>
                </div>
              </CardContent>
              
              <CardFooter className="border-t pt-6">
                <div className="w-full space-y-4">
                  {/* Error Message */}
                  {error && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        {typeof error === 'string' ? error : 'Failed to place order. Please try again.'}
                      </AlertDescription>
                    </Alert>
                  )}
                  
                  {/* Success Message */}
                  {success && (
                    <Alert className="bg-green-50 border-green-200">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <AlertDescription className="text-green-800">
                        Order placed successfully! Redirecting...
                      </AlertDescription>
                    </Alert>
                  )}
                  
                  {/* Terms Agreement */}
                  <div className="text-xs text-gray-500">
                    <p className="mb-2">
                      By placing your order, you agree to our{' '}
                      <Link to="/terms" className="text-blue-600 hover:underline">
                        Terms of Service
                      </Link>{' '}
                      and{' '}
                      <Link to="/privacy" className="text-blue-600 hover:underline">
                        Privacy Policy
                      </Link>
                      .
                    </p>
                    <p>
                      Your personal data will be used to process your order, support your experience
                      throughout this website, and for other purposes described in our privacy policy.
                    </p>
                  </div>
                  
                  {/* Place Order Button */}
                  <Button
                    onClick={placeOrder}
                    disabled={loading || success}
                    size="lg"
                    className="w-full py-6 text-lg font-medium"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Processing Order...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="mr-2 h-5 w-5" />
                        Place Order
                      </>
                    )}
                  </Button>
                  
                  {/* Back Button */}
                  <Button
                    variant="outline"
                    onClick={() => navigate('/checkout/payment')}
                    disabled={loading}
                    className="w-full"
                  >
                    Back to Payment
                  </Button>
                </div>
              </CardFooter>
            </Card>
            
            {/* Order Protection */}
            <Card className="mt-6">
              <CardContent className="pt-6">
                <div className="flex items-start space-x-3">
                  <ShieldCheck className="h-5 w-5 text-green-600 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">Order Protection</h4>
                    <p className="text-sm text-gray-600">
                      Your order is protected by our 30-day money-back guarantee and secure payment processing.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PlaceOrder;