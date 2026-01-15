import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { saveShippingAddress } from "../../actions/cartActions";
import { useNavigate } from "react-router-dom";
import CheckoutSteps from "../../components/checkout/CheckoutSteps";
import { 
  listAddresses,
  deleteAddress,
  setAddressAsDefault
} from '../../actions/customerActions';
import { Button } from "@/components/ui/button";
import { Plus, MapPin, Check, ArrowRight, ArrowLeft, Edit2, Trash2, AlertCircle } from "lucide-react";
import { AddressModal } from "../../components/checkout/AddressModal";

function Shipping({ setCompleted, completed }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Local state
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [editingAddress, setEditingAddress] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  // Redux selectors
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;

  const addressList = useSelector((state) => state.addressList);
  const { loading: loadingAddresses, addresses, error: addressesError } = addressList;

  const addressDelete = useSelector((state) => state.addressDelete);
  const { loading: deleteLoading, success: deleteSuccess } = addressDelete;

  // Auth redirect
  useEffect(() => {
    if (!userInfo) {
      navigate("/login");
    } else {
      dispatch(listAddresses());
    }
  }, [userInfo, navigate, dispatch]);

  // Sync selected address with cart state
  useEffect(() => {
    if (shippingAddress?.id) {
      setSelectedAddressId(shippingAddress.id);
    }
  }, [shippingAddress]);

  // Handle successful deletion
  useEffect(() => {
    if (deleteSuccess) {
      setDeleteConfirmId(null);
      // If deleted address was selected, clear selection
      if (deleteConfirmId === selectedAddressId) {
        setSelectedAddressId(null);
        dispatch(saveShippingAddress(null));
      }
    }
  }, [deleteSuccess, deleteConfirmId, selectedAddressId, dispatch]);

  // Handler: Add new address
  const handleAddAddress = useCallback(() => {
    setEditingAddress(null);
    setModalOpen(true);
  }, []);

  // Handler: Edit address
  const handleEditAddress = useCallback((address, e) => {
    e?.stopPropagation();
    setEditingAddress(address);
    setModalOpen(true);
  }, []);

  // Handler: Select address
  const handleSelectAddress = useCallback((address) => {
    setSelectedAddressId(address.id);
    dispatch(saveShippingAddress(address));
  }, [dispatch]);

  // Handler: Delete address with confirmation
  const handleDeleteAddress = useCallback((addressId, e) => {
    e?.stopPropagation();
    
    if (deleteConfirmId === addressId) {
      // Confirm delete
      dispatch(deleteAddress(addressId));
    } else {
      // Show confirmation
      setDeleteConfirmId(addressId);
      // Auto-cancel after 3 seconds
      setTimeout(() => {
        setDeleteConfirmId(null);
      }, 3000);
    }
  }, [deleteConfirmId, dispatch]);

  // Handler: Continue to payment
  const handleContinue = useCallback(() => {
    if (!selectedAddressId) {
      return;
    }

    if (typeof setCompleted === 'function') {
      setCompleted((prev) => ({ ...prev, 0: true }));
    }

    navigate("/payment");
  }, [selectedAddressId, setCompleted, navigate]);

  // Handler: Back to cart
  const handleBackToCart = useCallback(() => {
    navigate('/cart');
  }, [navigate]);

  // Get addresses array safely
  const addressesArray = addresses?.results || addresses || [];
  const hasAddresses = addressesArray.length > 0;
  const selectedAddress = addressesArray.find(addr => addr.id === selectedAddressId);

  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <div className="border-b-2 border-black">
        <div className="px-4 py-6">
          <h1 className="text-xl uppercase tracking-[0.3em] font-medium text-center">
            Shipping
          </h1>
        </div>
      </div>

      {/* Checkout Steps */}
      <div className="border-b border-black/10">
        <CheckoutSteps step_active={0} completed={completed || {}} />
      </div>

      {/* Main Content */}
      <div className="px-4 py-8 max-w-4xl mx-auto">
        
        {/* Header with Add Button */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-sm uppercase tracking-[0.2em] font-medium">
              Select Shipping Address
            </h2>
            <p className="text-xs text-gray-600 mt-1">
              Choose from saved addresses or add new
            </p>
          </div>
          <Button
            onClick={handleAddAddress}
            className="h-10 bg-black text-white hover:bg-gray-900 text-[10px] uppercase tracking-[0.2em] transition-all hover:scale-105"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add New
          </Button>
        </div>

        {/* Loading State */}
        {loadingAddresses && (
          <div className="text-center py-12">
            <div className="inline-block w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin" />
            <p className="text-xs text-gray-600 mt-3 uppercase tracking-wider">
              Loading addresses...
            </p>
          </div>
        )}

        {/* Error State */}
        {addressesError && !loadingAddresses && (
          <div className="border-2 border-red-500 bg-red-50 p-6 text-center mb-8 animate-in fade-in slide-in-from-top-2 duration-300">
            <AlertCircle className="w-8 h-8 mx-auto mb-3 text-red-600" />
            <p className="text-sm text-red-700 font-medium mb-2">Failed to load addresses</p>
            <p className="text-xs text-red-600">{addressesError}</p>
            <Button
              onClick={() => dispatch(listAddresses())}
              variant="outline"
              className="mt-4 h-9 border-2 border-red-500 text-red-700 hover:bg-red-50 text-[10px] uppercase tracking-wider"
            >
              Try Again
            </Button>
          </div>
        )}

        {/* Address List */}
        {!loadingAddresses && hasAddresses && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {addressesArray.map((addr) => {
              const isSelected = selectedAddressId === addr.id;
              const isDeleting = deleteConfirmId === addr.id;
              
              return (
                <div
                  key={addr.id}
                  onClick={() => !isDeleting && handleSelectAddress(addr)}
                  className={`border-2 p-5 cursor-pointer transition-all duration-200 ${
                    isSelected
                      ? 'border-black bg-black text-white shadow-lg scale-[1.02]'
                      : 'border-black hover:bg-gray-50 hover:shadow-md'
                  } ${isDeleting ? 'ring-2 ring-red-500 ring-offset-2' : ''}`}
                >
                  {/* Selection Indicator & Actions */}
                  <div className="flex items-start justify-between mb-3">
                    <div className={`w-5 h-5 border-2 rounded-full flex items-center justify-center transition-all ${
                      isSelected ? 'border-white bg-white' : 'border-black'
                    }`}>
                      {isSelected && (
                        <Check className="w-3 h-3 text-black" />
                      )}
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <button
                        onClick={(e) => handleEditAddress(addr, e)}
                        disabled={deleteLoading && deleteConfirmId === addr.id}
                        className={`p-1.5 rounded transition-all ${
                          isSelected 
                            ? 'hover:bg-white/20' 
                            : 'hover:bg-gray-200'
                        } disabled:opacity-50`}
                        title="Edit address"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={(e) => handleDeleteAddress(addr.id, e)}
                        disabled={deleteLoading && deleteConfirmId === addr.id}
                        className={`p-1.5 rounded transition-all ${
                          isDeleting
                            ? 'bg-red-500 text-white'
                            : isSelected 
                              ? 'hover:bg-white/20' 
                              : 'hover:bg-red-50 hover:text-red-600'
                        } disabled:opacity-50`}
                        title={isDeleting ? "Click again to confirm delete" : "Delete address"}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Delete Confirmation Message */}
                  {isDeleting && (
                    <div className="mb-3 p-2 bg-red-50 border border-red-200 rounded animate-in fade-in slide-in-from-top-1 duration-200">
                      <p className="text-[10px] text-red-700 uppercase tracking-wider">
                        Click delete again to confirm
                      </p>
                    </div>
                  )}

                  {/* Address Details */}
                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" />
                      <div className="text-sm leading-relaxed flex-1">
                        <div className="font-medium flex items-center gap-2">
                          <span className="capitalize">{addr.address_type}</span>
                          {addr.is_default && (
                            <span className={`text-[9px] px-2 py-0.5 rounded uppercase tracking-wider ${
                              isSelected 
                                ? 'bg-white/20 text-white' 
                                : 'bg-black/10 text-black'
                            }`}>
                              Default
                            </span>
                          )}
                        </div>
                        <div className="opacity-90 mt-1">
                          {addr.street_address}
                          {addr.apartment && `, ${addr.apartment}`}
                        </div>
                        <div className="opacity-80">
                          {addr.ward && `${addr.ward}, `}
                          {addr.subcounty && `${addr.subcounty}, `}
                          {addr.city}
                        </div>
                        <div className="opacity-80">
                          {addr.county}, {addr.postal_code}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Empty State */}
        {!loadingAddresses && !addressesError && !hasAddresses && (
          <div className="border-2 border-black p-12 text-center mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <MapPin className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <h3 className="text-sm uppercase tracking-[0.2em] font-medium mb-2">
              No Addresses Saved
            </h3>
            <p className="text-xs text-gray-600 mb-6">
              Add your first shipping address to continue
            </p>
            <Button
              onClick={handleAddAddress}
              className="h-10 bg-black text-white hover:bg-gray-900 text-[10px] uppercase tracking-[0.2em] transition-all hover:scale-105"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Address
            </Button>
          </div>
        )}

        {/* Selected Address Preview */}
        {selectedAddress && (
          <div className="border-2 border-black bg-gray-50 p-5 mb-8 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="flex items-start gap-3">
              <Check className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-[10px] uppercase tracking-[0.2em] font-medium mb-2">
                  Shipping To
                </p>
                <p className="text-sm leading-relaxed">
                  {selectedAddress.street_address}
                  {selectedAddress.apartment && `, ${selectedAddress.apartment}`}
                  <br />
                  {selectedAddress.city}, {selectedAddress.county} {selectedAddress.postal_code}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Delivery Info */}
        <div className="border-2 border-black p-5 mb-8">
          <div className="flex items-start gap-3">
            <div className="w-1 h-full bg-black flex-shrink-0" />
            <div className="space-y-1">
              <p className="text-[10px] uppercase tracking-[0.2em] font-medium">
                Delivery Information
              </p>
              <p className="text-xs text-gray-600 leading-relaxed">
                Standard delivery: 3-5 business days<br />
                Free shipping on orders above KES 5,000
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex flex-col-reverse sm:flex-row gap-3">
          <Button
            onClick={handleBackToCart}
            variant="outline"
            className="flex-1 h-12 border-2 border-black bg-white hover:bg-gray-50 text-[10px] uppercase tracking-[0.2em] transition-all hover:scale-[1.02]"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Cart
          </Button>
          <Button
            onClick={handleContinue}
            disabled={!selectedAddressId}
            className="flex-1 h-12 bg-black text-white hover:bg-gray-900 disabled:opacity-40 disabled:cursor-not-allowed text-[10px] uppercase tracking-[0.2em] transition-all hover:scale-[1.02] disabled:hover:scale-100"
          >
            Continue to Payment
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>

        {/* Validation Warning */}
        {!selectedAddressId && hasAddresses && (
          <div className="mt-4 p-3 border-2 border-amber-500 bg-amber-50 text-amber-800 text-xs text-center animate-in fade-in slide-in-from-bottom-2 duration-300">
            <AlertCircle className="w-4 h-4 inline-block mr-2" />
            Please select a shipping address to continue
          </div>
        )}
      </div>

      {/* Address Modal */}
      <AddressModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        editAddress={editingAddress}
        addressType="shipping"
      />
    </div>
  );
}

export default Shipping;