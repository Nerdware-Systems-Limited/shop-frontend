import apiClient from '../api/apiClient';
import {
  PRODUCT_LIST_REQUEST,
  PRODUCT_LIST_SUCCESS,
  PRODUCT_LIST_FAIL,
  PRODUCT_DETAILS_REQUEST,
  PRODUCT_DETAILS_SUCCESS,
  PRODUCT_DETAILS_FAIL,
  CATEGORY_LIST_REQUEST,
  CATEGORY_LIST_SUCCESS,
  CATEGORY_LIST_FAIL,
  BRAND_LIST_REQUEST,
  BRAND_LIST_SUCCESS,
  BRAND_LIST_FAIL,
  SET_FILTERS,
  CLEAR_FILTERS,
  SET_SORT,
  REVIEW_CREATE_REQUEST,
  REVIEW_CREATE_SUCCESS,
  REVIEW_CREATE_FAIL,
} from '../constants/productConstants';

// List all products with filters
export const listProducts = (params = {}) => async (dispatch) => {
  try {
    dispatch({ type: PRODUCT_LIST_REQUEST });

    const queryParams = new URLSearchParams();
    
    if (params.search) queryParams.append('search', params.search);
    if (params.category) queryParams.append('category', params.category);
    if (params.brand) queryParams.append('brand', params.brand);
    if (params.min_price) queryParams.append('min_price', params.min_price);
    if (params.max_price) queryParams.append('max_price', params.max_price);
    if (params.in_stock !== undefined) queryParams.append('in_stock', params.in_stock);
    if (params.on_sale !== undefined) queryParams.append('on_sale', params.on_sale);
    if (params.ordering) queryParams.append('ordering', params.ordering);
    if (params.page) queryParams.append('page', params.page);

    console.log('Fetching products with params:', queryParams.toString());

    const { data } = await apiClient.get(`/products/?${queryParams.toString()}`);

    dispatch({
      type: PRODUCT_LIST_SUCCESS,
      payload: data,
    });
  } catch (error) {
    console.error('Error in listProducts:', error);
    dispatch({
      type: PRODUCT_LIST_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

// Get product details
export const getProductDetails = (slug) => async (dispatch) => {
  try {
    dispatch({ type: PRODUCT_DETAILS_REQUEST });

    const { data } = await apiClient.get(`/products/${slug}/`);

    dispatch({
      type: PRODUCT_DETAILS_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: PRODUCT_DETAILS_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

// List all categories
export const listCategories = () => async (dispatch) => {
  try {
    dispatch({ type: CATEGORY_LIST_REQUEST });

    const { data } = await apiClient.get('/categories/');

    dispatch({
      type: CATEGORY_LIST_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: CATEGORY_LIST_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

// List all brands
export const listBrands = () => async (dispatch) => {
  try {
    dispatch({ type: BRAND_LIST_REQUEST });

    const { data } = await apiClient.get('/brands/');

    dispatch({
      type: BRAND_LIST_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: BRAND_LIST_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

// Set filters
export const setFilters = (filters) => (dispatch) => {
  dispatch({
    type: SET_FILTERS,
    payload: filters,
  });
};

// Clear all filters
export const clearFilters = () => (dispatch) => {
  dispatch({ type: CLEAR_FILTERS });
};

// Set sort option
export const setSort = (sortOption) => (dispatch) => {
  dispatch({
    type: SET_SORT,
    payload: sortOption,
  });
};

// Create product review
export const createProductReview = (productId, review) => async (dispatch) => {
  try {
    dispatch({ type: REVIEW_CREATE_REQUEST });

    const { data } = await apiClient.post('/reviews/', {
      product: productId,
      ...review,
    });

    dispatch({
      type: REVIEW_CREATE_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: REVIEW_CREATE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};