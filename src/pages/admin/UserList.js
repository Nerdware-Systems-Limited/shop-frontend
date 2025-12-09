import React, { useEffect, useState } from 'react'
import { LinkContainer } from 'react-router-bootstrap'
import { Table, Button, Col, Row, Container } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, Link } from 'react-router-dom'
import Loader from '../components/Loader'
import Message from '../components/Message'
import { listUsers, deleteUser } from '../actions/user_actions'
import SidebarComponent from '../components/SidebarComponent'
import DataTable, { defaultThemes } from 'react-data-table-component';

function UserList({ openside }) {

    const dispatch = useDispatch()
    const history = useNavigate()

    const [SelectedRows, setSelectedRows] = useState([]);

    const userList = useSelector(state => state.userList)
    const { loading, error, users } = userList

    const User = useSelector(state => state.User)
    const { userInfo } = User

    const data = users

    const userDelete = useSelector(state => state.userDelete)
    const { success: successDelete } = userDelete


    useEffect(() => {
        if (userInfo && userInfo.isAdmin) {
            dispatch(listUsers())
        } else {
            history('/login')
        }

    }, [dispatch, history, successDelete, userInfo ])



    const deleteHandler = () => {
        if (window.confirm(`Are you sure you want to delete this(these) ${SelectedRows.length} particular user(s)?`)) {
            SelectedRows.forEach(id => {
                dispatch(deleteUser(id));
            });
        }
    };

    const columns = [
        {
            name: 'Name',
            selector: row => <Link to={`/${row._id}/edituser`}>{row.name}</Link>,
        },
        {
            name: 'Email',
            selector: row => row.email,
        },
        {
            name: 'Is Staff',
            selector: row => row.isAdmin ? (<i className='fas fa-check' style={{ color: 'green' }}></i>) : (<i className='fa-solid fa-xmark' style={{ color: 'red' }}></i>),
        },
    ];
    
    
    
    const Handleselected = ( selection ) => {
        setSelectedRows(selection.selectedRows.map(row => row._id))
    }

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

    return (
        <Col>
    <div className='pages' style={{ display: 'flex'}}>
        <SidebarComponent openside={openside}/>
        <Container>
        <div className='flex-grow-1 overflow-auto' >
            <br></br>
            <h1>Users</h1>
            {loading
                ? (<Loader />)
                : error
                    ? (<Message variant='danger'>{error}</Message>)
                    : (
                        <div className='admin'>
                            <Row className='text-left'>
                            <Col>
                            
                            <Button className='btn-sm' variant='danger' onClick={deleteHandler} block>
                                <i className='fas fa-trash'></i> Delete
                            </Button>
                            </Col>
                            </Row>
                            <DataTable
                                    columns={columns}
                                    data={data}
                                    customStyles={customStyles}
                                    fixedHeader={true}
                                    fixedHeaderScrollHeight='500px'
                                    progressPending={loading}
                                    selectableRows
                                    onSelectedRowsChange={Handleselected}
                                    pagination
                                    dense
                                    style={{ minWidth: '60px', width: '50%' }}
                                />
                        </div>
                    )}
        </div>
        </Container>
        </div>
        </Col>
    )
}

export default UserList