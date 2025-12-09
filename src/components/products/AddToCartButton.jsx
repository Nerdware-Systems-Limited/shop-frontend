import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ShoppingCart, Check, AlertCircle } from 'lucide-react';
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
  
  const { cartItems } = useSelector((state) => state.cart);
  const cartItem = cartItems.find(item => item.product === product.id);

  const handleAddToCart = async (e) => {
    // Prevent link navigation if button is inside a Link
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
      }, 2000);
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setIsAdding(false);
    }
  };

  const handleQuantityChange = (newQty) => {
    const validQty = Math.max(1, Math.min(newQty, product.stock_quantity));
    setQty(validQty);
  };

  // Get button styles based on variant
  const getButtonStyles = () => {
    const baseStyles = "flex items-center justify-center gap-2 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed";
    
    switch (variant) {
      case 'card-hover':
        // Desktop hover button
        return `${baseStyles} w-full py-2.5 px-4 font-medium text-sm uppercase tracking-wider shadow-lg ${
          !product.is_in_stock 
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
            : showSuccess
            ? 'bg-green-600 text-white'
            : 'bg-white text-black hover:bg-black hover:text-white'
        }`;
      
      case 'card-mobile':
        // Mobile button below card
        return `${baseStyles} w-full py-2 px-4 text-xs font-medium uppercase tracking-wider border ${
          !product.is_in_stock 
            ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed' 
            : showSuccess
            ? 'bg-green-600 text-white border-green-600'
            : 'bg-white text-black border-black hover:bg-black hover:text-white'
        }`;
      
      default:
        // Default button style
        return `${baseStyles} bg-black text-white py-3 px-6 hover:bg-gray-800 ${className}`;
    }
  };

  if (!product.is_in_stock) {
    const iconSize = variant === 'card-mobile' ? 'w-3.5 h-3.5' : 'w-5 h-5';
    const textSize = variant === 'card-mobile' ? 'text-xs' : 'text-sm';
    
    return (
      <button
        disabled
        className={getButtonStyles()}
      >
        <AlertCircle className={iconSize} />
        <span className={`${textSize} tracking-widest uppercase font-medium`}>
          Out of Stock
        </span>
      </button>
    );
  }

  if (showSuccess) {
    const iconSize = variant === 'card-mobile' ? 'w-3.5 h-3.5' : 'w-4 h-4';
    const textSize = variant === 'card-mobile' ? 'text-xs' : 'text-sm';
    
    return (
      <button
        disabled
        className={getButtonStyles()}
      >
        <Check className={iconSize} />
        <span className={`${textSize} tracking-widest uppercase font-medium`}>
          Added
        </span>
      </button>
    );
  }

  return (
    <div className={variant === 'default' && showQuantitySelector ? 'flex flex-col gap-3' : ''}>
      {showQuantitySelector && variant === 'default' && (
        <div className="flex items-center gap-4">
          <label className="text-sm font-medium text-gray-700">Quantity:</label>
          <div className="flex items-center border border-gray-300 rounded-lg">
            <button
              onClick={() => handleQuantityChange(qty - 1)}
              className="px-4 py-2 hover:bg-gray-50 transition-colors"
              disabled={qty <= 1}
            >
              -
            </button>
            <input
              type="number"
              value={qty}
              onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
              className="w-16 text-center border-x border-gray-300 py-2 focus:outline-none"
              min="1"
              max={product.stock_quantity}
            />
            <button
              onClick={() => handleQuantityChange(qty + 1)}
              className="px-4 py-2 hover:bg-gray-50 transition-colors"
              disabled={qty >= product.stock_quantity}
            >
              +
            </button>
          </div>
          {product.is_low_stock && (
            <span className="text-xs text-amber-600">
              Only {product.stock_quantity} left!
            </span>
          )}
        </div>
      )}

      <button
        onClick={handleAddToCart}
        disabled={isAdding}
        className={getButtonStyles()}
      >
        <ShoppingCart className={variant === 'card-mobile' ? 'w-3.5 h-3.5' : 'w-4 h-4'} />
        <span className={`${variant === 'card-mobile' ? 'text-xs' : 'text-sm'} tracking-widest uppercase font-medium`}>
          {isAdding ? 'Adding...' : cartItem ? 'Add More' : 'Add to Cart'}
        </span>
      </button>

      {cartItem && variant === 'default' && (
        <p className="text-xs text-center text-gray-600">
          {cartItem.qty} {cartItem.qty === 1 ? 'item' : 'items'} already in cart
        </p>
      )}
    </div>
  );
};

export default AddToCartButton;