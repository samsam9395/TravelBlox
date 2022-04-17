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
import { Timestamp } from 'firebase/firestore';
import { doc, setDoc, addDoc, collection, getDoc } from 'firebase/firestore';
import DateTimeSelector from '../components/DateTimeSelector';
import AutoCompleteInput from '../components/AutoCompleteInput';

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
  height: 70%;
  margin: 0 auto;
  background-color: white;
  margin-top: calc(100vh - 85vh - 20px);
  padding: 20px 20px;
  display: flex;
  flex-direction: column;
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

const FormsContainer = styled.div`
  flex-direction: column;
  display: flex;
  margin: 20px 0 40px 0;
`;

const db = firebaseDB();

async function addToDataBase(
  blockTitle,
  description,
  startTimeValue,
  endTimeValue,
  location,
  collectionID,
  planDocRef
) {
  const timeBlockRef = doc(
    collection(db, collectionID, planDocRef, 'time_blocks_test')
  );

  await setDoc(timeBlockRef, {
    title: blockTitle,
    text: description,
    start: startTimeValue,
    end: endTimeValue,
    // location: location,
    place_id: location.place_id,
    place_name: location.name,
    id: timeBlockRef.id,
  });
}

function AddNewTimeBlock(props) {
  const [blockTitle, setBlockTitle] = useState('');
  //   const [address, setAddress] = useState('');
  const [description, setDescription] = useState('');
  const [startTimeValue, setStartTimeValue] = useState(null);
  const [endTimeValue, setEndTimeValue] = useState(null);
  const [initialTimeBlockData, setInitialTimeBlockData] = useState({});
  const [location, setLocation] = useState('');
  // const firebaseBlockListRef = collection(
  //   db,
  //   props.collectionID,
  //   props.planDocRef,
  //   'time_blocks'
  // );
  return (
    <>
      <BlackWrapper>
        <PopBox>
          <ButtonContainer>
            <CloseBtn
              aria-label="close"
              onClick={() => {
                props.setShowPopUp(false);
              }}>
              <Close />
            </CloseBtn>
          </ButtonContainer>
          <FormsContainer>
            <TextField
              required
              sx={{ m: 1, minWidth: 80 }}
              size="small"
              label="Title"
              variant="outlined"
              value={initialTimeBlockData.title}
              onChange={(e) => {
                setBlockTitle(e.target.value);
              }}
            />
            <DateTimeSelector
              setStartTimeValue={setStartTimeValue}
              startTimeValue={startTimeValue}
              setEndTimeValue={setEndTimeValue}
              endTimeValue={endTimeValue}
            />
            <AutoCompleteInput setLocation={setLocation} />
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
          </FormsContainer>
          <Button
            variant="contained"
            onClick={(e) => {
              if (blockTitle && location && startTimeValue && endTimeValue) {
                addToDataBase(
                  blockTitle,
                  description,
                  startTimeValue,
                  endTimeValue,
                  location,
                  props.collectionID,
                  props.planDocRef
                );
                props.setShowPopUp(false);
                alert('Successfully added!');
              } else {
                alert('Please fill in all the requirements!');
              }
            }}>
            Submit
          </Button>
        </PopBox>
      </BlackWrapper>
    </>
  );
}

export default AddNewTimeBlock;
