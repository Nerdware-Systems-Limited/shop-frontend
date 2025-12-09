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

// Product List Reducer
const initialProductListState = {
  loading: false,
  products: [],
  count: 0,
  next: null,
  previous: null,
  error: null,
};

export const productListReducer = (state = initialProductListState, action) => {
  switch (action.type) {
    case PRODUCT_LIST_REQUEST:
      return { ...state, loading: true, error: null };
    case PRODUCT_LIST_SUCCESS:
      return {
        loading: false,
        products: action.payload.results || action.payload,
        count: action.payload.count || action.payload.length,
        next: action.payload.next,
        previous: action.payload.previous,
        error: null,
      };
    case PRODUCT_LIST_FAIL:
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

// Product Details Reducer
const initialProductDetailsState = {
  loading: false,
  product: null,
  error: null,
};

export const productDetailsReducer = (state = initialProductDetailsState, action) => {
  switch (action.type) {
    case PRODUCT_DETAILS_REQUEST:
      return { ...state, loading: true, error: null };
    case PRODUCT_DETAILS_SUCCESS:
      return { loading: false, product: action.payload, error: null };
    case PRODUCT_DETAILS_FAIL:
      return { ...state, loading: false, error: action.payload };
    case PRODUCT_DETAILS_RESET:
      return initialProductDetailsState;
    default:
      return state;
  }
};

// Featured Products Reducer
const initialFeaturedProductsState = {
  loading: false,
  products: [],
  error: null,
};

export const featuredProductsReducer = (state = initialFeaturedProductsState, action) => {
  switch (action.type) {
    case FEATURED_PRODUCTS_REQUEST:
      return { ...state, loading: true, error: null };
    case FEATURED_PRODUCTS_SUCCESS:
      return { loading: false, products: action.payload, error: null };
    case FEATURED_PRODUCTS_FAIL:
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

// On Sale Products Reducer
const initialOnSaleProductsState = {
  loading: false,
  products: [],
  error: null,
};

export const onSaleProductsReducer = (state = initialOnSaleProductsState, action) => {
  switch (action.type) {
    case ON_SALE_PRODUCTS_REQUEST:
      return { ...state, loading: true, error: null };
    case ON_SALE_PRODUCTS_SUCCESS:
      return { loading: false, products: action.payload, error: null };
    case ON_SALE_PRODUCTS_FAIL:
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

// Category List Reducer
const initialCategoryListState = {
  loading: false,
  categories: [],
  error: null,
};

export const categoryListReducer = (state = initialCategoryListState, action) => {
  switch (action.type) {
    case CATEGORY_LIST_REQUEST:
      return { ...state, loading: true, error: null };
    case CATEGORY_LIST_SUCCESS:
      return { loading: false, categories: action.payload, error: null };
    case CATEGORY_LIST_FAIL:
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

// Category Products Reducer
const initialCategoryProductsState = {
  loading: false,
  products: [],
  error: null,
};

export const categoryProductsReducer = (state = initialCategoryProductsState, action) => {
  switch (action.type) {
    case CATEGORY_PRODUCTS_REQUEST:
      return { ...state, loading: true, error: null };
    case CATEGORY_PRODUCTS_SUCCESS:
      return { loading: false, products: action.payload, error: null };
    case CATEGORY_PRODUCTS_FAIL:
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

// Brand List Reducer
const initialBrandListState = {
  loading: false,
  brands: [],
  error: null,
};

export const brandListReducer = (state = initialBrandListState, action) => {
  switch (action.type) {
    case BRAND_LIST_REQUEST:
      return { ...state, loading: true, error: null };
    case BRAND_LIST_SUCCESS:
      return { loading: false, brands: action.payload, error: null };
    case BRAND_LIST_FAIL:
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

// Brand Products Reducer
const initialBrandProductsState = {
  loading: false,
  products: [],
  error: null,
};

export const brandProductsReducer = (state = initialBrandProductsState, action) => {
  switch (action.type) {
    case BRAND_PRODUCTS_REQUEST:
      return { ...state, loading: true, error: null };
    case BRAND_PRODUCTS_SUCCESS:
      return { loading: false, products: action.payload, error: null };
    case BRAND_PRODUCTS_FAIL:
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

// Review List Reducer
const initialReviewListState = {
  loading: false,
  reviews: [],
  error: null,
};

export const reviewListReducer = (state = initialReviewListState, action) => {
  switch (action.type) {
    case REVIEW_LIST_REQUEST:
      return { ...state, loading: true, error: null };
    case REVIEW_LIST_SUCCESS:
      return { loading: false, reviews: action.payload, error: null };
    case REVIEW_LIST_FAIL:
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

// Review Create Reducer
const initialReviewCreateState = {
  loading: false,
  success: false,
  review: null,
  error: null,
};

export const reviewCreateReducer = (state = initialReviewCreateState, action) => {
  switch (action.type) {
    case REVIEW_CREATE_REQUEST:
      return { ...state, loading: true, error: null };
    case REVIEW_CREATE_SUCCESS:
      return { loading: false, success: true, review: action.payload, error: null };
    case REVIEW_CREATE_FAIL:
      return { ...state, loading: false, success: false, error: action.payload };
    case REVIEW_CREATE_RESET:
      return initialReviewCreateState;
    default:
      return state;
  }
};

// My Reviews Reducer
const initialMyReviewsState = {
  loading: false,
  reviews: [],
  error: null,
};

export const myReviewsReducer = (state = initialMyReviewsState, action) => {
  switch (action.type) {
    case MY_REVIEWS_REQUEST:
      return { ...state, loading: true, error: null };
    case MY_REVIEWS_SUCCESS:
      return { loading: false, reviews: action.payload, error: null };
    case MY_REVIEWS_FAIL:
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

// Product Image Add Reducer
const initialProductImageAddState = {
  loading: false,
  success: false,
  error: null,
};

export const productImageAddReducer = (state = initialProductImageAddState, action) => {
  switch (action.type) {
    case PRODUCT_IMAGE_ADD_REQUEST:
      return { ...state, loading: true, error: null };
    case PRODUCT_IMAGE_ADD_SUCCESS:
      return { loading: false, success: true, error: null };
    case PRODUCT_IMAGE_ADD_FAIL:
      return { ...state, loading: false, success: false, error: action.payload };
    default:
      return state;
  }
};

// Product Image Delete Reducer
const initialProductImageDeleteState = {
  loading: false,
  success: false,
  error: null,
};

export const productImageDeleteReducer = (state = initialProductImageDeleteState, action) => {
  switch (action.type) {
    case PRODUCT_IMAGE_DELETE_REQUEST:
      return { ...state, loading: true, error: null };
    case PRODUCT_IMAGE_DELETE_SUCCESS:
      return { loading: false, success: true, error: null };
    case PRODUCT_IMAGE_DELETE_FAIL:
      return { ...state, loading: false, success: false, error: action.payload };
    default:
      return state;
  }
};

// Filter Reducer
const initialFilterState = {
  category: '',
  brand: '',
  minPrice: 0,
  maxPrice: 10000,
  inStock: false,
  onSale: false,
  sortBy: '',
};

export const filterReducer = (state = initialFilterState, action) => {
  switch (action.type) {
    case SET_FILTERS:
      return { ...state, ...action.payload };
    case CLEAR_FILTERS:
      return initialFilterState;
    case SET_SORT:
      return { ...state, sortBy: action.payload };
    default:
      return state;
  }
};