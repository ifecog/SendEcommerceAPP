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
  const userSignin = useSelector((state) => state.userSignin)
  const {userInfo} = userSignin

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
        `${process.env.REACT_APP_SEND24_API_URL}sizes`
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
        // const is_fragile = cart.cartItems[0].is_fragile ? 1 : 0;
        const pickup_coordinates = '6.892107747042948, 3.718155923471927'
        const pickup_state = 'Ogun'
        const destination_coordinates = `${cart.shippingAddress.latitude}, ${cart.shippingAddress.longitude}`
        const destination_state = cart.shippingAddress.state

        const response = await axios.post(
          `${process.env.REACT_APP_SEND24_API_URL}pricing`,
          {
            size_id,
            pickup_coordinates,
            destination_coordinates,
            pickup_state,
            destination_state,
            is_fragile,
          }
        )

        const filteredPrices = response.data.data.filter(
          (option) =>
            Object.keys(option).includes('HUB_TO_HUB') ||
            Object.keys(option).includes('HUB_TO_DOOR')
        )

        setSend24Prices(filteredPrices)
      }

      if (Object.keys(sizeIdMap).length > 0) {
        fetchSend24Prices()
      }
    } else {
      setSelectedSend24Price(null)
    }
  }, [send24Shipping, cart, sizeIdMap])

  const placeOrder = async () => {
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

    if (send24Shipping) {
      const send24OrderData = {
        pickup_address:
          'UNILAG Senate Building, UNILAG Senate Building, Otunba Payne St, Akoka, Lagos 101245, Lagos, Nigeria',
        pickup_coordinates: '6.5194683, 3.3987129',
        destination_address: cart.shippingAddress.address,
        destination_coordinates: `${cart.shippingAddress.latitude}, ${cart.shippingAddress.longitude}`,
        size_id: '68882080-9cb3-11ed-a1e0-1b525c297de0',
        label: cart.cartItems[0].name,
        package_note: cart.cartItems[0].description,
        is_fragile: 0,
        name: userInfo.name,
        phone: userInfo.phone_number,
        email: userInfo.email,
        recipient_note:
          'Quia itaque incidunt distinctio qui blanditiis voluptate quis fugiat alias.',
        destination_state: cart.shippingAddress.state,
        destination_local_government: 'Lagelu',
        pickup_state: 'Lagos',
        variant: 'HUB_TO_DOOR',
        origin_hub_id: '32b51d10-8eaf-11ee-8032-37c06d0259ca',
        images: [cart.cartItems[0].image],
      }

      try {
        const config = {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.REACT_APP_SEND24_AUTH_TOKEN}`,
          },
        }

        await axios.post(
          `${process.env.REACT_APP_SEND24_API_URL}corporates/orders/`,
          send24OrderData,
          config
        )
      } catch (error) {
        console.error('Send24 Order Creation Error:', error)
      }
    }
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
                  <Col>Items</Col>
                  <Col>${cart.itemsPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Shipping</Col>
                  <Col>${selectedSend24Price || cart.shippingPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Tax</Col>
                  <Col>${cart.taxPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Total</Col>
                  <Col>
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
                {error && <Message variant='danger'>{error}</Message>}
              </ListGroup.Item>
              <ListGroup.Item>
                <Button
                  type='button'
                  className='btn-block'
                  disabled={cart.cartItems === 0}
                  onClick={placeOrder}
                >
                  Place Order
                </Button>
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default PlaceOrderScreen
