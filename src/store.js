import { createStore, combineReducers, applyMiddleware } from 'redux';
import { thunk } from 'redux-thunk';
import { composeWithDevTools } from '@redux-devtools/extension';
import {
  productListReducer,
  productDetailsReducer,
  categoryListReducer,
  brandListReducer,
  filterReducer,
  reviewCreateReducer,
} from './reducers/productReducers';

const reducer = combineReducers({
  productList: productListReducer,
  productDetails: productDetailsReducer,
  categoryList: categoryListReducer,
  brandList: brandListReducer,
  filters: filterReducer,
  reviewCreate: reviewCreateReducer,
});

const initialState = {};

const middleware = [thunk];

const store = createStore(
  reducer,
  initialState,
  composeWithDevTools(applyMiddleware(...middleware))
);

export default store;