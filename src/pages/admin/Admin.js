import React, { useState, useEffect } from 'react'
import { Row, Col, Container, Card, Button } from 'react-bootstrap'
import SidebarComponent from '../components/SidebarComponent'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate, Link } from 'react-router-dom'
import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline';
import ReceiptIcon from '@mui/icons-material/Receipt';
import PaymentsOutlinedIcon from '@mui/icons-material/PaymentsOutlined';
import LineChart from '../components/LineChart';
import Loader from '../components/Loader'
import Message from '../components/Message'
import { listOrders } from '../actions/order_actions'
import { listUsers } from '../actions/user_actions'


function Admin({ openside }) {
  const dispatch = useDispatch()
  const history = useNavigate()
  const [SaleFilter, setsalesFilter] = useState([]);
  const [Clients, setClients] = useState([]);
  const [TotalRevenue, setTotalRevenue] = useState(0);

  const orderList = useSelector(state => state.orderList)
  const { loading, error, orders } = orderList

  const userList = useSelector(state => state.userList)
  const { loading:loadusers, error:errorusers, users } = userList

  const User = useSelector(state => state.User)
  const { userInfo } = User
  
  const [userData, setUserData] = useState({
    labels: [],
    datasets: [
      {
        label: "Mpesa Payments",
        data: [], // Add data for Mpesa payments
        backgroundColor: "#60f808", // Set background color for Mpesa payments
        borderColor: "#41a408", // Set border color for Mpesa payments
        borderWidth: 2,
      },
      {
        label: "PayPal Payments",
        data: [], // Add data for PayPal payments
        backgroundColor: "#0f69ba", // Set background color for PayPal payments
        borderColor: "#0f67ba", // Set border color for PayPal payments
        borderWidth: 2,
      },
      // Add more datasets for other payment methods if needed
    ],
  });

  useEffect(() => {
    if (userInfo && userInfo.isAdmin) {
          dispatch(listUsers())
      } else {
          history('/login')
      }
    if (orders && orders.length > 0) {
      const paidOrders = orders.filter(order => order.isPaid);
      
      setsalesFilter(paidOrders);
      setTotalRevenue(paidOrders.reduce((sum, order) => sum + parseFloat(order.totalPrice), 0));
      const paidOrderLabels = paidOrders.map(order => order.paidAt.substring(0, 10));

      const MpesaPayments = paidOrders.filter(order => order.paymentMethod === "M-Pesa" || order.paymentMethod === "MPesa" || order.paymentMethod === "Mpesa");
      const paypalPayments = paidOrders.filter(order => order.paymentMethod === "PayPal");
      
      const MpesaPaymentsData = MpesaPayments.map(order => order.totalPrice);
      const paypalPaymentsData = paypalPayments.map(order => order.totalPrice);

      
  
      setUserData({
        labels: paidOrderLabels,
        datasets: [
          {
            label: "Mpesa Payments",
            data: MpesaPaymentsData
          },
          {
            label: "PayPal Payments",
            data: paypalPaymentsData
          }
        ]
      })} else{
        dispatch(listOrders())
      } 
      if (users && users.length > 0){
        setClients(users)
      } 
  }, [dispatch, orders])

  console.log(TotalRevenue)
  return (
      <div className='pages' style={{ display: 'flex' }}>
        <SidebarComponent openside={openside}/>
      <div style={{ marginRight: openside ? '4' : '4' }} >
        <Container>
      <h1>Dashboard</h1>
      {/* Users  */}
      <Row>
        <Col>
        <Card border="secondary" bg= 'transparent' style={{ width: '18rem' }}>
          <Card.Body>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
             <div>
            <PeopleOutlineIcon style={{ fontSize: 100, color: 'blue' }} />
            </div>
            <Link to="/userlist">
              <center>
              <Card.Title>{Clients.length}</Card.Title>
              <Card.Subtitle>Clients</Card.Subtitle>
              </center>
            </Link>
            </div>
          </Card.Body>
        </Card>
        </Col>
        {/* Successful orders */}
        <Col>
        <Card border="warning" bg= 'transparent' style={{ width: '18rem' }}>
          <Card.Body>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
             <div>
            <ReceiptIcon style={{ fontSize: 100, color: 'orange' }} />
            </div>
            <Link to="/alloders">
              <center>
              <Card.Title>{SaleFilter.length}</Card.Title>
              <Card.Subtitle>Sales</Card.Subtitle>
              </center>
            </Link>
            </div>
          </Card.Body>
        </Card>
        </Col>
        {/* Revenue */}
        <Col>
        <Card border="info" bg= 'transparent' style={{ width: '18rem' }}>
          <Card.Body>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
             <div>
            <PaymentsOutlinedIcon style={{ fontSize: 100, color: 'green' }} />
            </div>
            <Link to="/payments">
              <center>
              <Card.Title> Ksh {TotalRevenue.toFixed(2)}</Card.Title>
              <Card.Subtitle>Revenue</Card.Subtitle>
              </center>
            </Link>
            </div>
          </Card.Body>
        </Card>
        </Col>
      </Row>
      <Row>
        <Col>
        <div style={{ width: 700 }}>
              {loading
                ? (<Loader />)
                : error
                    ? (<Message variant='danger'>{error}</Message>)
                    : (
                   <LineChart chartData={userData} />)}
      </div>
        </Col>
      </Row>
      </Container>
      </div>
      </div>
    
  
  )
}

export default Admin