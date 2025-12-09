import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { X, ShoppingBag, ArrowRight, Trash2 } from 'lucide-react';
import { removeFromCart } from '../../actions/cartActions';

const MiniCart = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const { cartItems, itemsPrice } = useSelector((state) => state.cart);

  const handleRemove = (productId) => {
    dispatch(removeFromCart(productId));
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white z-50 shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-3">
            <ShoppingBag className="w-6 h-6" />
            <h2 className="text-xl font-medium tracking-wide uppercase">
              Shopping Cart
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Close cart"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-6">
          {cartItems.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingBag className="w-20 h-20 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500 mb-6">Your cart is empty</p>
              <Link
                to="/products"
                onClick={onClose}
                className="inline-block bg-black text-white px-6 py-3 hover:bg-gray-800 transition-colors"
              >
                <span className="text-xs tracking-widest uppercase">Start Shopping</span>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item.product}
                  className="flex gap-4 pb-4 border-b last:border-0"
                >
                  <Link
                    to={`/product/${item.slug}`}
                    onClick={onClose}
                    className="flex-shrink-0"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded-lg border"
                    />
                  </Link>

                  <div className="flex-1 min-w-0">
                    <Link
                      to={`/product/${item.slug}`}
                      onClick={onClose}
                      className="text-sm font-medium hover:text-gray-600 transition-colors line-clamp-2 mb-1"
                    >
                      {item.name}
                    </Link>
                    
                    <p className="text-xs text-gray-500 mb-2">{item.brand}</p>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-semibold">
                          Ksh {item.price}
                        </p>
                        <p className="text-xs text-gray-500">Qty: {item.qty}</p>
                      </div>

                      <button
                        onClick={() => handleRemove(item.product)}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {cartItems.length > 0 && (
          <div className="border-t p-6 space-y-4">
            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-600">Subtotal</span>
              <span className="text-2xl font-bold">
                Ksh {itemsPrice}
              </span>
            </div>

            <Link
              to="/cart"
              onClick={onClose}
              className="block w-full bg-black text-white py-4 hover:bg-gray-800 transition-colors text-center"
            >
              <span className="text-sm tracking-widest uppercase font-medium">
                View Cart
              </span>
            </Link>

            <Link
              to="/shipping"
              onClick={onClose}
              className="flex items-center justify-center gap-2 w-full bg-white border-2 border-black text-black py-4 hover:bg-gray-50 transition-colors"
            >
              <span className="text-sm tracking-widest uppercase font-medium">
                Checkout
              </span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <p className="text-xs text-center text-gray-500">
              Shipping & taxes calculated at checkout
            </p>
          </div>
        )}
      </div>
    </>
  );
};

export default MiniCart;