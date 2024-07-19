import React, {useState, useEffect} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {Link, useParams, useNavigate} from 'react-router-dom'
import {
  Row,
  Col,
  Image,
  ListGroup,
  Button,
  Card,
  Form,
  Carousel,
} from 'react-bootstrap'
import Rating from '../components/Rating'
import Loader from '../components/Loader'
import Message from '../components/Message'
import {
  listProductDetails,
  createProductReview,
} from '../actions/productActions'
import {PRODUCT_CREATE_REVIEW_RESET} from '../constants/productConstants'

function ProductScreen() {
  const [qty, setQty] = useState(1)
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [index, setIndex] = useState(0)

  const {id} = useParams()
  const dispatch = useDispatch()

  const productDetails = useSelector((state) => state.productDetails)
  const {error, loading, product} = productDetails

  const userSignin = useSelector((state) => state.userSignin)
  const {userInfo} = userSignin

  const productCreateReview = useSelector((state) => state.productCreateReview)
  const {
    error: errorReview,
    loading: loadingReview,
    success: successReview,
  } = productCreateReview

  useEffect(() => {
    if (successReview) {
      setRating(0)
      setComment('')
      dispatch({type: PRODUCT_CREATE_REVIEW_RESET})
    }
    dispatch(listProductDetails(id))
  }, [id, dispatch, successReview])

  const navigate = useNavigate()

  const addToCartHandler = () => {
    navigate(`/cart/${id}?qty=${qty}`)
  }

  const reviewSubmitHandler = (e) => {
    e.preventDefault()
    dispatch(createProductReview(id, {rating, comment}))
  }

  const handleSelect = (selectedIndex) => {
    setIndex(selectedIndex)
  }

  return (
    <div className='product-screen'>
      <Link to='/' className='btn btn-light my-3'>
        Go Back
      </Link>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message>{error}</Message>
      ) : (
        <div>
          <Row>
            <Col md={6}>
              <Carousel
                activeIndex={index}
                onSelect={handleSelect}
                className='carousel-custom'
              >
                {product.image_a && (
                  <Carousel.Item>
                    <Image
                      src={product.image_a}
                      alt={product.name}
                      fluid
                      className='d-block mx-auto'
                    />
                  </Carousel.Item>
                )}
                {product.image_b && (
                  <Carousel.Item>
                    <Image
                      src={product.image_b}
                      alt={product.name}
                      fluid
                      className='d-block mx-auto'
                    />
                  </Carousel.Item>
                )}
                {product.image_c && (
                  <Carousel.Item>
                    <Image
                      src={product.image_c}
                      alt={product.name}
                      fluid
                      className='d-block mx-auto'
                    />
                  </Carousel.Item>
                )}
                {product.image_d && (
                  <Carousel.Item>
                    <Image
                      src={product.image_d}
                      alt={product.name}
                      fluid
                      className='d-block mx-auto'
                    />
                  </Carousel.Item>
                )}
              </Carousel>
              <div className='thumbnail-container d-flex justify-content-center mt-2'>
                {product.image_a && (
                  <Image
                    src={product.image_a}
                    alt={product.name}
                    thumbnail
                    className={`thumbnail ${index === 0 ? 'active' : ''}`}
                    onClick={() => handleSelect(0)}
                  />
                )}
                {product.image_b && (
                  <Image
                    src={product.image_b}
                    alt={product.name}
                    thumbnail
                    className={`thumbnail ${index === 1 ? 'active' : ''}`}
                    onClick={() => handleSelect(1)}
                  />
                )}
                {product.image_c && (
                  <Image
                    src={product.image_c}
                    alt={product.name}
                    thumbnail
                    className={`thumbnail ${index === 2 ? 'active' : ''}`}
                    onClick={() => handleSelect(2)}
                  />
                )}
                {product.image_d && (
                  <Image
                    src={product.image_d}
                    alt={product.name}
                    thumbnail
                    className={`thumbnail ${index === 3 ? 'active' : ''}`}
                    onClick={() => handleSelect(3)}
                  />
                )}
              </div>
            </Col>

            <Col md={6}>
              <Card className='my-3 p-3 rounded'>
                <ListGroup variant='flush'>
                  <ListGroup.Item className='text-center'>
                    <h3>{product.name}</h3>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Row>
                      <Col>Price:</Col>
                      <Col>
                        <strong>${product.discount_price}</strong>{' '}
                        {product.price &&
                          product.price !== product.discount_price && (
                            <span className='strikethrough'>
                              ${product.price}
                            </span>
                          )}
                      </Col>
                    </Row>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Row>
                      <Col md={6}>
                        <strong>Quantity:</strong> {product.count_in_stock}
                      </Col>
                      <Col md={6}>
                        <strong>Brand:</strong> {product.brand.name}
                      </Col>
                    </Row>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <strong>Description:</strong> {product.description}
                  </ListGroup.Item>
                  <ListGroup.Item className='text-center'>
                    <Rating
                      value={product.rating}
                      text={`reviews (${product.num_of_reviews})`}
                      color={'#f8e825'}
                    />
                  </ListGroup.Item>
                </ListGroup>
              </Card>
              <Card className='my-3 p-3 rounded'>
                <ListGroup variant='flush'>
                  <ListGroup.Item>
                    <Row>
                      <Col>Price:</Col>
                      <Col>
                        <strong>${product.discount_price}</strong>{' '}
                        {product.price &&
                          product.price !== product.discount_price && (
                            <span className='strikethrough'>
                              ${product.price}
                            </span>
                          )}
                      </Col>
                    </Row>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Row>
                      <Col>Status:</Col>
                      <Col>
                        <strong>
                          {product.count_in_stock > 0
                            ? 'In Stock'
                            : 'Out of Stock'}
                        </strong>
                      </Col>
                    </Row>
                  </ListGroup.Item>
                  {product.count_in_stock > 0 && (
                    <ListGroup.Item>
                      <Row>
                        <Col>Qty</Col>
                        <Col xs='auto' className='my-1'>
                          <Form.Control
                            className='form-select form-select-override'
                            as='select'
                            value={qty}
                            onChange={(e) => setQty(e.target.value)}
                          >
                            {[...Array(product.count_in_stock).keys()].map(
                              (x) => (
                                <option key={x + 1} value={x + 1}>
                                  {x + 1}
                                </option>
                              )
                            )}
                          </Form.Control>
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  )}
                  <ListGroup.Item>
                    <Button
                      onClick={addToCartHandler}
                      className='btn-block btn-primary'
                      disabled={product.count_in_stock === 0}
                      type='button'
                      style={{width: '100%'}}
                    >
                      Add to Cart
                    </Button>
                  </ListGroup.Item>
                </ListGroup>
              </Card>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <h4 className='my-3'>Reviews</h4>
              {product.reviews.length === 0 && (
                <Message variant='info'>No Reviews</Message>
              )}
              <ListGroup variant='flush'>
                {product.reviews.map((review) => (
                  <ListGroup.Item key={review._id}>
                    <strong>{review.name}</strong>
                    <Rating value={review.rating} color='#f8e825' />
                    <p>{review.created_time.substring(0, 10)}</p>
                    <p>{review.comment}</p>
                  </ListGroup.Item>
                ))}
                <ListGroup.Item>
                  <h4>Write a Review</h4>
                  {loadingReview && <Loader />}
                  {successReview && (
                    <Message variant='success'>Review Submitted!</Message>
                  )}
                  {errorReview && (
                    <Message variant='danger'>{errorReview}</Message>
                  )}
                  {userInfo ? (
                    <Form onSubmit={reviewSubmitHandler}>
                      <Form.Group controlId='rating'>
                        <Form.Label>Rating</Form.Label>
                        <Form.Control
                          className='form-select form-select-override'
                          as='select'
                          value={rating}
                          onChange={(e) => setRating(e.target.value)}
                        >
                          <option value=''>Select</option>
                          <option value='1'>1 - Poor</option>
                          <option value='2'>2 - Fair</option>
                          <option value='3'>3 - Good</option>
                          <option value='4'>4 - Very Good</option>
                          <option value='5'>5 - Excellent</option>
                        </Form.Control>
                      </Form.Group>

                      <Form.Group controlId='comment' className='mt-3'>
                        <Form.Label>Comment</Form.Label>
                        <Form.Control
                          as='textarea'
                          rows='5'
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                        ></Form.Control>
                      </Form.Group>

                      <Button
                        variant='primary'
                        disabled={loadingReview}
                        type='submit'
                        className='mt-3'
                        style={{width: '100%'}}
                      >
                        Submit
                      </Button>
                    </Form>
                  ) : (
                    <Message variant='info'>
                      Please{' '}
                      <Link
                        to='/login'
                        className='list-group-item-no-decoration'
                      >
                        login
                      </Link>{' '}
                      to write a review.
                    </Message>
                  )}
                </ListGroup.Item>
              </ListGroup>
            </Col>
          </Row>
        </div>
      )}
    </div>
  )
}

export default ProductScreen
