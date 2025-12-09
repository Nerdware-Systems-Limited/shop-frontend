import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { saveShippingAddress } from "../../actions/cartActions";
import { useNavigate } from "react-router-dom";
import CheckoutSteps from "../../components/checkout/CheckoutSteps";
import { 
  createAddress,
  listAddresses,
} from '../../actions/customerActions';
import { Button } from "@/components/ui/button";
import { Plus, MapPin, Check, ArrowRight, ArrowLeft, Edit2, Trash2 } from "lucide-react";
import { AddressModal } from "../../components/checkout/AddressModal";

function Shipping({ setCompleted, completed }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [editingAddress, setEditingAddress] = useState(null);

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  // Redirect if not logged in
  useEffect(() => {
    if (!userInfo){
      navigate("/login");
    } else {
      dispatch(listAddresses());
    }
  }, [userInfo, navigate, dispatch]);

  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;

  const addressList = useSelector((state) => state.addressList);
  const { loading: loadingAddresses, addresses, error: addressesError } = addressList;

  const handleAddAddress = () => {
    setEditingAddress(null);
    setModalOpen(true);
  };

  const handleEditAddress = (address) => {
    setEditingAddress(address);
    setModalOpen(true);
  };

  const handleSaveAddress = (addressData) => {
    if (editingAddress) {
      // Update existing address
      // dispatch(updateAddress(editingAddress.id, addressData));
    } else {
      // Create new address
      dispatch(createAddress(addressData));
    }
  };

  const handleSelectAddress = (address) => {
    setSelectedAddressId(address.id);
    dispatch(saveShippingAddress(address));
  };

  const handleContinue = () => {
    if (!selectedAddressId) {
      alert("Please select a shipping address");
      return;
    }

    if (typeof setCompleted === 'function') {
      setCompleted((prev) => ({ ...prev, 0: true }));
    }

    navigate("/payment");
  };


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
        <CheckoutSteps step_active="0" completed={completed || {}} />
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
            className="h-10 bg-black text-white hover:bg-gray-900 text-[10px] uppercase tracking-[0.2em]"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add New
          </Button>
        </div>

        {/* Loading State */}
        {loadingAddresses && (
          <div className="text-center py-12">
            <div className="inline-block w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {/* Error State */}
        {addressesError && (
          <div className="border-2 border-black p-4 text-center">
            <p className="text-sm text-gray-600">{addressesError}</p>
          </div>
        )}

        {/* Address List */}
        {!loadingAddresses && addresses && addresses?.results && addresses?.results.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {addresses?.results?.map((addr) => (
              <div
                key={addr.id}
                onClick={() => handleSelectAddress(addr)}
                className={`border-2 p-5 cursor-pointer transition-all ${
                  selectedAddressId === addr.id
                    ? 'border-black bg-black text-white'
                    : 'border-black hover:bg-gray-50'
                }`}
              >
                {/* Selection Indicator */}
                <div className="flex items-start justify-between mb-3">
                  <div className={`w-5 h-5 border-2 rounded-full flex items-center justify-center ${
                    selectedAddressId === addr.id ? 'border-white' : 'border-black'
                  }`}>
                    {selectedAddressId === addr.id && (
                      <Check className="w-3 h-3" />
                    )}
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditAddress(addr);
                      }}
                      className={`p-1.5 rounded transition-colors ${
                        selectedAddressId === addr.id 
                          ? 'hover:bg-white/20' 
                          : 'hover:bg-gray-100'
                      }`}
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        // dispatch(deleteAddress(addr.id));
                      }}
                      className={`p-1.5 rounded transition-colors ${
                        selectedAddressId === addr.id 
                          ? 'hover:bg-white/20' 
                          : 'hover:bg-gray-100'
                      }`}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Address Details */}
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <div className="text-sm leading-relaxed">
                      <div className="font-medium">{addr.address_type}</div>
                      <div className="opacity-80">{addr.city}</div>
                      <div className="opacity-80">{addr.street_address}, {addr.postal_code}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loadingAddresses && addresses && addresses.length === 0 && (
          <div className="border-2 border-black p-12 text-center mb-8">
            <MapPin className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <h3 className="text-sm uppercase tracking-[0.2em] font-medium mb-2">
              No Addresses Saved
            </h3>
            <p className="text-xs text-gray-600 mb-6">
              Add your first shipping address to continue
            </p>
            <Button
              onClick={handleAddAddress}
              className="h-10 bg-black text-white hover:bg-gray-900 text-[10px] uppercase tracking-[0.2em]"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Address
            </Button>
          </div>
        )}

        {/* Delivery Info */}
        <div className="border-2 border-black p-5 mb-8">
          <div className="flex items-start gap-3">
            <div className="w-1 h-full bg-black" />
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
            onClick={() => navigate('/cart')}
            variant="outline"
            className="flex-1 h-12 border-2 border-black bg-white hover:bg-gray-50 text-[10px] uppercase tracking-[0.2em]"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Cart
          </Button>
          <Button
            onClick={handleContinue}
            disabled={!selectedAddressId}
            className="flex-1 h-12 bg-black text-white hover:bg-gray-900 disabled:opacity-40 disabled:cursor-not-allowed text-[10px] uppercase tracking-[0.2em]"
          >
            Continue to Payment
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>

      {/* Address Modal */}
      <AddressModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        onSave={handleSaveAddress}
        editAddress={editingAddress}
        mode="shipping"
      />
    </div>
  );
}

export default Shipping;