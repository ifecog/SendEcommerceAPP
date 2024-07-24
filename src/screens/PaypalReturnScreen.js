import React, {useEffect} from 'react'
import {useNavigate, useLocation} from 'react-router-dom'
import {useDispatch, useSelector} from 'react-redux'
import {payOrder} from '../actions/orderActions'
import Message from '../components/Message'
import Loader from '../components/Loader'

function PaypalReturnScreen() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()

  const orderPay = useSelector((state) => state.orderPay)
  const {loading, success, error} = orderPay

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search)
    const paymentId = searchParams.get('paymentId')
    const PayerID = searchParams.get('PayerID')
    const orderUuid = searchParams.get('order_uuid')

    if (paymentId && PayerID && orderUuid) {
      dispatch(payOrder(paymentId, PayerID))
    } else {
      navigate('/')
    }
  }, [dispatch, location, navigate])

  useEffect(() => {
    if (success) {
      const searchParams = new URLSearchParams(location.search)
      const orderUuid = searchParams.get('order_uuid')
      navigate(`/order/${orderUuid}`)
    }
  }, [success, navigate, location])

  return (
    <div>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>{error}</Message>
      ) : null}
    </div>
  )
}

export default PaypalReturnScreen
