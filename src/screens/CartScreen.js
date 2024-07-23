import React, { useEffect } from 'react'
import { Link, useParams, useNavigate, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Row, Col, Button, ListGroup, Image, Form, Card } from 'react-bootstrap'
import Message from '../components/Message'
import { addToCart, RemoveFromCart } from '../actions/cartActions'

function CartScreen() {
  const { id } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const productId = id
  const qty = location.search ? Number(location.search.split('=')[1]) : 1

  const cart = useSelector((state) => state.cart)
  const { cartItems } = cart

  useEffect(() => {
    if (productId) {
      dispatch(addToCart(productId, qty))
    }
  }, [dispatch, productId, qty])

  const removeFromCartHandler = (id) => {
    dispatch(RemoveFromCart(id))
  }

  const checkoutHandler = () => {
    navigate('/shipping')
  }

  return (
    <Row>
      <Col md={8}>
        <h1>Shopping Cart</h1>
        {cartItems.length === 0 ? (
          <Message>
            Your cart is empty <Link to='/'>Go Back</Link>
          </Message>
        ) : (
          <ListGroup variant='flush'>
            {cartItems.map((item) => (
              <ListGroup.Item key={item.product}>
                <Row>
                  <Col md={2}>
                    <Link to={`/product/${item.product}`}>
                      <Image src={item.image} alt={item.name} fluid rounded />
                    </Link>
                  </Col>

                  <Col md={3}>
                    <Link
                      to={`/product/${item.product}`}
                      style={{ textDecoration: 'none' }}
                    >
                      <strong>{item.name}</strong>
                    </Link>
                  </Col>

                  <Col md={2}>
                    <strong>${item.price}</strong>
                  </Col>

                  <Col md={2}>
                    <Form.Control
                      className='form-select form-select-override'
                      as='select'
                      value={item.qty}
                      onChange={(e) =>
                        dispatch(
                          addToCart(item.product, Number(e.target.value))
                        )
                      }
                    >
                      {[...Array(item.count_in_stock).keys()].map((x) => (
                        <option key={x + 1} value={x + 1}>
                          {x + 1}
                        </option>
                      ))}
                    </Form.Control>
                  </Col>

                  <Col md={1}>
                    <Button
                      type='button'
                      variant='light'
                      onClick={() => removeFromCartHandler(item.product)}
                    >
                      <i className='fas fa-trash'></i>
                    </Button>
                  </Col>
                </Row>
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}
      </Col>
      <Col md={4}>
        <Card>
          <ListGroup variant='flush'>
            <ListGroup.Item>
              <h3>
                SubTotal({cartItems.reduce((acc, item) => acc + item.qty, 0)}{' '}
                items)
              </h3>
              ${cartItems.reduce((acc, item) => acc + item.qty * item.price, 0)}
            </ListGroup.Item>
            <ListGroup.Item>
              <Button
                onClick={checkoutHandler}
                type='button'
                style={{ width: '100%' }}
                className='btn-block'
                disabled={cartItems.length === 0}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100%',
                  }}
                >
                  Proceed to Checkout
                </div>
              </Button>
            </ListGroup.Item>
          </ListGroup>
        </Card>
      </Col>
    </Row>
  )
}

export default CartScreen
