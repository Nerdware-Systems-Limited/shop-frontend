import apiClient from '../api/apiClient';
import {
  PRODUCT_LIST_REQUEST,
  PRODUCT_LIST_SUCCESS,
  PRODUCT_LIST_FAIL,
  PRODUCT_DETAILS_REQUEST,
  PRODUCT_DETAILS_SUCCESS,
  PRODUCT_DETAILS_FAIL,
  PRODUCT_DETAILS_RESET,
  FEATURED_PRODUCTS_REQUEST,
  FEATURED_PRODUCTS_SUCCESS,
  FEATURED_PRODUCTS_FAIL,
  ON_SALE_PRODUCTS_REQUEST,
  ON_SALE_PRODUCTS_SUCCESS,
  ON_SALE_PRODUCTS_FAIL,
  CATEGORY_LIST_REQUEST,
  CATEGORY_LIST_SUCCESS,
  CATEGORY_LIST_FAIL,
  CATEGORY_PRODUCTS_REQUEST,
  CATEGORY_PRODUCTS_SUCCESS,
  CATEGORY_PRODUCTS_FAIL,
  BRAND_LIST_REQUEST,
  BRAND_LIST_SUCCESS,
  BRAND_LIST_FAIL,
  BRAND_PRODUCTS_REQUEST,
  BRAND_PRODUCTS_SUCCESS,
  BRAND_PRODUCTS_FAIL,
  REVIEW_LIST_REQUEST,
  REVIEW_LIST_SUCCESS,
  REVIEW_LIST_FAIL,
  REVIEW_CREATE_REQUEST,
  REVIEW_CREATE_SUCCESS,
  REVIEW_CREATE_FAIL,
  REVIEW_CREATE_RESET,
  MY_REVIEWS_REQUEST,
  MY_REVIEWS_SUCCESS,
  MY_REVIEWS_FAIL,
  PRODUCT_IMAGE_ADD_REQUEST,
  PRODUCT_IMAGE_ADD_SUCCESS,
  PRODUCT_IMAGE_ADD_FAIL,
  PRODUCT_IMAGE_DELETE_REQUEST,
  PRODUCT_IMAGE_DELETE_SUCCESS,
  PRODUCT_IMAGE_DELETE_FAIL,
  SET_FILTERS,
  CLEAR_FILTERS,
  SET_SORT,
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
    // Add cursor for pagination
    if (params.cursor) queryParams.append('cursor', params.cursor);

    const { data } = await apiClient.get(`/products/?${queryParams.toString()}`);

    dispatch({
      type: PRODUCT_LIST_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: PRODUCT_LIST_FAIL,
      payload:
        error.response?.data?.message || error.message || 'Failed to fetch products',
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
        error.response?.data?.message || error.message || 'Failed to fetch product details',
    });
  }
};

// Reset product details
export const resetProductDetails = () => (dispatch) => {
  dispatch({ type: PRODUCT_DETAILS_RESET });
};

// Get featured products
export const getFeaturedProducts = () => async (dispatch) => {
  try {
    dispatch({ type: FEATURED_PRODUCTS_REQUEST });

    const { data } = await apiClient.get('/products/featured/');

    dispatch({
      type: FEATURED_PRODUCTS_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: FEATURED_PRODUCTS_FAIL,
      payload:
        error.response?.data?.message || error.message || 'Failed to fetch featured products',
    });
  }
};

// Get on sale products
export const getOnSaleProducts = () => async (dispatch) => {
  try {
    dispatch({ type: ON_SALE_PRODUCTS_REQUEST });

    const { data } = await apiClient.get('/products/on_sale/');

    dispatch({
      type: ON_SALE_PRODUCTS_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: ON_SALE_PRODUCTS_FAIL,
      payload:
        error.response?.data?.message || error.message || 'Failed to fetch sale products',
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
        error.response?.data?.message || error.message || 'Failed to fetch categories',
    });
  }
};

// Get products by category
export const getCategoryProducts = (slug) => async (dispatch) => {
  try {
    dispatch({ type: CATEGORY_PRODUCTS_REQUEST });

    const { data } = await apiClient.get(`/categories/${slug}/products/`);

    dispatch({
      type: CATEGORY_PRODUCTS_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: CATEGORY_PRODUCTS_FAIL,
      payload:
        error.response?.data?.message || error.message || 'Failed to fetch category products',
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
        error.response?.data?.message || error.message || 'Failed to fetch brands',
    });
  }
};

// Get products by brand
export const getBrandProducts = (slug) => async (dispatch) => {
  try {
    dispatch({ type: BRAND_PRODUCTS_REQUEST });

    const { data } = await apiClient.get(`/brands/${slug}/products/`);

    dispatch({
      type: BRAND_PRODUCTS_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: BRAND_PRODUCTS_FAIL,
      payload:
        error.response?.data?.message || error.message || 'Failed to fetch brand products',
    });
  }
};

// List reviews (with optional filters)
export const listReviews = (params = {}) => async (dispatch) => {
  try {
    dispatch({ type: REVIEW_LIST_REQUEST });

    const queryParams = new URLSearchParams();
    if (params.product) queryParams.append('product', params.product);
    if (params.rating) queryParams.append('rating', params.rating);
    if (params.ordering) queryParams.append('ordering', params.ordering);

    const { data } = await apiClient.get(`/reviews/?${queryParams.toString()}`);

    dispatch({
      type: REVIEW_LIST_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: REVIEW_LIST_FAIL,
      payload:
        error.response?.data?.message || error.message || 'Failed to fetch reviews',
    });
  }
};

// Create product review
export const createProductReview = (productId, review) => async (dispatch) => {
  try {
    dispatch({ type: REVIEW_CREATE_REQUEST });

    const { data } = await apiClient.post('/reviews/', {
      product: productId,
      rating: review.rating,
      title: review.title,
      comment: review.comment,
    });

    dispatch({
      type: REVIEW_CREATE_SUCCESS,
      payload: data,
    });

    // Optionally reload product details to show new review
    // dispatch(getProductDetails(productSlug));
  } catch (error) {
    dispatch({
      type: REVIEW_CREATE_FAIL,
      payload:
        error.response?.data?.message || 
        error.response?.data?.detail || 
        error.message || 
        'Failed to create review',
    });
  }
};

// Reset review create state
export const resetReviewCreate = () => (dispatch) => {
  dispatch({ type: REVIEW_CREATE_RESET });
};

// Get my reviews (authenticated user)
export const getMyReviews = () => async (dispatch) => {
  try {
    dispatch({ type: MY_REVIEWS_REQUEST });

    const { data } = await apiClient.get('/reviews/my_reviews/');

    dispatch({
      type: MY_REVIEWS_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: MY_REVIEWS_FAIL,
      payload:
        error.response?.data?.message || error.message || 'Failed to fetch your reviews',
    });
  }
};

// Add image to product (admin)
export const addProductImage = (slug, imageData) => async (dispatch) => {
  try {
    dispatch({ type: PRODUCT_IMAGE_ADD_REQUEST });

    const formData = new FormData();
    formData.append('image', imageData.image);
    formData.append('alt_text', imageData.alt_text || '');
    formData.append('is_primary', imageData.is_primary || false);
    formData.append('order', imageData.order || 0);

    const { data } = await apiClient.post(
      `/products/${slug}/add_image/`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    dispatch({
      type: PRODUCT_IMAGE_ADD_SUCCESS,
      payload: data,
    });

    // Reload product details
    dispatch(getProductDetails(slug));
  } catch (error) {
    dispatch({
      type: PRODUCT_IMAGE_ADD_FAIL,
      payload:
        error.response?.data?.message || error.message || 'Failed to add image',
    });
  }
};

// Delete product image (admin)
export const deleteProductImage = (slug, imageId) => async (dispatch) => {
  try {
    dispatch({ type: PRODUCT_IMAGE_DELETE_REQUEST });

    await apiClient.delete(`/products/${slug}/remove_image/`, {
      data: { image_id: imageId },
    });

    dispatch({
      type: PRODUCT_IMAGE_DELETE_SUCCESS,
      payload: imageId,
    });

    // Reload product details
    dispatch(getProductDetails(slug));
  } catch (error) {
    dispatch({
      type: PRODUCT_IMAGE_DELETE_FAIL,
      payload:
        error.response?.data?.message || error.message || 'Failed to delete image',
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