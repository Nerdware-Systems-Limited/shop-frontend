import apiClient from '../api/apiClient';
import {
  CART_ADD_ITEM,
  CART_REMOVE_ITEM,
  CART_UPDATE_ITEM,
  CART_CLEAR_ITEMS,
  CART_SAVE_SHIPPING_ADDRESS,
  CART_SAVE_PAYMENT_METHOD,
  CART_CALCULATE_TOTALS,
} from '../constants/cartConstants';


// Add item to cart
export const addToCart = (product, qty = 1) => async (dispatch, getState) => {
  console.log('Adding to cart:', product, 'Quantity:', qty);
  try {
    // const { product } = await apiClient.get(`/products/${productId}/`);

    dispatch({
      type: CART_ADD_ITEM,
      payload: {
        product: product.id,
        name: product.name,
        slug: product.slug,
        image: product.primary_image || (product.images?.[0]?.image),
        price: product.final_price,
        originalPrice: product.price,
        discount: product.discount_percentage,
        stock: product.stock_quantity,
        brand: product.brand?.name,
        category: product.category?.name,
        qty: qty,
      },
    });

    // Save cart to localStorage
    localStorage.setItem('cartItems', JSON.stringify(getState().cart.cartItems));
    
    // Calculate totals after adding
    dispatch(calculateTotals());
  } catch (error) {
    console.error('Error adding to cart:', error);
  }
};

// Update cart item quantity
export const updateCartQty = (productId, qty) => (dispatch, getState) => {
  dispatch({
    type: CART_UPDATE_ITEM,
    payload: { productId, qty },
  });

  localStorage.setItem('cartItems', JSON.stringify(getState().cart.cartItems));
  dispatch(calculateTotals());
};

// Remove item from cart
export const removeFromCart = (productId) => (dispatch, getState) => {
  dispatch({
    type: CART_REMOVE_ITEM,
    payload: productId,
  });

  localStorage.setItem('cartItems', JSON.stringify(getState().cart.cartItems));
  dispatch(calculateTotals());
};

// Clear all cart items
export const clearCart = () => (dispatch) => {
  dispatch({ type: CART_CLEAR_ITEMS });
  localStorage.removeItem('cartItems');
};

// Save shipping address
export const saveShippingAddress = (address) => (dispatch) => {
  dispatch({
    type: CART_SAVE_SHIPPING_ADDRESS,
    payload: address,
  });

  localStorage.setItem('shippingAddress', JSON.stringify(address));
};

// Save payment method
export const savePaymentMethod = (method) => (dispatch) => {
  dispatch({
    type: CART_SAVE_PAYMENT_METHOD,
    payload: method,
  });

  localStorage.setItem('paymentMethod', JSON.stringify(method));
};

// Calculate cart totals
export const calculateTotals = () => (dispatch, getState) => {
  const { cartItems } = getState().cart;

  const itemsPrice = cartItems.reduce(
    (acc, item) => acc + item.price * item.qty,
    0
  );

  const shippingPrice = itemsPrice > 5000 ? 0 : 200; // Free shipping over 5000
  const taxPrice = itemsPrice * 0.16; // 16% VAT
  const totalPrice = itemsPrice + shippingPrice + taxPrice;

  const totalDiscount = cartItems.reduce(
    (acc, item) => acc + (item.originalPrice - item.price) * item.qty,
    0
  );

  dispatch({
    type: CART_CALCULATE_TOTALS,
    payload: {
      itemsPrice: Number(itemsPrice.toFixed(2)),
      shippingPrice: Number(shippingPrice.toFixed(2)),
      taxPrice: Number(taxPrice.toFixed(2)),
      totalPrice: Number(totalPrice.toFixed(2)),
      totalDiscount: Number(totalDiscount.toFixed(2)),
    },
  });
};