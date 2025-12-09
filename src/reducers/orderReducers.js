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

// Order Create Reducer
export const orderCreateReducer = (state = {}, action) => {
  switch (action.type) {
    case ORDER_CREATE_REQUEST:
      return { loading: true };
    case ORDER_CREATE_SUCCESS:
      return { loading: false, success: true, order: action.payload };
    case ORDER_CREATE_FAIL:
      return { loading: false, error: action.payload };
    case ORDER_CREATE_RESET:
      return {};
    default:
      return state;
  }
};

// Order List Reducer (Admin)
export const orderListReducer = (state = { orders: [] }, action) => {
  switch (action.type) {
    case ORDER_LIST_REQUEST:
      return { loading: true, orders: [] };
    case ORDER_LIST_SUCCESS:
      return {
        loading: false,
        orders: action.payload.results || action.payload,
        count: action.payload.count,
        next: action.payload.next,
        previous: action.payload.previous,
      };
    case ORDER_LIST_FAIL:
      return { loading: false, error: action.payload };
    case ORDER_LIST_RESET:
      return { orders: [] };
    default:
      return state;
  }
};

// Order Details Reducer
export const orderDetailsReducer = (state = { order: {} }, action) => {
  switch (action.type) {
    case ORDER_DETAILS_REQUEST:
      return { ...state, loading: true };
    case ORDER_DETAILS_SUCCESS:
      return { loading: false, order: action.payload };
    case ORDER_DETAILS_FAIL:
      return { loading: false, error: action.payload };
    case ORDER_DETAILS_RESET:
      return { order: {} };
    default:
      return state;
  }
};

// My Orders Reducer
export const myOrdersReducer = (state = { orders: [] }, action) => {
  switch (action.type) {
    case MY_ORDERS_REQUEST:
      return { loading: true, orders: [] };
    case MY_ORDERS_SUCCESS:
      return {
        loading: false,
        orders: action.payload.results || action.payload,
        count: action.payload.count,
        next: action.payload.next,
        previous: action.payload.previous,
      };
    case MY_ORDERS_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

// Order Update Status Reducer
export const orderUpdateStatusReducer = (state = {}, action) => {
  switch (action.type) {
    case ORDER_UPDATE_STATUS_REQUEST:
      return { loading: true };
    case ORDER_UPDATE_STATUS_SUCCESS:
      return { loading: false, success: true, data: action.payload };
    case ORDER_UPDATE_STATUS_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

// Order Cancel Reducer
export const orderCancelReducer = (state = {}, action) => {
  switch (action.type) {
    case ORDER_CANCEL_REQUEST:
      return { loading: true };
    case ORDER_CANCEL_SUCCESS:
      return { loading: false, success: true, data: action.payload };
    case ORDER_CANCEL_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

// Order Add Tracking Reducer
export const orderAddTrackingReducer = (state = {}, action) => {
  switch (action.type) {
    case ORDER_ADD_TRACKING_REQUEST:
      return { loading: true };
    case ORDER_ADD_TRACKING_SUCCESS:
      return { loading: false, success: true, data: action.payload };
    case ORDER_ADD_TRACKING_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

// Order Tracking Info Reducer
export const orderTrackingInfoReducer = (state = { tracking: {} }, action) => {
  switch (action.type) {
    case ORDER_TRACKING_INFO_REQUEST:
      return { ...state, loading: true };
    case ORDER_TRACKING_INFO_SUCCESS:
      return { loading: false, tracking: action.payload };
    case ORDER_TRACKING_INFO_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

// Order Return Create Reducer
export const orderReturnCreateReducer = (state = {}, action) => {
  switch (action.type) {
    case ORDER_RETURN_CREATE_REQUEST:
      return { loading: true };
    case ORDER_RETURN_CREATE_SUCCESS:
      return { loading: false, success: true, return: action.payload };
    case ORDER_RETURN_CREATE_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

// Order Return List Reducer
export const orderReturnListReducer = (state = { returns: [] }, action) => {
  switch (action.type) {
    case ORDER_RETURN_LIST_REQUEST:
      return { loading: true, returns: [] };
    case ORDER_RETURN_LIST_SUCCESS:
      return {
        loading: false,
        returns: action.payload.results || action.payload,
        count: action.payload.count,
      };
    case ORDER_RETURN_LIST_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

// Shipping Methods Reducer
export const shippingMethodsReducer = (state = { methods: [] }, action) => {
  switch (action.type) {
    case SHIPPING_METHODS_REQUEST:
      return { loading: true, methods: [] };
    case SHIPPING_METHODS_SUCCESS:
      return { loading: false, methods: action.payload };
    case SHIPPING_METHODS_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

// Shipping Quote Reducer
export const shippingQuoteReducer = (state = {}, action) => {
  switch (action.type) {
    case SHIPPING_QUOTE_REQUEST:
      return { loading: true };
    case SHIPPING_QUOTE_SUCCESS:
      return { loading: false, quote: action.payload };
    case SHIPPING_QUOTE_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

// Order Analytics Reducer
export const orderAnalyticsReducer = (state = { analytics: {} }, action) => {
  switch (action.type) {
    case ORDER_ANALYTICS_REQUEST:
      return { ...state, loading: true };
    case ORDER_ANALYTICS_SUCCESS:
      return { loading: false, analytics: action.payload };
    case ORDER_ANALYTICS_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

// Public Order Status Reducer
export const publicOrderStatusReducer = (state = { status: {} }, action) => {
  switch (action.type) {
    case PUBLIC_ORDER_STATUS_REQUEST:
      return { ...state, loading: true };
    case PUBLIC_ORDER_STATUS_SUCCESS:
      return { loading: false, status: action.payload };
    case PUBLIC_ORDER_STATUS_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

// Order Export Reducer
export const orderExportReducer = (state = {}, action) => {
  switch (action.type) {
    case ORDER_EXPORT_REQUEST:
      return { loading: true };
    case ORDER_EXPORT_SUCCESS:
      return { loading: false, success: true };
    case ORDER_EXPORT_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

// Order Item Download Reducer
export const orderItemDownloadReducer = (state = {}, action) => {
  switch (action.type) {
    case ORDER_ITEM_DOWNLOAD_REQUEST:
      return { loading: true };
    case ORDER_ITEM_DOWNLOAD_SUCCESS:
      return { loading: false, success: true, data: action.payload };
    case ORDER_ITEM_DOWNLOAD_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

// Order Note Create Reducer
export const orderNoteCreateReducer = (state = {}, action) => {
  switch (action.type) {
    case ORDER_NOTE_CREATE_REQUEST:
      return { loading: true };
    case ORDER_NOTE_CREATE_SUCCESS:
      return { loading: false, success: true, note: action.payload };
    case ORDER_NOTE_CREATE_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

// Order Note List Reducer
export const orderNoteListReducer = (state = { notes: [] }, action) => {
  switch (action.type) {
    case ORDER_NOTE_LIST_REQUEST:
      return { loading: true, notes: [] };
    case ORDER_NOTE_LIST_SUCCESS:
      return { loading: false, notes: action.payload };
    case ORDER_NOTE_LIST_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

// Order Filter Reducer
export const orderFilterReducer = (state = {
  filters: {},
  sort: '-created_at'
}, action) => {
  switch (action.type) {
    case SET_ORDER_FILTERS:
      return {
        ...state,
        filters: {
          ...state.filters,
          ...action.payload
        }
      };
    case CLEAR_ORDER_FILTERS:
      return {
        ...state,
        filters: {}
      };
    case SET_ORDER_SORT:
      return {
        ...state,
        sort: action.payload
      };
    default:
      return state;
  }
};