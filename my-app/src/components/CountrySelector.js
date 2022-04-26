import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

// setCountry={setCountry} setIsLoading={setIsLoading}
export default function CountrySelector(props) {
  // const [country, setCountry] = useState('');
  const [countryList, setCountryList] = useState([{ label: '' }]);
  const [displayValue, setDisplayValue] = useState({});

  useEffect(async () => {
    const list = await (
      await fetch('https://restcountries.com/v3.1/all')
    ).json();

    const countries = list.map((e) => {
      return {
        label: e.name.common,
        region: e.region,
        subregion: e.subregion,
        trans_mando: e.translations.zho || '',
        map: e.maps.googleMaps,
        flags: e.flags.svg,
      };
    });

    setCountryList(countries);
  }, []);

  useEffect(() => {
    if (props.country) {
      setDisplayValue(props.country);
    }
  }, [props.planTitle]);

  return (
    <Autocomplete
      id="country-select"
      sx={{ m: 1, width: 300 }}
      value={displayValue}
      options={countryList}
      autoHighlight
      isOptionEqualToValue={(option, value) => option.id === value.id}
      getOptionLabel={(option) => option.label || ''}
      onChange={(e) => {
        for (let country of countryList) {
          if (country.label === e.target.textContent) {
            console.log(country);
            setDisplayValue(country);
            props.setCountry(country);
          }
        }
        // console.log(e.target);
        // props.setCountry(e.target.textContent || value);
      }}
      renderOption={(props, option) => (
        <Box
          component="li"
          sx={{ '& > img': { mr: 2, flexShrink: 0 } }}
          {...props}>
          <img loading="lazy" width="20" src={option.flags} alt="flag" />
          {option.label}
        </Box>
      )}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Choose a country"
          inputProps={{
            ...params.inputProps,
          }}
          autoComplete="off" // disable autocomplete and autofill
          // value={country}
          onChange={(e) => {
            props.setCountry(e.target.value);
          }}
        />
      )}
    />
  );
}
