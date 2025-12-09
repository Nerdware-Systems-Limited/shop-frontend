import { createStore, combineReducers, applyMiddleware } from 'redux';
import { thunk } from 'redux-thunk';
import { composeWithDevTools } from '@redux-devtools/extension';
import {
  productListReducer,
  productDetailsReducer,
  featuredProductsReducer,
  onSaleProductsReducer,
  categoryListReducer,
  categoryProductsReducer,
  brandListReducer,
  brandProductsReducer,
  reviewListReducer,
  reviewCreateReducer,
  myReviewsReducer,
  productImageAddReducer,
  productImageDeleteReducer,
  filterReducer,
} from './reducers/productReducers';
import { cartReducer,
 } from './reducers/cartReducers';
import {
  userLoginReducer,
  userRegisterReducer,
  userDetailsReducer,
  userUpdateProfileReducer,
  userChangePasswordReducer,
  addressListReducer,
  addressDetailsReducer,
  addressCreateReducer,
  addressUpdateReducer,
  addressDeleteReducer,
  addressSetDefaultReducer,
  loyaltyPointsAddReducer,
} from './reducers/customerReducers';
import {
  orderCreateReducer,
  orderListReducer,
  orderDetailsReducer,
  myOrdersReducer,
  orderUpdateStatusReducer,
  orderCancelReducer,
  orderAddTrackingReducer,
  orderTrackingInfoReducer,
  orderReturnCreateReducer,
  orderReturnListReducer,
  shippingMethodsReducer,
  shippingQuoteReducer,
  orderAnalyticsReducer,
  publicOrderStatusReducer,
  orderExportReducer,
  orderItemDownloadReducer,
  orderNoteCreateReducer,
  orderNoteListReducer,
  orderFilterReducer,
} from './reducers/orderReducers';

const reducer = combineReducers({
  cart: cartReducer,
  productList: productListReducer,
  productDetails: productDetailsReducer,
  featuredProducts: featuredProductsReducer,
  onSaleProducts: onSaleProductsReducer,
  categoryList: categoryListReducer,
  categoryProducts: categoryProductsReducer,
  brandList: brandListReducer,
  brandProducts: brandProductsReducer,
  reviewList: reviewListReducer,
  reviewCreate: reviewCreateReducer,
  myReviews: myReviewsReducer,
  productImageAdd: productImageAddReducer,
  productImageDelete: productImageDeleteReducer,
  filters: filterReducer,

  // Customer reducers
  userLogin: userLoginReducer,
  userRegister: userRegisterReducer,
  userDetails: userDetailsReducer,
  userUpdateProfile: userUpdateProfileReducer,
  userChangePassword: userChangePasswordReducer,
  addressList: addressListReducer,
  addressDetails: addressDetailsReducer,
  addressCreate: addressCreateReducer,
  addressUpdate: addressUpdateReducer,
  addressDelete: addressDeleteReducer,
  addressSetDefault: addressSetDefaultReducer,
  loyaltyPointsAdd: loyaltyPointsAddReducer,

  // Order reducers
  orderCreate: orderCreateReducer,
  orderList: orderListReducer,
  orderDetails: orderDetailsReducer,
  myOrders: myOrdersReducer,
  orderUpdateStatus: orderUpdateStatusReducer,
  orderCancel: orderCancelReducer,
  orderAddTracking: orderAddTrackingReducer,
  orderTrackingInfo: orderTrackingInfoReducer,
  orderReturnCreate: orderReturnCreateReducer,
  orderReturnList: orderReturnListReducer,
  shippingMethods: shippingMethodsReducer,
  shippingQuote: shippingQuoteReducer,
  orderAnalytics: orderAnalyticsReducer,
  publicOrderStatus: publicOrderStatusReducer,
  orderExport: orderExportReducer,
  orderItemDownload: orderItemDownloadReducer,
  orderNoteCreate: orderNoteCreateReducer,
  orderNoteList: orderNoteListReducer,
  orderFilters: orderFilterReducer,
});

const cartItemsFromStorage = localStorage.getItem('cartItems') ?
    JSON.parse(localStorage.getItem('cartItems')) : []

const shippingAddressFromStorage = localStorage.getItem('shippingAddress') ?
    JSON.parse(localStorage.getItem('shippingAddress')) : {}
const paymentMethodFromStorage = localStorage.getItem('paymentMethod')
  ? JSON.parse(localStorage.getItem('paymentMethod'))
  : '';

// Load user info from localStorage if exists
const userInfoFromStorage = localStorage.getItem('accessToken')
  ? {
      accessToken: localStorage.getItem('accessToken'),
      refreshToken: localStorage.getItem('refreshToken'),
    }
  : null;

const initialState = {
  cart: {
      cartItems: cartItemsFromStorage,
      shippingAddress: shippingAddressFromStorage,
      paymentMethod: paymentMethodFromStorage,},
  userLogin: { 
    userInfo: userInfoFromStorage },
}


const middleware = [thunk];

const store = createStore(
  reducer,
  initialState,
  composeWithDevTools(applyMiddleware(...middleware))
);

export default store;