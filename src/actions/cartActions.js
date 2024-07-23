import axios from 'axios'
import {
  CART_ADD_ITEM,
  CART_REMOVE_ITEM,
  CART_SAVE_SHIPPING_ADDRESS,
  CART_SAVE_PAYMENT_METHOD,
} from '../constants/cartConstants'

export const addToCart = (uuid, qty) => async (dispatch, getState) => {
  const {data} = await axios.get(`/api/products/${uuid}`)

  dispatch({
    type: CART_ADD_ITEM,
    payload: {
      product: data.uuid,
      name: data.name,
      image: data.image_a,
      price: data.discount_price,
      count_in_stock: data.count_in_stock,
      qty,
    },
  })

  localStorage.setItem('cartItems', JSON.stringify(getState().cart.cartItems))
}

export const RemoveFromCart = (uuid, qty) => (dispatch, getState) => {
  dispatch({
    type: CART_REMOVE_ITEM,
    payload: uuid,
  })
}

export const saveShippingAddress = (data) => (dispatch) => {
  dispatch({
    type: CART_SAVE_SHIPPING_ADDRESS,
    payload: data,
  })
  localStorage.setItem('shippingAddress', JSON.stringify(data))
}

export const savePaymentMethod = (data) => (dispatch) => {
  dispatch({
    type: CART_SAVE_PAYMENT_METHOD,
    payload: data,
  })
  localStorage.setItem('paymentMethod', JSON.stringify(data))
}
