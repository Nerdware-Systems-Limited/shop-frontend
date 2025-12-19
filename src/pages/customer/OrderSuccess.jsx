import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { checkMpesaPaymentStatus } from '../../actions/paymentActions';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { Badge } from '../../components/ui/badge';
import {
  CheckCircle,
  Clock,
  AlertCircle,
  Package,
  Mail,
  Phone,
  MapPin,
  CreditCard,
  Loader2,
  Home,
  ArrowRight,
  RefreshCw,
  ExternalLink
} from 'lucide-react';

function OrderSuccess() {
  const { orderNumber } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const order = location.state?.order;
  const cart = useSelector(state => state.cart || {});
  // Safer approach
const mpesaPaymentStatus = useSelector(state => state.mpesaPaymentStatus || {});
const loading = mpesaPaymentStatus.loading || false;
const success = mpesaPaymentStatus.success || false;
const statusInfo = mpesaPaymentStatus.statusInfo || null;


  console.log(order)

  const [paymentStatus, setPaymentStatus] = useState('pending');
  const [mpesaTransaction, setMpesaTransaction] = useState(null);
  const [pollCount, setPollCount] = useState(0);
  const [showMpesaPrompt, setShowMpesaPrompt] = useState(false);
  const [mounted, setMounted] = useState(false);

  const paymentMethod = cart.paymentMethod?.method || order?.payment_method;
  const isMpesaPayment = paymentMethod === 'MPesa';
  const maxPollAttempts = 20;

  // Animation trigger
  useEffect(() => {
    setMounted(true);
  }, []);

  // Handle M-Pesa payment status updates from Redux
  useEffect(() => {
    if (!mpesaPaymentStatus.statusInfo) return;

    const transaction = mpesaPaymentStatus.statusInfo.transaction;
    if (transaction) {
      setMpesaTransaction(transaction);

      if (transaction.status === 'completed' && transaction.result_code === 0) {
        setPaymentStatus('completed');
        setShowMpesaPrompt(false);
      } else if (transaction.status === 'failed' || 'cancelled') {
        setPaymentStatus('failed');
        setShowMpesaPrompt(false);
      } else if (transaction.status === 'timeout') {
        setPaymentStatus('timeout');
        setShowMpesaPrompt(false);
      }
    }
  }, [mpesaPaymentStatus.statusInfo]);

  console.log("yo we here", mpesaPaymentStatus)

  // Poll M-Pesa payment status
  useEffect(() => {
    if (!isMpesaPayment || !order?.mpesa_checkout_request_id) {
      console.log("Skipping M-Pesa polling:", { 
        isMpesaPayment, 
        hasCheckoutId: !!order?.mpesa_checkout_request_id 
      });
      return;
    }

    // setShowMpesaPrompt(true);
    console.log("Cunt shit")

    const interval = setInterval(() => {
      if (pollCount < maxPollAttempts && paymentStatus === 'pending') {
        dispatch(checkMpesaPaymentStatus({ 
          checkout_request_id: order.mpesa_checkout_request_id 
        }));
        setPollCount(prev => prev + 1);
      } else {
        clearInterval(interval);
        if (paymentStatus === 'pending') {
          setPaymentStatus('timeout');
          setShowMpesaPrompt(false);
        }
      }
    }, 3000);

    // Initial check
    dispatch(checkMpesaPaymentStatus({ 
      checkout_request_id: order.mpesa_checkout_request_id 
    }));

    return () => clearInterval(interval);
  }, [isMpesaPayment, order?.mpesa_checkout_request_id, pollCount, paymentStatus, dispatch]);

  const handleRetryPayment = () => {
    navigate(`/checkout/payment`, { 
      state: { 
        orderId: order?.id,
        retryPayment: true 
      } 
    });
  };

  const handleManualCheck = () => {
    if (order?.mpesa_checkout_request_id) {
      setPollCount(0);
      dispatch(checkMpesaPaymentStatus({ 
        checkout_request_id: order.mpesa_checkout_request_id 
      }));
    }
  };

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-white">
        <div className={`max-w-md w-full transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <div className="text-center space-y-6">
            <div className="inline-flex items-center justify-center w-16 h-16 border-2 border-black rounded-full">
              <AlertCircle className="h-8 w-8" />
            </div>
            <div className="space-y-2">
              <h1 className="text-2xl font-light">Order Not Found</h1>
              <p className="text-gray-600">Please check your email for order details</p>
            </div>
            <Button 
              onClick={() => navigate('/orders')}
              className="bg-black hover:bg-gray-800 text-white border-0"
            >
              View My Orders
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const renderPaymentStatus = () => {
    if (!isMpesaPayment) {
      return (
        <div className={`transition-all duration-700 delay-300 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <div className="border border-black p-8 space-y-4">
            <div className="flex items-center justify-center">
              <div className="relative">
                <div className="w-20 h-20 border-2 border-black rounded-full flex items-center justify-center animate-scale-in">
                  <CheckCircle className="h-10 w-10" strokeWidth={1.5} />
                </div>
                <div className="absolute inset-0 border-2 border-black rounded-full animate-ping-slow opacity-20" />
              </div>
            </div>
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-light">Order Confirmed</h2>
              <p className="text-gray-600">Payment on delivery • Confirmation sent to your email</p>
            </div>
          </div>
        </div>
      );
    }

    if (paymentStatus === 'completed') {
      return (
        <div className={`transition-all duration-700 delay-300 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <div className="border border-black p-8 space-y-4">
            <div className="flex items-center justify-center">
              <div className="relative">
                <div className="w-20 h-20 border-2 border-black rounded-full flex items-center justify-center animate-scale-in">
                  <CheckCircle className="h-10 w-10" strokeWidth={1.5} />
                </div>
                <div className="absolute inset-0 border-2 border-black rounded-full animate-ping-slow opacity-20" />
              </div>
            </div>
            <div className="text-center space-y-3">
              <h2 className="text-2xl font-light">Payment Confirmed</h2>
              <p className="text-gray-600">Your M-Pesa payment was successful</p>
              {mpesaTransaction?.mpesa_receipt_number && (
                <div className="inline-block border border-gray-300 px-4 py-2">
                  <div className="text-xs text-gray-500 mb-1">Receipt Number</div>
                  <div className="font-mono text-sm">{mpesaTransaction.mpesa_receipt_number}</div>
                </div>
              )}
            </div>
          </div>
        </div>
      );
    }

    if (paymentStatus === 'failed') {
      return (
        <div className={`transition-all duration-700 delay-300 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <div className="border border-black p-8 space-y-4">
            <div className="flex items-center justify-center">
              <div className="w-20 h-20 border-2 border-black rounded-full flex items-center justify-center">
                <AlertCircle className="h-10 w-10" strokeWidth={1.5} />
              </div>
            </div>
            <div className="text-center space-y-3">
              <h2 className="text-2xl font-light">Payment Failed</h2>
              <p className="text-gray-600">
                {mpesaTransaction?.result_desc || 'Transaction not completed'}
              </p>
              <Button 
                onClick={handleRetryPayment}
                className="bg-black hover:bg-gray-800 text-white border-0"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Retry Payment
              </Button>
            </div>
          </div>
        </div>
      );
    }

    if (paymentStatus === 'timeout') {
      return (
        <div className={`transition-all duration-700 delay-300 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <div className="border border-black p-8 space-y-4">
            <div className="flex items-center justify-center">
              <div className="w-20 h-20 border-2 border-black rounded-full flex items-center justify-center">
                <Clock className="h-10 w-10" strokeWidth={1.5} />
              </div>
            </div>
            <div className="text-center space-y-3">
              <h2 className="text-2xl font-light">Payment Pending</h2>
              <p className="text-gray-600">
                Confirmation may take a few minutes
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button 
                  onClick={handleManualCheck}
                  variant="outline"
                  className="border-black hover:bg-gray-50"
                  disabled={mpesaPaymentStatus.loading}
                >
                  {mpesaPaymentStatus.loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Checking...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Check Status
                    </>
                  )}
                </Button>
                <Button 
                  onClick={handleRetryPayment}
                  className="bg-black hover:bg-gray-800 text-white border-0"
                >
                  Retry Payment
                </Button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className={`transition-all duration-700 delay-300 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        <div className="border border-black p-8 space-y-4">
          <div className="flex items-center justify-center">
            <div className="relative">
              <div className="w-20 h-20 border-2 border-black rounded-full flex items-center justify-center">
                <Loader2 className="h-10 w-10 animate-spin" strokeWidth={1.5} />
              </div>
            </div>
          </div>
          <div className="text-center space-y-3">
            <h2 className="text-2xl font-light">
              {showMpesaPrompt ? 'Complete on Phone' : 'Verifying Payment'}
            </h2>
            <p className="text-gray-600">
              {showMpesaPrompt 
                ? 'Check your phone for M-Pesa prompt'
                : 'This usually takes a few seconds'}
            </p>
            <div className="inline-flex items-center gap-2 text-sm text-gray-500">
              <div className="flex gap-1">
                <div className="w-1.5 h-1.5 bg-black rounded-full animate-bounce" style={{animationDelay: '0ms'}} />
                <div className="w-1.5 h-1.5 bg-black rounded-full animate-bounce" style={{animationDelay: '150ms'}} />
                <div className="w-1.5 h-1.5 bg-black rounded-full animate-bounce" style={{animationDelay: '300ms'}} />
              </div>
              <span>
                {Math.floor((maxPollAttempts - pollCount) * 3 / 60)}:
                {((maxPollAttempts - pollCount) * 3 % 60).toString().padStart(2, '0')}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white pt-20 px-4 pb-16">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Header */}
        <div className={`text-center space-y-4 transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <h1 className="text-4xl md:text-5xl font-light tracking-tight">Thank You</h1>
          <div className="inline-flex items-center gap-2 text-gray-600">
            <span className="text-sm">Order</span>
            <span className="font-mono text-sm border border-gray-300 px-3 py-1">
              #{order.order_number || order.id}
            </span>
          </div>
        </div>

        {/* Payment Status */}
        {renderPaymentStatus()}

        {/* Order Details Grid */}
        <div className={`grid md:grid-cols-2 gap-8 transition-all duration-700 delay-500 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          {/* Delivery */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-gray-200">
              <MapPin className="h-4 w-4" strokeWidth={1.5} />
              <h3 className="font-light">Delivery</h3>
            </div>
            <div className="space-y-2 text-sm">
              <p className="text-gray-900">
                {order.shipping_address?.address || cart.shippingAddress?.address}
              </p>
              <p className="text-gray-600">
                {order.shipping_address?.city || cart.shippingAddress?.city}
                {(order.shipping_address?.state || cart.shippingAddress?.state) && 
                  `, ${order.shipping_address?.state || cart.shippingAddress?.state}`}
              </p>
              <p className="text-gray-600">
                {order.shipping_address?.postal_code || cart.shippingAddress?.postalCode}
              </p>
              {(order.shipping_address?.phone || cart.shippingAddress?.phone) && (
                <div className="flex items-center gap-2 pt-2 text-gray-600">
                  <Phone className="h-3 w-3" strokeWidth={1.5} />
                  <span>{order.shipping_address?.phone || cart.shippingAddress?.phone}</span>
                </div>
              )}
            </div>
          </div>

          {/* Summary */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-gray-200">
              <Package className="h-4 w-4" strokeWidth={1.5} />
              <h3 className="font-light">Summary</h3>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span>KSH {order.items_price?.toFixed(2) || '0.00'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span>
                  {order.shipping_price === 0 ? 'FREE' : `KSH ${order.shipping_price?.toFixed(2) || 'TBD'}`}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax</span>
                <span>KSH {order.tax_price?.toFixed(2) || '0.00'}</span>
              </div>
              <div className="flex justify-between pt-3 border-t border-gray-200 font-light text-base">
                <span>Total</span>
                <span>KSH {order.total_price?.toFixed(2) || '0.00'}</span>
              </div>
              <div className="flex items-center gap-2 pt-2 text-gray-600">
                <CreditCard className="h-3 w-3" strokeWidth={1.5} />
                <span>
                  {isMpesaPayment ? `M-Pesa (${cart.paymentMethod?.mpesaNumber})` : 'Cash on Delivery'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className={`transition-all duration-700 delay-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <div className="border border-gray-200 p-8">
            <h3 className="font-light text-lg mb-6">What's Next</h3>
            <div className="space-y-6">
              {[
                { step: '01', title: 'Confirmation', desc: 'Email sent with order details' },
                { step: '02', title: 'Processing', desc: 'Items packed and prepared' },
                { step: '03', title: 'Delivery', desc: 'Tracking updates via email & SMS' }
              ].map((item, i) => (
                <div key={i} className="flex gap-6 group">
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 border border-gray-300 rounded-full flex items-center justify-center text-xs group-hover:border-black group-hover:bg-black group-hover:text-white transition-all duration-300">
                      {item.step}
                    </div>
                    {i < 2 && <div className="w-px h-8 bg-gray-200 mt-2" />}
                  </div>
                  <div className="flex-1 pb-2">
                    <h4 className="font-light mb-1">{item.title}</h4>
                    <p className="text-sm text-gray-600">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className={`flex flex-col sm:flex-row gap-4 transition-all duration-700 delay-900 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <Button
            onClick={() => navigate(`/orders/${order.id}`)}
            className="flex-1 bg-black hover:bg-gray-800 text-white border-0 h-12 group"
          >
            <span>View Order</span>
            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" strokeWidth={1.5} />
          </Button>
          
          <Button
            onClick={() => navigate('/products')}
            variant="outline"
            className="flex-1 border-black hover:bg-gray-50 h-12"
          >
            <Home className="mr-2 h-4 w-4" strokeWidth={1.5} />
            Continue Shopping
          </Button>
        </div>

        {/* Footer */}
        <div className={`text-center space-y-2 pt-8 transition-all duration-700 delay-1000 ${mounted ? 'opacity-100' : 'opacity-0'}`}>
          <p className="text-sm text-gray-600">Questions about your order?</p>
          <Link 
            to="/contact" 
            className="inline-flex items-center gap-1 text-sm hover:gap-2 transition-all duration-300"
          >
            <span>Contact Support</span>
            <ExternalLink className="h-3 w-3" strokeWidth={1.5} />
          </Link>
        </div>
      </div>

      <style>{`
        @keyframes scale-in {
          0% {
            transform: scale(0.8);
            opacity: 0;
          }
          50% {
            transform: scale(1.05);
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }

        @keyframes ping-slow {
          0%, 100% {
            transform: scale(1);
            opacity: 0.2;
          }
          50% {
            transform: scale(1.5);
            opacity: 0;
          }
        }

        .animate-scale-in {
          animation: scale-in 0.6s ease-out;
        }

        .animate-ping-slow {
          animation: ping-slow 2s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
      `}</style>
    </div>
  );
}

export default OrderSuccess;