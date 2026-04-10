import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  ShoppingBag, Trash2, Plus, Minus, ArrowRight,
  AlertCircle, Clock, X, Check,
} from 'lucide-react';
import {
  addToCart, removeFromCart, updateCartQty, calculateTotals,
} from '../../actions/cartActions';

const Cart = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();

  const [removingItems, setRemovingItems] = useState(new Set());
  const [showRemoveToast, setShowRemoveToast] = useState(false);
  const [lastRemovedItem, setLastRemovedItem] = useState(null);

  const qty = Number(searchParams.get('qty')) || 1;
  const productId = Number(id);

  const { cartItems, itemsPrice } = useSelector((state) => state.cart);

  useEffect(() => {
    if (productId) dispatch(addToCart(productId, qty));
  }, [dispatch, productId, qty]);

  useEffect(() => {
    dispatch(calculateTotals());
  }, [dispatch, cartItems]);

  const handleIncrement = (item) => {
    if (item.qty < item.stock) dispatch(updateCartQty(item.product, item.qty + 1));
  };

  const handleDecrement = (item) => {
    if (item.qty > 1) dispatch(updateCartQty(item.product, item.qty - 1));
  };

  const handleRemove = (item) => {
    setRemovingItems((prev) => new Set(prev).add(item.product));
    setLastRemovedItem(item);
    setTimeout(() => {
      dispatch(removeFromCart(item.product));
      setRemovingItems((prev) => {
        const next = new Set(prev);
        next.delete(item.product);
        return next;
      });
      setShowRemoveToast(true);
      setTimeout(() => setShowRemoveToast(false), 3000);
    }, 280);
  };

  const totalItems = cartItems.reduce((acc, item) => acc + item.qty, 0);

  /* ── EMPTY ── */
  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-white pt-24 pb-16 px-4">
        <div className="max-w-sm mx-auto mt-16 text-center">
          <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-7 text-gray-400">
            <ShoppingBag size={36} strokeWidth={1.4} />
          </div>
          <h2 className="text-2xl font-extrabold tracking-tight text-black mb-2">Your cart is empty</h2>
          <p className="text-sm text-gray-400 mb-8">Add some products and they'll appear here.</p>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 bg-black text-white text-xs font-bold uppercase tracking-widest px-7 py-4 rounded-xl"
          >
            Browse Products <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    );
  }

  /* ── MAIN ── */
  return (
    <div className="min-h-screen bg-white pt-20 pb-20 px-4">

      {/* Toast */}
      {showRemoveToast && lastRemovedItem && (
        <div className="fixed top-20 right-4 z-50 bg-white border border-gray-200 rounded-xl shadow-lg px-4 py-3 flex items-center gap-3 min-w-[220px]">
          <Check size={15} className="text-green-600 shrink-0" />
          <span className="text-xs font-medium text-black flex-1 truncate">{lastRemovedItem.name} removed</span>
          <button onClick={() => setShowRemoveToast(false)} className="text-gray-300 hover:text-gray-500">
            <X size={13} />
          </button>
        </div>
      )}

      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="flex items-end justify-between mb-8 gap-3 flex-wrap">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-400 mb-1">Review your order</p>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-black leading-none">
              Cart
            </h1>
          </div>
          <Link to="/products" className="text-xs font-medium text-gray-400 border-b border-gray-300 pb-px hover:text-black transition-colors">
            Continue shopping
          </Link>
        </div>

        {/* Grid — stacked on mobile, side-by-side on lg */}
        <div className="flex flex-col lg:grid lg:grid-cols-[1fr_340px] gap-6 lg:gap-10 items-start">

          {/* ── Items ── */}
          <div>
            <div className="flex items-center border-b-2 border-black pb-3 mb-1">
              <span className="text-[11px] font-bold uppercase tracking-widest text-gray-400">
                {totalItems} {totalItems === 1 ? 'item' : 'items'}
              </span>
            </div>

            {cartItems.map((item) => (
              <div
                key={item.product}
                className="flex gap-4 py-5 border-b border-gray-100 transition-all duration-300"
                style={{
                  opacity: removingItems.has(item.product) ? 0 : 1,
                  transform: removingItems.has(item.product) ? 'translateX(10px)' : 'none',
                }}
              >
                {/* Image */}
                <Link
                  to={`/product/${item.slug}`}
                  className="relative shrink-0 w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden border border-gray-100 block"
                >
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  {item.discount > 0 && (
                    <span className="absolute top-1.5 right-1.5 bg-black text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                      -{item.discount}%
                    </span>
                  )}
                </Link>

                {/* Details */}
                <div className="flex-1 min-w-0 flex flex-col gap-2">

                  {/* Name + remove */}
                  <div className="flex items-start gap-2">
                    <div className="flex-1 min-w-0">
                      <Link
                        to={`/product/${item.slug}`}
                        className="text-sm sm:text-base font-bold text-black leading-snug block truncate hover:opacity-60 transition-opacity"
                      >
                        {item.name}
                      </Link>
                      <p className="text-xs text-gray-400 mt-0.5">{item.brand} · {item.category}</p>
                    </div>
                    <button
                      onClick={() => handleRemove(item)}
                      className="text-gray-300 hover:text-red-400 transition-colors p-1 shrink-0"
                      aria-label="Remove"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>

                  {/* Price */}
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-extrabold tracking-tight text-black">
                      Ksh {item.price?.toLocaleString() || item.originalPrice?.toLocaleString()}
                    </span>
                    {item.discount > 0 && (
                      <span className="text-xs text-gray-300 line-through">
                        Ksh {item.originalPrice?.toLocaleString()}
                      </span>
                    )}
                  </div>

                  {/* Qty + subtotal */}
                  <div className="flex items-center justify-between flex-wrap gap-3">
                    <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                      <button
                        onClick={() => handleDecrement(item)}
                        disabled={item.qty <= 1}
                        className="px-3 py-2 text-black disabled:opacity-25 hover:bg-gray-50 transition-colors"
                        aria-label="Decrease"
                      >
                        <Minus size={13} />
                      </button>
                      <span className="px-4 text-sm font-bold text-black border-x border-gray-200 py-2 min-w-[40px] text-center">
                        {item.qty}
                      </span>
                      <button
                        onClick={() => handleIncrement(item)}
                        disabled={item.qty >= item.stock}
                        className="px-3 py-2 text-black disabled:opacity-25 hover:bg-gray-50 transition-colors"
                        aria-label="Increase"
                      >
                        <Plus size={13} />
                      </button>
                    </div>
                    <span className="text-sm font-bold text-black">
                      Ksh {(item.price || item.originalPrice * item.qty).toLocaleString()}
                    </span>
                  </div>

                  {/* Warnings */}
                  {item.qty >= item.stock && (
                    <div className="flex items-center gap-1.5 text-[11px] font-medium text-amber-700 bg-amber-50 border border-amber-200 rounded-md px-2.5 py-1.5 w-fit">
                      <AlertCircle size={12} />
                      <span>Maximum stock reached</span>
                    </div>
                  )}
                  {item.stock < 10 && item.qty < item.stock && (
                    <div className="flex items-center gap-1.5 text-[11px] font-medium text-amber-700 bg-amber-50 border border-amber-200 rounded-md px-2.5 py-1.5 w-fit">
                      <Clock size={12} />
                      <span>Only {item.stock - item.qty} left</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* ── Summary ── */}
          <div className="w-full lg:sticky lg:top-24">
            <div className="border-2 border-black rounded-2xl p-5 sm:p-6">
              <h2 className="text-sm font-black uppercase tracking-widest text-black mb-5">Order Summary</h2>

              <div className="h-px bg-gray-100 mb-4" />

              {/* Item lines */}
              <div className="flex flex-col gap-3 mb-4">
                {cartItems.map((item) => (
                  <div key={item.product} className="flex items-baseline justify-between gap-3">
                    <span className="text-xs text-gray-500 font-medium truncate flex-1 min-w-0">
                      {item.name}
                      <span className="text-gray-300"> ×{item.qty}</span>
                    </span>
                    <span className="text-xs font-semibold text-black shrink-0">
                      Ksh {(item.price|| item.originalPrice * item.qty).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>

              <div className="h-px bg-gray-100 mb-4" />

              {/* Total */}
              <div className="flex items-center justify-between mb-5">
                <span className="text-sm font-semibold text-gray-400">Total</span>
                <span className="text-2xl font-black tracking-tight text-black">
                  Ksh {itemsPrice?.toLocaleString()}
                </span>
              </div>

              <div className="h-px bg-gray-100 mb-5" />

              {/* CTA */}
              <Link
                to="/shipping"
                className="flex items-center justify-center gap-2 w-full bg-black text-white text-xs font-bold uppercase tracking-widest py-4 rounded-xl hover:opacity-75 transition-opacity"
              >
                Proceed to Checkout <ArrowRight size={16} />
              </Link>

              <p className="text-center text-[10px] text-gray-300 mt-3 tracking-widest uppercase">
                Secure · SSL Encrypted
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Cart;