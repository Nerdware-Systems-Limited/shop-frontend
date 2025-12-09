import React, { useEffect, useState } from 'react'
import { Table, Button, Row, Col, Container } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import Loader from '../components/Loader'
import Message from '../components/Message'
// import Paginate from '../components/Paginate'
import { listPerfumes, deletePerfume, createPerfume } from '../actions/perfumeactions'
import { PERFUME_CREATE_RESET } from '../constants/perfumeconstants'
import SidebarComponent from '../components/SidebarComponent'
import DataTable, { defaultThemes } from 'react-data-table-component';

function perfumeList({ openside }) {

    const dispatch = useDispatch()

    const [SelectedRows, setSelectedRows] = useState([]);

    const navigate = useNavigate()

    const perfumeList = useSelector(state => state.perfumeList)
    const { loading, error, perfumes  } = perfumeList

    const data = perfumes

    const perfumeDelete = useSelector(state => state.perfumeDelete)
    const { loading: loadingDelete, error: errorDelete, success: successDelete } = perfumeDelete

    const perfumeCreate = useSelector(state => state.perfumeCreate)
    const { loading: loadingCreate, error: errorCreate, success: successCreate, perfume: createdperfume } = perfumeCreate


    const User = useSelector(state => state.User)
    const { userInfo } = User

    const location = useLocation();

    console.log(location)
    let keyword = location.search
    useEffect(() => {
        dispatch({ type: PERFUME_CREATE_RESET })

        if (!userInfo.isAdmin) {
            navigate('/login')
        }

        if (successCreate) {
            navigate(`/${createdperfume._id}/editperfume`, {state: { create: 'create' }})
        } else {
            dispatch(listPerfumes(keyword))
        }

    }, [dispatch, navigate, userInfo, successDelete, successCreate, createdperfume, keyword])

    
    const deleteHandler = () => {
        if (window.confirm(`Are you sure you want to delete ${SelectedRows.length} perfume(s)?`)) {
            SelectedRows.forEach(id => {
                dispatch(deletePerfume(id));
            });
        }
    };

    const createPerfumeHandler = () => {
        dispatch(createPerfume())
    }
    const rowDisabledCriteria = row => row.countInStock == 0
    const columns = [
        {
            name: 'Name',
            selector: row => <Link to={`/${row._id}/editperfume`}>{row.name}</Link>,
        },
        {
            name: 'Brand',
            selector: row => row.brand,
        },
        {
            name: 'Category',
            selector: row => row.category,
        },
        {
            name: 'Rating',
            selector: row => row.rating,
        },
        {
            name: 'Price',
            selector: row => row.price,
        },
        {
            name: 'Stock Count',
            selector: row => row.countInStock,
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
        <div className='pages' style={{ display: 'flex'}}>
        <SidebarComponent openside={openside}/>
        <div className='flex-grow-1 overflow-auto' style={{ marginLeft: openside ? '4' : '4' }} >
            <Container>
            <Row className='align-items-center'>
                <Col>
                    <h1>Perfumes</h1>
                    {/* <PerfumeDataTable perfumes={perfumes} deleteHandler={deleteHandler} /> */}
                </Col>

                <Row className='text-right'>
                <Col xs={3} className='mb-3'>
                    <Button onClick={createPerfumeHandler} block style={{ backgroundColor: 'green', borderColor: 'green' }}>
                        <i className='fas fa-plus'></i> Create Perfume
                    </Button>
                </Col>
                <Col xs={3} className='mb-3'>
                    <Button onClick={deleteHandler} block style={{ backgroundColor: 'red', borderColor: 'red' }}>
                        <i className='fas fa-trash'></i> Delete
                    </Button>
                </Col>
            </Row>
            </Row>

            {loadingDelete && <Loader />}
            {errorDelete && <Message variant='danger'>{errorDelete}</Message>}


            {loadingCreate && <Loader />}
            {errorCreate && <Message variant='danger'>{errorCreate}</Message>}

            {loading
                ? (<Loader />)
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
                                    selectableRows
                                    onSelectedRowsChange={Handleselected}
                                    selectableRowDisabled={rowDisabledCriteria}
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

export default perfumeList