import axios from 'axios'
import {
  // create order
  ORDER_CREATE_REQUEST,
  ORDER_CREATE_SUCCESS,
  ORDER_CREATE_FAIL,
  // order details
  ORDER_DETAILS_REQUEST,
  ORDER_DETAILS_SUCCESS,
  ORDER_DETAILS_FAIL,
  // order pay
  ORDER_PAY_REQUEST,
  ORDER_PAY_SUCCESS,
  ORDER_PAY_FAIL,
  // order delivery
  ORDER_DELIVERY_REQUEST,
  ORDER_DELIVERY_SUCCESS,
  ORDER_DELIVERY_FAIL,
  // list my orders
  ORDER_LIST_MY_REQUEST,
  ORDER_LIST_MY_SUCCESS,
  ORDER_LIST_MY_FAIL,
  // admin order list
  ORDER_LIST_REQUEST,
  ORDER_LIST_SUCCESS,
  ORDER_LIST_FAIL,
} from '../constants/orderConstants'
import {CART_CLEAR_ITEMS} from '../constants/cartConstants'

export const createOrder = (order) => async (dispatch, getState) => {
  try {
    dispatch({
      type: ORDER_CREATE_REQUEST,
    })

    const {
      userLogin: {userInfo},
    } = getState()

    const config = {
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${userInfo.token}`,
      },
    }

    const {data} = await axios.post('/api/orders/add/', order, config)

    dispatch({
      type: ORDER_CREATE_SUCCESS,
      payload: data,
    })

    dispatch({
      type: CART_CLEAR_ITEMS,
      payload: data,
    })

    localStorage.removeItem('cartItems')
  } catch (error) {
    dispatch({
      type: ORDER_CREATE_FAIL,
      payload:
        error.response && error.response.data.detail
          ? error.response.data.detail
          : error.message,
    })
  }
}
