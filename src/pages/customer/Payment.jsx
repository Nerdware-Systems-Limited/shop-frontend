import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import CheckoutSteps from '../../components/checkout/CheckoutSteps'
import { savePaymentMethod } from '../../actions/cartActions'
import { useNavigate } from 'react-router-dom'

import { Button } from "@/components/ui/button"
import { CreditCard, Wallet, Banknote, Check, ArrowRight, ArrowLeft } from 'lucide-react'

function Payment({ setCompleted, completed }) {
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const [paymentMethod, setPaymentMethod] = useState('MPesa')
    const [mpesaNumber, setMpesaNumber] = useState("");

    const paymentOptions = [
        {
            id: 'MPesa',
            label: 'M-Pesa',
            description: 'Pay securely with M-Pesa mobile money',
            icon: Wallet,
            recommended: true
        },
        {
            id: 'OnDelivery',
            label: 'Cash on Delivery',
            description: 'Pay when you receive your order',
            icon: Banknote,
            recommended: false
        }
    ]

    const cart = useSelector((state) => state.cart);
    
    useEffect(() => {
      if (cart.paymentMethod?.method) {
        setPaymentMethod(cart.paymentMethod.method);
      }
      if (cart.paymentMethod?.mpesaNumber) {
        setMpesaNumber(cart.paymentMethod.mpesaNumber);
      }
    }, [cart.paymentMethod]);


    const submitHandler = (e) => {
        e.preventDefault()
        if (paymentMethod === "MPesa" && !mpesaNumber) {
            alert("Please enter your M-Pesa phone number.");
            return;
        }

        setCompleted((prevCompleted) => ({ 
          ...prevCompleted, 
          0: true, // Keep shipping completed
          1: true  // Mark payment completed
        }));

        dispatch(savePaymentMethod({
            method: paymentMethod,
            mpesaNumber: mpesaNumber,
        }));
        navigate('/placeorder')
    }

    return (
        <div className="min-h-screen bg-white">
            {/* Minimal Header */}
            <div className="border-b border-black">
                <div className="px-4 py-6">
                    <h1 className="text-2xl font-light tracking-[0.2em] uppercase text-center">
                        Payment
                    </h1>
                </div>
            </div>

            {/* Checkout Steps */}
            <div className="border-b border-black/10">
                <CheckoutSteps step_active={1} completed={completed} />
            </div>

            {/* Main Content */}
            <div className="px-4 py-8">
                <form onSubmit={submitHandler} className="max-w-2xl mx-auto space-y-6">
                    
                    {/* Instructions */}
                    <div className="space-y-2">
                        <p className="text-xs uppercase tracking-widest font-medium">
                            Select Payment Method
                        </p>
                        <p className="text-xs text-gray-600">
                            Choose how you'd like to pay for your order
                        </p>
                    </div>

                    {/* Payment Options */}
                    <div className="space-y-3">
                        {paymentOptions.map((option) => {
                            const Icon = option.icon
                            const isSelected = paymentMethod === option.id
                            
                            return (
                                <button
                                    key={option.id}
                                    type="button"
                                    onClick={() => setPaymentMethod(option.id)}
                                    className={`w-full text-left border transition-all ${
                                        isSelected 
                                            ? 'border-black bg-black text-white' 
                                            : 'border-black bg-white hover:bg-gray-50'
                                    }`}
                                >
                                    <div className="p-4 flex items-start gap-4">
                                        {/* Icon */}
                                        <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                                            isSelected ? 'bg-white/20' : 'bg-black/5'
                                        }`}>
                                            <Icon className={`w-5 h-5 ${isSelected ? 'text-white' : 'text-black'}`} />
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <p className={`text-sm font-medium uppercase tracking-wide ${
                                                    isSelected ? 'text-white' : 'text-black'
                                                }`}>
                                                    {option.label}
                                                </p>
                                                {option.recommended && (
                                                    <span className={`text-[10px] px-2 py-0.5 rounded uppercase tracking-wider ${
                                                        isSelected 
                                                            ? 'bg-white/20 text-white' 
                                                            : 'bg-black text-white'
                                                    }`}>
                                                        Recommended
                                                    </span>
                                                )}
                                            </div>
                                            <p className={`text-xs ${
                                                isSelected ? 'text-white/80' : 'text-gray-600'
                                            }`}>
                                                {option.description}
                                            </p>
                                        </div>

                                        {/* Checkmark */}
                                        <div className="flex-shrink-0">
                                            {isSelected && (
                                                <Check className="w-5 h-5 text-white" />
                                            )}
                                        </div>
                                    </div>
                                </button>
                            )
                        })}
                    </div>

                    {/* Info Box */}
                    {paymentMethod === "MPesa" && (
                        <div className="border border-black p-4">
                            <label className="text-xs uppercase tracking-widest font-medium mb-2 block">
                                M-Pesa Phone Number
                            </label>
                            <input
                                type="text"
                                value={mpesaNumber}
                                onChange={(e) => setMpesaNumber(e.target.value)}
                                placeholder="07XXXXXXXX"
                                className="w-full border border-black px-3 py-2 text-sm focus:outline-none focus:ring-0 bg-white"
                            />
                            <p className="text-xs text-gray-600 mt-2">
                                Enter the M-Pesa number you want to pay with.
                            </p>
                        </div>
                    )}

                    <div className="border border-black p-4 mt-8">
                        <div className="flex gap-3">
                            <CreditCard className="w-5 h-5 flex-shrink-0 mt-0.5" />
                            <div className="space-y-1">
                                <p className="text-xs uppercase tracking-widest font-medium">
                                    Secure Payment
                                </p>
                                <p className="text-xs text-gray-600 leading-relaxed">
                                    All transactions are encrypted and secure. Your payment information is never stored.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-3 pt-6">
                        <Button
                            type="submit"
                            className="w-full h-12 bg-black text-white hover:bg-gray-900 text-xs uppercase tracking-widest"
                        >
                            Continue
                            <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => navigate('/shipping')}
                            className="w-full h-12 border-black bg-white hover:bg-gray-50 text-xs uppercase tracking-widest"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Shipping
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Payment