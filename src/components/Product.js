import React from 'react'
import {Card} from 'react-bootstrap'
import Rating from './Rating'
import {Link} from 'react-router-dom'

function Product({product}) {
  return (
    <Card className='my-3 py-3 rounded'>
      <Link to={`/product/${product.uuid}`}>
        <Card.Img src={product.image_a} className='card-img-top' />
      </Link>

      <Card.Body className='card-body'>
        <Link
          to={`/product/${product.uuid}`}
          className='list-group-item-no-decoration'
        >
          <Card.Title as='div' className='card-title'>
            <strong>{product.name}</strong>
          </Card.Title>
        </Link>

        <Card.Text as='div' className='card-text'>
          <div className='rating'>
            <Rating
              value={product.rating}
              text={
                <div style={{whiteSpace: 'pre-wrap'}}>
                  {`${product.num_of_reviews} reviews`}
                </div>
              }
              color={'#f8e825'}
            />
          </div>
        </Card.Text>

        <div className='price-container'>
          <Card.Text as='h2' className='card-discount-price'>
            ${product.discount_price}
          </Card.Text>
          <Card.Text as='h2' className='card-price'>
            ${product.price}
          </Card.Text>
        </div>
      </Card.Body>
    </Card>
  )
}

export default Product
