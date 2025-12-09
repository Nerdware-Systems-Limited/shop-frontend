import React, { useState, useEffect } from 'react'
import { ColumnDirective, ColumnsDirective, GridComponent } from '@syncfusion/ej2-react-grids';
import { LinkContainer } from 'react-router-bootstrap'
import { Table, Button, Row, Col } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useLocation } from 'react-router-dom'
import Loader from '../components/Loader'
import Message from '../components/Message'
import Paginate from '../components/Paginate'
import { listPerfumes, deletePerfume, createPerfume } from '../actions/perfumeactions'
import { PERFUME_CREATE_RESET } from '../constants/perfumeconstants'

    
function list() {
    const dispatch = useDispatch()

    const navigate = useNavigate()

    const perfumeList = useSelector(state => state.perfumeList)
    const { loading, error, perfumes, pages, page } = perfumeList

    const perfumeDelete = useSelector(state => state.perfumeDelete)
    const { loading: loadingDelete, error: errorDelete, success: successDelete } = perfumeDelete

    const perfumeCreate = useSelector(state => state.perfumeCreate)
    const { loading: loadingCreate, error: errorCreate, success: successCreate, perfume: createdperfume } = perfumeCreate


    const User = useSelector(state => state.User)
    const { userInfo } = User

    const location = useLocation();

    let keyword = location.search
    useEffect(() => {
        dispatch({ type: PERFUME_CREATE_RESET })

        if (!userInfo.isAdmin) {
            navigate('/login')
        }

        if (successCreate) {
            navigate(`/${createdperfume._id}/editperfume`)
        } else {
            dispatch(listPerfumes(keyword))
        }

    }, [dispatch, navigate, userInfo, successDelete, successCreate, createdperfume, keyword])


    const deleteHandler = (id) => {

        if (window.confirm('Are you sure you want to delete this perfume?')) {
            dispatch(deletePerfume(id))
        }
    }

    const createPerfumeHandler = () => {
        dispatch(createPerfume())
    }

    return (
        <GridComponent dataSource={perfumes} />
      );
    };

export default list