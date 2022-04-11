import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Header from '../components/Header';
import Footer from '../components/Footer';
import {
  InputLabel,
  TextField,
  Button,
  FormControl,
  MenuItem,
  Select,
  IconButton,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { async } from '@firebase/util';

const BlackWrapper = styled.div`
  position: fixed;
  background: rgba(0, 0, 0, 0.64);
  width: 100%;
  height: 100vh;
  top: 0;
  left: 0;
  z-index: 10;
`;

const PopBox = styled.div`
  position: relative;
  width: 40vw;
  height: 60%;
  margin: 0 auto;
  background-color: white;
  margin-top: calc(100vh - 85vh - 20px);
  padding: 20px 20px;
  display: flex;
  flex-direction: column;
`;

const BlockWrapper = styled.div`
  display: flex;
`;

const BlockTitle = styled.input`
  font-size: 16px;
  padding: 0 10px;
  margin-left: 10px;
`;

const DeleteBtn = styled(IconButton)`
  position: relative;
  top: 0;
  width: 60px;
  margin-left: auto;
`;

function AddTimeBlock() {
  const [blockTitle, setBlockTitle] = useState('');
  const [country, setCountry] = useState('');
  const [countryList, setCountryList] = useState([]);
  const [address, setAddress] = useState('');
  const [description, setDescription] = useState('');

  useEffect(async () => {
    const list = await (
      await fetch('https://restcountries.com/v3.1/all')
    ).json();
    setCountryList(list.sort());
  }, []);

  return (
    <>
      <Header />
      <BlackWrapper>
        <PopBox>
          <DeleteBtn aria-label="delete">
            <DeleteIcon />
          </DeleteBtn>
          <TextField
            sx={{ m: 1, minWidth: 80 }}
            size="small"
            label="Title"
            variant="outlined"
            value={blockTitle}
            onChange={(e) => {
              setBlockTitle(e.target.value);
            }}
          />
          <FormControl sx={{ m: 1, minWidth: 80 }} size="small">
            <InputLabel id="select-country">County</InputLabel>
            <Select
              labelId="select-country"
              value={country}
              label="County"
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
          </FormControl>
          <TextField
            sx={{ m: 1, minWidth: 80 }}
            size="small"
            label="Address"
            variant="outlined"
            value={address}
            onChange={(e) => {
              setAddress(e.target.value);
            }}
          />
          <TextField
            sx={{ m: 1, minWidth: 8, minHeight: 120 }}
            multiline
            size="small"
            label="Description"
            variant="outlined"
            value={description}
            rows={4}
            helperText="Please enter description for this time block."
            onChange={(e) => {
              setDescription(e.target.value);
            }}
          />
          <Button variant="contained">Submit</Button>
        </PopBox>
      </BlackWrapper>
      <Footer />
    </>
  );
}

export default AddTimeBlock;
