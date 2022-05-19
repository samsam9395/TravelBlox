import React, { useState, useEffect, useRef } from 'react';
import { TextField } from '@mui/material';
import { themeColours } from '../styles/globalTheme';

function SearchInput(props) {
  const [inputLocationValue, setInputLocationValue] = useState('');

  const ref = useRef(null);

  useEffect(() => {
    if (ref.current) {
      const autocomplete = new window.google.maps.places.Autocomplete(
        ref.current
      );
      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        props.setLocation(place);
        setInputLocationValue(place.name);
      });
    }
  }, [ref, props.setLocation]);

  useEffect(() => {
    setInputLocationValue(props.locationName);
  }, [props.locationName]);

  return (
    <TextField
      inputRef={ref}
      required
      autoComplete="off"
      sx={{ m: 1, minWidth: 80, label: { color: themeColours.light_orange } }}
      size="small"
      label="Address"
      variant="outlined"
      value={inputLocationValue}
      onChange={(e) => {
        setInputLocationValue(e.target.value);
      }}
    />
  );
}

function AutoCompleteInput(props) {
  return (
    <SearchInput
      setLocation={props.setLocation}
      locationName={props.locationName || ''}
      placeId={props.placeId}
    />
  );
}

export default AutoCompleteInput;
