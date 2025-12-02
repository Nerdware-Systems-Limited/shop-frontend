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
  REVIEW_CREATE_RESET,
} from '../constants/productConstants';

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
    default:
      return state;
  }
};

const initialCategoryListState = {
  loading: false,
  categories: [],
  error: null,
};

export const categoryListReducer = (state = initialCategoryListState, action) => {
  switch (action.type) {
    case CATEGORY_LIST_REQUEST:
      return { ...state, loading: true };
    case CATEGORY_LIST_SUCCESS:
      return { loading: false, categories: action.payload, error: null };
    case CATEGORY_LIST_FAIL:
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

const initialBrandListState = {
  loading: false,
  brands: [],
  error: null,
};

export const brandListReducer = (state = initialBrandListState, action) => {
  switch (action.type) {
    case BRAND_LIST_REQUEST:
      return { ...state, loading: true };
    case BRAND_LIST_SUCCESS:
      return { loading: false, brands: action.payload, error: null };
    case BRAND_LIST_FAIL:
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

const initialFilterState = {
  category: '',
  brand: '',
  minPrice: 0,
  maxPrice: 1000000,
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

const initialReviewCreateState = {
  loading: false,
  success: false,
  error: null,
};

export const reviewCreateReducer = (state = initialReviewCreateState, action) => {
  switch (action.type) {
    case REVIEW_CREATE_REQUEST:
      return { ...state, loading: true };
    case REVIEW_CREATE_SUCCESS:
      return { loading: false, success: true, error: null };
    case REVIEW_CREATE_FAIL:
      return { loading: false, success: false, error: action.payload };
    case REVIEW_CREATE_RESET:
      return initialReviewCreateState;
    default:
      return state;
  }
};
