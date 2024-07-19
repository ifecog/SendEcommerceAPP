import React, {useState, useEffect} from 'react'
import {Link, useNavigate, useLocation} from 'react-router-dom'
import {Form, Button, Row, Col} from 'react-bootstrap'
import {useDispatch, useSelector} from 'react-redux'
import Message from '../components/Message'
import FormContainer from '../components/FormContainer'
import Loader from '../components/Loader'
import {signup} from '../actions/userActions'

function SignupScreen() {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [message, setMessage] = useState('')

  const formatPhoneNumber = (phone) => {
    if (phone.startsWith('0')) {
      return '+234' + phone.slice(1)
    }
    return '+234' + phone
  }

  const location = useLocation()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const redirect = location.search ? location.search.split('=')[1] : '/'

  const userSignup = useSelector((state) => state.userSignup)
  const {error, loading, userInfo} = userSignup

  useEffect(() => {
    if (userInfo) {
      navigate(redirect)
    }
  }, [navigate, userInfo, redirect])

  const submitHandler = (e) => {
    e.preventDefault()
    const formattedPhoneNumber = formatPhoneNumber(phoneNumber)

    if (password !== confirmPassword) {
      setMessage('Passwords do not match. Try again!')
    } else {
      dispatch(
        signup(firstName, lastName, email, formattedPhoneNumber, password)
      )
    }
  }

  return (
    <FormContainer>
      <h2>Sign Up</h2>
      {message && <Message variant='danger'>{message}</Message>}
      {error && <Message variant='danger'>{error}</Message>}
      {loading && <Loader />}

      <Form onSubmit={submitHandler}>
        <Form.Group controlId='firstName' className='py-3'>
          <Form.Label className='form-label'>First Name</Form.Label>
          <Form.Control
            required
            type='text'
            placeholder='Enter first name'
            className='form-control'
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId='lastName' className='py-3'>
          <Form.Label className='form-label'>Last Name</Form.Label>
          <Form.Control
            required
            type='text'
            placeholder='Enter last name'
            className='form-control'
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId='email' className='py-3'>
          <Form.Label className='form-label'>Email Address</Form.Label>
          <Form.Control
            required
            type='email'
            placeholder='Enter email'
            className='form-control'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId='phoneNumber' className='py-3'>
          <Form.Label className='form-label'>Phone Number</Form.Label>
          <Form.Control
            required
            type='tel'
            pattern='[0-9]{11}'
            placeholder='Enter phone number'
            className='form-control'
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId='password' className='py-3'>
          <Form.Label className='form-label'>Password</Form.Label>
          <Form.Control
            required
            type='password'
            placeholder='Enter password'
            className='form-control'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId='confirmPassword' className='py-3'>
          <Form.Label className='form-label'>Confirm Password</Form.Label>
          <Form.Control
            required
            type='password'
            placeholder='Confirm password'
            className='form-control'
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </Form.Group>

        <Button type='submit' variant='primary' className='form-submit-button'>
          Sign Up
        </Button>
      </Form>

      <Row className='py-3'>
        <Col>
          Have an Account?{' '}
          <Link to={redirect ? `/signin?redirect=${redirect}` : '/signin'}>
            Signin
          </Link>
        </Col>
      </Row>
    </FormContainer>
  )
}

export default SignupScreen
