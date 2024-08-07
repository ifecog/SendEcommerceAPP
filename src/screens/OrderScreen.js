import React, {useState, useEffect} from 'react'
import {Link, useNavigate, useParams} from 'react-router-dom'
import {ListGroup, Row, Col, Image, Card, Button} from 'react-bootstrap'
import {useDispatch, useSelector} from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import axios from 'axios'
import {
  getOrderDetails,
  deliverOrder,
  createPaypalPayment,
  dispatchOrder,
} from '../actions/orderActions'
import {
  ORDER_DELIVERY_RESET,
  ORDER_DISPATCH_RESET,
} from '../constants/orderConstants'

function OrderScreen() {
  const {id: uuid} = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const orderDetails = useSelector((state) => state.orderDetails)
  const {order, loading, error} = orderDetails

  const orderDelivery = useSelector((state) => state.orderDelivery)
  const {loading: loadingDelivery, success: successDelivery} = orderDelivery

  const orderDispatch = useSelector((state) => state.orderDispatch)
  const {loading: loadingDispatch, success: successDispatch} = orderDispatch

  const userSignin = useSelector((state) => state.userSignin)
  const {userInfo} = userSignin

  const paypalPayment = useSelector((state) => state.paypalPayment)
  const {
    loading: loadingPaypal,
    success: successPaypal,
    paymentInfo,
    error: errorPaypal,
  } = paypalPayment

  const [send24Shipping, setSend24Shipping] = useState(false)

  useEffect(() => {
    const send24ShippingOption =
      localStorage.getItem('send24Shipping') === 'true'
    setSend24Shipping(send24ShippingOption)
  }, [])

  useEffect(() => {
    if (!userInfo) {
      navigate('/signin')
    }

    if (
      !order ||
      order.uuid !== uuid ||
      successDelivery ||
      successPaypal ||
      successDispatch
    ) {
      dispatch({type: ORDER_DELIVERY_RESET})
      dispatch({type: ORDER_DISPATCH_RESET})
      dispatch(getOrderDetails(uuid))
    } else if (order.send24Shipping) {
      setSend24Shipping(true)
    }
  }, [
    navigate,
    userInfo,
    order,
    dispatch,
    uuid,
    successDelivery,
    successPaypal,
    successDispatch,
  ])

  const deliveryHandler = () => {
    dispatch(deliverOrder(order))
  }

  const dispatchHandler = async () => {
    if (send24Shipping) {
      const send24OrderData = {
        pickup_address:
          'UNILAG Senate Building, UNILAG Senate Building, Otunba Payne St, Akoka, Lagos 101245, Lagos, Nigeria',
        pickup_coordinates: '6.5194683, 3.3987129',
        destination_address: order.shippingAddress.address,
        destination_coordinates: `${order.shippingAddress.latitude}, ${order.shippingAddress.longitude}`,
        size_id: '68882080-9cb3-11ed-a1e0-1b525c297de0',
        label: order.orderItems[0].name,
        package_note: order.orderItems[0].description,
        is_fragile: 0,
        name: userInfo.name,
        phone: userInfo.phone_number,
        email: userInfo.email,
        recipient_note:
          'Quia itaque incidunt distinctio qui blanditiis voluptate quis fugiat alias.',
        destination_state: order.shippingAddress.state,
        destination_local_government: 'Lagelu',
        pickup_state: 'Lagos',
        variant: 'HUB_TO_DOOR',
        origin_hub_id: '32b51d10-8eaf-11ee-8032-37c06d0259ca',
        images: [order.orderItems[0].image],
      }

      try {
        const config = {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer 1936|220En9Wf2ne2r0CtVO6XL2bGY8iCq11NK3Q1PmWX`,
          },
        }

        await axios.post(
          'https://dev.dilivva.com.ng/api/v1/corporates/orders/',
          send24OrderData,
          config
        )
      } catch (error) {
        console.error('Send24 Order Creation Error:', error)
      }
    }

    dispatch(dispatchOrder(order))
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

              {loadingDispatch && <Loader />}

              {userInfo &&
                userInfo.isAdmin &&
                order.is_paid &&
                !order.is_available_for_dispatch && (
                  <ListGroup.Item>
                    <Button
                      type='button'
                      className='btn-block'
                      onClick={dispatchHandler}
                    >
                      Dispatch for Delivery
                    </Button>
                  </ListGroup.Item>
                )}

              {loadingDelivery && <Loader />}

              {userInfo &&
                userInfo.isAdmin &&
                order.is_paid &&
                order.is_available_for_dispatch &&
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
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default OrderScreen
