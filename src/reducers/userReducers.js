import {
  // user signin/signout
  USER_SIGNIN_REQUEST,
  USER_SIGNIN_SUCCESS,
  USER_SIGNIN_FAIL,
  USER_SIGNOUT,
  // User signup
  USER_SIGNUP_REQUEST,
  USER_SIGNUP_SUCCESS,
  USER_SIGNUP_FAIL,
  // user details
  USER_DETAILS_REQUEST,
  USER_DETAILS_SUCCESS,
  USER_DETAILS_FAIL,
  USER_DETAILS_RESET,
  // user update
  USER_UPDATE_PROFILE_REQUEST,
  USER_UPDATE_PROFILE_SUCCESS,
  USER_UPDATE_PROFILE_FAIL,
  USER_UPDATE_PROFILE_RESET,
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

export const userSigninReducer = (state = {}, action) => {
  switch (action.type) {
    case USER_SIGNIN_REQUEST:
      return {
        loading: true,
      }

    case USER_SIGNIN_SUCCESS:
      return {
        loading: false,
        userInfo: action.payload,
      }

    case USER_SIGNIN_FAIL:
      return {
        loading: false,
        error: action.payload,
      }

    case USER_SIGNOUT:
      return {}

    default:
      return state
  }
}

export const userSignupReducer = (state = {}, action) => {
  switch (action.type) {
    case USER_SIGNUP_REQUEST:
      return {
        loading: true,
      }

    case USER_SIGNUP_SUCCESS:
      return {
        loading: false,
        userInfo: action.payload,
      }

    case USER_SIGNUP_FAIL:
      return {
        loading: false,
        error: action.payload,
      }

    case USER_SIGNOUT:
      return {}

    default:
      return state
  }
}

export const userDetailsReducer = (state = {user: {}}, action) => {
  switch (action.type) {
    case USER_DETAILS_REQUEST:
      return {...state, loading: true}

    case USER_DETAILS_SUCCESS:
      return {loading: false, user: action.payload}

    case USER_DETAILS_FAIL:
      return {loading: false, error: action.payload}

    case USER_DETAILS_RESET:
      return {user: {}}

    default:
      return state
  }
}

export const userUpdateProfileReducer = (state = {}, action) => {
  switch (action.type) {
    case USER_UPDATE_PROFILE_REQUEST:
      return {loading: true}

    case USER_UPDATE_PROFILE_SUCCESS:
      return {loading: false, userInfo: action.payload}

    case USER_UPDATE_PROFILE_FAIL:
      return {loading: false, success: true, error: action.payload}

    case USER_UPDATE_PROFILE_RESET:
      return {}

    default:
      return state
  }
}
