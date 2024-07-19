import {
  legacy_createStore as createStore,
  combineReducers,
  applyMiddleware,
} from 'redux'
import {thunk} from 'redux-thunk'
import {composeWithDevTools} from 'redux-devtools-extension'
// Reducers
import {productListReducer} from './reducers/productReducers'
import {userSigninReducer, userSignupReducer} from './reducers/userReducers'

const reducer = combineReducers({
  productList: productListReducer,
  userSignin: userSigninReducer,
  userSignup: userSignupReducer,
})

const userInfoFromStorage = localStorage.getItem('userInfo')
  ? JSON.parse(localStorage.getItem('userInfo'))
  : null

const initialState = {
  userSignin: {userInfo: userInfoFromStorage},
}

const middleware = [thunk]

const store = createStore(
  reducer,
  initialState,
  composeWithDevTools(applyMiddleware(...middleware))
)

export default store
