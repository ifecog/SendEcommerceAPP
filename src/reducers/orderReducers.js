import {
  // create order
  ORDER_CREATE_REQUEST,
  ORDER_CREATE_SUCCESS,
  ORDER_CREATE_FAIL,
  ORDER_CREATE_RESET,
  // order details
  ORDER_DETAILS_REQUEST,
  ORDER_DETAILS_SUCCESS,
  ORDER_DETAILS_FAIL,
  // order payment
  ORDER_PAY_REQUEST,
  ORDER_PAY_SUCCESS,
  ORDER_PAY_FAIL,
  ORDER_PAY_RESET,
  // order delivery
  ORDER_DELIVERY_REQUEST,
  ORDER_DELIVERY_SUCCESS,
  ORDER_DELIVERY_FAIL,
  ORDER_DELIVERY_RESET,
  // list my orders
  ORDER_LIST_MY_REQUEST,
  ORDER_LIST_MY_SUCCESS,
  ORDER_LIST_MY_FAIL,
  ORDER_LIST_MY_RESET,
  // admin order list
  ORDER_LIST_REQUEST,
  ORDER_LIST_SUCCESS,
  ORDER_LIST_FAIL,
  PAYPAL_PAYMENT_REQUEST,
  PAYPAL_PAYMENT_SUCCESS,
  PAYPAL_PAYMENT_FAIL,
} from '../constants/orderConstants'

export const orderCreateReducer = (state = {}, action) => {
  switch (action.type) {
    case ORDER_CREATE_REQUEST:
      return {
        loading: true,
      }

    case ORDER_CREATE_SUCCESS:
      return {
        loading: false,
        success: true,
        order: action.payload,
      }

    case ORDER_CREATE_FAIL:
      return {
        loading: false,
        error: action.payload,
      }

    case ORDER_CREATE_RESET:
      return {}

    default:
      return state
  }
}

export const orderDetailsReducer = (
  state = {loading: true, orderItems: [], shippingAddress: {}},
  action
) => {
  switch (action.type) {
    case ORDER_DETAILS_REQUEST:
      return {
        ...state,
        loading: true,
      }

    case ORDER_DETAILS_SUCCESS:
      return {
        loading: false,
        order: action.payload,
      }

    case ORDER_DETAILS_FAIL:
      return {
        loading: false,
        error: action.payload,
      }

    default:
      return state
  }
}

export const paypalPaymentReducer = (state = {}, action) => {
  switch (action.type) {
    case PAYPAL_PAYMENT_REQUEST:
      return {loading: true}
    case PAYPAL_PAYMENT_SUCCESS:
      return {loading: false, success: true, paymentInfo: action.payload}
    case PAYPAL_PAYMENT_FAIL:
      return {loading: false, error: action.payload}
    default:
      return state
  }
}

export const orderPayReducer = (state = {}, action) => {
  switch (action.type) {
    case ORDER_PAY_REQUEST:
      return {loading: true}
    case ORDER_PAY_SUCCESS:
      return {loading: false, success: true}
    case ORDER_PAY_FAIL:
      return {loading: false, error: action.payload}
    case ORDER_PAY_RESET:
      return {}
    default:
      return state
  }
}

export const orderDeliveryReducer = (state = {}, action) => {
  switch (action.type) {
    case ORDER_DELIVERY_REQUEST:
      return {
        loading: true,
      }

    case ORDER_DELIVERY_SUCCESS:
      return {
        loading: false,
        success: true,
      }

    case ORDER_DELIVERY_FAIL:
      return {
        loading: false,
        error: action.payload,
      }

    case ORDER_DELIVERY_RESET:
      return {}

    default:
      return state
  }
}
