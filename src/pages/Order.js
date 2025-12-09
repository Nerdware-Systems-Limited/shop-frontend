import React, { useState, useEffect } from 'react'
import { Button, Row, Col, ListGroup, Image, Card, Form, Container } from 'react-bootstrap'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import PhoneInput from 'react-phone-number-input/input'
import { PayPalButton } from 'react-paypal-button-v2'
import Message from '../components/Message'
import Loader from '../components/Loader'
import { getOrderDetails, payOrder, deliverOrder, stkpush, ConfimMpesa, QueryMpesa } from '../actions/order_actions'
import { ORDER_PAY_RESET, ORDER_DELIVER_RESET } from '../constants/order_constants'


function Order() {
    // const url = 'https://perfumeoclock.4.us-1.fl0.io'
    const url = 'http://127.0.0.1:8000'
    const [phone, setPhone] = useState('')
    const [paymentPending, setPaymentPending] = useState(false);
    // const [Intervalid, setIntervalid] = useState(0);
    const { id } = useParams()
    // console.log(id)
    const orderId = id
    // console.log(orderId)
    const navigate = useNavigate()
    const dispatch = useDispatch()


    const [sdkReady, setSdkReady] = useState(false)
    const [mpesaReady, setMpesaReady] = useState(false)

    const orderDetails = useSelector(state => state.orderDetails)
    const { order, error, loading } = orderDetails

    const orderPay = useSelector(state => state.orderPay)
    const { loading: loadingPay, success: successPay } = orderPay

    const orderDeliver = useSelector(state => state.orderDeliver)
    const { loading: loadingDeliver, success: successDeliver } = orderDeliver

    const User = useSelector(state => state.User)
    const { userInfo } = User

    const pesaStk = useSelector(state => state.MpesaStk)
    const { MpesaStk } = pesaStk

    const confirm = useSelector(state => state.ConfirmMpesa)
    const { ConfirmMpesa } = confirm

    const query = useSelector(state => state.QueryMpesa)
    const { success: querysuccess } = query

    if (!loading && !error) {
        order.itemsPrice = order.orderItems.reduce((acc, item) => acc + item.price * item.qty, 0).toFixed(2)
    }


    const addPayPalScript = () => {
        const script = document.createElement('script')
        script.type = 'text/javascript'
        script.src = 'https://www.paypal.com/sdk/js?client-id=ARv92c-YDkuV302fTIhcXrQ-fzkd3pajUfJqNsSQ_DrPP3QK1HjFvWr_LGXDgiU0deEuB82sWb1JHvBd'
        script.async = true
        script.onload = () => {
            setSdkReady(true)
        }
        document.body.appendChild(script)
    }


    useEffect(() => {

        if (!userInfo) {
            navigate('/login')
        }

        if (!order || successPay || order._id !== Number(orderId) || successDeliver) {
            dispatch({ type: ORDER_PAY_RESET })
            dispatch({ type: ORDER_DELIVER_RESET })

            dispatch(getOrderDetails(orderId))
        } else if (!order.isPaid) {
            if (paymentPending) {
                if (MpesaStk) {
                    let count = 0
                    let stopper = ConfirmMpesa && ConfirmMpesa.status === "success" ? true:false;
                    const timerId = setInterval(() => {
                        dispatch(ConfimMpesa(MpesaStk.CheckoutRequestID, orderId));
                        count++
                        if (ConfirmMpesa && ConfirmMpesa.status === "success"|| ConfirmMpesa &&  ConfirmMpesa.status === "cancelled"){
                            console.log("Tric Rules")
                        }
                        if (count === 20) {
                            dispatch(QueryMpesa(MpesaStk.CheckoutRequestID));
                        } 
                        else if (ConfirmMpesa && ConfirmMpesa.status === "success"|| ConfirmMpesa && ConfirmMpesa.status === "cancelled" || count >= 30) {
                            clearInterval(timerId);
                            setPaymentPending(false);
                        }
                    }, 1000);
            }
            }
            
            if (!window.paypal) {
                addPayPalScript()
            } else {
                setSdkReady(true)
            }
            if (ConfirmMpesa && ConfirmMpesa.status === "success"){
                setMpesaReady(true)
            }
            
        }
    }, [dispatch, order, orderId, successPay, successDeliver, paymentPending, MpesaStk, querysuccess])

    const successPaymentHandler = (paymentResult) => {
        console.log(paymentResult)
        dispatch(payOrder(orderId, paymentResult))
    }

    const deliverHandler = () => {
        dispatch(deliverOrder(order))
    }

    const MpesaHandler = (e) => {
        e.preventDefault();

        // Dispatch stkpush action and handle payment pending state
        dispatch(stkpush(order.totalPrice, phone))
        setPaymentPending(true);
    };
    const reloadPendingPayment = () => {
        setPaymentPending(true);
      };

    const handleCancelPayment = () => {
        // Handle cancellation and reset payment state
        setPaymentPending(false);
    };

    return (
        <Container>
    <div style={{marginTop: '80px'}}>
        {loading ? (
        
        <Loader />
    ) : error ? (
        <Message variant='danger'>{error}</Message>
    ) : (
        <div>
                    <h1>Order: {order._id}</h1>
                    <Row>
                        <Col md={8}>
                            <ListGroup variant='flush'>
                                <ListGroup.Item>
                                    <h2>Shipping</h2>
                                    <p><strong>Name: </strong> {order.user.name}</p>
                                    <p><strong>Email: </strong><a href={`mailto:${order.user.email}`}>{order.user.email}</a></p>
                                    <p>
                                        <strong>Shipping: </strong>
                                        {order.shippingAddress.address},  {order.shippingAddress.city}
                                        {'  '}
                                        {order.shippingAddress.postalCode},
                                {'  '}
                                        {order.shippingAddress.country}
                                    </p>

                                    {order.isDelivered ? (
                                        <Message variant='success'>Delivered on {order.deliveredAt}</Message>
                                    ) : (
                                            <Message variant='warning'>Not Delivered</Message>
                                        )}
                                </ListGroup.Item>

                                <ListGroup.Item>
                                    <h2>Payment Method</h2>
                                    <p>
                                        <strong>Method: </strong>
                                        {order.paymentMethod}
                                    </p>
                                    {order.isPaid ? (
                                        <Message variant='success'>Paid on {order.paidAt}</Message>
                                    ) : (
                                            <Message variant='warning'>Not Paid</Message>
                                        )}

                                </ListGroup.Item>

                                <ListGroup.Item>
                                    <h2>Order Items</h2>
                                    {order.orderItems.length === 0 ? <Message variant='info'>
                                        Order is empty
                            </Message> : (
                                            <ListGroup variant='flush'>
                                                {order.orderItems.map((item, index) => (
                                                    <ListGroup.Item key={index}>
                                                        <Row>
                                                            <Col md={1}>
                                                                <Image src={url + item.image} alt={item.name} fluid rounded />
                                                            </Col>

                                                            <Col>
                                                                <Link to={`${url}/perfume/${item.perfume}`}>{item.name}</Link>
                                                            </Col>

                                                            <Col md={4}>
                                                                {item.qty} X ${item.price} = ${(item.qty * item.price).toFixed(2)}
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
                                            <Col>Items:</Col>
                                            <Col>${order.itemsPrice}</Col>
                                        </Row>
                                    </ListGroup.Item>

                                    <ListGroup.Item>
                                        <Row>
                                            <Col>Shipping:</Col>
                                            <Col>${order.shippingPrice}</Col>
                                        </Row>
                                    </ListGroup.Item>

                                    <ListGroup.Item>
                                        <Row>
                                            <Col>Tax:</Col>
                                            <Col>${order.taxPrice}</Col>
                                        </Row>
                                    </ListGroup.Item>

                                    <ListGroup.Item>
                                        <Row>
                                            <Col>Total:</Col>
                                            <Col>${order.totalPrice}</Col>
                                        </Row>
                                    </ListGroup.Item>
                                    <br></br>
                                    <br></br>

                                    {
                                        !order.isPaid && (
                                            order.paymentMethod === 'PayPal' ? (
                                                <ListGroup.Item>
                                                    {loadingPay && <Loader />}

                                                    {!sdkReady ? (
                                                        <Loader />
                                                    ) : (
                                                        <PayPalButton
                                                            amount={order.totalPrice}
                                                            onSuccess={successPaymentHandler}
                                                        />
                                                    )}
                                                </ListGroup.Item>
                                                
                                            ) : (
                                                <ListGroup.Item>
                                                    {loadingPay && <Loader />}
                                                    {!mpesaReady ? (
                                                        paymentPending ? (
                                                            <div>
                                                                <center>
                                                                    <Loader />
                                                                    <p>Payment is pending...</p>
                                                                    <Button onClick={handleCancelPayment} variant='danger'>
                                                                        Cancel Payment
                                                                    </Button>
                                                                </center>
                                                            </div>
                                                        ) : (
                                                            <div>
                                                                {ConfirmMpesa ? (
                                                                    <div>
                                                                        {ConfirmMpesa.status === "error" ? (
                                                                            <div>
                                                                                <center>
                                                                                    <h4><span style={{ fontWeight: 'bold', color: 'red' }}>Payment not found. Reload?</span></h4>
                                                                                    <Button onClick={reloadPendingPayment} variant='primary'>
                                                                                        Reload
                                                                                    </Button>
                                                                                </center>
                                                                            </div>
                                                                        ) : (
                                                                            <div>
                                                                                <center>
                                                                                    <h4><span style={{ fontWeight: 'bold', color: 'red' }}>Request cancelled By The User</span></h4>
                                                                                </center>
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                ) : (
                                                                    <div>
                                                                        <center>
                                                                            <h4><strong>Complete Payment</strong></h4>
                                                                        </center>
                                                                        
                                                                    </div>
                                                                )}
                                                                <Form onSubmit={MpesaHandler}>
                                                                            <center>
                                                                                <Image src={`${url}/images/mpesa.png`} fluid rounded style={{ height: '100px' }} />
                                                                                <PhoneInput
                                                                                    country="KE"
                                                                                    value={phone}
                                                                                    onChange={setPhone}
                                                                                    style={{ 
                                                                                        width: '100%', 
                                                                                        padding: '10px', 
                                                                                        borderRadius: '5px', 
                                                                                        border: '1px solid #ccc',
                                                                                        marginBottom: '20px' // Adding margin at the bottom
                                                                                    }}
                                                                                />
                                                                                <Button type='submit' variant='success'>
                                                                                    Pay with Mpesa
                                                                                </Button>
                                                                            </center>
                                                                        </Form>
                                                            </div>
                                                        )
                                                    ) : null}
                                                </ListGroup.Item>
                                            )
                                        )
                                    }

                                </ListGroup>
                                {loadingDeliver && <Loader />}
                                {userInfo && userInfo.isAdmin && order.isPaid && !order.isDelivered && (
                                    <ListGroup.Item>
                                        <Button
                                            type='button'
                                            className='btn btn-block'
                                            onClick={deliverHandler}
                                        >
                                            Mark As Delivered
                                        </Button>
                                    </ListGroup.Item>
                                )}
                            </Card>
                        </Col>
                    </Row>
                    </div>
    )}
                </div>
                </Container>
            )};

export default Order