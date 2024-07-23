import React, {useState} from 'react'
import {Link, useNavigate, useLocation} from 'react-router-dom'
import {Form, Button, Row, Col} from 'react-bootstrap'
import {useDispatch, useSelector} from 'react-redux'
import FormContainer from '../components/FormContainer'
import {saveShippingAddress} from '../actions/cartActions'
import CheckoutSteps from '../components/CheckoutSteps'
import PlacesAutocomplete from '../components/PlacesAutocomplete'

function ShippingScreen() {
  const NIGERIAN_STATES = [
    'Abia',
    'Adamawa',
    'Akwa Ibom',
    'Anambra',
    'Bauchi',
    'Bayelsa',
    'Benue',
    'Borno',
    'Cross River',
    'Delta',
    'Ebonyi',
    'Edo',
    'Ekiti',
    'Enugu',
    'FCT',
    'Gombe',
    'Imo',
    'Jigawa',
    'Kaduna',
    'Kano',
    'Katsina',
    'Kebbi',
    'Kogi',
    'Kwara',
    'Lagos',
    'Nasarawa',
    'Niger',
    'Ogun',
    'Ondo',
    'Osun',
    'Oyo',
    'Plateau',
    'Rivers',
    'Sokoto',
    'Taraba',
    'Yobe',
    'Zamfara',
  ]

  const cart = useSelector((state) => state.cart)
  const {shippingAddress} = cart

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [state, setState] = useState(shippingAddress.state || '')
  const [city, setCity] = useState(shippingAddress.city || '')
  const [address, setAddress] = useState(shippingAddress.address || '')
  const [addressNote, setAddressNote] = useState(
    shippingAddress.addressNote || ''
  )
  const [postalCode, setPostalCode] = useState(shippingAddress.postalCode || '')
  const [latitude, setLatitude] = useState(shippingAddress.latitude || '')
  const [longitude, setLongitude] = useState(shippingAddress.longitude || '')

  const location = useLocation()
  const redirect = location.search ? location.search.split('=')[1] : '/'

  const submitHandler = (e) => {
    e.preventDefault()
    dispatch(
      saveShippingAddress({
        state,
        city,
        address,
        addressNote,
        postalCode,
        latitude,
        longitude,
      })
    )
    navigate('/payment')
  }

  return (
    <FormContainer>
      <CheckoutSteps step1 step2 />
      <h1>Shipping</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group controlId='state' className='py-3'>
          <Form.Label>State</Form.Label>
          <Form.Select
            required
            value={state}
            onChange={(e) => setState(e.target.value)}
          >
            <option value=''>Select State</option>
            {NIGERIAN_STATES.map((state) => (
              <option key={state} value={state}>
                {state}
              </option>
            ))}
          </Form.Select>
        </Form.Group>

        <Form.Group controlId='city' className='py-3'>
          <Form.Label>City</Form.Label>
          <Form.Control
            required
            type='text'
            placeholder='Enter city name'
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId='address' className='py-3'>
          <Form.Label>Address</Form.Label>
          <PlacesAutocomplete
            value={address}
            onChange={setAddress}
            onSelect={(addressData) => {
              setAddress(addressData.address)
              setLatitude(addressData.latitude)
              setLongitude(addressData.longitude)
            }}
          />
        </Form.Group>

        <Form.Group controlId='addressNote' className='py-3'>
          <Form.Label>Address Note</Form.Label>
          <Form.Control
            type='text'
            placeholder='Enter address note'
            value={addressNote}
            onChange={(e) => setAddressNote(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId='postalCode' className='py-3'>
          <Form.Label>Postal Code</Form.Label>
          <Form.Control
            required
            type='text'
            placeholder='Enter postal code'
            value={postalCode}
            onChange={(e) => setPostalCode(e.target.value)}
          />
        </Form.Group>

        <Button type='submit' variant='primary'>
          Continue
        </Button>

        <Row className='py-3'>
          <Col>
            Want to add more items before shipping?{' '}
            <Link
              to={redirect ? `/cart?redirect=${redirect}` : '/cart'}
              style={{textDecoration: 'none'}}
            >
              Cart
            </Link>
          </Col>
        </Row>
      </Form>
    </FormContainer>
  )
}

export default ShippingScreen
