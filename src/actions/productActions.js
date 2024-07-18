import axios from 'axios'
import {
  // products list
  PRODUCT_LIST_REQUEST,
  PRODUCT_LIST_SUCCESS,
  PRODUCT_LIST_FAIL,
  // // top rated products
  // PRODUCT_TOP_RATED_REQUEST,
  // PRODUCT_TOP_RATED_SUCCESS,
  // PRODUCT_TOP_RATED_FAIL,
  // // product details
  // PRODUCT_DETAILS_REQUEST,
  // PRODUCT_DETAILS_SUCCESS,
  // PRODUCT_DETAILS_FAIL,
  // // product reviews
  // PRODUCT_CREATE_REVIEW_REQUEST,
  // PRODUCT_CREATE_REVIEW_SUCCESS,
  // PRODUCT_CREATE_REVIEW_FAIL,
  // PRODUCT_CREATE_REVIEW_RESET,
  // // admin create products
  // PRODUCT_CREATE_REQUEST,
  // PRODUCT_CREATE_SUCCESS,
  // PRODUCT_CREATE_FAIL,
  // PRODUCT_CREATE_RESET,
  // // admin update products
  // PRODUCT_UPDATE_REQUEST,
  // PRODUCT_UPDATE_SUCCESS,
  // PRODUCT_UPDATE_FAIL,
  // PRODUCT_UPDATE_RESET,
  // // admin delete products
  // PRODUCT_DELETE_REQUEST,
  // PRODUCT_DELETE_SUCCESS,
  // PRODUCT_DELETE_FAIL,
} from '../constants/productConstants'

export const listProducts =
  (keyword = '') =>
  async (dispatch) => {
    try {
      dispatch({
        type: PRODUCT_LIST_REQUEST,
      })

      const {data} = await axios.get(`/api/products/${keyword}`)

      dispatch({
        type: PRODUCT_LIST_SUCCESS,
        payload: data,
      })
    } catch (error) {
      dispatch({
        type: PRODUCT_LIST_FAIL,
        payload:
          error.response && error.response.data.detail
            ? error.response.data.detail
            : error.message,
      })
    }
  }
