import apiClient from '../api/apiClient';
import {
  USER_LOGIN_REQUEST,
  USER_LOGIN_SUCCESS,
  USER_LOGIN_FAIL,
  USER_LOGOUT,
  USER_REGISTER_REQUEST,
  USER_REGISTER_SUCCESS,
  USER_REGISTER_FAIL,
  USER_DETAILS_REQUEST,
  USER_DETAILS_SUCCESS,
  USER_DETAILS_FAIL,
  USER_DETAILS_RESET,
  USER_UPDATE_PROFILE_REQUEST,
  USER_UPDATE_PROFILE_SUCCESS,
  USER_UPDATE_PROFILE_FAIL,
  USER_UPDATE_PROFILE_RESET,
  USER_CHANGE_PASSWORD_REQUEST,
  USER_CHANGE_PASSWORD_SUCCESS,
  USER_CHANGE_PASSWORD_FAIL,
  USER_CHANGE_PASSWORD_RESET,
  ADDRESS_LIST_REQUEST,
  ADDRESS_LIST_SUCCESS,
  ADDRESS_LIST_FAIL,
  ADDRESS_DETAILS_REQUEST,
  ADDRESS_DETAILS_SUCCESS,
  ADDRESS_DETAILS_FAIL,
  ADDRESS_DETAILS_RESET,
  ADDRESS_CREATE_REQUEST,
  ADDRESS_CREATE_SUCCESS,
  ADDRESS_CREATE_FAIL,
  ADDRESS_CREATE_RESET,
  ADDRESS_UPDATE_REQUEST,
  ADDRESS_UPDATE_SUCCESS,
  ADDRESS_UPDATE_FAIL,
  ADDRESS_UPDATE_RESET,
  ADDRESS_DELETE_REQUEST,
  ADDRESS_DELETE_SUCCESS,
  ADDRESS_DELETE_FAIL,
  ADDRESS_SET_DEFAULT_REQUEST,
  ADDRESS_SET_DEFAULT_SUCCESS,
  ADDRESS_SET_DEFAULT_FAIL,
  LOYALTY_POINTS_ADD_REQUEST,
  LOYALTY_POINTS_ADD_SUCCESS,
  LOYALTY_POINTS_ADD_FAIL,
  PASSWORD_RESET_REQUEST,
  PASSWORD_RESET_SUCCESS,
  PASSWORD_RESET_FAIL,
  PASSWORD_RESET_RESET,
  PASSWORD_RESET_VERIFY_REQUEST,
  PASSWORD_RESET_VERIFY_SUCCESS,
  PASSWORD_RESET_VERIFY_FAIL,
  PASSWORD_RESET_VERIFY_RESET,
  PASSWORD_RESET_CONFIRM_REQUEST,
  PASSWORD_RESET_CONFIRM_SUCCESS,
  PASSWORD_RESET_CONFIRM_FAIL,
  PASSWORD_RESET_CONFIRM_RESET,
} from '../constants/customerConstants';

// Login user
export const login = (username, password) => async (dispatch) => {
  try {
    dispatch({ type: USER_LOGIN_REQUEST });

    const { data } = await apiClient.post('/auth/token/', {
      username,
      password,
    });

    dispatch({
      type: USER_LOGIN_SUCCESS,
      payload: data,
    });

    // console.log(data);

    // Store tokens in localStorage
    localStorage.setItem('accessToken', data.access);
    localStorage.setItem('refreshToken', data.refresh);

    // Load user details after login
    dispatch(getUserDetails());
  } catch (error) {
    dispatch({
      type: USER_LOGIN_FAIL,
      payload:
        error.response?.data?.message ||
        error.response?.data?.detail ||
        error.message ||
        'Login failed',
    });
  }
};

// Register user
export const register = (userData) => async (dispatch) => {
  try {
    dispatch({ type: USER_REGISTER_REQUEST });

    const { data } = await apiClient.post('/customers/register/', userData);

    dispatch({
      type: USER_REGISTER_SUCCESS,
      payload: data,
    });

    console.log("Register Data", data)

    // Store tokens in localStorage
    localStorage.setItem('accessToken', data.tokens.access);
    localStorage.setItem('refreshToken', data.tokens.refresh);

    // Load user details after registration
    dispatch(getUserDetails());
  } catch (error) {
    dispatch({
      type: USER_REGISTER_FAIL,
      payload:
        error.response?.data ||
        error.response?.data?.message ||
        error.message ||
        'Registration failed',
    });
  }
};

// Logout user
export const logout = (refreshToken) => async (dispatch) => {
  try {
    // Call logout API to blacklist token
    if (refreshToken) {
      await apiClient.post('/customers/logout/', {
        refresh_token: refreshToken,
      });
    }
  } catch (error) {
    console.error('Logout API error:', error);
  } finally {
    // Clear localStorage
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    
    dispatch({ type: USER_LOGOUT });
    dispatch({ type: USER_DETAILS_RESET });
  }
};

// Get user details
export const getUserDetails = () => async (dispatch) => {
  try {
    dispatch({ type: USER_DETAILS_REQUEST });

    const { data } = await apiClient.get('/customers/profile/');

    dispatch({
      type: USER_DETAILS_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: USER_DETAILS_FAIL,
      payload:
        error.response?.data?.message ||
        error.response?.data?.detail ||
        error.message ||
        'Failed to fetch user details',
    });
  }
};

// Update user profile
export const updateUserProfile = (userData) => async (dispatch) => {
  try {
    dispatch({ type: USER_UPDATE_PROFILE_REQUEST });

    const { data } = await apiClient.put('/customers/profile/update/', userData);

    dispatch({
      type: USER_UPDATE_PROFILE_SUCCESS,
      payload: data,
    });

    // Refresh user details
    dispatch(getUserDetails());
  } catch (error) {
    dispatch({
      type: USER_UPDATE_PROFILE_FAIL,
      payload:
        error.response?.data ||
        error.response?.data?.message ||
        error.message ||
        'Failed to update profile',
    });
  }
};

// Reset update profile state
export const resetUpdateProfile = () => (dispatch) => {
  dispatch({ type: USER_UPDATE_PROFILE_RESET });
};

// Change password
export const changePassword = (passwordData) => async (dispatch) => {
  try {
    dispatch({ type: USER_CHANGE_PASSWORD_REQUEST });

    await apiClient.put('/customers/password/change/', passwordData);

    dispatch({
      type: USER_CHANGE_PASSWORD_SUCCESS,
    });
  } catch (error) {
    dispatch({
      type: USER_CHANGE_PASSWORD_FAIL,
      payload:
        error.response?.data ||
        error.response?.data?.message ||
        error.message ||
        'Failed to change password',
    });
  }
};

// Reset change password state
export const resetChangePassword = () => (dispatch) => {
  dispatch({ type: USER_CHANGE_PASSWORD_RESET });
};

// Get addresses list
export const listAddresses = () => async (dispatch) => {
  try {
    dispatch({ type: ADDRESS_LIST_REQUEST });

    const { data } = await apiClient.get('/customers/addresses/');

    dispatch({
      type: ADDRESS_LIST_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: ADDRESS_LIST_FAIL,
      payload:
        error.response?.data?.message ||
        error.response?.data?.detail ||
        error.message ||
        'Failed to fetch addresses',
    });
  }
};

// Get address details
export const getAddressDetails = (id) => async (dispatch) => {
  try {
    dispatch({ type: ADDRESS_DETAILS_REQUEST });

    const { data } = await apiClient.get(`/customers/addresses/${id}/`);

    dispatch({
      type: ADDRESS_DETAILS_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: ADDRESS_DETAILS_FAIL,
      payload:
        error.response?.data?.message ||
        error.response?.data?.detail ||
        error.message ||
        'Failed to fetch address details',
    });
  }
};

// Reset address details
export const resetAddressDetails = () => (dispatch) => {
  dispatch({ type: ADDRESS_DETAILS_RESET });
};

// Create address
export const createAddress = (addressData) => async (dispatch) => {
  try {
    dispatch({ type: ADDRESS_CREATE_REQUEST });

    const { data } = await apiClient.post('/customers/addresses/', addressData);

    dispatch({
      type: ADDRESS_CREATE_SUCCESS,
      payload: data,
    });

    // Refresh addresses list
    dispatch(listAddresses());
  } catch (error) {
    dispatch({
      type: ADDRESS_CREATE_FAIL,
      payload:
        error.response?.data ||
        error.response?.data?.message ||
        error.message ||
        'Failed to create address',
    });
  }
};

// Reset create address state
export const resetCreateAddress = () => (dispatch) => {
  dispatch({ type: ADDRESS_CREATE_RESET });
};

// Update address
export const updateAddress = (id, addressData) => async (dispatch) => {
  try {
    dispatch({ type: ADDRESS_UPDATE_REQUEST });

    const { data } = await apiClient.put(`/customers/addresses/${id}/`, addressData);

    dispatch({
      type: ADDRESS_UPDATE_SUCCESS,
      payload: data,
    });

    // Refresh addresses list
    dispatch(listAddresses());
  } catch (error) {
    dispatch({
      type: ADDRESS_UPDATE_FAIL,
      payload:
        error.response?.data ||
        error.response?.data?.message ||
        error.message ||
        'Failed to update address',
    });
  }
};

// Reset update address state
export const resetUpdateAddress = () => (dispatch) => {
  dispatch({ type: ADDRESS_UPDATE_RESET });
};

// Delete address
export const deleteAddress = (id) => async (dispatch) => {
  try {
    dispatch({ type: ADDRESS_DELETE_REQUEST });

    await apiClient.delete(`/customers/addresses/${id}/`);

    dispatch({
      type: ADDRESS_DELETE_SUCCESS,
      payload: id,
    });

    // Refresh addresses list
    dispatch(listAddresses());
  } catch (error) {
    dispatch({
      type: ADDRESS_DELETE_FAIL,
      payload:
        error.response?.data?.message ||
        error.response?.data?.detail ||
        error.message ||
        'Failed to delete address',
    });
  }
};

// Set address as default
export const setAddressAsDefault = (id) => async (dispatch) => {
  try {
    dispatch({ type: ADDRESS_SET_DEFAULT_REQUEST });

    const { data } = await apiClient.post(`/customers/addresses/${id}/set_default/`);

    dispatch({
      type: ADDRESS_SET_DEFAULT_SUCCESS,
      payload: data,
    });

    // Refresh addresses list
    dispatch(listAddresses());
  } catch (error) {
    dispatch({
      type: ADDRESS_SET_DEFAULT_FAIL,
      payload:
        error.response?.data?.message ||
        error.response?.data?.detail ||
        error.message ||
        'Failed to set address as default',
    });
  }
};

// Add loyalty points (admin only)
export const addLoyaltyPoints = (customerId, points) => async (dispatch) => {
  try {
    dispatch({ type: LOYALTY_POINTS_ADD_REQUEST });

    const { data } = await apiClient.post(`/customers/all/${customerId}/add_loyalty_points/`, {
      points,
    });

    dispatch({
      type: LOYALTY_POINTS_ADD_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: LOYALTY_POINTS_ADD_FAIL,
      payload:
        error.response?.data?.message ||
        error.response?.data?.detail ||
        error.message ||
        'Failed to add loyalty points',
    });
  }
};

// Request password reset
export const requestPasswordReset = (email) => async (dispatch) => {
  try {
    dispatch({ type: PASSWORD_RESET_REQUEST });

    const { data } = await apiClient.post('/customers/password/reset/', {
      email,
    });

    dispatch({
      type: PASSWORD_RESET_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: PASSWORD_RESET_FAIL,
      payload:
        error.response?.data?.message ||
        error.response?.data?.detail ||
        error.message ||
        'Failed to request password reset',
    });
  }
};

// Reset password reset state
export const resetPasswordReset = () => (dispatch) => {
  dispatch({ type: PASSWORD_RESET_RESET });
};

// Verify password reset code
export const verifyResetCode = (uid, token, code) => async (dispatch) => {
  try {
    dispatch({ type: PASSWORD_RESET_VERIFY_REQUEST });

    const { data } = await apiClient.post('/customers/password/reset/verify/', {
      uid,
      token,
      code,
    });

    dispatch({
      type: PASSWORD_RESET_VERIFY_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: PASSWORD_RESET_VERIFY_FAIL,
      payload:
        error.response?.data?.message ||
        error.response?.data?.detail ||
        error.response?.data?.code?.[0] ||
        error.message ||
        'Invalid or expired reset code',
    });
  }
};

// Reset verify code state
export const resetVerifyCode = () => (dispatch) => {
  dispatch({ type: PASSWORD_RESET_VERIFY_RESET });
};

// Confirm password reset
export const confirmPasswordReset = (resetData) => async (dispatch) => {
  try {
    dispatch({ type: PASSWORD_RESET_CONFIRM_REQUEST });

    const { data } = await apiClient.post('/customers/password/reset/confirm/', resetData);

    dispatch({
      type: PASSWORD_RESET_CONFIRM_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: PASSWORD_RESET_CONFIRM_FAIL,
      payload:
        error.response?.data?.message ||
        error.response?.data?.detail ||
        error.response?.data?.new_password?.[0] ||
        error.message ||
        'Failed to reset password',
    });
  }
};

// Reset confirm password state
export const resetConfirmPassword = () => (dispatch) => {
  dispatch({ type: PASSWORD_RESET_CONFIRM_RESET });
};