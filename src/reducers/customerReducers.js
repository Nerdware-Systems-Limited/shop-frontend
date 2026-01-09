import {
  USER_LOGIN_REQUEST,
  USER_LOGIN_SUCCESS,
  USER_LOGIN_FAIL,
  USER_LOGOUT,
  USER_REGISTER_REQUEST,
  USER_REGISTER_SUCCESS,
  USER_REGISTER_FAIL,
  USER_DETAILS_REQUEST,
  USER_DETAILS_SUCCESS,
  USER_DETAILS_FAIL,
  USER_DETAILS_RESET,
  USER_UPDATE_PROFILE_REQUEST,
  USER_UPDATE_PROFILE_SUCCESS,
  USER_UPDATE_PROFILE_FAIL,
  USER_UPDATE_PROFILE_RESET,
  USER_CHANGE_PASSWORD_REQUEST,
  USER_CHANGE_PASSWORD_SUCCESS,
  USER_CHANGE_PASSWORD_FAIL,
  USER_CHANGE_PASSWORD_RESET,
  ADDRESS_LIST_REQUEST,
  ADDRESS_LIST_SUCCESS,
  ADDRESS_LIST_FAIL,
  ADDRESS_DETAILS_REQUEST,
  ADDRESS_DETAILS_SUCCESS,
  ADDRESS_DETAILS_FAIL,
  ADDRESS_DETAILS_RESET,
  ADDRESS_CREATE_REQUEST,
  ADDRESS_CREATE_SUCCESS,
  ADDRESS_CREATE_FAIL,
  ADDRESS_CREATE_RESET,
  ADDRESS_UPDATE_REQUEST,
  ADDRESS_UPDATE_SUCCESS,
  ADDRESS_UPDATE_FAIL,
  ADDRESS_UPDATE_RESET,
  ADDRESS_DELETE_REQUEST,
  ADDRESS_DELETE_SUCCESS,
  ADDRESS_DELETE_FAIL,
  ADDRESS_SET_DEFAULT_REQUEST,
  ADDRESS_SET_DEFAULT_SUCCESS,
  ADDRESS_SET_DEFAULT_FAIL,
  LOYALTY_POINTS_ADD_REQUEST,
  LOYALTY_POINTS_ADD_SUCCESS,
  LOYALTY_POINTS_ADD_FAIL,
  PASSWORD_RESET_REQUEST,
  PASSWORD_RESET_SUCCESS,
  PASSWORD_RESET_FAIL,
  PASSWORD_RESET_RESET,
  PASSWORD_RESET_VERIFY_REQUEST,
  PASSWORD_RESET_VERIFY_SUCCESS,
  PASSWORD_RESET_VERIFY_FAIL,
  PASSWORD_RESET_VERIFY_RESET,
  PASSWORD_RESET_CONFIRM_REQUEST,
  PASSWORD_RESET_CONFIRM_SUCCESS,
  PASSWORD_RESET_CONFIRM_FAIL,
  PASSWORD_RESET_CONFIRM_RESET,
} from '../constants/customerConstants';

// User login reducer
export const userLoginReducer = (state = {}, action) => {
  switch (action.type) {
    case USER_LOGIN_REQUEST:
      return { loading: true };
    case USER_LOGIN_SUCCESS:
      return { loading: false, userInfo: action.payload };
    case USER_LOGIN_FAIL:
      return { loading: false, error: action.payload };
    case USER_LOGOUT:
      return {};
    default:
      return state;
  }
};

// User register reducer
export const userRegisterReducer = (state = {}, action) => {
  switch (action.type) {
    case USER_REGISTER_REQUEST:
      return { loading: true };
    case USER_REGISTER_SUCCESS:
      return { loading: false, userInfo: action.payload };
    case USER_REGISTER_FAIL:
      return { loading: false, error: action.payload };
    case USER_LOGOUT:
      return {};
    default:
      return state;
  }
};

// User details reducer
export const userDetailsReducer = (state = { user: {} }, action) => {
  switch (action.type) {
    case USER_DETAILS_REQUEST:
      return { ...state, loading: true };
    case USER_DETAILS_SUCCESS:
      return { loading: false, user: action.payload };
    case USER_DETAILS_FAIL:
      return { loading: false, error: action.payload };
    case USER_DETAILS_RESET:
      return { user: {} };
    default:
      return state;
  }
};

// User update profile reducer
export const userUpdateProfileReducer = (state = {}, action) => {
  switch (action.type) {
    case USER_UPDATE_PROFILE_REQUEST:
      return { loading: true };
    case USER_UPDATE_PROFILE_SUCCESS:
      return { loading: false, success: true, userInfo: action.payload };
    case USER_UPDATE_PROFILE_FAIL:
      return { loading: false, error: action.payload };
    case USER_UPDATE_PROFILE_RESET:
      return {};
    default:
      return state;
  }
};

// User change password reducer
export const userChangePasswordReducer = (state = {}, action) => {
  switch (action.type) {
    case USER_CHANGE_PASSWORD_REQUEST:
      return { loading: true };
    case USER_CHANGE_PASSWORD_SUCCESS:
      return { loading: false, success: true };
    case USER_CHANGE_PASSWORD_FAIL:
      return { loading: false, error: action.payload };
    case USER_CHANGE_PASSWORD_RESET:
      return {};
    default:
      return state;
  }
};

// Address list reducer
export const addressListReducer = (state = { addresses: [] }, action) => {
  switch (action.type) {
    case ADDRESS_LIST_REQUEST:
      return { loading: true, addresses: [] };
    case ADDRESS_LIST_SUCCESS:
      return { loading: false, addresses: action.payload };
    case ADDRESS_LIST_FAIL:
      return { loading: false, error: action.payload, addresses: [] };
    default:
      return state;
  }
};

// Address details reducer
export const addressDetailsReducer = (state = { address: {} }, action) => {
  switch (action.type) {
    case ADDRESS_DETAILS_REQUEST:
      return { ...state, loading: true };
    case ADDRESS_DETAILS_SUCCESS:
      return { loading: false, address: action.payload };
    case ADDRESS_DETAILS_FAIL:
      return { loading: false, error: action.payload };
    case ADDRESS_DETAILS_RESET:
      return { address: {} };
    default:
      return state;
  }
};

// Address create reducer
export const addressCreateReducer = (state = {}, action) => {
  switch (action.type) {
    case ADDRESS_CREATE_REQUEST:
      return { loading: true };
    case ADDRESS_CREATE_SUCCESS:
      return { loading: false, success: true, address: action.payload };
    case ADDRESS_CREATE_FAIL:
      return { loading: false, error: action.payload };
    case ADDRESS_CREATE_RESET:
      return {};
    default:
      return state;
  }
};

// Address update reducer
export const addressUpdateReducer = (state = {}, action) => {
  switch (action.type) {
    case ADDRESS_UPDATE_REQUEST:
      return { loading: true };
    case ADDRESS_UPDATE_SUCCESS:
      return { loading: false, success: true, address: action.payload };
    case ADDRESS_UPDATE_FAIL:
      return { loading: false, error: action.payload };
    case ADDRESS_UPDATE_RESET:
      return {};
    default:
      return state;
  }
};

// Address delete reducer
export const addressDeleteReducer = (state = {}, action) => {
  switch (action.type) {
    case ADDRESS_DELETE_REQUEST:
      return { loading: true };
    case ADDRESS_DELETE_SUCCESS:
      return { loading: false, success: true };
    case ADDRESS_DELETE_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

// Address set default reducer
export const addressSetDefaultReducer = (state = {}, action) => {
  switch (action.type) {
    case ADDRESS_SET_DEFAULT_REQUEST:
      return { loading: true };
    case ADDRESS_SET_DEFAULT_SUCCESS:
      return { loading: false, success: true, address: action.payload };
    case ADDRESS_SET_DEFAULT_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

// Loyalty points add reducer
export const loyaltyPointsAddReducer = (state = {}, action) => {
  switch (action.type) {
    case LOYALTY_POINTS_ADD_REQUEST:
      return { loading: true };
    case LOYALTY_POINTS_ADD_SUCCESS:
      return { loading: false, success: true, data: action.payload };
    case LOYALTY_POINTS_ADD_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

// Password reset request reducer
export const passwordResetReducer = (state = {}, action) => {
  switch (action.type) {
    case PASSWORD_RESET_REQUEST:
      return { loading: true };
    case PASSWORD_RESET_SUCCESS:
      return { loading: false, success: true, message: action.payload.message };
    case PASSWORD_RESET_FAIL:
      return { loading: false, error: action.payload };
    case PASSWORD_RESET_RESET:
      return {};
    default:
      return state;
  }
};

// Password reset code verify reducer
export const passwordResetVerifyReducer = (state = {}, action) => {
  switch (action.type) {
    case PASSWORD_RESET_VERIFY_REQUEST:
      return { loading: true };
    case PASSWORD_RESET_VERIFY_SUCCESS:
      return { 
        loading: false, 
        success: true, 
        uid: action.payload.uid,
        token: action.payload.token,
        code: action.payload.code,
        message: action.payload.message 
      };
    case PASSWORD_RESET_VERIFY_FAIL:
      return { loading: false, error: action.payload };
    case PASSWORD_RESET_VERIFY_RESET:
      return {};
    default:
      return state;
  }
};

// Password reset confirm reducer
export const passwordResetConfirmReducer = (state = {}, action) => {
  switch (action.type) {
    case PASSWORD_RESET_CONFIRM_REQUEST:
      return { loading: true };
    case PASSWORD_RESET_CONFIRM_SUCCESS:
      return { loading: false, success: true, message: action.payload.message };
    case PASSWORD_RESET_CONFIRM_FAIL:
      return { loading: false, error: action.payload };
    case PASSWORD_RESET_CONFIRM_RESET:
      return {};
    default:
      return state;
  }
};