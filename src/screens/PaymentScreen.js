import React, {useState} from 'react'
import {useNavigate} from 'react-router-dom'
import {Form, Button, Col} from 'react-bootstrap'
import {useDispatch, useSelector} from 'react-redux'
import FormContainer from '../components/FormContainer'
import CheckoutSteps from '../components/CheckoutSteps'
import {savePaymentMethod} from '../actions/cartActions'

function PaymentScreen() {
  const cart = useSelector((state) => state.cart)
  const {shippingAddress} = cart

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [paymentMethod, setPaymentMethod] = useState('PayPal')

  if (!shippingAddress.address) {
    navigate('/shipping')
  }

  const submitHandler = (e) => {
    e.preventDefault()
    dispatch(savePaymentMethod(paymentMethod))
    navigate('/placeorder')
  }

  return (
    <FormContainer>
      <CheckoutSteps step1 step2 step3 />
      <h1>Payment Method</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group className='py-3'>
          <Form.Label as='legend'>Select Method</Form.Label>
          <Col>
            <Form.Check
              type='radio'
              label='PayPal'
              id='PayPal'
              name='paymentMethod'
              value='PayPal'
              checked={paymentMethod === 'PayPal'}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
            <Form.Check
              type='radio'
              label='Credit Card'
              id='CreditCard'
              name='paymentMethod'
              value='CreditCard'
              checked={paymentMethod === 'CreditCard'}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
          </Col>
        </Form.Group>

        <Button type='submit' variant='primary'>
          Continue
        </Button>
      </Form>
    </FormContainer>
  )
}

export default PaymentScreen
