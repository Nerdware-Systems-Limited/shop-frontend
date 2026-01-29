import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
  Download,
  FileText,
  User,
  Mail,
  Calendar,
  DollarSign,
  ShoppingBag,
  MessageSquare,
  Edit,
  Ban
} from 'lucide-react';
import { Link } from 'react-router-dom';

// shadcn components
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

// Redux actions
import { 
  getOrderDetails, 
  updateOrderStatus, 
  cancelOrder,
  addTrackingToOrder,
  createOrderNote,
  getOrderNotes,
  downloadOrderItem
} from '../actions/orderActions';

const OrderDetails = () => {
  const { id: orderNumber } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Local state
  const [newStatus, setNewStatus] = useState('');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [carrier, setCarrier] = useState('');
  const [noteText, setNoteText] = useState('');
  const [cancelReason, setCancelReason] = useState('');
  const [showStatusDialog, setShowStatusDialog] = useState(false);
  const [showTrackingDialog, setShowTrackingDialog] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [showNoteDialog, setShowNoteDialog] = useState(false);
  const [copiedField, setCopiedField] = useState('');

  // Redux state
  const orderDetails = useSelector(state => state.orderDetails);
  const { loading, error, order } = orderDetails;
  // console.log("Order Details:", order);

  const userLogin = useSelector(state => state.userLogin);
  const { userInfo } = userLogin;

  const orderUpdateStatus = useSelector(state => state.orderUpdateStatus);
  const { loading: updateLoading, success: updateSuccess } = orderUpdateStatus;

  const orderNotes = useSelector(state => state.orderNoteList);
  const { notes } = orderNotes;

  useEffect(() => {
    if (!userInfo) {
      navigate('/login');
    } else if (orderNumber) {
      dispatch(getOrderDetails(orderNumber));
      dispatch(getOrderNotes(orderNumber));
    }
  }, [dispatch, navigate, userInfo, orderNumber, updateSuccess]);

  // Helper functions
  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-500',
      processing: 'bg-blue-500',
      shipped: 'bg-purple-500',
      delivered: 'bg-green-500',
      cancelled: 'bg-red-500',
      refunded: 'bg-gray-500'
    };
    return colors[status] || 'bg-gray-500';
  };

  const getPaymentStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-500',
      paid: 'bg-green-500',
      failed: 'bg-red-500',
      refunded: 'bg-gray-500'
    };
    return colors[status] || 'bg-gray-500';
  };

  const copyToClipboard = (text, field) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(''), 2000);
  };

  const handleStatusUpdate = () => {
    if (newStatus && order) {
      dispatch(updateOrderStatus(order.order_number, { status: newStatus }));
      setShowStatusDialog(false);
      setNewStatus('');
    }
  };

  const handleAddTracking = () => {
    if (trackingNumber && order) {
      dispatch(addTrackingToOrder(order.order_number, {
        tracking_number: trackingNumber,
        carrier: carrier || 'Local Courier'
      }));
      setShowTrackingDialog(false);
      setTrackingNumber('');
      setCarrier('');
    }
  };

  const handleCancelOrder = () => {
    if (cancelReason && order) {
      dispatch(cancelOrder(order.order_number, { reason: cancelReason }));
      setShowCancelDialog(false);
      setCancelReason('');
    }
  };

  const handleAddNote = () => {
    if (noteText && order) {
      dispatch(createOrderNote(order.order_number, { note: noteText }));
      setShowNoteDialog(false);
      setNoteText('');
    }
  };

  // Loading skeleton
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
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

  // Error state
  if (error) {
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

  const isAdmin = userInfo?.isAdmin;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
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
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Order #{order.order_number}
              </h1>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar className="h-4 w-4" />
                <span>Placed on {new Date(order.created_at).toLocaleString()}</span>
              </div>
            </div>

            <div className="flex gap-2">
              <Badge className={`${getStatusColor(order.status)} hover:${getStatusColor(order.status)}`}>
                {order.status_display}
              </Badge>
              <Badge className={`${getPaymentStatusColor(order.payment_status)} hover:${getPaymentStatusColor(order.payment_status)}`}>
                {order.payment_status_display}
              </Badge>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Customer Information */}
            <Card className="border-gray-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Customer Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-600">Name</label>
                    <div className="flex items-center gap-2 mt-1">
                      <p className="font-semibold">{order?.customer_details?.first_name} {order?.customer_details?.last_name}</p>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={() => copyToClipboard(order?.customer_details?.first_name + " " + order?.customer_details?.last_name, 'name')}
                      >
                        {copiedField === 'name' ? (
                          <CheckCircle2 className="h-3 w-3 text-green-600" />
                        ) : (
                          <Copy className="h-3 w-3" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm text-gray-600">Email</label>
                    <div className="flex items-center gap-2 mt-1">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <p className="text-sm">{order?.customer_details?.email}</p>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={() => copyToClipboard(order?.customer_details?.email, 'email')}
                      >
                        {copiedField === 'email' ? (
                          <CheckCircle2 className="h-3 w-3 text-green-600" />
                        ) : (
                          <Copy className="h-3 w-3" />
                        )}
                      </Button>
                    </div>
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
                <div>
                  <label className="text-sm text-gray-600">Shipping Address</label>
                  <p className="mt-1 font-medium">{"P.O Box " + order?.shipping_address?.street_address + "," + order?.shipping_address?.postal_code + ", \n" + order?.shipping_address?.county}</p>
                </div>

                {order.tracking_number && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <Truck className="h-5 w-5 text-blue-600 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-blue-900">Tracking Number</p>
                        <div className="flex items-center gap-2 mt-1">
                          <p className="font-mono text-sm">{order.tracking_number}</p>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0"
                            onClick={() => copyToClipboard(order.tracking_number, 'tracking')}
                          >
                            {copiedField === 'tracking' ? (
                              <CheckCircle2 className="h-3 w-3 text-green-600" />
                            ) : (
                              <Copy className="h-3 w-3" />
                            )}
                          </Button>
                        </div>
                        <p className="text-xs text-gray-600 mt-1">Carrier: {order.carrier}</p>
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
                  Order Items ({order?.items?.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {order.items?.map((item) => (
                    <div key={item.id} className="flex gap-4 pb-4 border-b border-gray-200 last:border-0">
                      <Link to={`/product/${item.product?.slug}`}>
                      <div className="h-20 w-20 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        {item.product?.primary_image ? (
                          <img 
                            src={item.product.primary_image} 
                            alt={item.product.name || 'Product'}
                            className="h-full w-full object-cover rounded-lg"
                          />
                        ) : (
                          <Package className="h-8 w-8 text-gray-400" />
                        )}
                      </div>
                      </Link>

                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-900 truncate">
                          {item.product?.name || 'Product'}
                        </h4>
                        
                        <div className="mt-1 space-y-1">
                          <p className="text-sm text-gray-600">
                            Quantity: {item.quantity || 1}
                          </p>
                          
                          {item.product?.sku && (
                            <p className="text-xs text-gray-500">SKU: {item.product.sku}</p>
                          )}
                          
                          {item.variant_details && (
                            <p className="text-xs text-gray-500">{item.variant_details}</p>
                          )}
                          
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-medium px-2 py-0.5 bg-blue-50 text-blue-700 rounded">
                              {item.product?.category_name || 'Category'}
                            </span>
                            
                            {item.product?.is_low_stock && (
                              <span className="hidden lg:inline-flex text-xs font-medium px-2 py-0.5 bg-yellow-50 text-yellow-700 rounded">
                                Low Stock
                              </span>
                            )}
                            
                            {item.product?.is_featured && (
                              <span className="hidden lg:inline-flex text-xs font-medium px-2 py-0.5 bg-purple-50 text-purple-700 rounded">
                                Featured
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="text-right flex flex-col justify-between">
                        <div>
                          <p className="font-semibold text-gray-900">
                            KSH {parseFloat(item.price || 0).toFixed(2)}
                          </p>
                          
                          {item.product?.discount_percentage && parseFloat(item.product.discount_percentage) > 0 && (
                            <div className="text-sm text-gray-500 mt-1">
                              <span className="line-through mr-2">
                                KSH {parseFloat(item.original_price || item.price || 0).toFixed(2)}
                              </span>
                              <span className="text-green-600 font-medium">
                                {parseFloat(item.product.discount_percentage)}% off
                              </span>
                            </div>
                          )}
                        </div>
                        
                        <div className="mt-2">
                          <p className="text-sm text-gray-600">
                            Total: KSH {parseFloat(item.total || 0).toFixed(2)}
                          </p>
                          
                          {parseFloat(item.tax_rate || 0) > 0 && (
                            <p className="text-xs text-gray-500">
                              (incl. {parseFloat(item.tax_rate || 0)}% tax)
                            </p>
                          )}
                        </div>
                        
                        {item.is_digital && item.can_download && (
                          <button className="mt-2 text-xs font-medium text-blue-600 hover:text-blue-800 hover:underline">
                            Download File
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                  {(!order.items || order.items.length === 0) && (
                    <p className="text-center text-gray-500 py-8">No items found</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Order Notes - Admin Only */}
            {isAdmin && (
              <Card className="border-gray-200">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <MessageSquare className="h-5 w-5" />
                      Order Notes
                    </CardTitle>
                    <Button 
                      variant="outline"
                      size="sm"
                      onClick={() => setShowNoteDialog(true)}
                      className="border-gray-300"
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      Add Note
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {notes && notes.length > 0 ? (
                    <div className="space-y-3">
                      {notes.map((note, index) => (
                        <div key={index} className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                          <p className="text-sm">{note.note}</p>
                          <p className="text-xs text-gray-500 mt-2">
                            {new Date(note.created_at).toLocaleString()}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center text-gray-500 py-4">No notes yet</p>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column - Sidebar */}
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
                  <span className="font-medium">KSH {order.subtotal}</span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium">KSH {order.shipping_cost}</span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax</span>
                  <span className="font-medium">KSH {order.tax_amount}</span>
                </div>

                {parseFloat(order.discount_amount) > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Discount</span>
                    <span className="font-medium">-KSH {order.discount_amount}</span>
                  </div>
                )}

                <Separator />

                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>KSH {order.total} {order.currency}</span>
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
                    <Badge className={`${getPaymentStatusColor(order.payment_status)}`}>
                      {order.payment_status_display}
                    </Badge>
                  </div>
                  
                  {order.payment_method && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Method</span>
                      <span className="font-medium">{order.payment_method}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Admin Actions */}
            {isAdmin && (
              <Card className="border-gray-200">
                <CardHeader>
                  <CardTitle>Admin Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button 
                    className="w-full bg-black hover:bg-gray-900 text-white"
                    onClick={() => setShowStatusDialog(true)}
                    disabled={updateLoading}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Update Status
                  </Button>

                  {!order.tracking_number && (
                    <Button 
                      variant="outline"
                      className="w-full border-gray-300"
                      onClick={() => setShowTrackingDialog(true)}
                    >
                      <Truck className="h-4 w-4 mr-2" />
                      Add Tracking
                    </Button>
                  )}

                  {order.status !== 'cancelled' && order.status !== 'delivered' && (
                    <Button 
                      variant="outline"
                      className="w-full border-red-300 text-red-600 hover:bg-red-50"
                      onClick={() => setShowCancelDialog(true)}
                    >
                      <Ban className="h-4 w-4 mr-2" />
                      Cancel Order
                    </Button>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Dialogs */}
        
        {/* Update Status Dialog */}
        <Dialog open={showStatusDialog} onOpenChange={setShowStatusDialog}>
          <DialogContent className="bg-white">
            <DialogHeader>
              <DialogTitle>Update Order Status</DialogTitle>
              <DialogDescription>
                Change the status of order #{order.order_number}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <Select value={newStatus} onValueChange={setNewStatus}>
                <SelectTrigger className="border-gray-300">
                  <SelectValue placeholder="Select new status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="shipped">Shipped</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => setShowStatusDialog(false)}
                className="border-gray-300"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleStatusUpdate}
                disabled={!newStatus || updateLoading}
                className="bg-black hover:bg-gray-900 text-white"
              >
                Update Status
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Add Tracking Dialog */}
        <Dialog open={showTrackingDialog} onOpenChange={setShowTrackingDialog}>
          <DialogContent className="bg-white">
            <DialogHeader>
              <DialogTitle>Add Tracking Information</DialogTitle>
              <DialogDescription>
                Add tracking details for order #{order.order_number}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Tracking Number</label>
                <Input
                  placeholder="Enter tracking number"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  className="border-gray-300"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Carrier</label>
                <Input
                  placeholder="e.g., DHL, FedEx, Local Courier"
                  value={carrier}
                  onChange={(e) => setCarrier(e.target.value)}
                  className="border-gray-300"
                />
              </div>
            </div>
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => setShowTrackingDialog(false)}
                className="border-gray-300"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleAddTracking}
                disabled={!trackingNumber}
                className="bg-black hover:bg-gray-900 text-white"
              >
                Add Tracking
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Cancel Order Dialog */}
        <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
          <DialogContent className="bg-white">
            <DialogHeader>
              <DialogTitle>Cancel Order</DialogTitle>
              <DialogDescription>
                Are you sure you want to cancel order #{order.order_number}?
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <Textarea
                placeholder="Reason for cancellation..."
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className="border-gray-300"
                rows={4}
              />
            </div>
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => setShowCancelDialog(false)}
                className="border-gray-300"
              >
                Go Back
              </Button>
              <Button 
                onClick={handleCancelOrder}
                disabled={!cancelReason}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                Cancel Order
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Add Note Dialog */}
        <Dialog open={showNoteDialog} onOpenChange={setShowNoteDialog}>
          <DialogContent className="bg-white">
            <DialogHeader>
              <DialogTitle>Add Order Note</DialogTitle>
              <DialogDescription>
                Add an internal note for order #{order.order_number}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <Textarea
                placeholder="Enter your note..."
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                className="border-gray-300"
                rows={4}
              />
            </div>
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => setShowNoteDialog(false)}
                className="border-gray-300"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleAddNote}
                disabled={!noteText}
                className="bg-black hover:bg-gray-900 text-white"
              >
                Add Note
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default OrderDetails;