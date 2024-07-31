import React, {useEffect, useState} from 'react'
import {Modal, Button, ListGroup, Row, Col} from 'react-bootstrap'
import axios from 'axios'

const Send24WidgetModal = ({show, onClose, onSelect, sizeIdMap, cart}) => {
  const [send24Prices, setSend24Prices] = useState(null)
  const [expandedIndex, setExpandedIndex] = useState(null)

  useEffect(() => {
    if (show) {
      const fetchSend24Prices = async () => {
        const size_id = '68882080-9cb3-11ed-a1e0-1b525c297de0'
        const is_fragile = 0
        const pickup_coordinates = '6.5194683, 3.3987129'
        const pickup_state = 'Lagos'
        const destination_coordinates = `${cart.shippingAddress.latitude}, ${cart.shippingAddress.longitude}`
        const destination_state = cart.shippingAddress.state

        try {
          const response = await axios.post(
            `${process.env.REACT_APP_SEND24_API_URL}/pricing`,
            {
              size_id,
              pickup_coordinates,
              destination_coordinates,
              pickup_state,
              destination_state,
              is_fragile,
            }
          )

          const filteredPrices = response.data.data.filter(
            (option) =>
              Object.keys(option).includes('HUB_TO_HUB') ||
              Object.keys(option).includes('HUB_TO_DOOR')
          )

          setSend24Prices(filteredPrices)
        } catch (error) {
          console.error('Error fetching Send24 prices:', error)
        }
      }

      fetchSend24Prices()
    }
  }, [show, sizeIdMap, cart])

  const handleReadMore = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index)
  }

  return (
    <Modal
      show={show}
      onHide={onClose}
      className='send24-widget-modal'
      centered
    >
      <Modal.Header className='d-flex justify-content-between align-items-center'>
        <img
          src='/send24-logo.webp'
          alt='Send24 Logo'
          className='send24-logo'
        />
        <button className='close-button' onClick={onClose}>
          &times;
        </button>
      </Modal.Header>
      <Modal.Body>
        <ListGroup>
          {send24Prices &&
            send24Prices.map((option, index) => {
              const variant = Object.keys(option)[0]
              const price = option[variant].price
              const description =
                variant === 'HUB_TO_HUB'
                  ? 'Easily pick up your packages at a send24 hub closest to you!'
                  : 'Have a send24 agent deliver your packages to your doorstep!'

              return (
                <ListGroup.Item key={index} className='price-option'>
                  <Row className='align-items-center'>
                    <Col>{variant.replace(/_/g, ' ')}</Col>
                    <Col className='text-center'>${price}</Col>
                    <Col className='text-end'>
                      <Button
                        variant='primary'
                        onClick={() => {
                          onSelect(price)
                          onClose()
                        }}
                        className='select-button'
                      >
                        Select
                      </Button>
                    </Col>
                  </Row>
                  <Row>
                    <Col className='mt-2'>
                      <span
                        className='read-more-text'
                        onClick={() => handleReadMore(index)}
                      >
                        {expandedIndex === index
                          ? 'Read less...'
                          : 'Read more...'}
                      </span>
                      {expandedIndex === index && (
                        <div className='description'>{description}</div>
                      )}
                    </Col>
                  </Row>
                </ListGroup.Item>
              )
            })}
        </ListGroup>
      </Modal.Body>
    </Modal>
  )
}

export default Send24WidgetModal
