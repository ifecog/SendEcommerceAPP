import React, {useState, useEffect} from 'react'
import {Link, useNavigate, useParams} from 'react-router-dom'
import {ListGroup, Row, Col, Image, Card, Button} from 'react-bootstrap'
import {useDispatch, useSelector} from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import {
  getOrderDetails,
  deliverOrder,
  createPaypalPayment,
} from '../actions/orderActions'
import {ORDER_DELIVERY_RESET} from '../constants/orderConstants'

function OrderScreen() {
  const {id: uuid} = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const orderDetails = useSelector((state) => state.orderDetails)
  const {order, loading, error} = orderDetails

  const orderDelivery = useSelector((state) => state.orderDelivery)
  const {loading: loadingDelivery, success: successDelivery} = orderDelivery

  const userSignin = useSelector((state) => state.userSignin)
  const {userInfo} = userSignin

  const paypalPayment = useSelector((state) => state.paypalPayment)
  const {
    loading: loadingPaypal,
    success: successPaypal,
    paymentInfo,
    error: errorPaypal,
  } = paypalPayment

  if (!loading && !error) {
    order.itemsPrice = order.orderItems
      .reduce((acc, item) => acc + item.price * item.qty, 0)
      .toFixed(2)
  }

  useEffect(() => {
    if (!userInfo) {
      navigate('/signin')
    }
    console.log('Order UUID:', uuid)
    if (!order || order.uuid !== uuid || successDelivery || successPaypal) {
      dispatch({type: ORDER_DELIVERY_RESET})
      dispatch(getOrderDetails(uuid))
    }
  }, [
    navigate,
    userInfo,
    order,
    dispatch,
    uuid,
    successDelivery,
    successPaypal,
  ])

  const deliveryHandler = () => {
    dispatch(deliverOrder(order))
  }

  const paypalPaymentHandler = async () => {
    const paypalPayment = await dispatch(createPaypalPayment(order.uuid))
    if (paypalPayment.approval_url) {
      window.location.href = paypalPayment.approval_url
    }
  }

  return loading ? (
    <Loader />
  ) : error ? (
    <Message variant='danger'>{error}</Message>
  ) : (
    <div>
      <h1>Order {order.uuid}</h1>
      <Row>
        <Col md={8}>
          <ListGroup variant='flush'>
            <ListGroup.Item>
              <h2>Delivery Details</h2>
              <p>
                <strong>Name: {order.user.name}</strong>
              </p>
              <p>
                <strong>
                  <a href={`mailto:${order.user.email}`}>
                    Email: {order.user.email}
                  </a>
                </strong>
              </p>
              <p>Shipping Address: {order.shippingAddress.address}.</p>
              <p>Address Note: {order.shippingAddress.address_note}.</p>
              {order.is_delivered ? (
                <Message variant='success'>
                  Delivery Date: {order.delivery_time}
                </Message>
              ) : (
                <Message variant='warning'>Pending Delivery</Message>
              )}
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Payment</h2>
              <p>Option: {order.payment_method}</p>
              {order.is_paid ? (
                <Message variant='success'>
                  Payment Date: {order.payment_time}
                </Message>
              ) : (
                <Message variant='warning'>Pending Payment</Message>
              )}
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Order Items</h2>
              {order.orderItems.length === 0 ? (
                <Message variant='info'>Order is empty</Message>
              ) : (
                <ListGroup variant='flush'>
                  {order.orderItems.map((item, index) => (
                    <ListGroup.Item key={index}>
                      <Row className='align-items-center'>
                        <Col md={2}>
                          <Link to={`/product/${item.product}`}>
                            <Image
                              src={item.image_a}
                              alt={item.name}
                              fluid
                              rounded
                            />
                          </Link>
                        </Col>
                        <Col>
                          <Link to={`/product/${item.product}`}>
                            {item.name}
                          </Link>
                        </Col>
                        <Col md={4}>
                          {item.qty} x ${item.price} = $
                          {(item.qty * item.price).toFixed(2)}
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </ListGroup.Item>
          </ListGroup>
        </Col>

        <Col md={4}>
          <Card>
            <ListGroup variant='flush'>
              <ListGroup.Item>
                <h2>Order Summary</h2>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Items:</Col>
                  <Col>${order.itemsPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Shipping:</Col>
                  <Col>${order.shipping_price}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Tax:</Col>
                  <Col>${order.tax_price}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Total:</Col>
                  <Col>${order.total_price}</Col>
                </Row>
              </ListGroup.Item>
              {order.payment_method === 'PayPal' && !order.is_paid && (
                <ListGroup.Item>
                  {loadingPaypal ? (
                    <Loader />
                  ) : errorPaypal ? (
                    <Message variant='danger'>{errorPaypal}</Message>
                  ) : (
                    <Button
                      type='button'
                      className='btn btn-primary'
                      onClick={paypalPaymentHandler}
                    >
                      Pay with PayPal
                    </Button>
                  )}
                </ListGroup.Item>
              )}
            </ListGroup>

            {loadingDelivery && <Loader />}
            {userInfo &&
              userInfo.isAdmin &&
              order.is_paid &&
              !order.is_delivered && (
                <ListGroup.Item>
                  <Button
                    type='button'
                    className='btn-block'
                    onClick={deliveryHandler}
                  >
                    Mark as Delivered
                  </Button>
                </ListGroup.Item>
              )}
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default OrderScreen
