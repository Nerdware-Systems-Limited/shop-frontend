import apiClient from '../api/apiClient';
import {
  MPESA_CONFIG_LIST_REQUEST,
  MPESA_CONFIG_LIST_SUCCESS,
  MPESA_CONFIG_LIST_FAIL,
  MPESA_CONFIG_DETAILS_REQUEST,
  MPESA_CONFIG_DETAILS_SUCCESS,
  MPESA_CONFIG_DETAILS_FAIL,
  MPESA_CONFIG_SET_DEFAULT_REQUEST,
  MPESA_CONFIG_SET_DEFAULT_SUCCESS,
  MPESA_CONFIG_SET_DEFAULT_FAIL,
  MPESA_CONFIG_TEST_REQUEST,
  MPESA_CONFIG_TEST_SUCCESS,
  MPESA_CONFIG_TEST_FAIL,
  MPESA_TRANSACTION_LIST_REQUEST,
  MPESA_TRANSACTION_LIST_SUCCESS,
  MPESA_TRANSACTION_LIST_FAIL,
  MPESA_TRANSACTION_LIST_RESET,
  MPESA_TRANSACTION_DETAILS_REQUEST,
  MPESA_TRANSACTION_DETAILS_SUCCESS,
  MPESA_TRANSACTION_DETAILS_FAIL,
  MPESA_TRANSACTION_DETAILS_RESET,
  MY_MPESA_TRANSACTIONS_REQUEST,
  MY_MPESA_TRANSACTIONS_SUCCESS,
  MY_MPESA_TRANSACTIONS_FAIL,
  MPESA_TRANSACTION_RETRY_REQUEST,
  MPESA_TRANSACTION_RETRY_SUCCESS,
  MPESA_TRANSACTION_RETRY_FAIL,
  MPESA_TRANSACTION_STATS_REQUEST,
  MPESA_TRANSACTION_STATS_SUCCESS,
  MPESA_TRANSACTION_STATS_FAIL,
  MPESA_PAYMENT_INITIATE_REQUEST,
  MPESA_PAYMENT_INITIATE_SUCCESS,
  MPESA_PAYMENT_INITIATE_FAIL,
  MPESA_PAYMENT_INITIATE_RESET,
  MPESA_PAYMENT_STATUS_REQUEST,
  MPESA_PAYMENT_STATUS_SUCCESS,
  MPESA_PAYMENT_STATUS_FAIL,
  MPESA_PAYMENT_STATUS_RESET,
  MPESA_REFUND_LIST_REQUEST,
  MPESA_REFUND_LIST_SUCCESS,
  MPESA_REFUND_LIST_FAIL,
  MPESA_REFUND_DETAILS_REQUEST,
  MPESA_REFUND_DETAILS_SUCCESS,
  MPESA_REFUND_DETAILS_FAIL,
  MPESA_REFUND_PROCESS_REQUEST,
  MPESA_REFUND_PROCESS_SUCCESS,
  MPESA_REFUND_PROCESS_FAIL,
  MPESA_PAYMENT_METHOD_LIST_REQUEST,
  MPESA_PAYMENT_METHOD_LIST_SUCCESS,
  MPESA_PAYMENT_METHOD_LIST_FAIL,
  MPESA_PAYMENT_METHOD_CREATE_REQUEST,
  MPESA_PAYMENT_METHOD_CREATE_SUCCESS,
  MPESA_PAYMENT_METHOD_CREATE_FAIL,
  MPESA_PAYMENT_METHOD_DELETE_REQUEST,
  MPESA_PAYMENT_METHOD_DELETE_SUCCESS,
  MPESA_PAYMENT_METHOD_DELETE_FAIL,
  MPESA_PAYMENT_METHOD_SET_DEFAULT_REQUEST,
  MPESA_PAYMENT_METHOD_SET_DEFAULT_SUCCESS,
  MPESA_PAYMENT_METHOD_SET_DEFAULT_FAIL,
  SET_MPESA_FILTERS,
  CLEAR_MPESA_FILTERS,
  SET_MPESA_SORT,
} from '../constants/paymentConstants';

// ============ M-PESA CONFIGURATION ACTIONS ============

// List M-Pesa configurations (admin)
export const listMpesaConfigurations = () => async (dispatch) => {
  try {
    dispatch({ type: MPESA_CONFIG_LIST_REQUEST });

    const { data } = await apiClient.get('/payments/configurations/');

    dispatch({
      type: MPESA_CONFIG_LIST_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: MPESA_CONFIG_LIST_FAIL,
      payload:
        error.response?.data?.message || error.message || 'Failed to fetch M-Pesa configurations',
    });
  }
};

// Get M-Pesa configuration details (admin)
export const getMpesaConfigurationDetails = (id) => async (dispatch) => {
  try {
    dispatch({ type: MPESA_CONFIG_DETAILS_REQUEST });

    const { data } = await apiClient.get(`/payments/configurations/${id}/`);

    dispatch({
      type: MPESA_CONFIG_DETAILS_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: MPESA_CONFIG_DETAILS_FAIL,
      payload:
        error.response?.data?.message || error.message || 'Failed to fetch configuration details',
    });
  }
};

// Set default M-Pesa configuration (admin)
export const setDefaultMpesaConfiguration = (id) => async (dispatch) => {
  try {
    dispatch({ type: MPESA_CONFIG_SET_DEFAULT_REQUEST });

    const { data } = await apiClient.post(`/payments/configurations/${id}/set_default/`);

    dispatch({
      type: MPESA_CONFIG_SET_DEFAULT_SUCCESS,
      payload: data,
    });

    // Refresh configuration list
    dispatch(listMpesaConfigurations());
  } catch (error) {
    dispatch({
      type: MPESA_CONFIG_SET_DEFAULT_FAIL,
      payload:
        error.response?.data?.message || error.message || 'Failed to set default configuration',
    });
  }
};

// Test M-Pesa connection (admin)
export const testMpesaConnection = (id) => async (dispatch) => {
  try {
    dispatch({ type: MPESA_CONFIG_TEST_REQUEST });

    const { data } = await apiClient.post(`/payments/configurations/${id}/test_connection/`);

    dispatch({
      type: MPESA_CONFIG_TEST_SUCCESS,
      payload: data,
    });

    return { success: true, data };
  } catch (error) {
    dispatch({
      type: MPESA_CONFIG_TEST_FAIL,
      payload:
        error.response?.data?.message || error.message || 'Failed to test connection',
    });
    return { success: false, error: error.response?.data || error.message };
  }
};

// ============ M-PESA TRANSACTION ACTIONS ============

// List all M-Pesa transactions (admin)
export const listMpesaTransactions = (params = {}) => async (dispatch) => {
  try {
    dispatch({ type: MPESA_TRANSACTION_LIST_REQUEST });

    const queryParams = new URLSearchParams();
    
    if (params.status) queryParams.append('status', params.status);
    if (params.transaction_type) queryParams.append('transaction_type', params.transaction_type);
    if (params.amount_min) queryParams.append('amount_min', params.amount_min);
    if (params.amount_max) queryParams.append('amount_max', params.amount_max);
    if (params.phone_number) queryParams.append('phone_number', params.phone_number);
    if (params.order) queryParams.append('order', params.order);
    if (params.customer) queryParams.append('customer', params.customer);
    if (params.date_from) queryParams.append('date_from', params.date_from);
    if (params.date_to) queryParams.append('date_to', params.date_to);
    if (params.is_successful !== undefined) queryParams.append('is_successful', params.is_successful);
    if (params.page) queryParams.append('page', params.page);
    if (params.page_size) queryParams.append('page_size', params.page_size);
    if (params.ordering) queryParams.append('ordering', params.ordering);

    const { data } = await apiClient.get(`/payments/transactions/?${queryParams.toString()}`);

    dispatch({
      type: MPESA_TRANSACTION_LIST_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: MPESA_TRANSACTION_LIST_FAIL,
      payload:
        error.response?.data?.message || error.message || 'Failed to fetch transactions',
    });
  }
};

// Reset transaction list
export const resetMpesaTransactionList = () => (dispatch) => {
  dispatch({ type: MPESA_TRANSACTION_LIST_RESET });
};

// Get M-Pesa transaction details
export const getMpesaTransactionDetails = (id) => async (dispatch) => {
  try {
    dispatch({ type: MPESA_TRANSACTION_DETAILS_REQUEST });

    const { data } = await apiClient.get(`/payments/transactions/${id}/`);

    dispatch({
      type: MPESA_TRANSACTION_DETAILS_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: MPESA_TRANSACTION_DETAILS_FAIL,
      payload:
        error.response?.data?.message || error.message || 'Failed to fetch transaction details',
    });
  }
};

// Reset transaction details
export const resetMpesaTransactionDetails = () => (dispatch) => {
  dispatch({ type: MPESA_TRANSACTION_DETAILS_RESET });
};

// Get user's M-Pesa transactions
export const getMyMpesaTransactions = (params = {}) => async (dispatch) => {
  try {
    dispatch({ type: MY_MPESA_TRANSACTIONS_REQUEST });

    const queryParams = new URLSearchParams();
    if (params.status) queryParams.append('status', params.status);
    if (params.page) queryParams.append('page', params.page);
    if (params.ordering) queryParams.append('ordering', params.ordering);

    const { data } = await apiClient.get(`/payments/transactions/my_transactions/?${queryParams.toString()}`);

    dispatch({
      type: MY_MPESA_TRANSACTIONS_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: MY_MPESA_TRANSACTIONS_FAIL,
      payload:
        error.response?.data?.message || error.message || 'Failed to fetch your transactions',
    });
  }
};

// Retry failed M-Pesa transaction
export const retryMpesaTransaction = (id) => async (dispatch) => {
  try {
    dispatch({ type: MPESA_TRANSACTION_RETRY_REQUEST });

    const { data } = await apiClient.post(`/payments/transactions/${id}/retry/`);

    dispatch({
      type: MPESA_TRANSACTION_RETRY_SUCCESS,
      payload: data,
    });

    return { success: true, transaction: data.transaction };
  } catch (error) {
    dispatch({
      type: MPESA_TRANSACTION_RETRY_FAIL,
      payload:
        error.response?.data?.error || error.message || 'Failed to retry transaction',
    });
    return { success: false, error: error.response?.data?.error || error.message };
  }
};

// Get M-Pesa transaction statistics (admin)
export const getMpesaTransactionStats = () => async (dispatch) => {
  try {
    dispatch({ type: MPESA_TRANSACTION_STATS_REQUEST });

    const { data } = await apiClient.get('/payments/transactions/stats/');

    dispatch({
      type: MPESA_TRANSACTION_STATS_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: MPESA_TRANSACTION_STATS_FAIL,
      payload:
        error.response?.data?.message || error.message || 'Failed to fetch statistics',
    });
  }
};

// ============ PAYMENT INITIATION ACTIONS ============

// Initiate M-Pesa payment
export const initiateMpesaPayment = (paymentData) => async (dispatch) => {
  try {
    dispatch({ type: MPESA_PAYMENT_INITIATE_REQUEST });

    const { data } = await apiClient.post('/payments/initiate/', paymentData);

    dispatch({
      type: MPESA_PAYMENT_INITIATE_SUCCESS,
      payload: data,
    });

    return { success: true, data };
  } catch (error) {
    dispatch({
      type: MPESA_PAYMENT_INITIATE_FAIL,
      payload:
        error.response?.data?.error || error.message || 'Failed to initiate payment',
    });
    return { success: false, error: error.response?.data?.error || error.message };
  }
};

// Reset payment initiation state
export const resetMpesaPaymentInitiate = () => (dispatch) => {
  dispatch({ type: MPESA_PAYMENT_INITIATE_RESET });
};

// Check M-Pesa payment status
export const checkMpesaPaymentStatus = (statusData) => async (dispatch) => {
  try {
    dispatch({ type: MPESA_PAYMENT_STATUS_REQUEST });

    const { data } = await apiClient.post('/payments/check-status/', statusData);

    dispatch({
      type: MPESA_PAYMENT_STATUS_SUCCESS,
      payload: data,
    });

    return { success: true, data };
  } catch (error) {
    dispatch({
      type: MPESA_PAYMENT_STATUS_FAIL,
      payload:
        error.response?.data?.error || error.message || 'Failed to check payment status',
    });
    return { success: false, error: error.response?.data?.error || error.message };
  }
};

// Reset payment status check state
export const resetMpesaPaymentStatus = () => (dispatch) => {
  dispatch({ type: MPESA_PAYMENT_STATUS_RESET });
};

// ============ M-PESA REFUND ACTIONS ============

// List M-Pesa refunds
export const listMpesaRefunds = (params = {}) => async (dispatch) => {
  try {
    dispatch({ type: MPESA_REFUND_LIST_REQUEST });

    const queryParams = new URLSearchParams();
    if (params.status) queryParams.append('status', params.status);
    if (params.page) queryParams.append('page', params.page);

    const { data } = await apiClient.get(`/payments/refunds/?${queryParams.toString()}`);

    dispatch({
      type: MPESA_REFUND_LIST_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: MPESA_REFUND_LIST_FAIL,
      payload:
        error.response?.data?.message || error.message || 'Failed to fetch refunds',
    });
  }
};

// Get refund details
export const getMpesaRefundDetails = (id) => async (dispatch) => {
  try {
    dispatch({ type: MPESA_REFUND_DETAILS_REQUEST });

    const { data } = await apiClient.get(`/payments/refunds/${id}/`);

    dispatch({
      type: MPESA_REFUND_DETAILS_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: MPESA_REFUND_DETAILS_FAIL,
      payload:
        error.response?.data?.message || error.message || 'Failed to fetch refund details',
    });
  }
};

// Process M-Pesa refund (admin)
export const processMpesaRefund = (refundData) => async (dispatch) => {
  try {
    dispatch({ type: MPESA_REFUND_PROCESS_REQUEST });

    const { data } = await apiClient.post('/payments/process-refund/', refundData);

    dispatch({
      type: MPESA_REFUND_PROCESS_SUCCESS,
      payload: data,
    });

    return { success: true, refund: data.refund };
  } catch (error) {
    dispatch({
      type: MPESA_REFUND_PROCESS_FAIL,
      payload:
        error.response?.data?.error || error.message || 'Failed to process refund',
    });
    return { success: false, error: error.response?.data?.error || error.message };
  }
};

// ============ PAYMENT METHOD ACTIONS ============

// List user's payment methods
export const listMpesaPaymentMethods = () => async (dispatch) => {
  try {
    dispatch({ type: MPESA_PAYMENT_METHOD_LIST_REQUEST });

    const { data } = await apiClient.get('/payments/payment-methods/');

    dispatch({
      type: MPESA_PAYMENT_METHOD_LIST_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: MPESA_PAYMENT_METHOD_LIST_FAIL,
      payload:
        error.response?.data?.message || error.message || 'Failed to fetch payment methods',
    });
  }
};

// Create payment method
export const createMpesaPaymentMethod = (methodData) => async (dispatch) => {
  try {
    dispatch({ type: MPESA_PAYMENT_METHOD_CREATE_REQUEST });

    const { data } = await apiClient.post('/payments/payment-methods/', methodData);

    dispatch({
      type: MPESA_PAYMENT_METHOD_CREATE_SUCCESS,
      payload: data,
    });

    // Refresh payment methods list
    dispatch(listMpesaPaymentMethods());

    return { success: true, paymentMethod: data };
  } catch (error) {
    dispatch({
      type: MPESA_PAYMENT_METHOD_CREATE_FAIL,
      payload:
        error.response?.data?.phone_number?.[0] || 
        error.response?.data?.message || 
        error.message || 
        'Failed to create payment method',
    });
    return { success: false, error: error.response?.data || error.message };
  }
};

// Delete payment method
export const deleteMpesaPaymentMethod = (id) => async (dispatch) => {
  try {
    dispatch({ type: MPESA_PAYMENT_METHOD_DELETE_REQUEST });

    await apiClient.delete(`/payments/payment-methods/${id}/`);

    dispatch({
      type: MPESA_PAYMENT_METHOD_DELETE_SUCCESS,
      payload: id,
    });

    // Refresh payment methods list
    dispatch(listMpesaPaymentMethods());
  } catch (error) {
    dispatch({
      type: MPESA_PAYMENT_METHOD_DELETE_FAIL,
      payload:
        error.response?.data?.message || error.message || 'Failed to delete payment method',
    });
  }
};

// Set default payment method
export const setDefaultMpesaPaymentMethod = (id) => async (dispatch) => {
  try {
    dispatch({ type: MPESA_PAYMENT_METHOD_SET_DEFAULT_REQUEST });

    const { data } = await apiClient.post(`/payments/payment-methods/${id}/set_default/`);

    dispatch({
      type: MPESA_PAYMENT_METHOD_SET_DEFAULT_SUCCESS,
      payload: data,
    });

    // Refresh payment methods list
    dispatch(listMpesaPaymentMethods());
  } catch (error) {
    dispatch({
      type: MPESA_PAYMENT_METHOD_SET_DEFAULT_FAIL,
      payload:
        error.response?.data?.message || error.message || 'Failed to set default payment method',
    });
  }
};

// ============ FILTER ACTIONS ============

// Set M-Pesa filters
export const setMpesaFilters = (filters) => (dispatch) => {
  dispatch({
    type: SET_MPESA_FILTERS,
    payload: filters,
  });
};

// Clear M-Pesa filters
export const clearMpesaFilters = () => (dispatch) => {
  dispatch({ type: CLEAR_MPESA_FILTERS });
};

// Set M-Pesa sort option
export const setMpesaSort = (sortOption) => (dispatch) => {
  dispatch({
    type: SET_MPESA_SORT,
    payload: sortOption,
  });
};