import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

// setCountry={setCountry} setIsLoading={setIsLoading}
export default function CountrySelector(props) {
  // const [country, setCountry] = useState('');
  const [countryList, setCountryList] = useState([{ label: '' }]);
  // const [isLoading, setIsLoading] = useState(true);

  useEffect(async () => {
    const list = await (
      await fetch('https://restcountries.com/v3.1/all')
    ).json();

    const countries = list.map((e) => {
      return {
        label: e.name.common,
        region: e.region,
        subregion: e.subregion,
        trans_mando: e.translations.zho,
        map: e.maps.googleMaps,
        flags: e.flags.svg,
      };
    });

    setCountryList(countries);
  }, []);

  return (
    <Autocomplete
      id="country-select"
      sx={{ m: 1, width: 300 }}
      options={countryList}
      autoHighlight
      getOptionLabel={(option) => option.label}
      onChange={(e) => {
        props.setCountry(e.target.textContent);
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

    // <FormControl sx={{ m: 1, minWidth: 100 }} size="small">
    //   <InputLabel id="select-country">County</InputLabel>
    //   {isLoading ? (
    //     <Box sx={{ display: 'flex' }} align="center" justify="center">
    //       <CircularProgress size={14} sx={{ py: 2 }} />
    //     </Box>
    //   ) : (
    //     <Select
    //       labelId="select-country"
    //       value={country}
    //       label="Country"
    //       onChange={(e) => {
    //         setCountry(e.target.value);
    //       }}>
    //       {countryList.map((country, index) => {
    //         return (
    //           <MenuItem value={country.name.common} key={index}>
    //             {country.flag} {country.name.common}
    //           </MenuItem>
    //         );
    //       })}
    //     </Select>
    //   )}
    // </FormControl>
  );
}
