import { createStore, combineReducers, applyMiddleware } from 'redux';
import { thunk } from 'redux-thunk';
import { composeWithDevTools } from '@redux-devtools/extension';
import {
  productListReducer,
  productDetailsReducer,
  productCreateReducer,
  productUpdateReducer,
  productDeleteReducer,
  featuredProductsReducer,
  onSaleProductsReducer,
  newArrivalProductsReducer,
  bestsellerProductsReducer,
  relatedProductsReducer,
  searchProductsReducer,
  categoryListReducer,
  categoryDetailsReducer,
  categoryProductsReducer,
  categoryCreateReducer,
  categoryUpdateReducer,
  categoryDeleteReducer,
  brandListReducer,
  brandDetailsReducer,
  brandProductsReducer,
  brandCreateReducer,
  brandUpdateReducer,
  brandDeleteReducer,
  reviewListReducer,
  reviewCreateReducer,
  reviewUpdateReducer,
  reviewDeleteReducer,
  myReviewsReducer,
  reviewMarkHelpfulReducer,
  productImageAddReducer,
  productImageUpdateReducer,
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
  passwordResetReducer,
  passwordResetVerifyReducer,
  passwordResetConfirmReducer,
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
import {
  mpesaConfigListReducer,
  mpesaConfigDetailsReducer,
  mpesaConfigSetDefaultReducer,
  mpesaConfigTestReducer,
  mpesaTransactionListReducer,
  mpesaTransactionDetailsReducer,
  myMpesaTransactionsReducer,
  mpesaTransactionRetryReducer,
  mpesaTransactionStatsReducer,
  mpesaPaymentInitiateReducer,
  mpesaPaymentStatusReducer,
  mpesaRefundListReducer,
  mpesaRefundDetailsReducer,
  mpesaRefundProcessReducer,
  mpesaPaymentMethodListReducer,
  mpesaPaymentMethodCreateReducer,
  mpesaPaymentMethodDeleteReducer,
  mpesaPaymentMethodSetDefaultReducer,
  mpesaFilterReducer,
} from './reducers/paymentReducers';

import {
  warehouseListReducer,
  warehouseDetailsReducer,
  warehouseCreateReducer,
  warehouseUpdateReducer,
  warehouseDeleteReducer,
  warehouseInventoryReducer,
  warehouseStatsReducer,
  warehouseSetPrimaryReducer,
  warehouseStockListReducer,
  warehouseStockDetailsReducer,
  warehouseStockLowReducer,
  warehouseStockOutReducer,
  warehouseStockReorderReducer,
  warehouseStockAdjustReducer,
  warehouseStockReserveReducer,
  stockMovementListReducer,
  stockMovementDetailsReducer,
  stockMovementCreateReducer,
  stockMovementSummaryReducer,
  stockMovementExportReducer,
  inventoryTransferListReducer,
  inventoryTransferDetailsReducer,
  inventoryTransferCreateReducer,
  inventoryTransferApproveReducer,
  inventoryTransferShipReducer,
  inventoryTransferReceiveReducer,
  inventoryTransferCancelReducer,
  stockAlertListReducer,
  stockAlertDetailsReducer,
  stockAlertResolveReducer,
  stockAlertUnresolvedReducer,
  stockAlertCriticalReducer,
  stockCountListReducer,
  stockCountDetailsReducer,
  stockCountCreateReducer,
  stockCountStartReducer,
  stockCountRecordReducer,
  stockCountCompleteReducer,
  inventoryAnalyticsReducer,
  bulkInventoryUpdateReducer,
  inventoryFilterReducer,
} from './reducers/inventoryReducers';

const reducer = combineReducers({
  cart: cartReducer,
   // Product reducers
  productList: productListReducer,
  productDetails: productDetailsReducer,
  productCreate: productCreateReducer,
  productUpdate: productUpdateReducer,
  productDelete: productDeleteReducer,
  featuredProducts: featuredProductsReducer,
  onSaleProducts: onSaleProductsReducer,
  newArrivalProducts: newArrivalProductsReducer,
  bestsellerProducts: bestsellerProductsReducer,
  relatedProducts: relatedProductsReducer,
  searchProducts: searchProductsReducer,

  // Category reducers
  categoryList: categoryListReducer,
  categoryDetails: categoryDetailsReducer,
  categoryProducts: categoryProductsReducer,
  categoryCreate: categoryCreateReducer,
  categoryUpdate: categoryUpdateReducer,
  categoryDelete: categoryDeleteReducer,

  // Brand reducers
  brandList: brandListReducer,
  brandDetails: brandDetailsReducer,
  brandProducts: brandProductsReducer,
  brandCreate: brandCreateReducer,
  brandUpdate: brandUpdateReducer,
  brandDelete: brandDeleteReducer,

  // Review reducers
  reviewList: reviewListReducer,
  reviewCreate: reviewCreateReducer,
  reviewUpdate: reviewUpdateReducer,
  reviewDelete: reviewDeleteReducer,
  myReviews: myReviewsReducer,
  reviewMarkHelpful: reviewMarkHelpfulReducer,

  // Product Image reducers
  productImageAdd: productImageAddReducer,
  productImageUpdate: productImageUpdateReducer,
  productImageDelete: productImageDeleteReducer,

  // Filter reducer
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
  // Password reset reducers
  passwordReset: passwordResetReducer,
  passwordResetVerify: passwordResetVerifyReducer,
  passwordResetConfirm: passwordResetConfirmReducer,

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

  // M-Pesa Payment reducers
  mpesaConfigList: mpesaConfigListReducer,
  mpesaConfigDetails: mpesaConfigDetailsReducer,
  mpesaConfigSetDefault: mpesaConfigSetDefaultReducer,
  mpesaConfigTest: mpesaConfigTestReducer,
  mpesaTransactionList: mpesaTransactionListReducer,
  mpesaTransactionDetails: mpesaTransactionDetailsReducer,
  myMpesaTransactions: myMpesaTransactionsReducer,
  mpesaTransactionRetry: mpesaTransactionRetryReducer,
  mpesaTransactionStats: mpesaTransactionStatsReducer,
  mpesaPaymentInitiate: mpesaPaymentInitiateReducer,
  mpesaPaymentStatus: mpesaPaymentStatusReducer,
  mpesaRefundList: mpesaRefundListReducer,
  mpesaRefundDetails: mpesaRefundDetailsReducer,
  mpesaRefundProcess: mpesaRefundProcessReducer,
  mpesaPaymentMethodList: mpesaPaymentMethodListReducer,
  mpesaPaymentMethodCreate: mpesaPaymentMethodCreateReducer,
  mpesaPaymentMethodDelete: mpesaPaymentMethodDeleteReducer,
  mpesaPaymentMethodSetDefault: mpesaPaymentMethodSetDefaultReducer,
  mpesaFilters: mpesaFilterReducer,

  // Inventory reducers
  warehouseList: warehouseListReducer,
  warehouseDetails: warehouseDetailsReducer,
  warehouseCreate: warehouseCreateReducer,
  warehouseUpdate: warehouseUpdateReducer,
  warehouseDelete: warehouseDeleteReducer,
  warehouseInventory: warehouseInventoryReducer,
  warehouseStats: warehouseStatsReducer,
  warehouseSetPrimary: warehouseSetPrimaryReducer,
  warehouseStockList: warehouseStockListReducer,
  warehouseStockDetails: warehouseStockDetailsReducer,
  warehouseStockLow: warehouseStockLowReducer,
  warehouseStockOut: warehouseStockOutReducer,
  warehouseStockReorder: warehouseStockReorderReducer,
  warehouseStockAdjust: warehouseStockAdjustReducer,
  warehouseStockReserve: warehouseStockReserveReducer,
  stockMovementList: stockMovementListReducer,
  stockMovementDetails: stockMovementDetailsReducer,
  stockMovementCreate: stockMovementCreateReducer,
  stockMovementSummary: stockMovementSummaryReducer,
  stockMovementExport: stockMovementExportReducer,
  inventoryTransferList: inventoryTransferListReducer,
  inventoryTransferDetails: inventoryTransferDetailsReducer,
  inventoryTransferCreate: inventoryTransferCreateReducer,
  inventoryTransferApprove: inventoryTransferApproveReducer,
  inventoryTransferShip: inventoryTransferShipReducer,
  inventoryTransferReceive: inventoryTransferReceiveReducer,
  inventoryTransferCancel: inventoryTransferCancelReducer,
  stockAlertList: stockAlertListReducer,
  stockAlertDetails: stockAlertDetailsReducer,
  stockAlertResolve: stockAlertResolveReducer,
  stockAlertUnresolved: stockAlertUnresolvedReducer,
  stockAlertCritical: stockAlertCriticalReducer,
  stockCountList: stockCountListReducer,
  stockCountDetails: stockCountDetailsReducer,
  stockCountCreate: stockCountCreateReducer,
  stockCountStart: stockCountStartReducer,
  stockCountRecord: stockCountRecordReducer,
  stockCountComplete: stockCountCompleteReducer,
  inventoryAnalytics: inventoryAnalyticsReducer,
  bulkInventoryUpdate: bulkInventoryUpdateReducer,
  inventoryFilters: inventoryFilterReducer,
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
    userInfo: userInfoFromStorage ,
    loading: false,
    error: null},
}


const middleware = [thunk];

const store = createStore(
  reducer,
  initialState,
  composeWithDevTools(applyMiddleware(...middleware))
);

export default store;