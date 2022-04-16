import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { InputLabel, TextField } from '@mui/material';
import GoogleAPI from '../utils/GoogleAPI';
import { Wrapper, Status } from '@googlemaps/react-wrapper';

const ApiKey = GoogleAPI();

function SearchInput() {
  const ref = useRef(null);
  const [location, setLocation] = useState('');
  const [placeId, setPlaceId] = useState('');

  useEffect(() => {
    if (ref.current) {
      const autocomplete = new window.google.maps.places.Autocomplete(
        ref.current
      );
      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        setLocation(place);
        setPlaceId(location.place_id);
      });
    }
  }, [ref, setLocation]);

  return (
    <>
      <TextField
        // ref={ref}
        inputRef={ref}
        required
        autoComplete="off"
        sx={{ m: 1, minWidth: 80 }}
        size="small"
        label="Address"
        variant="outlined"
        // value={address}
      />
    </>
  );
}

function AutoCompleteInput() {
  return (
    <>
      <Wrapper apiKey={ApiKey} libraries={['places']}>
        <SearchInput />
      </Wrapper>
    </>
  );
}

export default AutoCompleteInput;
