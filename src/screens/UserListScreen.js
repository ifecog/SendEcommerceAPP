import React, {useEffect} from 'react'
import {useNavigate} from 'react-router-dom'
import {LinkContainer} from 'react-router-bootstrap'
import {Table, Button} from 'react-bootstrap'
import {useDispatch, useSelector} from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import {listUsers, deleteUser} from '../actions/userActions'

function UserListScreen() {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const userList = useSelector((state) => state.userList)
  const {loading, error, users} = userList

  const userSignin = useSelector((state) => state.userSignin)
  const {userInfo} = userSignin

  const userDelete = useSelector((state) => state.userDelete)
  const {success: successDelete} = userDelete

  useEffect(() => {
    if (userInfo && userInfo.isAdmin) {
      dispatch(listUsers())
    } else {
      navigate('/signin')
    }
  }, [dispatch, userInfo, successDelete, navigate])

  const deleteHandler = (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      dispatch(deleteUser(id))
    }
  }

  return (
    <div>
      <h1 className='text-center py-3'>Users</h1>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>{error}</Message>
      ) : (
        <Table striped bordered hover responsive className='table-sm'>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone Number</th>
              <th>Admin</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {users.map((user) => (
              <tr key={user.uuid}>
                <td>{user.uuid}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.phone_number}</td>
                <td>
                  {user.isAdmin ? (
                    <i className='fas fa-check' style={{color: 'green'}}></i>
                  ) : (
                    <i className='fas fa-check' style={{color: 'red'}}></i>
                  )}
                </td>
                <td>
                  <LinkContainer to={`/admin/user/${user.uuid}/edit`}>
                    <Button variant='success' className='btn-sm'>
                      <i className='fas fa-edit'></i>
                    </Button>
                  </LinkContainer>
                  <Button
                    variant='danger'
                    className='btn-sm mx-2'
                    onClick={() => deleteHandler(user.uuid)}
                  >
                    <i className='fas fa-trash'></i>
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  )
}

export default UserListScreen
