import apiClient from '../api/apiClient';
import {
  ORDER_CREATE_REQUEST,
  ORDER_CREATE_SUCCESS,
  ORDER_CREATE_FAIL,
  ORDER_CREATE_RESET,
  ORDER_LIST_REQUEST,
  ORDER_LIST_SUCCESS,
  ORDER_LIST_FAIL,
  ORDER_LIST_RESET,
  ORDER_DETAILS_REQUEST,
  ORDER_DETAILS_SUCCESS,
  ORDER_DETAILS_FAIL,
  ORDER_DETAILS_RESET,
  MY_ORDERS_REQUEST,
  MY_ORDERS_SUCCESS,
  MY_ORDERS_FAIL,
  ORDER_UPDATE_STATUS_REQUEST,
  ORDER_UPDATE_STATUS_SUCCESS,
  ORDER_UPDATE_STATUS_FAIL,
  ORDER_CANCEL_REQUEST,
  ORDER_CANCEL_SUCCESS,
  ORDER_CANCEL_FAIL,
  ORDER_ADD_TRACKING_REQUEST,
  ORDER_ADD_TRACKING_SUCCESS,
  ORDER_ADD_TRACKING_FAIL,
  ORDER_TRACKING_INFO_REQUEST,
  ORDER_TRACKING_INFO_SUCCESS,
  ORDER_TRACKING_INFO_FAIL,
  ORDER_RETURN_CREATE_REQUEST,
  ORDER_RETURN_CREATE_SUCCESS,
  ORDER_RETURN_CREATE_FAIL,
  ORDER_RETURN_LIST_REQUEST,
  ORDER_RETURN_LIST_SUCCESS,
  ORDER_RETURN_LIST_FAIL,
  SHIPPING_METHODS_REQUEST,
  SHIPPING_METHODS_SUCCESS,
  SHIPPING_METHODS_FAIL,
  SHIPPING_QUOTE_REQUEST,
  SHIPPING_QUOTE_SUCCESS,
  SHIPPING_QUOTE_FAIL,
  ORDER_ANALYTICS_REQUEST,
  ORDER_ANALYTICS_SUCCESS,
  ORDER_ANALYTICS_FAIL,
  PUBLIC_ORDER_STATUS_REQUEST,
  PUBLIC_ORDER_STATUS_SUCCESS,
  PUBLIC_ORDER_STATUS_FAIL,
  ORDER_EXPORT_REQUEST,
  ORDER_EXPORT_SUCCESS,
  ORDER_EXPORT_FAIL,
  ORDER_ITEM_DOWNLOAD_REQUEST,
  ORDER_ITEM_DOWNLOAD_SUCCESS,
  ORDER_ITEM_DOWNLOAD_FAIL,
  ORDER_NOTE_CREATE_REQUEST,
  ORDER_NOTE_CREATE_SUCCESS,
  ORDER_NOTE_CREATE_FAIL,
  ORDER_NOTE_LIST_REQUEST,
  ORDER_NOTE_LIST_SUCCESS,
  ORDER_NOTE_LIST_FAIL,
  SET_ORDER_FILTERS,
  CLEAR_ORDER_FILTERS,
  SET_ORDER_SORT,
} from '../constants/orderConstants';

// Create new order
export const createOrder = (orderData) => async (dispatch, getState) => {
  try {
    dispatch({ type: ORDER_CREATE_REQUEST });

    const { data } = await apiClient.post('/orders/orders/', orderData);

    dispatch({
      type: ORDER_CREATE_SUCCESS,
      payload: data,
    });

    // Clear cart after successful order
    localStorage.removeItem('cartItems');
    localStorage.removeItem('shippingAddress');
    localStorage.removeItem('paymentMethod');

    return { success: true, order: data };
  } catch (error) {
    dispatch({
      type: ORDER_CREATE_FAIL,
      payload:
        error.response?.data?.message || error.message || 'Failed to create order',
    });
    return { success: false, error: error.response?.data || error.message };
  }
};

// Reset order creation state
export const resetOrderCreate = () => (dispatch) => {
  dispatch({ type: ORDER_CREATE_RESET });
};

// List all orders (admin)
export const listOrders = (params = {}) => async (dispatch, getState) => {
  try {
    dispatch({ type: ORDER_LIST_REQUEST });

    const queryParams = new URLSearchParams();
    
    if (params.order_number) queryParams.append('order_number', params.order_number);
    if (params.customer_email) queryParams.append('customer_email', params.customer_email);
    if (params.status) queryParams.append('status', params.status);
    if (params.payment_status) queryParams.append('payment_status', params.payment_status);
    if (params.payment_method) queryParams.append('payment_method', params.payment_method);
    if (params.date_after) queryParams.append('created_at_after', params.date_after);
    if (params.date_before) queryParams.append('created_at_before', params.date_before);
    if (params.total_min) queryParams.append('total_min', params.total_min);
    if (params.total_max) queryParams.append('total_max', params.total_max);
    if (params.is_guest !== undefined) queryParams.append('is_guest', params.is_guest);
    if (params.has_tracking !== undefined) queryParams.append('has_tracking', params.has_tracking);
    if (params.page) queryParams.append('page', params.page);
    if (params.page_size) queryParams.append('page_size', params.page_size);
    if (params.ordering) queryParams.append('ordering', params.ordering);

    const { data } = await apiClient.get(`/orders/orders/?${queryParams.toString()}`);

    dispatch({
      type: ORDER_LIST_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: ORDER_LIST_FAIL,
      payload:
        error.response?.data?.message || error.message || 'Failed to fetch orders',
    });
  }
};

// Reset order list
export const resetOrderList = () => (dispatch) => {
  dispatch({ type: ORDER_LIST_RESET });
};

// Get order details
export const getOrderDetails = (orderNumber) => async (dispatch, getState) => {
  try {
    dispatch({ type: ORDER_DETAILS_REQUEST });

    const { data } = await apiClient.get(`/orders/${orderNumber}/`);

    dispatch({
      type: ORDER_DETAILS_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: ORDER_DETAILS_FAIL,
      payload:
        error.response?.data?.message || error.message || 'Failed to fetch order details',
    });
  }
};

// Reset order details
export const resetOrderDetails = () => (dispatch) => {
  dispatch({ type: ORDER_DETAILS_RESET });
};

// Get user's orders
export const getMyOrders = (params = {}) => async (dispatch, getState) => {
  try {
    dispatch({ type: MY_ORDERS_REQUEST });

    const queryParams = new URLSearchParams();
    if (params.status) queryParams.append('status', params.status);
    if (params.page) queryParams.append('page', params.page);
    if (params.ordering) queryParams.append('ordering', params.ordering);

    const { data } = await apiClient.get(`/orders/my_orders/?${queryParams.toString()}`);

    dispatch({
      type: MY_ORDERS_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: MY_ORDERS_FAIL,
      payload:
        error.response?.data?.message || error.message || 'Failed to fetch your orders',
    });
  }
};

// Update order status (admin)
export const updateOrderStatus = (orderNumber, statusData) => async (dispatch) => {
  try {
    dispatch({ type: ORDER_UPDATE_STATUS_REQUEST });

    const { data } = await apiClient.post(
      `/orders/orders/${orderNumber}/update_status/`,
      statusData
    );

    dispatch({
      type: ORDER_UPDATE_STATUS_SUCCESS,
      payload: data,
    });

    // Refresh order details
    dispatch(getOrderDetails(orderNumber));
  } catch (error) {
    dispatch({
      type: ORDER_UPDATE_STATUS_FAIL,
      payload:
        error.response?.data?.message || error.message || 'Failed to update order status',
    });
  }
};

// Cancel order
export const cancelOrder = (orderNumber, cancelData) => async (dispatch) => {
  try {
    dispatch({ type: ORDER_CANCEL_REQUEST });

    const { data } = await apiClient.post(
      `/orders/${orderNumber}/cancel/`,
      cancelData
    );

    dispatch({
      type: ORDER_CANCEL_SUCCESS,
      payload: data,
    });

    // Refresh order details
    dispatch(getOrderDetails(orderNumber));
  } catch (error) {
    dispatch({
      type: ORDER_CANCEL_FAIL,
      payload:
        error.response?.data?.message || error.message || 'Failed to cancel order',
    });
  }
};

// Add tracking information (admin)
export const addTrackingToOrder = (orderNumber, trackingData) => async (dispatch) => {
  try {
    dispatch({ type: ORDER_ADD_TRACKING_REQUEST });

    const { data } = await apiClient.post(
      `/orders/${orderNumber}/add_tracking/`,
      trackingData
    );

    dispatch({
      type: ORDER_ADD_TRACKING_SUCCESS,
      payload: data,
    });

    // Refresh order details
    dispatch(getOrderDetails(orderNumber));
  } catch (error) {
    dispatch({
      type: ORDER_ADD_TRACKING_FAIL,
      payload:
        error.response?.data?.message || error.message || 'Failed to add tracking',
    });
  }
};

// Get tracking information
export const getTrackingInfo = (orderNumber) => async (dispatch) => {
  try {
    dispatch({ type: ORDER_TRACKING_INFO_REQUEST });

    const { data } = await apiClient.get(`/orders/${orderNumber}/tracking_info/`);

    dispatch({
      type: ORDER_TRACKING_INFO_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: ORDER_TRACKING_INFO_FAIL,
      payload:
        error.response?.data?.message || error.message || 'Failed to fetch tracking info',
    });
  }
};

// Create return request
export const createOrderReturn = (returnData) => async (dispatch) => {
  try {
    dispatch({ type: ORDER_RETURN_CREATE_REQUEST });

    const { data } = await apiClient.post('/returns/', returnData);

    dispatch({
      type: ORDER_RETURN_CREATE_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: ORDER_RETURN_CREATE_FAIL,
      payload:
        error.response?.data?.message || error.message || 'Failed to create return request',
    });
  }
};

// List returns
export const listOrderReturns = (params = {}) => async (dispatch) => {
  try {
    dispatch({ type: ORDER_RETURN_LIST_REQUEST });

    const queryParams = new URLSearchParams();
    if (params.status) queryParams.append('status', params.status);
    if (params.order_number) queryParams.append('order_number', params.order_number);
    if (params.page) queryParams.append('page', params.page);

    const { data } = await apiClient.get(`/returns/?${queryParams.toString()}`);

    dispatch({
      type: ORDER_RETURN_LIST_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: ORDER_RETURN_LIST_FAIL,
      payload:
        error.response?.data?.message || error.message || 'Failed to fetch returns',
    });
  }
};

// Get shipping methods
export const getShippingMethods = () => async (dispatch) => {
  try {
    dispatch({ type: SHIPPING_METHODS_REQUEST });

    const { data } = await apiClient.get('/orders/shipping-methods/');

    dispatch({
      type: SHIPPING_METHODS_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: SHIPPING_METHODS_FAIL,
      payload:
        error.response?.data?.message || error.message || 'Failed to fetch shipping methods',
    });
  }
};

// Calculate shipping quote
export const calculateShippingQuote = (quoteData) => async (dispatch) => {
  try {
    dispatch({ type: SHIPPING_QUOTE_REQUEST });

    const { data } = await apiClient.post(
      '/shipping-methods/calculate/',
      quoteData
    );

    dispatch({
      type: SHIPPING_QUOTE_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: SHIPPING_QUOTE_FAIL,
      payload:
        error.response?.data?.message || error.message || 'Failed to calculate shipping',
    });
  }
};

// Get order analytics (admin)
export const getOrderAnalytics = (period = 'month') => async (dispatch) => {
  try {
    dispatch({ type: ORDER_ANALYTICS_REQUEST });

    const { data } = await apiClient.get(`/analytics/?period=${period}`);

    dispatch({
      type: ORDER_ANALYTICS_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: ORDER_ANALYTICS_FAIL,
      payload:
        error.response?.data?.message || error.message || 'Failed to fetch analytics',
    });
  }
};

// Get public order status (no auth required)
export const getPublicOrderStatus = (orderNumber, email) => async (dispatch) => {
  try {
    dispatch({ type: PUBLIC_ORDER_STATUS_REQUEST });

    const { data } = await apiClient.get(
      `/public/status/?order_number=${orderNumber}&email=${email}`
    );

    dispatch({
      type: PUBLIC_ORDER_STATUS_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: PUBLIC_ORDER_STATUS_FAIL,
      payload:
        error.response?.data?.message || error.message || 'Failed to fetch order status',
    });
  }
};

// Export orders to CSV (admin)
export const exportOrders = (params = {}) => async (dispatch) => {
  try {
    dispatch({ type: ORDER_EXPORT_REQUEST });

    const queryParams = new URLSearchParams();
    if (params.status) queryParams.append('status', params.status);
    if (params.date_after) queryParams.append('created_at_after', params.date_after);
    if (params.date_before) queryParams.append('created_at_before', params.date_before);

    const response = await apiClient.get(`/orders/export/?${queryParams.toString()}`, {
      responseType: 'blob',
    });

    // Create download link
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `orders_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();

    dispatch({
      type: ORDER_EXPORT_SUCCESS,
    });
  } catch (error) {
    dispatch({
      type: ORDER_EXPORT_FAIL,
      payload:
        error.response?.data?.message || error.message || 'Failed to export orders',
    });
  }
};

// Download digital product
export const downloadOrderItem = (itemId) => async (dispatch) => {
  try {
    dispatch({ type: ORDER_ITEM_DOWNLOAD_REQUEST });

    const { data } = await apiClient.post(`/order-items/${itemId}/download/`);

    dispatch({
      type: ORDER_ITEM_DOWNLOAD_SUCCESS,
      payload: data,
    });

    // Open download URL
    if (data.download_url) {
      window.open(data.download_url, '_blank');
    }
  } catch (error) {
    dispatch({
      type: ORDER_ITEM_DOWNLOAD_FAIL,
      payload:
        error.response?.data?.message || error.message || 'Failed to download item',
    });
  }
};

// Create order note
export const createOrderNote = (orderNumber, noteData) => async (dispatch) => {
  try {
    dispatch({ type: ORDER_NOTE_CREATE_REQUEST });

    const { data } = await apiClient.post(
      `/orders/${orderNumber}/notes/`,
      noteData
    );

    dispatch({
      type: ORDER_NOTE_CREATE_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: ORDER_NOTE_CREATE_FAIL,
      payload:
        error.response?.data?.message || error.message || 'Failed to create note',
    });
  }
};

// Get order notes
export const getOrderNotes = (orderNumber) => async (dispatch) => {
  try {
    dispatch({ type: ORDER_NOTE_LIST_REQUEST });

    const { data } = await apiClient.get(`/orders/${orderNumber}/notes/`);

    dispatch({
      type: ORDER_NOTE_LIST_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: ORDER_NOTE_LIST_FAIL,
      payload:
        error.response?.data?.message || error.message || 'Failed to fetch notes',
    });
  }
};

// Filter actions
export const setOrderFilters = (filters) => (dispatch) => {
  dispatch({
    type: SET_ORDER_FILTERS,
    payload: filters,
  });
};

export const clearOrderFilters = () => (dispatch) => {
  dispatch({ type: CLEAR_ORDER_FILTERS });
};

export const setOrderSort = (sortOption) => (dispatch) => {
  dispatch({
    type: SET_ORDER_SORT,
    payload: sortOption,
  });
};