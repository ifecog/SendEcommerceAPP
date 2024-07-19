import axios from 'axios'
import {
  // User signin/signout
  USER_SIGNIN_REQUEST,
  USER_SIGNIN_SUCCESS,
  USER_SIGNIN_FAIL,
  USER_SIGNOUT,
  // User signup
  USER_SIGNUP_REQUEST,
  USER_SIGNUP_SUCCESS,
  USER_SIGNUP_FAIL,
  // // user details
  // USER_DETAILS_REQUEST,
  // USER_DETAILS_SUCCESS,
  // USER_DETAILS_FAIL,
  // USER_DETAILS_RESET,
  // // user update
  // USER_UPDATE_PROFILE_REQUEST,
  // USER_UPDATE_PROFILE_SUCCESS,
  // USER_UPDATE_PROFILE_FAIL,
  // USER_UPDATE_PROFILE_RESET,
  // // admin users list
  // USER_LIST_REQUEST,
  // USER_LIST_SUCCESS,
  // USER_LIST_FAIL,
  // USER_LIST_RESET,
  // // admin user delete
  // USER_DELETE_REQUEST,
  // USER_DELETE_SUCCESS,
  // USER_DELETE_FAIL,
  // // admin update user
  // USER_UPDATE_REQUEST,
  // USER_UPDATE_SUCCESS,
  // USER_UPDATE_FAIL,
  // USER_UPDATE_RESET,
} from '../constants/userConstants'

export const signin = (email, password) => async (dispatch) => {
  try {
    dispatch({
      type: USER_SIGNIN_REQUEST,
    })

    const config = {
      headers: {
        'Content-type': 'application/json',
      },
    }

    const {data} = await axios.post(
      `/api/users/signin/`,
      {email: email, password: password},
      config
    )

    dispatch({
      type: USER_SIGNIN_SUCCESS,
      payload: data,
    })

    localStorage.setItem('userInfo', JSON.stringify(data))
  } catch (error) {
    dispatch({
      type: USER_SIGNIN_FAIL,
      payload:
        error.response && error.response.data.detail
          ? error.response.data.detail
          : error.message,
    })
  }
}

export const signout = () => (dispatch) => {
  localStorage.removeItem('userInfo')
  dispatch({
    type: USER_SIGNOUT,
  })
}

export const signup =
  (firstName, lastName, email, phoneNumber, password) => async (dispatch) => {
    try {
      dispatch({
        type: USER_SIGNUP_REQUEST,
      })

      const config = {
        headers: {
          'Content-type': 'application/json',
        },
      }

      const {data} = await axios.post(
        `/api/users/signup/`,
        {
          first_name: firstName,
          last_name: lastName,
          email: email,
          phone_number: phoneNumber,
          password: password,
        },
        config
      )

      dispatch({
        type: USER_SIGNUP_SUCCESS,
        payload: data,
      })

      dispatch({
        type: USER_SIGNIN_SUCCESS,
        payload: data,
      })

      localStorage.setItem('userInfo', JSON.stringify(data))
    } catch (error) {
      dispatch({
        type: USER_SIGNUP_FAIL,
        payload:
          error.response && error.response.data.detail
            ? error.response.data.detail
            : error.message,
      })
    }
  }
