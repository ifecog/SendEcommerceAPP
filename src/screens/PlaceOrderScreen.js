import React, {useEffect, useState} from 'react'
import {Link, useNavigate} from 'react-router-dom'
import {ListGroup, Button, Row, Col, Image, Card, Form} from 'react-bootstrap'
import {useDispatch, useSelector} from 'react-redux'
import Message from '../components/Message'
import CheckoutSteps from '../components/CheckoutSteps'
import {createOrder} from '../actions/orderActions'
import {ORDER_CREATE_RESET} from '../constants/orderConstants'
import axios from 'axios'

function PlaceOrderScreen() {
  const [send24Shipping, setSend24Shipping] = useState(false)
  const [send24Prices, setSend24Prices] = useState(null)
  const [selectedSend24Price, setSelectedSend24Price] = useState(null)
  const [sizeIdMap, setSizeIdMap] = useState({})

  const orderCreate = useSelector((state) => state.orderCreate)
  const {order, error, success} = orderCreate

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const cart = useSelector((state) => state.cart)

  cart.itemsPrice = cart.cartItems
    .reduce((acc, item) => acc + item.price * item.qty, 0)
    .toFixed(2)

  // Default shipping price
  cart.shippingPrice = (cart.itemsPrice > 500 ? 0 : 10).toFixed(2)

  // Assuming an 8% sales tax
  cart.taxPrice = Number(0.08 * cart.itemsPrice).toFixed(2)

  cart.totalPrice = (
    Number(cart.itemsPrice) +
    Number(cart.shippingPrice) +
    Number(cart.taxPrice)
  ).toFixed(2)

  if (!cart.paymentMethod) {
    navigate('/payment')
  }

  useEffect(() => {
    if (success && order) {
      navigate(`/order/${order.uuid}`)
      dispatch({type: ORDER_CREATE_RESET})
    }
  }, [navigate, order, success, dispatch])

  useEffect(() => {
    const fetchSizeIds = async () => {
      const response = await axios.get(
        'https://dev.dilivva.com.ng/api/v1/sizes'
      )
      const sizes = response.data.data
      const sizeMap = {}
      sizes.forEach((size) => {
        sizeMap[size.name] = size.uuid
      })
      setSizeIdMap(sizeMap)
    }

    fetchSizeIds()
  }, [])

  useEffect(() => {
    if (send24Shipping) {
      const fetchSend24Prices = async () => {
        const size_id = '68882080-9cb3-11ed-a1e0-1b525c297de0'
        const is_fragile = 0
        // const is_fragile = cart.cartItems[0].is_fragile ? 1 : 0
        const pickup_coordinates = '6.892107747042948, 3.718155923471927'
        const pickup_state = 'Ogun'
        const destination_coordinates = `${cart.shippingAddress.latitude}, ${cart.shippingAddress.longitude}`
        const destination_state = cart.shippingAddress.state

        const response = await axios.post(
          'https://dev.dilivva.com.ng/api/v1/pricing',
          {
            size_id,
            pickup_coordinates,
            destination_coordinates,
            pickup_state,
            destination_state,
            is_fragile,
          }
        )

        setSend24Prices(response.data.data)
      }

      if (Object.keys(sizeIdMap).length > 0) {
        fetchSend24Prices()
      }
    } else {
      setSelectedSend24Price(null)
    }
  }, [send24Shipping, cart, sizeIdMap])

  const placeOrder = () => {
    if (cart.cartItems.length === 0) {
      alert('Your cart is empty')
      return
    }

    dispatch(
      createOrder({
        orderItems: cart.cartItems,
        shippingAddress: cart.shippingAddress,
        paymentMethod: cart.paymentMethod,
        itemsPrice: cart.itemsPrice,
        shippingPrice: selectedSend24Price || cart.shippingPrice,
        taxPrice: cart.taxPrice,
        totalPrice: (
          Number(cart.itemsPrice) +
          Number(selectedSend24Price || cart.shippingPrice) +
          Number(cart.taxPrice)
        ).toFixed(2),
      })
    )
  }

  return (
    <div>
      <CheckoutSteps step1 step2 step3 step4 />
      <Row>
        <Col md={8}>
          <ListGroup variant='flush'>
            <ListGroup.Item>
              <h2>Shipping</h2>
              <p>Address: {cart.shippingAddress.address + '.'}</p>
              <p>Address Note: {cart.shippingAddress.address_note + '.'}</p>
              <Form.Check
                type='checkbox'
                label='Use Send24 for shipping'
                checked={send24Shipping}
                onChange={() => setSend24Shipping(!send24Shipping)}
              />
              {send24Shipping && send24Prices && (
                <div>
                  <h3>Send24 Shipping Options</h3>
                  <ListGroup>
                    {send24Prices.map((option, index) => (
                      <ListGroup.Item key={index}>
                        <Row>
                          <Col>{Object.keys(option)[0]}</Col>
                          <Col>${option[Object.keys(option)[0]].price}</Col>
                          <Col>
                            <Button
                              type='button'
                              onClick={() =>
                                setSelectedSend24Price(
                                  option[Object.keys(option)[0]].price
                                )
                              }
                            >
                              Select
                            </Button>
                          </Col>
                        </Row>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                </div>
              )}
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Payment</h2>
              <p>Option: {cart.paymentMethod}</p>
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Order Items</h2>
              {cart.cartItems.length === 0 ? (
                <Message variant='info'>Your cart is empty</Message>
              ) : (
                <ListGroup variant='flush'>
                  {cart.cartItems.map((item, index) => (
                    <ListGroup.Item key={index}>
                      <Row className='align-items-center'>
                        <Col md={2}>
                          <Link to={`/product/${item.product}`}>
                            <Image
                              src={item.image}
                              alt={item.name}
                              fluid
                              rounded
                            />
                          </Link>
                        </Col>
                        <Col>
                          <Link
                            to={`/product/${item.product}`}
                            className='list-group-item-no-decoration'
                          >
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
                  <Col>Items: </Col>
                  <Col md={4}>${cart.itemsPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Shipping: </Col>
                  <Col md={4}>${selectedSend24Price || cart.shippingPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Tax: </Col>
                  <Col md={4}>${cart.taxPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Total: </Col>
                  <Col md={4}>
                    $
                    {(
                      Number(cart.itemsPrice) +
                      Number(selectedSend24Price || cart.shippingPrice) +
                      Number(cart.taxPrice)
                    ).toFixed(2)}
                  </Col>
                </Row>
              </ListGroup.Item>

              <ListGroup.Item>
                <Button
                  className='btn-block'
                  style={{width: '100%'}}
                  type='button'
                  variant='primary'
                  disabled={cart.cartItems.length === 0}
                  onClick={placeOrder}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      height: '100%',
                    }}
                  >
                    Place Order
                  </div>
                </Button>
              </ListGroup.Item>
            </ListGroup>
          </Card>
          <ListGroup variant='flush'>
            <ListGroup.Item>
              {error && <Message variant='danger'>{error}</Message>}
            </ListGroup.Item>
          </ListGroup>
        </Col>
      </Row>
    </div>
  )
}

export default PlaceOrderScreen
