import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ShoppingCart, Check, AlertCircle, Minus, Plus } from 'lucide-react';
import { addToCart } from '../../actions/cartActions';

const AddToCartButton = ({ 
  product, 
  quantity = 1, 
  className = '', 
  showQuantitySelector = false,
  variant = 'default' // 'default', 'card-hover', 'card-mobile'
}) => {
  const dispatch = useDispatch();
  const [qty, setQty] = useState(quantity);
  const [isAdding, setIsAdding] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  
  const { cartItems } = useSelector((state) => state.cart);
  const cartItem = cartItems.find(item => item.product === product.id);

  const handleAddToCart = async (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    if (!product.is_in_stock) return;

    setIsAdding(true);
    
    try {
      await dispatch(addToCart(product, qty));
      setShowSuccess(true);
      
      setTimeout(() => {
        setShowSuccess(false);
      }, 2500);
    } catch (error) {
      console.error('Error adding to cart:', error);
      setShowError(true);
      setTimeout(() => {
        setShowError(false);
      }, 2500);
    } finally {
      setIsAdding(false);
    }
  };

  const handleQuantityChange = (newQty) => {
    const validQty = Math.max(1, Math.min(newQty, product.stock_quantity));
    setQty(validQty);
  };

  const getButtonStyles = () => {
    const baseStyles = "relative flex items-center justify-center gap-2 transition-all duration-300 disabled:cursor-not-allowed overflow-hidden group";
    
    switch (variant) {
      case 'card-hover':
        return `${baseStyles} w-full py-3 px-4 font-semibold text-sm uppercase tracking-wider rounded-xl shadow-lg ${
          !product.is_in_stock 
            ? 'bg-gray-100 text-gray-400' 
            : showSuccess
            ? 'bg-emerald-500 text-white shadow-emerald-200'
            : showError
            ? 'bg-red-500 text-white shadow-red-200'
            : 'bg-white text-gray-900 hover:bg-gray-900 hover:text-white shadow-gray-200 hover:shadow-xl'
        }`;
      
      case 'card-mobile':
        return `${baseStyles} w-full py-2.5 px-4 text-xs font-semibold uppercase tracking-wider border-2 rounded-lg ${
          !product.is_in_stock 
            ? 'bg-gray-50 text-gray-400 border-gray-200' 
            : showSuccess
            ? 'bg-emerald-500 text-white border-emerald-500'
            : showError
            ? 'bg-red-500 text-white border-red-500'
            : 'bg-white text-gray-900 border-gray-900 hover:bg-gray-900 hover:text-white'
        }`;
      
      default:
        return `${baseStyles} rounded-xl py-3.5 px-8 font-semibold shadow-lg ${
          showSuccess
            ? 'bg-emerald-500 text-white shadow-emerald-200'
            : showError
            ? 'bg-red-500 text-white shadow-red-200'
            : 'bg-gray-900 text-white hover:bg-black shadow-gray-300 hover:shadow-xl'
        } ${className}`;
    }
  };

  if (!product.is_in_stock) {
    const iconSize = variant === 'card-mobile' ? 'w-4 h-4' : 'w-5 h-5';
    
    return (
      <button
        disabled
        className={getButtonStyles()}
      >
        <AlertCircle className={`${iconSize} opacity-70`} />
        <span className="tracking-wider uppercase font-semibold">
          Out of Stock
        </span>
      </button>
    );
  }

  if (showSuccess) {
    const iconSize = variant === 'card-mobile' ? 'w-4 h-4' : 'w-5 h-5';
    
    return (
      <button
        disabled
        className={getButtonStyles()}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-emerald-600 animate-pulse opacity-20" />
        <Check className={`${iconSize} animate-in zoom-in-50 duration-300`} strokeWidth={2.5} />
        <span className="tracking-wider uppercase font-semibold">
          Added to Cart
        </span>
      </button>
    );
  }

  if (showError) {
    const iconSize = variant === 'card-mobile' ? 'w-4 h-4' : 'w-5 h-5';
    
    return (
      <button
        disabled
        className={getButtonStyles()}
      >
        <AlertCircle className={`${iconSize} animate-in zoom-in-50 duration-300`} strokeWidth={2.5} />
        <span className="tracking-wider uppercase font-semibold">
          Error - Try Again
        </span>
      </button>
    );
  }

  return (
    <div className={variant === 'default' && showQuantitySelector ? 'flex flex-col gap-4' : ''}>
      {showQuantitySelector && variant === 'default' && (
        <div className="flex items-center gap-4">
          <label className="text-sm font-semibold text-gray-700">Quantity:</label>
          <div className="flex items-center bg-white border-2 border-gray-200 rounded-xl shadow-sm hover:border-gray-300 transition-colors">
            <button
              onClick={() => handleQuantityChange(qty - 1)}
              className="p-3 hover:bg-gray-50 transition-colors rounded-l-xl disabled:opacity-40 disabled:cursor-not-allowed group"
              disabled={qty <= 1}
            >
              <Minus className="w-4 h-4 text-gray-600 group-hover:text-gray-900 transition-colors" strokeWidth={2.5} />
            </button>
            <input
              type="number"
              value={qty}
              onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
              className="w-16 text-center border-x-2 border-gray-200 py-3 focus:outline-none focus:bg-gray-50 font-semibold text-gray-900"
              min="1"
              max={product.stock_quantity}
            />
            <button
              onClick={() => handleQuantityChange(qty + 1)}
              className="p-3 hover:bg-gray-50 transition-colors rounded-r-xl disabled:opacity-40 disabled:cursor-not-allowed group"
              disabled={qty >= product.stock_quantity}
            >
              <Plus className="w-4 h-4 text-gray-600 group-hover:text-gray-900 transition-colors" strokeWidth={2.5} />
            </button>
          </div>
          {product.is_low_stock && (
            <div className="flex items-center gap-1.5 bg-amber-50 text-amber-700 px-3 py-1.5 rounded-full border border-amber-200">
              <AlertCircle className="w-3.5 h-3.5" strokeWidth={2.5} />
              <span className="text-xs font-semibold">
                Only {product.stock_quantity} left
              </span>
            </div>
          )}
        </div>
      )}

      <button
        onClick={handleAddToCart}
        disabled={isAdding}
        className={getButtonStyles()}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-10 transform -skew-x-12 group-hover:translate-x-full transition-all duration-700" />
        
        {isAdding ? (
          <>
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            <span className="tracking-wider uppercase font-semibold">
              Adding...
            </span>
          </>
        ) : (
          <>
            <ShoppingCart 
              className={`${variant === 'card-mobile' ? 'w-4 h-4' : 'w-5 h-5'} transition-transform group-hover:scale-110`} 
              strokeWidth={2.5}
            />
            <span className="tracking-wider uppercase font-semibold">
              {cartItem ? 'Add More' : 'Add to Cart'}
            </span>
          </>
        )}
      </button>

      {cartItem && variant === 'default' && (
        <div className="flex items-center justify-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-lg border border-blue-200">
          <Check className="w-3.5 h-3.5" strokeWidth={2.5} />
          <p className="text-xs font-semibold">
            {cartItem.qty} {cartItem.qty === 1 ? 'item' : 'items'} in cart
          </p>
        </div>
      )}
    </div>
  );
};

export default AddToCartButton;