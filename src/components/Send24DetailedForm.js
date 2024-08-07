import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import PlacesAutocomplete from './PlacesAutocomplete';
import NIGERIAN_STATES from '../NigerianStates';

const Send24DetailedForm = ({ show, onClose, onSave }) => {
  const [state, setState] = useState('');
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');
  const [addressNote, setAddressNote] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');

  const handleSave = () => {
    onSave({ state, city, address, addressNote, postalCode, latitude, longitude });
    onClose();
  };

  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Send24 Delivery Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="state">
            <Form.Label>State</Form.Label>
            <Form.Select required value={state} onChange={(e) => setState(e.target.value)}>
              <option value="">Select State</option>
              {NIGERIAN_STATES.map((state) => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
          <Form.Group controlId="city" className="py-3">
            <Form.Label>City</Form.Label>
            <Form.Control
              required
              type="text"
              placeholder="Enter city name"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="address" className="py-3">
            <Form.Label>Address</Form.Label>
            <PlacesAutocomplete
              value={address}
              onChange={setAddress}
              onSelect={(addressData) => {
                setAddress(addressData.address);
                setLatitude(addressData.latitude);
                setLongitude(addressData.longitude);
              }}
            />
          </Form.Group>
          <Form.Group controlId="addressNote" className="py-3">
            <Form.Label>Address Note</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter address note"
              value={addressNote}
              onChange={(e) => setAddressNote(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="postalCode" className="py-3">
            <Form.Label>Postal Code</Form.Label>
            <Form.Control
              required
              type="text"
              placeholder="Enter postal code"
              value={postalCode}
              onChange={(e) => setPostalCode(e.target.value)}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSave}>
          Save
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default Send24DetailedForm;
