import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import {
  InputLabel,
  TextField,
  Button,
  FormControl,
  MenuItem,
  Select,
  IconButton,
} from '@mui/material';
import { Delete, Close } from '@mui/icons-material';
import firebaseDB from '../utils/firebaseConfig';
import { doc, setDoc, addDoc, collection } from 'firebase/firestore';

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

const DeleteBtn = styled(IconButton)`
  position: relative;
  top: 0;
  width: 60px;
  margin-left: auto;
`;

const CloseBtn = styled(IconButton)`
  position: relative;
  top: 0;
  width: 60px;
  margin-left: auto;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const db = firebaseDB();

async function addToDataBase(blockTitle, description) {
  // Create an initial document to update.
  const timeBlockRef = collection(
    db,
    'plan101',
    'zqZZcY8RO85mFVmtHbVI',
    'time_blocks_test'
  );

  console.log(blockTitle);
  console.log(description);

  await addDoc(timeBlockRef, {
    testTitle: 'Seoul 3 Days',
    title: blockTitle,
    text: description,
  });
}

function AddTimeBlock(props) {
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
      <BlackWrapper>
        <PopBox>
          <ButtonContainer>
            <DeleteBtn aria-label="delete">
              <Delete />
            </DeleteBtn>
            <CloseBtn
              aria-label="close"
              onClick={() => {
                props.setShowPopUp(false);
              }}>
              <Close />
            </CloseBtn>
          </ButtonContainer>
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
          <Button
            variant="contained"
            onClick={(e) => {
              if (blockTitle && address && description) {
                addToDataBase(blockTitle, description);
                props.setShowPopUp(false);
                alert('Successfully added!');
              } else {
                alert('Please fill in all the inputs!');
              }
            }}>
            Submit
          </Button>
        </PopBox>
      </BlackWrapper>
    </>
  );
}

export default AddTimeBlock;
