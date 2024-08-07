import React, {useEffect} from 'react'
import {useNavigate} from 'react-router-dom'
import {LinkContainer} from 'react-router-bootstrap'
import {Table, Button} from 'react-bootstrap'
import {useDispatch, useSelector} from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import {listOrders} from '../actions/orderActions'

function OrderListScreen() {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const userSignin = useSelector((state) => state.userSignin)
  const {userInfo} = userSignin

  const orderList = useSelector((state) => state.orderList)
  const {loading, error, orders} = orderList

  useEffect(() => {
    if (userInfo && userInfo.isAdmin) {
      dispatch(listOrders())
    } else {
      navigate('/signin')
    }
  }, [dispatch, userInfo, navigate])

  return (
    <div>
      <h1 className='text-center py-3'>Orders</h1>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>{error}</Message>
      ) : (
        <Table striped bordered hover responsive className='table-sm'>
          <thead>
            <tr>
              <th>ID</th>
              <th>USER</th>
              <th>DATE CREATED</th>
              <th>TOTAL PRICE($)</th>
              <th>PAID</th>
              <th>DELIVERED</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {orders.map((order) => (
              <tr key={order.uuid}>
                <td>{order.uuid}</td>
                <td>{order.user && order.user.name}</td>
                <td>{order.created_time.substring(0, 10)}</td>
                <td>{order.total_price}</td>
                <td>
                  {order.is_paid ? (
                    order.payment_time.substring(0, 10)
                  ) : (
                    <i className='fas fa-check' style={{color: 'red'}}></i>
                  )}
                </td>
                <td>
                  {order.is_delivered ? (
                    order.delivery_time.substring(0, 10)
                  ) : (
                    <i className='fas fa-check' style={{color: 'red'}}></i>
                  )}
                </td>
                <td>
                  <LinkContainer to={`/order/${order.uuid}`}>
                    <Button variant='success' className='btn-sm'>
                      Order Details
                      {/* <i className='fas fa-edit'></i> */}
                    </Button>
                  </LinkContainer>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  )
}

export default OrderListScreen
