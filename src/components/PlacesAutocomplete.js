import React, { useState, useEffect, useRef } from 'react';
import { LoadScript, Autocomplete } from '@react-google-maps/api';

const PlacesAutocomplete = ({ value, onChange, onSelect }) => {
  const [address, setAddress] = useState(value);
  const autocompleteRef = useRef(null);

  const handlePlaceChanged = () => {
    const place = autocompleteRef.current.getPlace();
    if (place.geometry) {
      const formattedAddress = place.formatted_address;
      const lat = place.geometry.location.lat();
      const lng = place.geometry.location.lng();
      setAddress(formattedAddress);
      onSelect({
        address: formattedAddress,
        latitude: lat,
        longitude: lng,
      });
    }
  };

  useEffect(() => {
    if (window.google) {
      const autocomplete = new window.google.maps.places.Autocomplete(document.getElementById('address'), {
        types: ['address'],
        componentRestrictions: { country: 'ng' },
      });
      autocompleteRef.current = autocomplete;
      autocomplete.addListener('place_changed', handlePlaceChanged);
    }
  }, []);

  return (
    <LoadScript
      googleMapsApiKey='AIzaSyAV-Ro1WZ5bFKJsxEjgRn8ytNa9VxmEkrw'
      libraries={['places']}
    >
      <Autocomplete
        onLoad={(autocomplete) => (autocompleteRef.current = autocomplete)}
        onPlaceChanged={handlePlaceChanged}
      >
        <input
          type='text'
          className='form-control'
          value={address}
          onChange={(e) => {
            setAddress(e.target.value);
            onChange(e.target.value);
          }}
          placeholder='Enter address'
          id='address'
        />
      </Autocomplete>
    </LoadScript>
  );
};

export default PlacesAutocomplete;
