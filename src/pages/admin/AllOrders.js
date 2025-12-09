import React, { useEffect, useState } from 'react'
import { LinkContainer } from 'react-router-bootstrap'
import { Button, Container, Col } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate,Link } from 'react-router-dom'
import Loader from '../components/Loader'
import Message from '../components/Message'
import DataTable, { defaultThemes } from 'react-data-table-component'
import { listOrders } from '../actions/order_actions'
import SidebarComponent from '../components/SidebarComponent'
// import { Table, TableHead, TableBody, TableFooter, TableRow, TableCell, TablePagination, TableSortLabel } from '@mui/material';


function AllOrders({ openside }) {

    const dispatch = useDispatch()
    const history = useNavigate()

    const [selectedFilter, setSelectedFilter] = useState('all');
    

    const handleFilterChange = (event) => {
        setSelectedFilter(event.target.value);
    };

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(8);

    const orderList = useSelector(state => state.orderList)
    const { loading, error, orders } = orderList

    const [OrderFilter, setOrderFilter] = useState([]);

    console.log(OrderFilter)
    const User = useSelector(state => state.User)
    const { userInfo } = User
    
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const columns = [
        {
            name: 'Order ID',
            selector: row => row._id,
        },
        {
            name: 'User',
            selector: row => <Link to={`/order/${row._id}`}>{row.user.name}</Link>,
        },
        {
            name: 'Items',
            selector: row => row.orderItems.map(item => item.name).join(', '),
        },
        {
            name: 'Address',
            selector: row => row.shippingAddress.address,
        },
        {
            name: 'City',
            selector: row => row.shippingAddress.city,
        },
        {
            name: 'Shipping Price',
            selector: row => row.shippingAddress.shippingPrice || 'Not Available',
        },
        {
            name: 'Payment Method',
            selector: row => row.paymentMethod,
        },
        {
            name: 'Total Price',
            selector: row => row.totalPrice,
        },
        {
            name: 'Paid',
            selector: row => row.isPaid ? 'Yes' : 'No',
        },
        {
            name: 'Paid At',
            selector: row => row.paidAt,
        },
        {
            name: 'Delivered',
            selector: row => row.isDelivered ? 'Yes' : 'No',
        },
        {
            name: 'Delivered At',
            selector: row => row.deliveredAt,
        },
        {
            name: 'Created At',
            selector: row => row.createdAt,
        }
    ];
    
    

    const customStyles = {
        header: {
            style: {
                minHeight: '80px',
            },
        },
        headRow: {
            style: {
                borderTopStyle: 'solid',
                borderTopWidth: '2px',
                borderTopColor: defaultThemes.default.divider.default,
            },
        },
        headCells: {
            style: {
                '&:not(:last-of-type)': {
                    borderRightStyle: 'solid',
                    borderRightWidth: '2px',
                    borderRightColor: defaultThemes.default.divider.default,
                },
            },
        },
        cells: {
            style: {
                '&:not(:last-of-type)': {
                    borderRightStyle: 'solid',
                    borderRightWidth: '1px',
                    borderRightColor: defaultThemes.default.divider.default,
                },
            },
        },
    };

    useEffect(() => {
        if (userInfo && userInfo.isAdmin) {
            dispatch(listOrders());
            setOrderFilter(orders)
        } else {
            history.push('/login'); // Corrected history method from history('/login') to history.push('/login')
        }
        if (OrderFilter  && OrderFilter.length < 1){
            setOrderFilter(orders)
        }
        if (orders && orders.length > 0) {
            if (selectedFilter === 'all') {
                setOrderFilter(orders);
            } else if (selectedFilter === 'paid') {
                setOrderFilter(orders.filter(order => order.isPaid));
            } else if (selectedFilter === 'NotDelivered') { // Corrected selectedFilter value from 'NotDelivered' to 'notDelivered'
                setOrderFilter(orders.filter(order => !order.isDelivered && order.isPaid));
            } else if (selectedFilter === 'completed') {
                setOrderFilter(orders.filter(order => order.isPaid && order.isDelivered));
            }
        }
    
    }, [dispatch, history, userInfo, selectedFilter]); 

    const data = OrderFilter.length > 0 ? OrderFilter : orders;

    // Blatant "inspiration" from https://codepen.io/Jacqueline34/pen/pyVoWr
    function convertArrayOfObjectsToCSV(array) {
        let result;

        const columnDelimiter = ',';
        const lineDelimiter = '\n';
        const keys = Object.keys(data[0]);

        result = '';
        result += keys.join(columnDelimiter);
        result += lineDelimiter;

        array.forEach(item => {
            let ctr = 0;
            keys.forEach(key => {
                if (ctr > 0) result += columnDelimiter;

                result += item[key];
                
                ctr++;
            });
            result += lineDelimiter;
        });

        return result;
    }

    // Blatant "inspiration" from https://codepen.io/Jacqueline34/pen/pyVoWr
    function downloadCSV(array) {
        const link = document.createElement('a');
        let csv = convertArrayOfObjectsToCSV(array);
        if (csv == null) return;

        const filename = 'export.csv';

        if (!csv.match(/^data:text\/csv/i)) {
            csv = `data:text/csv;charset=utf-8,${csv}`;
        }

        link.setAttribute('href', encodeURI(csv));
        link.setAttribute('download', filename);
        link.click();
    }

    return (
        <div className='pages' style={{ display: 'flex', justifyContent: "Space"}}>
        <SidebarComponent openside={openside}/>
       
        <div className='flex-grow-1 overflow-auto' style={{ marginLeft: openside ? '4' : '4' }} >
        <Container>
            <Col>
            <div className='pages' >
                <label htmlFor="order-filter">Filter Orders:</label>
                <select id="order-filter" value={selectedFilter} onChange={handleFilterChange}>
                    <option value="all">All Orders</option>
                    <option value="paid">Paid Orders</option>
                    <option value="NotDelivered">To be Delivered Orders</option>
                    <option value="completed">Completed Orders</option>
                </select>
                <p>Selected Filter: {selectedFilter}</p>
            </div>
            <h1> {selectedFilter} Orders:  {OrderFilter.length}</h1>

            </Col>
            {loading
                ? (<Loader />
                )
                
                : error
                    ? (<Message variant='danger'>{error}</Message>)
                    : (
                        <div className='admin'>
                            <DataTable
                                    columns={columns}
                                    data={data}
                                    customStyles={customStyles}
                                    fixedHeader={true}
                                    fixedHeaderScrollHeight='500px'
                                    progressPending={loading}
                                    pagination
                                    dense
                                    style={{ minWidth: '60px', width: '50%' }}
                                />
                        </div>
                    )}
        </Container>
        </div>
        
        </div>
    )
}

export default AllOrders