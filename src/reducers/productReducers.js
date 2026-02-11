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
// PRODUCT REDUCERS
// ============================================================================

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

// Product Create Reducer
const initialProductCreateState = {
  loading: false,
  success: false,
  product: null,
  error: null,
};

export const productCreateReducer = (state = initialProductCreateState, action) => {
  switch (action.type) {
    case PRODUCT_CREATE_REQUEST:
      return { ...state, loading: true, error: null };
    case PRODUCT_CREATE_SUCCESS:
      return { loading: false, success: true, product: action.payload, error: null };
    case PRODUCT_CREATE_FAIL:
      return { ...state, loading: false, success: false, error: action.payload };
    case PRODUCT_CREATE_RESET:
      return initialProductCreateState;
    default:
      return state;
  }
};

// Product Update Reducer
const initialProductUpdateState = {
  loading: false,
  success: false,
  product: null,
  error: null,
};

export const productUpdateReducer = (state = initialProductUpdateState, action) => {
  switch (action.type) {
    case PRODUCT_UPDATE_REQUEST:
      return { ...state, loading: true, error: null };
    case PRODUCT_UPDATE_SUCCESS:
      return { loading: false, success: true, product: action.payload, error: null };
    case PRODUCT_UPDATE_FAIL:
      return { ...state, loading: false, success: false, error: action.payload };
    case PRODUCT_UPDATE_RESET:
      return initialProductUpdateState;
    default:
      return state;
  }
};

// Product Delete Reducer
const initialProductDeleteState = {
  loading: false,
  success: false,
  error: null,
};

export const productDeleteReducer = (state = initialProductDeleteState, action) => {
  switch (action.type) {
    case PRODUCT_DELETE_REQUEST:
      return { ...state, loading: true, error: null };
    case PRODUCT_DELETE_SUCCESS:
      return { loading: false, success: true, error: null };
    case PRODUCT_DELETE_FAIL:
      return { ...state, loading: false, success: false, error: action.payload };
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

// New Arrival Products Reducer
const initialNewArrivalProductsState = {
  loading: false,
  products: [],
  error: null,
};

export const newArrivalProductsReducer = (state = initialNewArrivalProductsState, action) => {
  switch (action.type) {
    case NEW_ARRIVAL_PRODUCTS_REQUEST:
      return { ...state, loading: true, error: null };
    case NEW_ARRIVAL_PRODUCTS_SUCCESS:
      return { loading: false, products: action.payload, error: null };
    case NEW_ARRIVAL_PRODUCTS_FAIL:
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

// Bestseller Products Reducer
const initialBestsellerProductsState = {
  loading: false,
  products: [],
  error: null,
};

export const bestsellerProductsReducer = (state = initialBestsellerProductsState, action) => {
  switch (action.type) {
    case BESTSELLER_PRODUCTS_REQUEST:
      return { ...state, loading: true, error: null };
    case BESTSELLER_PRODUCTS_SUCCESS:
      return { loading: false, products: action.payload, error: null };
    case BESTSELLER_PRODUCTS_FAIL:
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

// Related Products Reducer
const initialRelatedProductsState = {
  loading: false,
  products: [],
  error: null,
};

export const relatedProductsReducer = (state = initialRelatedProductsState, action) => {
  switch (action.type) {
    case RELATED_PRODUCTS_REQUEST:
      return { ...state, loading: true, error: null };
    case RELATED_PRODUCTS_SUCCESS:
      return { loading: false, products: action.payload, error: null };
    case RELATED_PRODUCTS_FAIL:
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

// Search Products Reducer
const initialSearchProductsState = {
  loading: false,
  products: [],
  count: 0,
  error: null,
};

export const searchProductsReducer = (state = initialSearchProductsState, action) => {
  switch (action.type) {
    case SEARCH_PRODUCTS_REQUEST:
      return { ...state, loading: true, error: null };
    case SEARCH_PRODUCTS_SUCCESS:
      return {
        loading: false,
        products: action.payload.results || action.payload,
        count: action.payload.count || action.payload.length,
        error: null,
      };
    case SEARCH_PRODUCTS_FAIL:
      return { ...state, loading: false, error: action.payload };
    case SEARCH_PRODUCTS_RESET:
      return initialSearchProductsState;
    default:
      return state;
  }
};

// ============================================================================
// CATEGORY REDUCERS
// ============================================================================

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

// Category Details Reducer
const initialCategoryDetailsState = {
  loading: false,
  category: null,
  error: null,
};

export const categoryDetailsReducer = (state = initialCategoryDetailsState, action) => {
  switch (action.type) {
    case CATEGORY_DETAILS_REQUEST:
      return { ...state, loading: true, error: null };
    case CATEGORY_DETAILS_SUCCESS:
      return { loading: false, category: action.payload, error: null };
    case CATEGORY_DETAILS_FAIL:
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

// Category Products Reducer
const initialCategoryProductsState = {
  loading: false,
  products: [],
  count: 0,
  error: null,
};

export const categoryProductsReducer = (state = initialCategoryProductsState, action) => {
  switch (action.type) {
    case CATEGORY_PRODUCTS_REQUEST:
      return { ...state, loading: true, error: null };
    case CATEGORY_PRODUCTS_SUCCESS:
      return {
        loading: false,
        products: action.payload.results || action.payload,
        count: action.payload.count || action.payload.length,
        error: null,
      };
    case CATEGORY_PRODUCTS_FAIL:
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

// Category Create Reducer
const initialCategoryCreateState = {
  loading: false,
  success: false,
  category: null,
  error: null,
};

export const categoryCreateReducer = (state = initialCategoryCreateState, action) => {
  switch (action.type) {
    case CATEGORY_CREATE_REQUEST:
      return { ...state, loading: true, error: null };
    case CATEGORY_CREATE_SUCCESS:
      return { loading: false, success: true, category: action.payload, error: null };
    case CATEGORY_CREATE_FAIL:
      return { ...state, loading: false, success: false, error: action.payload };
    case CATEGORY_CREATE_RESET:
      return initialCategoryCreateState;
    default:
      return state;
  }
};

// Category Update Reducer
const initialCategoryUpdateState = {
  loading: false,
  success: false,
  category: null,
  error: null,
};

export const categoryUpdateReducer = (state = initialCategoryUpdateState, action) => {
  switch (action.type) {
    case CATEGORY_UPDATE_REQUEST:
      return { ...state, loading: true, error: null };
    case CATEGORY_UPDATE_SUCCESS:
      return { loading: false, success: true, category: action.payload, error: null };
    case CATEGORY_UPDATE_FAIL:
      return { ...state, loading: false, success: false, error: action.payload };
    case CATEGORY_UPDATE_RESET:
      return initialCategoryUpdateState;
    default:
      return state;
  }
};

// Category Delete Reducer
const initialCategoryDeleteState = {
  loading: false,
  success: false,
  error: null,
};

export const categoryDeleteReducer = (state = initialCategoryDeleteState, action) => {
  switch (action.type) {
    case CATEGORY_DELETE_REQUEST:
      return { ...state, loading: true, error: null };
    case CATEGORY_DELETE_SUCCESS:
      return { loading: false, success: true, error: null };
    case CATEGORY_DELETE_FAIL:
      return { ...state, loading: false, success: false, error: action.payload };
    default:
      return state;
  }
};

// ============================================================================
// BRAND REDUCERS
// ============================================================================

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

// Brand Details Reducer
const initialBrandDetailsState = {
  loading: false,
  brand: null,
  error: null,
};

export const brandDetailsReducer = (state = initialBrandDetailsState, action) => {
  switch (action.type) {
    case BRAND_DETAILS_REQUEST:
      return { ...state, loading: true, error: null };
    case BRAND_DETAILS_SUCCESS:
      return { loading: false, brand: action.payload, error: null };
    case BRAND_DETAILS_FAIL:
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

// Brand Products Reducer
const initialBrandProductsState = {
  loading: false,
  products: [],
  count: 0,
  error: null,
};

export const brandProductsReducer = (state = initialBrandProductsState, action) => {
  switch (action.type) {
    case BRAND_PRODUCTS_REQUEST:
      return { ...state, loading: true, error: null };
    case BRAND_PRODUCTS_SUCCESS:
      return {
        loading: false,
        products: action.payload.results || action.payload,
        count: action.payload.count || action.payload.length,
        error: null,
      };
    case BRAND_PRODUCTS_FAIL:
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

// Brand Create Reducer
const initialBrandCreateState = {
  loading: false,
  success: false,
  brand: null,
  error: null,
};

export const brandCreateReducer = (state = initialBrandCreateState, action) => {
  switch (action.type) {
    case BRAND_CREATE_REQUEST:
      return { ...state, loading: true, error: null };
    case BRAND_CREATE_SUCCESS:
      return { loading: false, success: true, brand: action.payload, error: null };
    case BRAND_CREATE_FAIL:
      return { ...state, loading: false, success: false, error: action.payload };
    case BRAND_CREATE_RESET:
      return initialBrandCreateState;
    default:
      return state;
  }
};

// Brand Update Reducer
const initialBrandUpdateState = {
  loading: false,
  success: false,
  brand: null,
  error: null,
};

export const brandUpdateReducer = (state = initialBrandUpdateState, action) => {
  switch (action.type) {
    case BRAND_UPDATE_REQUEST:
      return { ...state, loading: true, error: null };
    case BRAND_UPDATE_SUCCESS:
      return { loading: false, success: true, brand: action.payload, error: null };
    case BRAND_UPDATE_FAIL:
      return { ...state, loading: false, success: false, error: action.payload };
    case BRAND_UPDATE_RESET:
      return initialBrandUpdateState;
    default:
      return state;
  }
};

// Brand Delete Reducer
const initialBrandDeleteState = {
  loading: false,
  success: false,
  error: null,
};

export const brandDeleteReducer = (state = initialBrandDeleteState, action) => {
  switch (action.type) {
    case BRAND_DELETE_REQUEST:
      return { ...state, loading: true, error: null };
    case BRAND_DELETE_SUCCESS:
      return { loading: false, success: true, error: null };
    case BRAND_DELETE_FAIL:
      return { ...state, loading: false, success: false, error: action.payload };
    default:
      return state;
  }
};

// ============================================================================
// REVIEW REDUCERS
// ============================================================================

// Review List Reducer
const initialReviewListState = {
  loading: false,
  reviews: [],
  count: 0,
  error: null,
};

export const reviewListReducer = (state = initialReviewListState, action) => {
  switch (action.type) {
    case REVIEW_LIST_REQUEST:
      return { ...state, loading: true, error: null };
    case REVIEW_LIST_SUCCESS:
      return {
        loading: false,
        reviews: action.payload.results || action.payload,
        count: action.payload.count || action.payload.length,
        error: null,
      };
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

// Review Update Reducer
const initialReviewUpdateState = {
  loading: false,
  success: false,
  review: null,
  error: null,
};

export const reviewUpdateReducer = (state = initialReviewUpdateState, action) => {
  switch (action.type) {
    case REVIEW_UPDATE_REQUEST:
      return { ...state, loading: true, error: null };
    case REVIEW_UPDATE_SUCCESS:
      return { loading: false, success: true, review: action.payload, error: null };
    case REVIEW_UPDATE_FAIL:
      return { ...state, loading: false, success: false, error: action.payload };
    case REVIEW_UPDATE_RESET:
      return initialReviewUpdateState;
    default:
      return state;
  }
};

// Review Delete Reducer
const initialReviewDeleteState = {
  loading: false,
  success: false,
  error: null,
};

export const reviewDeleteReducer = (state = initialReviewDeleteState, action) => {
  switch (action.type) {
    case REVIEW_DELETE_REQUEST:
      return { ...state, loading: true, error: null };
    case REVIEW_DELETE_SUCCESS:
      return { loading: false, success: true, error: null };
    case REVIEW_DELETE_FAIL:
      return { ...state, loading: false, success: false, error: action.payload };
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

// Review Mark Helpful Reducer
const initialReviewMarkHelpfulState = {
  loading: false,
  success: false,
  error: null,
};

export const reviewMarkHelpfulReducer = (state = initialReviewMarkHelpfulState, action) => {
  switch (action.type) {
    case REVIEW_MARK_HELPFUL_REQUEST:
      return { ...state, loading: true, error: null };
    case REVIEW_MARK_HELPFUL_SUCCESS:
      return { loading: false, success: true, error: null };
    case REVIEW_MARK_HELPFUL_FAIL:
      return { ...state, loading: false, success: false, error: action.payload };
    default:
      return state;
  }
};

// ============================================================================
// PRODUCT IMAGE REDUCERS
// ============================================================================

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

// Product Image Update Reducer
const initialProductImageUpdateState = {
  loading: false,
  success: false,
  error: null,
};

export const productImageUpdateReducer = (state = initialProductImageUpdateState, action) => {
  switch (action.type) {
    case PRODUCT_IMAGE_UPDATE_REQUEST:
      return { ...state, loading: true, error: null };
    case PRODUCT_IMAGE_UPDATE_SUCCESS:
      return { loading: false, success: true, error: null };
    case PRODUCT_IMAGE_UPDATE_FAIL:
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

// ============================================================================
// FILTER REDUCER
// ============================================================================

const initialFilterState = {
  category: '',
  brand: '',
  minPrice: 0,
  maxPrice: 1000000,
  minRating: 0,
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
    case SET_PRICE_RANGE:
      return {
        ...state,
        minPrice: action.payload.minPrice,
        maxPrice: action.payload.maxPrice,
      };
    case SET_CATEGORY_FILTER:
      return { ...state, category: action.payload };
    case SET_BRAND_FILTER:
      return { ...state, brand: action.payload };
    case SET_RATING_FILTER:
      return { ...state, minRating: action.payload };
    case TOGGLE_IN_STOCK_FILTER:
      return { ...state, inStock: !state.inStock };
    case TOGGLE_ON_SALE_FILTER:
      return { ...state, onSale: !state.onSale };
    default:
      return state;
  }
};