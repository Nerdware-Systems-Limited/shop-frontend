import React, {useState, useEffect} from 'react';
import axios from 'axios'
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom'
import {Button, Form} from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { listPerfumesDetail, updatePerfume } from '../actions/perfumeactions'
import Loader from '../components/Loader'
import Message from '../components/Message'
import FormContainer from '../components/FormContainer'
import { PERFUME_UPDATE_RESET } from '../constants/perfumeconstants';

function EditPerfume({ match }) {
  
  const { id } = useParams();
  const perfumeId = id

  const [name, setName] = useState('')
  const [price, setPrice] = useState(0)
  const [image, setImage] = useState('')
  const [brand, setBrand] = useState('')
  const [category, setCategory] = useState('')
  const [countInStock, setCountInStock] = useState(0)
  const [description, setDescription] = useState('')
  const [uploading, setUploading] = useState(false)


  const location = useLocation()
  const create = location.state

  const dispatch = useDispatch()

  const perfumeDetail = useSelector(state => state.perfumeDetail)
  const { error, loading, perfume } = perfumeDetail

  const perfumeUpdate = useSelector(state => state.perfumeUpdate)
  const { error: errorUpdate, loading: loadingUpdate, success: successUpdate } = perfumeUpdate

  const navigate = useNavigate()

  useEffect(()=>{
    if (successUpdate) {
        dispatch({ type: PERFUME_UPDATE_RESET })
        navigate('/perfumelist')
    }
    else {
        if (!perfume.name || perfume._id !== Number(perfumeId)) {
            dispatch(listPerfumesDetail(perfumeId))
        } else {
            setName(perfume.name)
            setPrice(perfume.price)
            setImage(perfume.image)
            setBrand(perfume.brand)
            setCategory(perfume.category)
            setCountInStock(perfume.countInStock)
            setDescription(perfume.description)
        }

    }
    
    
    
  }, [dispatch, perfumeId, perfume, navigate, successUpdate])

  

  const submitHandler = (e) => {
    e.preventDefault()
    console.log(perfumeId)
    dispatch(updatePerfume({
        _id: perfumeId,
        name,
        price,
        image,
        brand,
        category,
        countInStock,
        description
    }))
}

const uploadFileHandler = async (e) => {
    const file = e.target.files[0]
    const formData = new FormData()

    console.log(perfumeId)
    formData.append('image', file)
    formData.append('perfume_id', perfumeId)

    setUploading(true)

    try {
        const config = {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }

        const { data } = await axios.post('/perfumes/upload/', formData, config)


        setImage(data)
        setUploading(false)

    } catch (error) {
        setUploading(false)
    }
}
  return (
    <div>
            <Link to='/perfumelist'>
                Go Back
            </Link>

            <FormContainer>

                {create ? (<h1> Create Perfume</h1>) : (<h1> Edit Perfume</h1>)}

                {loadingUpdate && <Loader />}
                {errorUpdate && <Message variant='danger'>{errorUpdate}</Message>}

                {loading ? <Loader /> : error ? <Message variant='danger'>{error}</Message>
                    : (
                        <Form onSubmit={submitHandler}>

                            <Form.Group controlId='name'>
                                <Form.Label>Name</Form.Label>
                                <Form.Control

                                    type='name'
                                    placeholder='Enter name'
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                >
                                </Form.Control>
                            </Form.Group>

                            <Form.Group controlId='price'>
                                <Form.Label>Price</Form.Label>
                                <Form.Control

                                    type='number'
                                    placeholder='Enter price'
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                >
                                </Form.Control>
                            </Form.Group>


                            <Form.Group controlId='image'>
                                <Form.Label>Image</Form.Label>
                                <Form.Control

                                    type='text'
                                    placeholder='Enter image'
                                    value={image}
                                    onChange={(e) => setImage(e.target.value)}
                                >
                                </Form.Control>

                                <Form.Control 
                                type="file"
                                id='image-file'
                                label='Choose File'
                                custom
                                onChange={ uploadFileHandler } />
                                 {uploading && <Loader />}

                            </Form.Group>
                            <Form.Group>

                            </Form.Group>


                            <Form.Group controlId='brand'>
                                <Form.Label>Brand</Form.Label>
                                <Form.Control

                                    type='text'
                                    placeholder='Enter brand'
                                    value={brand}
                                    onChange={(e) => setBrand(e.target.value)}
                                >
                                </Form.Control>
                            </Form.Group>

                            <Form.Group controlId='countinstock'>
                                <Form.Label>Stock</Form.Label>
                                <Form.Control

                                    type='number'
                                    placeholder='Enter stock'
                                    value={countInStock}
                                    onChange={(e) => setCountInStock(e.target.value)}
                                >
                                </Form.Control>
                            </Form.Group>

                            <Form.Group controlId='category'>
                                <Form.Label>Category</Form.Label>
                                <Form.Control

                                    type='text'
                                    placeholder='Enter category'
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                >
                                </Form.Control>
                            </Form.Group>

                            <Form.Group controlId='description'>
                                <Form.Label>Description</Form.Label>
                                <Form.Control

                                    type='text'
                                    placeholder='Enter description'
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                >
                                </Form.Control>
                            </Form.Group>

                            <Button type='submit' variant='primary'>
                                Update
                        </Button>

                        </Form>
                    )}

            </FormContainer >
        </div>
  )}

export default EditPerfume;
