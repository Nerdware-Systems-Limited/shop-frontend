import React, { useState, useEffect, useCallback, useMemo } from 'react';
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
  ExternalLink,
  XCircle
} from 'lucide-react';

// Payment state machine constants
const PAYMENT_STATES = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  COMPLETED: 'completed',
  FAILED: 'failed',
  TIMEOUT: 'timeout',
  CANCELLED: 'cancelled'
};

const RESULT_CODES = {
  SUCCESS: 0,
  CANCELLED: 1032,
  INSUFFICIENT_FUNDS: 1,
  PROCESSING: 4999,
  TIMEOUT: 1037
};

function OrderSuccess() {
  const { orderNumber } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const order = location.state?.order;
  const cart = useSelector(state => state.cart || {});
  const mpesaPaymentStatus = useSelector(state => state.mpesaPaymentStatus || {});

  const [paymentState, setPaymentState] = useState(PAYMENT_STATES.PENDING);
  const [pollCount, setPollCount] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [userAction, setUserAction] = useState(null);

  const maxPollAttempts = 20; // 2 minutes (20 * 6s)
  const pollInterval = 6000; // 6 seconds - Respects Safaricom rate limits

  // Determine payment method
  const paymentMethod = cart.paymentMethod?.method || order?.payment_method;
  const isMpesaPayment = paymentMethod === 'MPesa' || paymentMethod === 'mpesa';

  // Extract transaction data safely
  const transaction = useMemo(() => {
    return mpesaPaymentStatus?.statusInfo?.transaction || null;
  }, [mpesaPaymentStatus]);

  // Animation trigger
  useEffect(() => {
    setMounted(true);
  }, []);

  // ==========================================
  // PAYMENT STATE MACHINE
  // ==========================================
  const determinePaymentState = useCallback((transactionData) => {
    if (!transactionData) return PAYMENT_STATES.PENDING;

    const { status, result_code, is_successful, is_pending } = transactionData;

    // console.log('Payment State Determination:', {
    //   status,
    //   result_code,
    //   is_successful,
    //   is_pending
    // });

    // Priority 1: Check is_successful flag (most reliable)
    if (is_successful === true && result_code === RESULT_CODES.SUCCESS) {
      return PAYMENT_STATES.COMPLETED;
    }

    // Priority 2: Check for specific failure codes
    if (result_code === RESULT_CODES.CANCELLED) {
      return PAYMENT_STATES.CANCELLED;
    }

    if (result_code === RESULT_CODES.INSUFFICIENT_FUNDS) {
      return PAYMENT_STATES.FAILED;
    }

    if (result_code === RESULT_CODES.TIMEOUT) {
      return PAYMENT_STATES.TIMEOUT;
    }

    // Priority 3: Check processing state
    if (status === 'processing' || result_code === RESULT_CODES.PROCESSING || is_pending === true) {
      return PAYMENT_STATES.PROCESSING;
    }

    // Priority 4: Check failed state
    if (status === 'failed' && is_successful === false) {
      return PAYMENT_STATES.FAILED;
    }

    // Priority 5: Check completed state
    if (status === 'completed' && result_code === RESULT_CODES.SUCCESS) {
      return PAYMENT_STATES.COMPLETED;
    }

    // Default: pending
    return PAYMENT_STATES.PENDING;
  }, []);

  // Handle M-Pesa payment status updates
  useEffect(() => {
    if (!transaction) return;

    const newState = determinePaymentState(transaction);
    
    // Only update if state actually changed
    if (newState !== paymentState) {
      console.log('Payment state transition:', paymentState, '->', newState);
      setPaymentState(newState);
    }
  }, [transaction, determinePaymentState, paymentState]);

  // ==========================================
  // POLLING LOGIC - Smart & Efficient with Rate Limit Protection
  // ==========================================
  useEffect(() => {
    if (!isMpesaPayment || !order?.mpesa_checkout_request_id) {
      console.log('Skipping M-Pesa polling:', { 
        isMpesaPayment, 
        hasCheckoutId: !!order?.mpesa_checkout_request_id 
      });
      return;
    }

    // Stop polling if payment is in terminal state
    const terminalStates = [
      PAYMENT_STATES.COMPLETED,
      PAYMENT_STATES.FAILED,
      PAYMENT_STATES.CANCELLED
    ];

    if (terminalStates.includes(paymentState)) {
      console.log('Payment in terminal state, stopping poll');
      return;
    }

    // Stop polling if max attempts reached
    if (pollCount >= maxPollAttempts) {
      console.log('Max poll attempts reached, setting timeout state');
      setPaymentState(PAYMENT_STATES.TIMEOUT);
      return;
    }

    // Initial immediate check
    if (pollCount === 0) {
      dispatch(checkMpesaPaymentStatus({ 
        checkout_request_id: order.mpesa_checkout_request_id 
      }));
      setPollCount(1);
    }

    // Set up polling interval with exponential backoff after rate limit errors
    const effectiveInterval = pollCount > 5 ? pollInterval * 1.5 : pollInterval;
    
    const interval = setInterval(() => {
      console.log(`Polling attempt ${pollCount + 1}/${maxPollAttempts} (${effectiveInterval/1000}s interval)`);
      dispatch(checkMpesaPaymentStatus({ 
        checkout_request_id: order.mpesa_checkout_request_id 
      }));
      setPollCount(prev => prev + 1);
    }, effectiveInterval);

    return () => clearInterval(interval);
  }, [
    isMpesaPayment, 
    order?.mpesa_checkout_request_id, 
    pollCount, 
    paymentState, 
    dispatch, 
    maxPollAttempts
  ]);

  // ==========================================
  // USER ACTIONS
  // ==========================================
  const handleRetryPayment = useCallback(() => {
    setUserAction('retry');
    navigate(`/checkout/payment`, { 
      state: { 
        orderId: order?.id,
        orderNumber: order?.order_number,
        retryPayment: true 
      } 
    });
  }, [navigate, order]);

  const handleManualCheck = useCallback(() => {
    if (!order?.mpesa_checkout_request_id) return;
    
    setUserAction('check');
    setPollCount(0);
    setPaymentState(PAYMENT_STATES.PENDING);
    
    dispatch(checkMpesaPaymentStatus({ 
      checkout_request_id: order.mpesa_checkout_request_id 
    }));
  }, [order, dispatch]);

  const handleContactSupport = useCallback(() => {
    navigate('/contact', {
      state: {
        orderNumber: order?.order_number,
        issue: 'payment_issue'
      }
    });
  }, [navigate, order]);

  // ==========================================
  // LOADING INDICATOR
  // ==========================================
  const isLoading = useMemo(() => {
    return mpesaPaymentStatus.loading || 
           (paymentState === PAYMENT_STATES.PENDING && isMpesaPayment);
  }, [mpesaPaymentStatus.loading, paymentState, isMpesaPayment]);

  // ==========================================
  // TIME REMAINING CALCULATOR
  // ==========================================
  const timeRemaining = useMemo(() => {
    const remainingAttempts = maxPollAttempts - pollCount;
    const remainingSeconds = remainingAttempts * (pollInterval / 1000);
    const minutes = Math.floor(remainingSeconds / 60);
    const seconds = remainingSeconds % 60;
    return { minutes, seconds };
  }, [pollCount, maxPollAttempts]);

  // ==========================================
  // RENDER NO ORDER
  // ==========================================
  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-white">
        <div className={`max-w-md w-full transition-all duration-700 ${
          mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}>
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

  // ==========================================
  // RENDER PAYMENT STATUS CARD
  // ==========================================
  const renderPaymentStatusCard = () => {
    // CASH ON DELIVERY - Always success
    if (!isMpesaPayment) {
      return (
        <StatusCard
          icon={<CheckCircle className="h-10 w-10" strokeWidth={1.5} />}
          title="Order Confirmed"
          description="Payment on delivery • Confirmation sent to your email"
          variant="success"
          mounted={mounted}
        />
      );
    }

    // M-PESA PAYMENT STATES
    switch (paymentState) {
      case PAYMENT_STATES.COMPLETED:
        return (
          <StatusCard
            icon={<CheckCircle className="h-10 w-10" strokeWidth={1.5} />}
            title="Payment Confirmed"
            description="Your M-Pesa payment was successful"
            variant="success"
            mounted={mounted}
          >
            {transaction?.mpesa_receipt_number && (
              <div className="inline-block border border-gray-300 px-4 py-2 mt-4">
                <div className="text-xs text-gray-500 mb-1">M-Pesa Receipt</div>
                <div className="font-mono text-sm font-medium">
                  {transaction.mpesa_receipt_number}
                </div>
              </div>
            )}
          </StatusCard>
        );

      case PAYMENT_STATES.PROCESSING:
        return (
          <StatusCard
            icon={<Loader2 className="h-10 w-10 animate-spin" strokeWidth={1.5} />}
            title="Processing Payment"
            description={transaction?.result_desc || "Waiting for M-Pesa confirmation"}
            variant="processing"
            mounted={mounted}
          >
            <div className="flex flex-col items-center gap-3 mt-4">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <div className="flex gap-1">
                  {[0, 150, 300].map((delay, i) => (
                    <div 
                      key={i}
                      className="w-1.5 h-1.5 bg-black rounded-full animate-bounce" 
                      style={{animationDelay: `${delay}ms`}} 
                    />
                  ))}
                </div>
                <span>
                  {timeRemaining.minutes}:{timeRemaining.seconds.toString().padStart(2, '0')} remaining
                </span>
              </div>
              <p className="text-xs text-gray-500 text-center max-w-sm">
                Check your phone for the M-Pesa prompt. This usually takes 10-30 seconds.
              </p>
            </div>
          </StatusCard>
        );

      case PAYMENT_STATES.FAILED:
        return (
          <StatusCard
            icon={<XCircle className="h-10 w-10" strokeWidth={1.5} />}
            title="Payment Failed"
            description={transaction?.result_desc || 'Transaction could not be completed'}
            variant="error"
            mounted={mounted}
          >
            <div className="flex flex-col sm:flex-row gap-3 mt-6">
              <Button 
                onClick={handleRetryPayment}
                className="bg-black hover:bg-gray-800 text-white border-0"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Retry Payment
              </Button>
              <Button 
                onClick={handleContactSupport}
                variant="outline"
                className="border-black hover:bg-gray-50"
              >
                Contact Support
              </Button>
            </div>
          </StatusCard>
        );

      case PAYMENT_STATES.CANCELLED:
        return (
          <StatusCard
            icon={<XCircle className="h-10 w-10" strokeWidth={1.5} />}
            title="Payment Cancelled"
            description="You cancelled the M-Pesa payment request"
            variant="error"
            mounted={mounted}
          >
            <div className="flex justify-center mt-6">
              <Button 
                onClick={handleRetryPayment}
                className="bg-black hover:bg-gray-800 text-white border-0 px-8"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Try Again
              </Button>
            </div>
          </StatusCard>
        );

      case PAYMENT_STATES.TIMEOUT:
        return (
          <StatusCard
            icon={<Clock className="h-10 w-10" strokeWidth={1.5} />}
            title="Payment Verification Timeout"
            description="We couldn't confirm your payment in time. Please check your M-Pesa messages."
            variant="warning"
            mounted={mounted}
          >
            <div className="flex flex-col sm:flex-row gap-3 mt-6">
              <Button 
                onClick={handleManualCheck}
                variant="outline"
                className="border-black hover:bg-gray-50"
                disabled={isLoading}
              >
                {isLoading ? (
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
          </StatusCard>
        );

      default:
        return (
          <StatusCard
            icon={<Loader2 className="h-10 w-10 animate-spin" strokeWidth={1.5} />}
            title="Verifying Payment"
            description="Please wait while we verify your payment"
            variant="processing"
            mounted={mounted}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-white pt-20 px-4 pb-16">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Header */}
        <div className={`text-center space-y-4 transition-all duration-700 ${
          mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}>
          <h1 className="text-4xl md:text-5xl font-light tracking-tight">Thank You</h1>
          <div className="inline-flex items-center gap-2 text-gray-600">
            <span className="text-sm">Order</span>
            <span className="font-mono text-sm border border-gray-300 px-3 py-1">
              #{order.order_number || order.id}
            </span>
          </div>
        </div>

        {/* Payment Status */}
        {renderPaymentStatusCard()}

        {/* Order Details Grid */}
        <div className={`grid md:grid-cols-2 gap-8 transition-all duration-700 delay-500 ${
          mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}>
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
                <span>KSH {order.subtotal || '0.00'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span>
                  {order.shipping_cost === 0 ? 'FREE' : `KSH ${order.shipping_cost || 'TBD'}`}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax</span>
                <span>KSH {order.tax_amount || '0.00'}</span>
              </div>
              <div className="flex justify-between pt-3 border-t border-gray-200 font-light text-base">
                <span>Total</span>
                <span>KSH {order.total || '0.00'}</span>
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
        <div className={`transition-all duration-700 delay-700 ${
          mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}>
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
        <div className={`flex flex-col sm:flex-row gap-4 transition-all duration-700 delay-900 ${
          mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}>
          <Button
            onClick={() => navigate(`/order/${order.order_number}`)}
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
        <div className={`text-center space-y-2 pt-8 transition-all duration-700 delay-1000 ${
          mounted ? 'opacity-100' : 'opacity-0'
        }`}>
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
          0% { transform: scale(0.8); opacity: 0; }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); opacity: 1; }
        }

        @keyframes ping-slow {
          0%, 100% { transform: scale(1); opacity: 0.2; }
          50% { transform: scale(1.5); opacity: 0; }
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

// ==========================================
// STATUS CARD COMPONENT
// ==========================================
const StatusCard = ({ icon, title, description, variant, mounted, children }) => {
  const variantStyles = {
    success: 'border-green-500 bg-green-50',
    error: 'border-red-500 bg-red-50',
    warning: 'border-yellow-500 bg-yellow-50',
    processing: 'border-blue-500 bg-blue-50',
    default: 'border-gray-300 bg-white'
  };

  return (
    <div className={`transition-all duration-700 delay-300 ${
      mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
    }`}>
      <div className={`border-2 p-8 space-y-4 ${variantStyles[variant] || variantStyles.default}`}>
        <div className="flex items-center justify-center">
          <div className="relative">
            <div className="w-20 h-20 border-2 border-black rounded-full flex items-center justify-center animate-scale-in bg-white">
              {icon}
            </div>
            {variant === 'success' && (
              <div className="absolute inset-0 border-2 border-black rounded-full animate-ping-slow opacity-20" />
            )}
          </div>
        </div>
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-light">{title}</h2>
          <p className="text-gray-600">{description}</p>
        </div>
        {children}
      </div>
    </div>
  );
};

export default OrderSuccess;