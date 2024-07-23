import {
  legacy_createStore as createStore,
  combineReducers,
  applyMiddleware,
} from 'redux'
import {thunk} from 'redux-thunk'
import {composeWithDevTools} from 'redux-devtools-extension'
// Reducers
import {
  productDetailsReducer,
  productListReducer,
  productCreateReviewReducer,
  productCreateReducer,
  productUpdateReducer,
  productDeleteReducer,
} from './reducers/productReducers'
import {
  userDeleteReducer,
  userDetailsReducer,
  userListReducer,
  userSigninReducer,
  userSignupReducer,
  userUpdateProfileReducer,
  userUpdateReducer,
} from './reducers/userReducers'
import {cartReducer} from './reducers/cartReducers'

const reducer = combineReducers({
  productList: productListReducer,
  productDetails: productDetailsReducer,
  productCreateReview: productCreateReviewReducer,
  productCreate: productCreateReducer,
  productUpdate: productUpdateReducer,
  productDelete: productDeleteReducer,
  userSignin: userSigninReducer,
  userSignup: userSignupReducer,
  userDetails: userDetailsReducer,
  userUpdateProfile: userUpdateProfileReducer,
  userList: userListReducer,
  userUpdate: userUpdateReducer,
  userDelete: userDeleteReducer,
  cart: cartReducer,
})

const cartItemsFromStorage = localStorage.getItem('cartItems')
  ? JSON.parse(localStorage.getItem('cartItems'))
  : []

const userInfoFromStorage = localStorage.getItem('userInfo')
  ? JSON.parse(localStorage.getItem('userInfo'))
  : null

const shippingAddressFromStorage = localStorage.getItem('shippingAddress')
  ? JSON.parse(localStorage.getItem('shippingAddress'))
  : {}

const initialState = {
  cart: {
    cartItems: cartItemsFromStorage,
    shippingAddress: shippingAddressFromStorage,
  },
  userSignin: {userInfo: userInfoFromStorage},
}

const middleware = [thunk]

const store = createStore(
  reducer,
  initialState,
  composeWithDevTools(applyMiddleware(...middleware))
)

export default store
