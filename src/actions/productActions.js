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
  NEW_ARRIVAL_PRODUCTS_REQUEST,
  NEW_ARRIVAL_PRODUCTS_SUCCESS,
  NEW_ARRIVAL_PRODUCTS_FAIL,
  BESTSELLER_PRODUCTS_REQUEST,
  BESTSELLER_PRODUCTS_SUCCESS,
  BESTSELLER_PRODUCTS_FAIL,
  CATEGORY_LIST_REQUEST,
  CATEGORY_LIST_SUCCESS,
  CATEGORY_LIST_FAIL,
  CATEGORY_DETAILS_REQUEST,
  CATEGORY_DETAILS_SUCCESS,
  CATEGORY_DETAILS_FAIL,
  CATEGORY_PRODUCTS_REQUEST,
  CATEGORY_PRODUCTS_SUCCESS,
  CATEGORY_PRODUCTS_FAIL,
  CATEGORY_CREATE_REQUEST,
  CATEGORY_CREATE_SUCCESS,
  CATEGORY_CREATE_FAIL,
  CATEGORY_CREATE_RESET,
  CATEGORY_UPDATE_REQUEST,
  CATEGORY_UPDATE_SUCCESS,
  CATEGORY_UPDATE_FAIL,
  CATEGORY_UPDATE_RESET,
  CATEGORY_DELETE_REQUEST,
  CATEGORY_DELETE_SUCCESS,
  CATEGORY_DELETE_FAIL,
  BRAND_LIST_REQUEST,
  BRAND_LIST_SUCCESS,
  BRAND_LIST_FAIL,
  BRAND_DETAILS_REQUEST,
  BRAND_DETAILS_SUCCESS,
  BRAND_DETAILS_FAIL,
  BRAND_PRODUCTS_REQUEST,
  BRAND_PRODUCTS_SUCCESS,
  BRAND_PRODUCTS_FAIL,
  BRAND_CREATE_REQUEST,
  BRAND_CREATE_SUCCESS,
  BRAND_CREATE_FAIL,
  BRAND_CREATE_RESET,
  BRAND_UPDATE_REQUEST,
  BRAND_UPDATE_SUCCESS,
  BRAND_UPDATE_FAIL,
  BRAND_UPDATE_RESET,
  BRAND_DELETE_REQUEST,
  BRAND_DELETE_SUCCESS,
  BRAND_DELETE_FAIL,
  REVIEW_LIST_REQUEST,
  REVIEW_LIST_SUCCESS,
  REVIEW_LIST_FAIL,
  REVIEW_CREATE_REQUEST,
  REVIEW_CREATE_SUCCESS,
  REVIEW_CREATE_FAIL,
  REVIEW_CREATE_RESET,
  REVIEW_UPDATE_REQUEST,
  REVIEW_UPDATE_SUCCESS,
  REVIEW_UPDATE_FAIL,
  REVIEW_UPDATE_RESET,
  REVIEW_DELETE_REQUEST,
  REVIEW_DELETE_SUCCESS,
  REVIEW_DELETE_FAIL,
  MY_REVIEWS_REQUEST,
  MY_REVIEWS_SUCCESS,
  MY_REVIEWS_FAIL,
  REVIEW_MARK_HELPFUL_REQUEST,
  REVIEW_MARK_HELPFUL_SUCCESS,
  REVIEW_MARK_HELPFUL_FAIL,
  PRODUCT_IMAGE_ADD_REQUEST,
  PRODUCT_IMAGE_ADD_SUCCESS,
  PRODUCT_IMAGE_ADD_FAIL,
  PRODUCT_IMAGE_DELETE_REQUEST,
  PRODUCT_IMAGE_DELETE_SUCCESS,
  PRODUCT_IMAGE_DELETE_FAIL,
  PRODUCT_IMAGE_UPDATE_REQUEST,
  PRODUCT_IMAGE_UPDATE_SUCCESS,
  PRODUCT_IMAGE_UPDATE_FAIL,
  PRODUCT_CREATE_REQUEST,
  PRODUCT_CREATE_SUCCESS,
  PRODUCT_CREATE_FAIL,
  PRODUCT_CREATE_RESET,
  PRODUCT_UPDATE_REQUEST,
  PRODUCT_UPDATE_SUCCESS,
  PRODUCT_UPDATE_FAIL,
  PRODUCT_UPDATE_RESET,
  PRODUCT_DELETE_REQUEST,
  PRODUCT_DELETE_SUCCESS,
  PRODUCT_DELETE_FAIL,
  PRODUCT_INCREMENT_VIEW_REQUEST,
  PRODUCT_INCREMENT_VIEW_SUCCESS,
  PRODUCT_INCREMENT_VIEW_FAIL,
  RELATED_PRODUCTS_REQUEST,
  RELATED_PRODUCTS_SUCCESS,
  RELATED_PRODUCTS_FAIL,
  SEARCH_PRODUCTS_REQUEST,
  SEARCH_PRODUCTS_SUCCESS,
  SEARCH_PRODUCTS_FAIL,
  SEARCH_PRODUCTS_RESET,
  SET_FILTERS,
  CLEAR_FILTERS,
  SET_SORT,
  SET_PRICE_RANGE,
  SET_CATEGORY_FILTER,
  SET_BRAND_FILTER,
  SET_RATING_FILTER,
  TOGGLE_IN_STOCK_FILTER,
  TOGGLE_ON_SALE_FILTER,
} from '../constants/productConstants';

// ============================================================================
// PRODUCT ACTIONS
// ============================================================================

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
    if (params.min_current_price) queryParams.append('min_current_price', params.min_current_price);
    if (params.max_current_price) queryParams.append('max_current_price', params.max_current_price);
    if (params.in_stock !== undefined) queryParams.append('in_stock', params.in_stock);
    if (params.on_sale !== undefined) queryParams.append('on_sale', params.on_sale);
    if (params.is_new !== undefined) queryParams.append('is_new', params.is_new);
    if (params.is_bestseller !== undefined) queryParams.append('is_bestseller', params.is_bestseller);
    if (params.is_featured !== undefined) queryParams.append('is_featured', params.is_featured);
    if (params.condition) queryParams.append('condition', params.condition);
    if (params.min_rating) queryParams.append('min_rating', params.min_rating);
    if (params.min_discount) queryParams.append('min_discount', params.min_discount);
    if (params.has_warranty !== undefined) queryParams.append('has_warranty', params.has_warranty);
    if (params.ordering) queryParams.append('ordering', params.ordering);
    if (params.page) queryParams.append('page', params.page);
    if (params.cursor) queryParams.append('cursor', params.cursor);

    console.log("Actions Params", queryParams.toString())

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

// Create product (admin)
export const createProduct = (productData) => async (dispatch) => {
  try {
    dispatch({ type: PRODUCT_CREATE_REQUEST });

    const { data } = await apiClient.post('/products/', productData);

    dispatch({
      type: PRODUCT_CREATE_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: PRODUCT_CREATE_FAIL,
      payload:
        error.response?.data?.message || error.message || 'Failed to create product',
    });
  }
};

// Reset product create
export const resetProductCreate = () => (dispatch) => {
  dispatch({ type: PRODUCT_CREATE_RESET });
};

// Update product (admin)
export const updateProduct = (slug, productData) => async (dispatch) => {
  try {
    dispatch({ type: PRODUCT_UPDATE_REQUEST });

    const { data } = await apiClient.put(`/products/${slug}/`, productData);

    dispatch({
      type: PRODUCT_UPDATE_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: PRODUCT_UPDATE_FAIL,
      payload:
        error.response?.data?.message || error.message || 'Failed to update product',
    });
  }
};

// Reset product update
export const resetProductUpdate = () => (dispatch) => {
  dispatch({ type: PRODUCT_UPDATE_RESET });
};

// Delete product (admin)
export const deleteProduct = (slug) => async (dispatch) => {
  try {
    dispatch({ type: PRODUCT_DELETE_REQUEST });

    await apiClient.delete(`/products/${slug}/`);

    dispatch({
      type: PRODUCT_DELETE_SUCCESS,
      payload: slug,
    });
  } catch (error) {
    dispatch({
      type: PRODUCT_DELETE_FAIL,
      payload:
        error.response?.data?.message || error.message || 'Failed to delete product',
    });
  }
};

// Increment product view count
export const incrementProductView = (slug) => async (dispatch) => {
  try {
    dispatch({ type: PRODUCT_INCREMENT_VIEW_REQUEST });

    const { data } = await apiClient.post(`/products/${slug}/increment_view/`);

    dispatch({
      type: PRODUCT_INCREMENT_VIEW_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: PRODUCT_INCREMENT_VIEW_FAIL,
      payload:
        error.response?.data?.message || error.message || 'Failed to increment view count',
    });
  }
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

// Get new arrival products
export const getNewArrivalProducts = () => async (dispatch) => {
  try {
    dispatch({ type: NEW_ARRIVAL_PRODUCTS_REQUEST });

    const { data } = await apiClient.get('/products/new_arrivals/');

    dispatch({
      type: NEW_ARRIVAL_PRODUCTS_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: NEW_ARRIVAL_PRODUCTS_FAIL,
      payload:
        error.response?.data?.message || error.message || 'Failed to fetch new arrival products',
    });
  }
};

// Get bestseller products
export const getBestsellerProducts = () => async (dispatch) => {
  try {
    dispatch({ type: BESTSELLER_PRODUCTS_REQUEST });

    const { data } = await apiClient.get('/products/bestsellers/');

    dispatch({
      type: BESTSELLER_PRODUCTS_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: BESTSELLER_PRODUCTS_FAIL,
      payload:
        error.response?.data?.message || error.message || 'Failed to fetch bestseller products',
    });
  }
};

// Get related products
export const getRelatedProducts = (slug) => async (dispatch) => {
  try {
    dispatch({ type: RELATED_PRODUCTS_REQUEST });

    const { data } = await apiClient.get(`/products/${slug}/related/`);

    dispatch({
      type: RELATED_PRODUCTS_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: RELATED_PRODUCTS_FAIL,
      payload:
        error.response?.data?.message || error.message || 'Failed to fetch related products',
    });
  }
};

// Search products
export const searchProducts = (query) => async (dispatch) => {
  try {
    dispatch({ type: SEARCH_PRODUCTS_REQUEST });

    const { data } = await apiClient.get(`/products/?search=${query}`);

    dispatch({
      type: SEARCH_PRODUCTS_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: SEARCH_PRODUCTS_FAIL,
      payload:
        error.response?.data?.message || error.message || 'Failed to search products',
    });
  }
};

// Reset search
export const resetSearch = () => (dispatch) => {
  dispatch({ type: SEARCH_PRODUCTS_RESET });
};

// ============================================================================
// CATEGORY ACTIONS
// ============================================================================

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

// Get category details
export const getCategoryDetails = (slug) => async (dispatch) => {
  try {
    dispatch({ type: CATEGORY_DETAILS_REQUEST });

    const { data } = await apiClient.get(`/categories/${slug}/`);

    dispatch({
      type: CATEGORY_DETAILS_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: CATEGORY_DETAILS_FAIL,
      payload:
        error.response?.data?.message || error.message || 'Failed to fetch category details',
    });
  }
};

// Get products by category
export const getCategoryProducts = (slug, params = {}) => async (dispatch) => {
  try {
    dispatch({ type: CATEGORY_PRODUCTS_REQUEST });

    const queryParams = new URLSearchParams();
    if (params.ordering) queryParams.append('ordering', params.ordering);
    if (params.page) queryParams.append('page', params.page);

    const { data } = await apiClient.get(
      `/categories/${slug}/products/?${queryParams.toString()}`
    );

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

// Create category (admin)
export const createCategory = (categoryData) => async (dispatch) => {
  try {
    dispatch({ type: CATEGORY_CREATE_REQUEST });

    const formData = new FormData();
    Object.keys(categoryData).forEach((key) => {
      if (categoryData[key] !== null && categoryData[key] !== undefined) {
        formData.append(key, categoryData[key]);
      }
    });

    const { data } = await apiClient.post('/categories/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    dispatch({
      type: CATEGORY_CREATE_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: CATEGORY_CREATE_FAIL,
      payload:
        error.response?.data?.message || error.message || 'Failed to create category',
    });
  }
};

// Reset category create
export const resetCategoryCreate = () => (dispatch) => {
  dispatch({ type: CATEGORY_CREATE_RESET });
};

// Update category (admin)
export const updateCategory = (slug, categoryData) => async (dispatch) => {
  try {
    dispatch({ type: CATEGORY_UPDATE_REQUEST });

    const formData = new FormData();
    Object.keys(categoryData).forEach((key) => {
      if (categoryData[key] !== null && categoryData[key] !== undefined) {
        formData.append(key, categoryData[key]);
      }
    });

    const { data } = await apiClient.put(`/categories/${slug}/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    dispatch({
      type: CATEGORY_UPDATE_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: CATEGORY_UPDATE_FAIL,
      payload:
        error.response?.data?.message || error.message || 'Failed to update category',
    });
  }
};

// Reset category update
export const resetCategoryUpdate = () => (dispatch) => {
  dispatch({ type: CATEGORY_UPDATE_RESET });
};

// Delete category (admin)
export const deleteCategory = (slug) => async (dispatch) => {
  try {
    dispatch({ type: CATEGORY_DELETE_REQUEST });

    await apiClient.delete(`/categories/${slug}/`);

    dispatch({
      type: CATEGORY_DELETE_SUCCESS,
      payload: slug,
    });
  } catch (error) {
    dispatch({
      type: CATEGORY_DELETE_FAIL,
      payload:
        error.response?.data?.message || error.message || 'Failed to delete category',
    });
  }
};

// ============================================================================
// BRAND ACTIONS
// ============================================================================

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

// Get brand details
export const getBrandDetails = (slug) => async (dispatch) => {
  try {
    dispatch({ type: BRAND_DETAILS_REQUEST });

    const { data } = await apiClient.get(`/brands/${slug}/`);

    dispatch({
      type: BRAND_DETAILS_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: BRAND_DETAILS_FAIL,
      payload:
        error.response?.data?.message || error.message || 'Failed to fetch brand details',
    });
  }
};

// Get products by brand
export const getBrandProducts = (slug, params = {}) => async (dispatch) => {
  try {
    dispatch({ type: BRAND_PRODUCTS_REQUEST });

    const queryParams = new URLSearchParams();
    if (params.ordering) queryParams.append('ordering', params.ordering);
    if (params.page) queryParams.append('page', params.page);

    const { data } = await apiClient.get(
      `/brands/${slug}/products/?${queryParams.toString()}`
    );

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

// Create brand (admin)
export const createBrand = (brandData) => async (dispatch) => {
  try {
    dispatch({ type: BRAND_CREATE_REQUEST });

    const formData = new FormData();
    Object.keys(brandData).forEach((key) => {
      if (brandData[key] !== null && brandData[key] !== undefined) {
        formData.append(key, brandData[key]);
      }
    });

    const { data } = await apiClient.post('/brands/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    dispatch({
      type: BRAND_CREATE_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: BRAND_CREATE_FAIL,
      payload:
        error.response?.data?.message || error.message || 'Failed to create brand',
    });
  }
};

// Reset brand create
export const resetBrandCreate = () => (dispatch) => {
  dispatch({ type: BRAND_CREATE_RESET });
};

// Update brand (admin)
export const updateBrand = (slug, brandData) => async (dispatch) => {
  try {
    dispatch({ type: BRAND_UPDATE_REQUEST });

    const formData = new FormData();
    Object.keys(brandData).forEach((key) => {
      if (brandData[key] !== null && brandData[key] !== undefined) {
        formData.append(key, brandData[key]);
      }
    });

    const { data } = await apiClient.put(`/brands/${slug}/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    dispatch({
      type: BRAND_UPDATE_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: BRAND_UPDATE_FAIL,
      payload:
        error.response?.data?.message || error.message || 'Failed to update brand',
    });
  }
};

// Reset brand update
export const resetBrandUpdate = () => (dispatch) => {
  dispatch({ type: BRAND_UPDATE_RESET });
};

// Delete brand (admin)
export const deleteBrand = (slug) => async (dispatch) => {
  try {
    dispatch({ type: BRAND_DELETE_REQUEST });

    await apiClient.delete(`/brands/${slug}/`);

    dispatch({
      type: BRAND_DELETE_SUCCESS,
      payload: slug,
    });
  } catch (error) {
    dispatch({
      type: BRAND_DELETE_FAIL,
      payload:
        error.response?.data?.message || error.message || 'Failed to delete brand',
    });
  }
};

// ============================================================================
// REVIEW ACTIONS
// ============================================================================

// List reviews (with optional filters)
export const listReviews = (params = {}) => async (dispatch) => {
  try {
    dispatch({ type: REVIEW_LIST_REQUEST });

    const queryParams = new URLSearchParams();
    if (params.product) queryParams.append('product', params.product);
    if (params.rating) queryParams.append('rating', params.rating);
    if (params.ordering) queryParams.append('ordering', params.ordering);
    if (params.page) queryParams.append('page', params.page);

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

// Update review
export const updateReview = (reviewId, reviewData) => async (dispatch) => {
  try {
    dispatch({ type: REVIEW_UPDATE_REQUEST });

    const { data } = await apiClient.put(`/reviews/${reviewId}/`, reviewData);

    dispatch({
      type: REVIEW_UPDATE_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: REVIEW_UPDATE_FAIL,
      payload:
        error.response?.data?.message || error.message || 'Failed to update review',
    });
  }
};

// Reset review update
export const resetReviewUpdate = () => (dispatch) => {
  dispatch({ type: REVIEW_UPDATE_RESET });
};

// Delete review
export const deleteReview = (reviewId) => async (dispatch) => {
  try {
    dispatch({ type: REVIEW_DELETE_REQUEST });

    await apiClient.delete(`/reviews/${reviewId}/`);

    dispatch({
      type: REVIEW_DELETE_SUCCESS,
      payload: reviewId,
    });
  } catch (error) {
    dispatch({
      type: REVIEW_DELETE_FAIL,
      payload:
        error.response?.data?.message || error.message || 'Failed to delete review',
    });
  }
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

// Mark review as helpful
export const markReviewHelpful = (reviewId) => async (dispatch) => {
  try {
    dispatch({ type: REVIEW_MARK_HELPFUL_REQUEST });

    const { data } = await apiClient.post(`/reviews/${reviewId}/mark_helpful/`);

    dispatch({
      type: REVIEW_MARK_HELPFUL_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: REVIEW_MARK_HELPFUL_FAIL,
      payload:
        error.response?.data?.message || error.message || 'Failed to mark review as helpful',
    });
  }
};

// ============================================================================
// PRODUCT IMAGE ACTIONS
// ============================================================================

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

// Update product image (admin)
export const updateProductImage = (slug, imageId, imageData) => async (dispatch) => {
  try {
    dispatch({ type: PRODUCT_IMAGE_UPDATE_REQUEST });

    const { data } = await apiClient.put(
      `/products/${slug}/update_image/`,
      {
        image_id: imageId,
        ...imageData,
      }
    );

    dispatch({
      type: PRODUCT_IMAGE_UPDATE_SUCCESS,
      payload: data,
    });

    // Reload product details
    dispatch(getProductDetails(slug));
  } catch (error) {
    dispatch({
      type: PRODUCT_IMAGE_UPDATE_FAIL,
      payload:
        error.response?.data?.message || error.message || 'Failed to update image',
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

// ============================================================================
// FILTER ACTIONS
// ============================================================================

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

// Set price range
export const setPriceRange = (minPrice, maxPrice) => (dispatch) => {
  dispatch({
    type: SET_PRICE_RANGE,
    payload: { minPrice, maxPrice },
  });
};

// Set category filter
export const setCategoryFilter = (category) => (dispatch) => {
  dispatch({
    type: SET_CATEGORY_FILTER,
    payload: category,
  });
};

// Set brand filter
export const setBrandFilter = (brand) => (dispatch) => {
  dispatch({
    type: SET_BRAND_FILTER,
    payload: brand,
  });
};

// Set rating filter
export const setRatingFilter = (rating) => (dispatch) => {
  dispatch({
    type: SET_RATING_FILTER,
    payload: rating,
  });
};

// Toggle in stock filter
export const toggleInStockFilter = () => (dispatch) => {
  dispatch({ type: TOGGLE_IN_STOCK_FILTER });
};

// Toggle on sale filter
export const toggleOnSaleFilter = () => (dispatch) => {
  dispatch({ type: TOGGLE_ON_SALE_FILTER });
};