import React, { useEffect, useState } from 'react';
import {
  InputLabel,
  FormControl,
  Box,
  TextField,
  Autocomplete,
  CircularProgress,
  Select,
  MenuItem,
} from '@mui/material';

export default function CountrySelector() {
  const [country, setCountry] = useState('');
  const [countryList, setCountryList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(async () => {
    const list = await (
      await fetch('https://restcountries.com/v3.1/all')
    ).json();
    setCountryList(list.sort());
    setIsLoading(false);
  }, []);

  return (
    <FormControl sx={{ m: 1, minWidth: 100 }} size="small">
      <InputLabel id="select-country">County</InputLabel>
      {isLoading ? (
        <Box sx={{ display: 'flex' }} align="center" justify="center">
          <CircularProgress size={14} sx={{ py: 2 }} />
        </Box>
      ) : (
        <Select
          labelId="select-country"
          value={country}
          label="Country"
          onChange={(e) => {
            setCountry(e.target.value);
          }}>
          {countryList.map((country, index) => {
            return (
              <MenuItem value={country.name.common} key={index}>
                {country.flag} {country.name.common}
              </MenuItem>
            );
          })}
        </Select>
      )}
    </FormControl>
  );
}
