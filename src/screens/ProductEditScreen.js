import React, {useState, useEffect} from 'react'
import axios from 'axios'
import {Link, useNavigate, useParams} from 'react-router-dom'
import {Form, Button} from 'react-bootstrap'
import {useDispatch, useSelector} from 'react-redux'
import Message from '../components/Message'
import FormContainer from '../components/FormContainer'
import Loader from '../components/Loader'
import {listProductDetails, updateProduct} from '../actions/productActions'
import {PRODUCT_UPDATE_RESET} from '../constants/productConstants'

function ProductEditScreen() {
  const {id} = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState(0)
  const [discountPrice, setDiscountPrice] = useState(0)
  const [imageA, setImageA] = useState('')
  const [imageB, setImageB] = useState('')
  const [imageC, setImageC] = useState('')
  const [imageD, setImageD] = useState('')
  const [category, setCategory] = useState('')
  const [brand, setBrand] = useState('')
  const [tags, setTags] = useState('')
  const [countInStock, setCountInStock] = useState(0)
  const [uploading, setUploading] = useState(false)

  const productId = id

  const productDetails = useSelector((state) => state.productDetails)
  const {error, loading, product} = productDetails

  const productUpdate = useSelector((state) => state.productUpdate)
  const {
    error: errorUpdate,
    loading: loadingUpdate,
    success: successUpdate,
  } = productUpdate

  useEffect(() => {
    if (successUpdate) {
      dispatch({type: PRODUCT_UPDATE_RESET})
      navigate('/admin/products')
    } else {
      if (!product.name || product.uuid !== productId) {
        dispatch(listProductDetails(productId))
      } else {
        setName(product.name)
        setDescription(product.description)
        setPrice(product.price)
        setDiscountPrice(product.discount_price)
        setImageA(product.image_a)
        setImageB(product.image_b)
        setImageC(product.image_c)
        setImageD(product.image_d)
        setBrand(product.brand.name)
        setCategory(product.category.name)
        setTags(product.tags.map((tag) => tag.name).join(', '))
        setCountInStock(product.count_in_stock)
      }
    }
  }, [dispatch, productId, product, navigate, successUpdate])

  const submitHandler = (e) => {
    e.preventDefault()
    dispatch(
      updateProduct({
        uuid: productId,
        name,
        description,
        price,
        discount_price: discountPrice,
        image_a: imageA,
        image_b: imageB,
        image_c: imageC,
        image_d: imageD,
        category,
        brand,
        tags: tags.split(',').map((tag) => tag.trim()),
        count_in_stock: countInStock,
      })
    )
  }

  const uploadFileHandler = async (e, imageType) => {
    const file = e.target.files[0]
    const formData = new FormData()

    formData.append('image', file)
    formData.append('imageType', imageType)
    formData.append('product_id', productId)

    setUploading(true)

    try {
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }

      const {data} = await axios.post(
        '/api/products/image-upload/',
        formData,
        config
      )
      if (imageType === 'image_a') {
        setImageA(data)
      } else if (imageType === 'image_b') {
        setImageB(data)
      } else if (imageType === 'image_c') {
        setImageC(data)
      } else if (imageType === 'image_d') {
        setImageD(data)
      }
      setUploading(false)
    } catch (error) {
      console.error(error)
      setUploading(false)
    }
  }

  return (
    <div>
      <Link to='/admin/products'>Go Back</Link>
      <FormContainer>
        <h1>Edit Product</h1>
        {loadingUpdate && <Loader />}
        {errorUpdate && <Message variant='danger'>{errorUpdate}</Message>}

        {loading ? (
          <Loader />
        ) : error ? (
          <Message variant='danger'>{error}</Message>
        ) : (
          <Form onSubmit={submitHandler}>
            <Form.Group controlId='name' className='py-3'>
              <Form.Label>Name</Form.Label>
              <Form.Control
                type='text'
                placeholder='Enter name'
                value={name}
                onChange={(e) => setName(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId='description' className='py-3'>
              <Form.Label>Description</Form.Label>
              <Form.Control
                as='textarea'
                rows={5}
                placeholder='Enter description'
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId='price' className='py-3'>
              <Form.Label>Price</Form.Label>
              <Form.Control
                type='number'
                placeholder='Enter price'
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId='discountPrice' className='py-3'>
              <Form.Label>Discount Price</Form.Label>
              <Form.Control
                type='number'
                placeholder='Enter discount price'
                value={discountPrice}
                onChange={(e) => setDiscountPrice(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId='imageA' className='py-3'>
              <Form.Label>Image A</Form.Label>
              <Form.Control
                type='text'
                placeholder='Enter image A URL'
                value={imageA}
                onChange={(e) => setImageA(e.target.value)}
              ></Form.Control>
              <Form.Control
                type='file'
                id='imageA-file'
                label='Select file'
                custom
                onChange={(e) => uploadFileHandler(e, 'image_a')}
              ></Form.Control>
              {uploading && <Loader />}
            </Form.Group>

            <Form.Group controlId='imageB' className='py-3'>
              <Form.Label>Image B</Form.Label>
              <Form.Control
                type='text'
                placeholder='Enter image B URL'
                value={imageB}
                onChange={(e) => setImageB(e.target.value)}
              ></Form.Control>
              <Form.Control
                type='file'
                id='imageB-file'
                label='Select file'
                custom
                onChange={(e) => uploadFileHandler(e, 'image_b')}
              ></Form.Control>
              {uploading && <Loader />}
            </Form.Group>

            <Form.Group controlId='imageC' className='py-3'>
              <Form.Label>Image C</Form.Label>
              <Form.Control
                type='text'
                placeholder='Enter image C URL'
                value={imageC}
                onChange={(e) => setImageC(e.target.value)}
              ></Form.Control>
              <Form.Control
                type='file'
                id='imageC-file'
                label='Select file'
                custom
                onChange={(e) => uploadFileHandler(e, 'image_c')}
              ></Form.Control>
              {uploading && <Loader />}
            </Form.Group>

            <Form.Group controlId='imageD' className='py-3'>
              <Form.Label>Image D</Form.Label>
              <Form.Control
                type='text'
                placeholder='Enter image D URL'
                value={imageD}
                onChange={(e) => setImageD(e.target.value)}
              ></Form.Control>
              <Form.Control
                type='file'
                id='imageD-file'
                label='Select file'
                custom
                onChange={(e) => uploadFileHandler(e, 'image_d')}
              ></Form.Control>
              {uploading && <Loader />}
            </Form.Group>

            <Form.Group controlId='brand' className='py-3'>
              <Form.Label>Brand</Form.Label>
              <Form.Control
                type='text'
                placeholder='Enter brand'
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId='category' className='py-3'>
              <Form.Label>Category</Form.Label>
              <Form.Control
                type='text'
                placeholder='Enter category'
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId='tags' className='py-3'>
              <Form.Label>Tags</Form.Label>
              <Form.Control
                type='text'
                placeholder='Enter tags (comma separated)'
                value={tags}
                onChange={(e) => setTags(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId='countInStock' className='py-3'>
              <Form.Label>Stock</Form.Label>
              <Form.Control
                type='number'
                placeholder='Enter stock'
                value={countInStock}
                onChange={(e) => setCountInStock(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Button type='submit' variant='primary'>
              Update
            </Button>
          </Form>
        )}
      </FormContainer>
    </div>
  )
}

export default ProductEditScreen
