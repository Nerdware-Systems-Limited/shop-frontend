import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Package,
  MapPin,
  CreditCard,
  Truck,
  CheckCircle2,
  Clock,
  XCircle,
  AlertCircle,
  ChevronLeft,
  Copy,
  Calendar,
  DollarSign,
  ShoppingBag,
  RefreshCw,
  Lock,
  ClipboardList,
} from 'lucide-react';

// shadcn components — same imports as OrderDetails
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';

// Redux
import {
  getOrderByTrackingToken,
  resetOrderTrackingToken,
} from '../actions/orderActions';

// ─────────────────────────────────────────────────────────────────────────────
// OrderTrackingPage
//
// Route:  /orders/:orderNumber?tracking_token=<token>
//
// Auth logic:
//   • If userInfo exists in Redux (logged-in user) AND the order number in the
//     URL matches their session → this page still works; the token is simply
//     ignored and any authenticated order-detail link will also work.
//   • If userInfo is null (guest / email link) → token is read from the URL
//     query param and used to fetch the order publicly.
//   • If the token is missing and the user is not logged in → redirect to login.
// ─────────────────────────────────────────────────────────────────────────────
const OrderTrackingPage = () => {
  const { orderNumber } = useParams();         // /orders/:orderNumber
  const [searchParams]  = useSearchParams();   // ?tracking_token=...
  const dispatch        = useDispatch();
  const navigate        = useNavigate();

  const trackingToken = searchParams.get('tracking_token');

  // ── Redux state ─────────────────────────────────────────────────────────────
  //
  // HOW TO READ REDUX STATE CORRECTLY (pattern used across this codebase):
  //
  //   const sliceName = useSelector(state => state.sliceKey);
  //   const { loading, someField, error } = sliceName;
  //
  // The key (`state.sliceKey`) must match what you registered in combineReducers
  // inside store.js.  Examples from this codebase:
  //
  //   state.userLogin          → { userInfo, loading, error }
  //   state.orderDetails       → { order, loading, error }
  //   state.orderTrackToken    → { order, loading, error, expired }   ← new
  //
  const userLogin        = useSelector((state) => state.userLogin);
  const { userInfo }     = userLogin;
  // userInfo is hydrated from localStorage on app boot (see store.js initialState).
  // It equals null when no one is logged in, or
  // { accessToken, refreshToken, isAdmin?, ... } when someone is.

  const orderTrackToken  = useSelector((state) => state.orderTrackToken);
  const { loading, order, error, expired } = orderTrackToken;

  // ── Local state ─────────────────────────────────────────────────────────────
  const [copiedField, setCopiedField] = useState('');

  // ── Effect: decide auth path & fetch ────────────────────────────────────────
  useEffect(() => {
    // CASE 1: No token AND no login → bounce to login with a redirect hint
    if (!trackingToken && !userInfo) {
      navigate(`/login?redirect=/orders/${orderNumber}`, { replace: true });
      return;
    }

    // CASE 2: Token present → fetch publicly (works for guests AND logged-in users)
    if (trackingToken) {
      dispatch(getOrderByTrackingToken(trackingToken));
    }

    // CASE 3: Logged-in user arrived WITHOUT a token (e.g. typed URL directly)
    // They should use the normal authenticated OrderDetails page instead.
    // We silently redirect them there so they get the full admin-capable view.
    if (!trackingToken && userInfo) {
      navigate(`/order/${orderNumber}`, { replace: true });
    }

    // Cleanup: reset the slice when leaving so stale data doesn't flash
    return () => {
      dispatch(resetOrderTrackingToken());
    };
  }, [dispatch, navigate, trackingToken, orderNumber, userInfo]);

  // ── Helpers ─────────────────────────────────────────────────────────────────
  const getStatusConfig = (status) => {
    const configs = {
      pending:         { color: 'bg-yellow-500', icon: <Clock className="h-4 w-4" />,        label: 'Pending' },
      processing:      { color: 'bg-blue-500',   icon: <RefreshCw className="h-4 w-4" />,    label: 'Processing' },
      shipped:         { color: 'bg-purple-500', icon: <Truck className="h-4 w-4" />,        label: 'Shipped' },
      out_for_delivery:{ color: 'bg-indigo-500', icon: <Truck className="h-4 w-4" />,        label: 'Out for Delivery' },
      delivered:       { color: 'bg-green-500',  icon: <CheckCircle2 className="h-4 w-4" />, label: 'Delivered' },
      cancelled:       { color: 'bg-red-500',    icon: <XCircle className="h-4 w-4" />,      label: 'Cancelled' },
      refunded:        { color: 'bg-gray-500',   icon: <XCircle className="h-4 w-4" />,      label: 'Refunded' },
    };
    return configs[status] || { color: 'bg-gray-500', icon: <Clock className="h-4 w-4" />, label: status };
  };

  const getPaymentStatusColor = (status) => {
    const colors = {
      pending:  'bg-yellow-500',
      paid:     'bg-green-500',
      failed:   'bg-red-500',
      refunded: 'bg-gray-500',
    };
    return colors[status] || 'bg-gray-500';
  };

  const copyToClipboard = (text, field) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(''), 2000);
  };

  // ── Progress timeline steps ──────────────────────────────────────────────────
  const TIMELINE_STEPS = [
    { key: 'pending',    label: 'Order Placed',    icon: <ClipboardList className="h-4 w-4" /> },
    { key: 'processing', label: 'Processing',      icon: <RefreshCw className="h-4 w-4" /> },
    { key: 'shipped',    label: 'Shipped',          icon: <Truck className="h-4 w-4" /> },
    { key: 'delivered',  label: 'Delivered',        icon: <CheckCircle2 className="h-4 w-4" /> },
  ];

  const getStepState = (stepKey, currentStatus) => {
    const order = ['pending', 'processing', 'shipped', 'delivered'];
    const stepIdx    = order.indexOf(stepKey);
    const currentIdx = order.indexOf(currentStatus);
    if (currentStatus === 'cancelled') return stepIdx === 0 ? 'cancelled' : 'inactive';
    if (stepIdx < currentIdx)  return 'complete';
    if (stepIdx === currentIdx) return 'active';
    return 'inactive';
  };

  // ─────────────────────────────────────────────────────────────────────────────
  // RENDER STATES
  // ─────────────────────────────────────────────────────────────────────────────

  // Loading skeleton — mirrors OrderDetails pattern
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8 max-w-5xl">
          <Skeleton className="h-8 w-64 mb-8 bg-gray-200" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="border-gray-200">
                  <CardContent className="pt-6">
                    <Skeleton className="h-32 w-full bg-gray-200" />
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="space-y-6">
              <Card className="border-gray-200">
                <CardContent className="pt-6">
                  <Skeleton className="h-48 w-full bg-gray-200" />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── EXPIRED / INVALID TOKEN ─────────────────────────────────────────────────
  if (expired) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <Card className="max-w-md w-full border-gray-200">
          <CardContent className="pt-8 pb-8 space-y-6 text-center">
            <div className="flex justify-center">
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
                <Lock className="h-8 w-8 text-gray-400" />
              </div>
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-semibold text-gray-900">Tracking Link Expired</h2>
              <p className="text-sm text-gray-500">
                This link was valid for 14 days and has now expired.
                Please log in to view your order details.
              </p>
            </div>
            <div className="space-y-3">
              <Button
                className="w-full bg-black hover:bg-gray-900 text-white"
                onClick={() => navigate(`/login?redirect=/order/${orderNumber}`)}
              >
                Log In to View Order
              </Button>
              <Button
                variant="outline"
                className="w-full border-gray-300"
                onClick={() => navigate('/products')}
              >
                Continue Shopping
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // ── GENERIC ERROR ───────────────────────────────────────────────────────────
  if (error && !expired) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md border-gray-200">
          <CardContent className="pt-6">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
            <Button
              className="w-full mt-4 bg-black hover:bg-gray-900 text-white"
              onClick={() => navigate(-1)}
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Go Back
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!order) return null;

  const statusConfig = getStatusConfig(order.status);

  // ─────────────────────────────────────────────────────────────────────────────
  // MAIN RENDER
  // ─────────────────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-5xl">

        {/* ── Header ────────────────────────────────────────────────────────── */}
        <div className="mb-8">
          <Button
            variant="ghost"
            className="mb-4 hover:bg-gray-200"
            onClick={() => navigate(-1)}
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back
          </Button>

          <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
            <div>
              <p className="text-sm text-gray-500 mb-1">Order Tracking</p>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Order #{order.order_number}
              </h1>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar className="h-4 w-4" />
                <span>Placed on {new Date(order.created_at).toLocaleString()}</span>
              </div>
            </div>

            <div className="flex gap-2">
              <Badge className={`${statusConfig.color} hover:${statusConfig.color} flex items-center gap-1`}>
                {statusConfig.icon}
                {order.status_display}
              </Badge>
              <Badge className={`${getPaymentStatusColor(order.payment_status)} hover:${getPaymentStatusColor(order.payment_status)}`}>
                {order.payment_status_display}
              </Badge>
            </div>
          </div>
        </div>

        {/* ── Guest banner (shown only to non-logged-in visitors) ────────────── */}
        {!userInfo && (
          <Alert className="mb-6 border-blue-200 bg-blue-50">
            <Lock className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800 text-sm">
              You are viewing this order via a secure email link.{' '}
              <button
                className="underline font-medium hover:no-underline"
                onClick={() => navigate('/login')}
              >
                Log in
              </button>{' '}
              to manage your orders, request returns, and more.
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ── LEFT COLUMN ─────────────────────────────────────────────────── */}
          <div className="lg:col-span-2 space-y-6">

            {/* Progress Timeline */}
            <Card className="border-gray-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="h-5 w-5" />
                  Order Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  {/* Connector line */}
                  <div className="absolute left-5 top-5 bottom-5 w-0.5 bg-gray-200 hidden sm:block" />

                  <div className="space-y-6">
                    {TIMELINE_STEPS.map((step) => {
                      const stepState = getStepState(step.key, order.status);
                      const stepHistory = order.status_history?.find(
                        (h) => h.new_status === step.key
                      );

                      const circleClass =
                        stepState === 'complete'
                          ? 'bg-green-600 text-white border-green-600'
                          : stepState === 'active'
                          ? 'bg-black text-white border-black'
                          : stepState === 'cancelled'
                          ? 'bg-red-500 text-white border-red-500'
                          : 'bg-white text-gray-400 border-gray-300';

                      const labelClass =
                        stepState === 'complete'
                          ? 'text-green-700 font-semibold'
                          : stepState === 'active'
                          ? 'text-gray-900 font-semibold'
                          : 'text-gray-400';

                      return (
                        <div key={step.key} className="flex items-start gap-4 relative">
                          <div
                            className={`w-10 h-10 rounded-full border-2 flex items-center justify-center flex-shrink-0 z-10 bg-white ${circleClass}`}
                          >
                            {step.icon}
                          </div>
                          <div className="flex-1 min-w-0 pt-1.5">
                            <p className={`text-sm ${labelClass}`}>{step.label}</p>
                            {stepHistory && (
                              <p className="text-xs text-gray-500 mt-0.5">
                                {new Date(stepHistory.created_at).toLocaleString()}
                                {stepHistory.notes ? ` — ${stepHistory.notes}` : ''}
                              </p>
                            )}
                            {stepState === 'active' && !stepHistory && (
                              <p className="text-xs text-gray-500 mt-0.5">In progress</p>
                            )}
                          </div>
                        </div>
                      );
                    })}

                    {/* Cancelled state */}
                    {order.status === 'cancelled' && (
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-full border-2 border-red-500 bg-red-500 text-white flex items-center justify-center flex-shrink-0 z-10">
                          <XCircle className="h-4 w-4" />
                        </div>
                        <div className="flex-1 pt-1.5">
                          <p className="text-sm font-semibold text-red-600">Order Cancelled</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Shipping Information */}
            <Card className="border-gray-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Shipping Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {(
                  <div>
                    <label className="text-sm text-gray-600">Delivery Address</label>
                    <p className="mt-1 font-medium">
                      {[
                        order.shipping_address.street_address &&
                          `P.O Box ${order.shipping_address.street_address}`,
                        order.shipping_address.postal_code,
                        order.shipping_address.county,
                      ]
                        .filter(Boolean)
                        .join(', ')}
                    </p>
                    <label className="text-sm text-gray-600">Shipping Method</label>
                    <p className="mt-1 font-medium">
                      {order.shipping_method}
                    </p>
                  </div>
                )}

                {order.tracking_number && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <Truck className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-blue-900">Tracking Number</p>
                        <div className="flex items-center gap-2 mt-1">
                          <p className="font-mono text-sm break-all">{order.tracking_number}</p>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0 flex-shrink-0"
                            onClick={() => copyToClipboard(order.tracking_number, 'tracking')}
                          >
                            {copiedField === 'tracking' ? (
                              <CheckCircle2 className="h-3 w-3 text-green-600" />
                            ) : (
                              <Copy className="h-3 w-3" />
                            )}
                          </Button>
                        </div>
                        {order.carrier && (
                          <p className="text-xs text-gray-600 mt-1">Carrier: {order.carrier}</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {order.estimated_delivery && (
                  <div>
                    <label className="text-sm text-gray-600">Estimated Delivery</label>
                    <p className="mt-1 font-medium">
                      {new Date(order.estimated_delivery).toLocaleDateString()}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Order Items */}
            <Card className="border-gray-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingBag className="h-5 w-5" />
                  Order Items ({order?.items?.length ?? 0})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {order.items?.map((item, idx) => (
                    <div
                      key={item.id ?? idx}
                      className="flex gap-4 pb-4 border-b border-gray-200 last:border-0"
                    >
                      <div className="h-20 w-20 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Package className="h-8 w-8 text-gray-400" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-900 truncate">
                          {item.product?.name || 'Product'}
                        </h4>
                        <p className="text-sm text-gray-600 mt-1">
                          Qty: {item.quantity}
                        </p>
                      </div>

                      <div className="text-right flex-shrink-0">
                        <p className="font-semibold text-gray-900">
                          KSH {parseFloat(item.price || 0).toFixed(2)}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          Total: KSH {(parseFloat(item.price || 0) * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}

                  {(!order.items || order.items.length === 0) && (
                    <p className="text-center text-gray-500 py-8">No items found</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* ── RIGHT COLUMN ────────────────────────────────────────────────── */}
          <div className="space-y-6">

            {/* Order Summary */}
            <Card className="border-gray-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">KSH {order.subtotal ?? '—'}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium">KSH {order.shipping_cost ?? '—'}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax</span>
                  <span className="font-medium">KSH {order.tax_amount ?? '—'}</span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>KSH {order.total}</span>
                </div>
              </CardContent>
            </Card>

            {/* Payment Information */}
            <Card className="border-gray-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Payment
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Status</span>
                    <Badge className={getPaymentStatusColor(order.payment_status)}>
                      {order.payment_status_display}
                    </Badge>
                  </div>
                  {order.payment_method && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Method</span>
                      <span className="font-medium">{order.payment_method_display}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* CTA for logged-out users */}
            {!userInfo && (
              <Card className="border-gray-200 bg-gray-50">
                <CardContent className="pt-6 space-y-3">
                  <p className="text-sm text-gray-600 text-center">
                    Want to manage your orders, request returns, or view full history?
                  </p>
                  <Button
                    className="w-full bg-black hover:bg-gray-900 text-white"
                    onClick={() => navigate('/login')}
                  >
                    <Lock className="h-4 w-4 mr-2" />
                    Log In to Your Account
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderTrackingPage;