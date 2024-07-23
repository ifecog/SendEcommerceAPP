import React, {useState, useEffect} from 'react'
import {Link, useNavigate, useParams} from 'react-router-dom'
import {Form, Button} from 'react-bootstrap'
import {useDispatch, useSelector} from 'react-redux'
import Message from '../components/Message'
import FormContainer from '../components/FormContainer'
import Loader from '../components/Loader'
import {getUserDetails, updateUser} from '../actions/userActions'
import {USER_UPDATE_RESET} from '../constants/userConstants'

function UserEditScreen() {
  const {id} = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [isAdmin, setIsAdmin] = useState(false)

  const formatPhoneNumber = (phone) => {
    if (phone.startsWith('0')) {
      return '+234' + phone.slice(1)
    }
    return '+234' + phone
  }

  const userDetails = useSelector((state) => state.userDetails)
  const {error, loading, user} = userDetails

  const userUpdate = useSelector((state) => state.userUpdate)
  const {
    error: errorUpdate,
    loading: loadingUpdate,
    success: successUpdate,
  } = userUpdate

  useEffect(() => {
    if (successUpdate) {
      dispatch({type: USER_UPDATE_RESET})
      navigate('/admin/users')
    } else {
      if (!user || user.uuid !== id) {
        dispatch(getUserDetails(id))
      } else {
        setFirstName(user.first_name)
        setLastName(user.last_name)
        setEmail(user.email)
        setPhoneNumber(user.phone_number)
        setIsAdmin(user.isAdmin)
      }
    }
  }, [dispatch, id, user, successUpdate, navigate])

  const submitHandler = (e) => {
    e.preventDefault()
    const formattedPhoneNumber = formatPhoneNumber(phoneNumber)
    dispatch(
      updateUser({
        uuid: user.uuid,
        first_name: firstName,
        last_name: lastName,
        email: email,
        phone_number: formattedPhoneNumber,
        isAdmin: isAdmin,
      })
    )
  }

  return (
    <div>
      <Link to='/admin/users'>Go Back</Link>
      <FormContainer>
        <h1>Edit User</h1>
        {loadingUpdate && <Loader />}
        {errorUpdate && <Message variant='danger'>{errorUpdate}</Message>}
        {loading ? (
          <Loader />
        ) : error ? (
          <Message variant='danger'>{error}</Message>
        ) : (
          user && (
            <Form onSubmit={submitHandler}>
              <Form.Group controlId='firstName' className='py-3'>
                <Form.Label>First Name</Form.Label>
                <Form.Control
                  type='name'
                  placeholder='Enter first name'
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                ></Form.Control>
              </Form.Group>

              <Form.Group controlId='lastName' className='py-3'>
                <Form.Label>Last Name</Form.Label>
                <Form.Control
                  type='name'
                  placeholder='Enter last name'
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                ></Form.Control>
              </Form.Group>

              <Form.Group controlId='email' className='py-3'>
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type='email'
                  placeholder='Enter email'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                ></Form.Control>
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

              <Form.Group controlId='isadmin' className='py-3'>
                <Form.Check
                  type='checkbox'
                  label='Is Admin'
                  checked={isAdmin}
                  onChange={(e) => setIsAdmin(e.target.checked)}
                ></Form.Check>
              </Form.Group>

              <Button type='submit' variant='primary'>
                Update
              </Button>
            </Form>
          )
        )}
      </FormContainer>
    </div>
  )
}

export default UserEditScreen
