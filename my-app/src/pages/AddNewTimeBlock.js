import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import {
  InputLabel,
  TextField,
  Button,
  IconButton,
  CardMedia,
  Card,
  Box,
} from '@mui/material';
// import { Close, PhotoCamera } from '@mui/icons-material';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import Close from '@mui/icons-material/Close';
import AddLocationIcon from '@mui/icons-material/AddLocation';
import firebaseDB from '../utils/firebaseConfig';
import { doc, setDoc, addDoc, collection, getDoc } from 'firebase/firestore';
import DateTimeSelector from '../components/DateTimeSelector';
import AutoCompleteInput from '../components/AutoCompleteInput';
import LocationCard from '../components/LocationCard';

const db = firebaseDB();

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
  width: 80vw;
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
  overflow: auto;
`;

const Input = styled('input')({
  display: 'none',
});

function handleImageUpload(e, setTimeBlockImage) {
  console.log(e.target.files[0]);
  const reader = new FileReader();
  if (e) {
    reader.readAsDataURL(e.target.files[0]);
  }

  reader.onload = function () {
    // console.log(reader.result); //base64encoded string
    setTimeBlockImage(reader.result);
  };
  reader.onerror = function (error) {
    console.log('Error: ', error);
  };
}

function AddNewTimeBlock(props) {
  const [blockTitle, setBlockTitle] = useState('');
  //   const [address, setAddress] = useState('');
  const [description, setDescription] = useState('');
  const [startTimeValue, setStartTimeValue] = useState(props.startDateValue);
  const [endTimeValue, setEndTimeValue] = useState(props.startDateValue);
  const [initialTimeBlockData, setInitialTimeBlockData] = useState({});
  const [location, setLocation] = useState('');
  const [timeBlockImage, setTimeBlockImage] = useState('');

  console.log(props.collectionID);

  useEffect(() => {
    console.log(location);
  }, [location]);

  async function addToDataBase(
    blockTitle,
    description,
    startTimeValue,
    endTimeValue,
    location,
    collectionID,
    planDocRef,
    timeBlockImage
  ) {
    console.log('db', collectionID, planDocRef, 'time_blocks');

    const timeBlockRef = doc(
      collection(db, collectionID, planDocRef, 'time_blocks')
    );

    try {
      await setDoc(timeBlockRef, {
        title: blockTitle,
        text: description,
        start: startTimeValue,
        end: endTimeValue,
        // location: location,
        place_id: location.place_id,
        place_name: location.name,
        place_format_address: location.formatted_address,
        id: timeBlockRef.id,
        timeblock_img: timeBlockImage,
        location: location,
      });

      props.setShowPopUp(false);
      alert('Successfully added!');
    } catch (error) {
      console.log(error);
    }

    props.setAddedTimeBlock(true);
  }

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
            <LocationCard location={location} />
            <TextField
              required
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
            <Card sx={{ width: 400 }}>
              <CardMedia component="img" image={timeBlockImage} height="200" />
              <label htmlFor="icon-button-file">
                <Input
                  accept="image/*"
                  id="icon-button-file"
                  type="file"
                  onChange={(e) => {
                    handleImageUpload(e, setTimeBlockImage);
                  }}
                />
                <Box textAlign="center">
                  <IconButton
                    color="primary"
                    aria-label="upload picture"
                    component="div">
                    <PhotoCamera />
                  </IconButton>
                </Box>
              </label>
            </Card>
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
                  props.planDocRef,
                  timeBlockImage
                );
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
