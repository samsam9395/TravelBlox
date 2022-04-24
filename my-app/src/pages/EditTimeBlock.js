import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import {
  TextField,
  Button,
  IconButton,
  Autocomplete,
  CardMedia,
  Card,
  Box,
} from '@mui/material';
import { Delete, Close, PhotoCamera } from '@mui/icons-material';
import firebaseDB from '../utils/firebaseConfig';
import { doc, setDoc, collection, getDoc, deleteDoc } from 'firebase/firestore';
import DateTimeSelector from '../components/Input/DateTimeSelector';
import AutoCompleteInput from '../components/AutoCompleteInput';
import LocationCard from '../components/LocationCard';

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

const FormsContainer = styled.div`
  flex-direction: column;
  display: flex;
  margin: 20px 0 40px 0;
  overflow: auto;
`;

const db = firebaseDB();

const Input = styled('input')({
  display: 'none',
});

const TimeBlockImgContainer = styled.div`
  width: 100%;
  margin-top: 30px;
  margin-bottom: 30px;
`;

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

async function UpdateToDataBase(
  timeBlockRef,
  blockTitle,
  description,
  startTimeValue,
  endTimeValue,
  location,
  timeBlockImage
) {
  // const location_img = location.photos[0].getUrl();

  try {
    await setDoc(
      timeBlockRef,
      {
        title: blockTitle,
        text: description,
        start: startTimeValue,
        end: endTimeValue,
        place_id: location.place_id,
        place_name: location.name,
        place_format_address: location.formatted_address,
        timeblock_img: timeBlockImage,
        place_img: location.photos[0].getUrl() || '',
        place_formatted_phone_number: location.formatted_phone_number || '',
        place_international_phone_number:
          location.international_phone_number || '',
        place_url: location.url,
        place_rating: location.rating,
        place_types: location.types,
      },
      {
        merge: true,
      }
    );
  } catch (error) {
    console.log(error);
  }

  console.log('successfully post to firebase!');
}

async function retreiveFromDataBase(timeBlockRef, setInitBlockData) {
  const timeBlockSnap = await getDoc(timeBlockRef);

  if (timeBlockSnap.exists()) {
    console.log('retreived');
    const initialData = timeBlockSnap.data();
    console.log(initialData);

    if (setInitBlockData) {
      setInitBlockData(initialData);
    }

    return initialData;
  } else {
    console.log('No such document!');
  }
}

async function deleteFromDataBase(timeBlockRef, blockTitle, setShowEditPopUp) {
  await deleteDoc(timeBlockRef);
  alert(blockTitle + 'is deleted!');
  setShowEditPopUp(false);
}

// collectionID={collectionID}
//planDocRef={planDocRef}

function EditTimeBlock(props) {
  const [initBlockData, setInitBlockData] = useState({});
  const [blockTitle, setBlockTitle] = useState('');
  const [locationName, setLocationName] = useState('');
  const [location, setLocation] = useState('');
  const [placeId, setPlaceId] = useState('');
  // const [helperInitAddress, setHelperInitAddress] = useState('');
  const [description, setDescription] = useState('');
  const [startTimeValue, setStartTimeValue] = useState(
    props.currentSelectTimeData.start || null
  );
  const [endTimeValue, setEndTimeValue] = useState(
    props.currentSelectTimeData.end || null
  );
  const [timeBlockImage, setTimeBlockImage] = useState('');
  const [isImported, setIsImported] = useState(false);
  const [importPlaceData, setImportPlaceData] = useState({});
  const [timeBlockRef, setTimeBlockRef] = useState('');

  // might need to be assigned outside???
  // const timeBlockRef = doc(
  //   db,
  //   props.collectionID,
  //   props.planDocRef,
  //   'time_blocks',
  //   props.currentSelectTimeId
  // );

  console.log(props.importData);

  useEffect(() => {
    if (props.importData.status === 'imported') {
      const data = props.importData.blockData;
      setBlockTitle(props.importData.title);
      console.log(6666, 'imported yes');
      console.log(data);
      setIsImported(true);
      setLocationName(data.place_name);
      setPlaceId(data.place_id);
      setImportPlaceData(data);
      setStartTimeValue(new Date(props.importData.start));
      setEndTimeValue(new Date(props.importData.end));
    } else if (props.importData.status === 'origin') {
      console.log('wrong origin');
      setTimeBlockRef(
        doc(
          db,
          props.collectionID,
          props.planDocRef,
          'time_blocks',
          props.currentSelectTimeId
        )
      );
      // retreiveFromDataBase(timeBlockRef, setInitBlockData);
    }
  }, [props.importData.status]);

  useEffect(() => {
    if (props.importData.status === 'origin' && initBlockData) {
      setDescription(initBlockData.text);
      setBlockTitle(initBlockData.title);
      setPlaceId(initBlockData.place_id);
      setLocationName(initBlockData.place_name);

      // const initFirebaseLocationData = {
      //   place_id: initBlockData.place_id,
      //   name: initBlockData.place_name,
      //   formatted_address: initBlockData.place_format_address,
      // };

      setTimeBlockImage(initBlockData.timeblock_img);

      setLocation({
        name: initBlockData.place_name,
        formatted_address: initBlockData.place_format_address,
        formatted_phone_number: initBlockData.place_formatted_phone_number,
        international_phone_number:
          initBlockData.place_international_phone_number,
        url: initBlockData.place_url,
        types: initBlockData.types,
        mainImg: initBlockData.place_img,
        rating: initBlockData.place_rating,
        // from: 'editMode',
      });
    }
  }, [initBlockData]);

  return (
    <>
      <BlackWrapper>
        <PopBox>
          <ButtonContainer>
            <DeleteBtn
              aria-label="delete"
              onClick={() =>
                deleteFromDataBase(
                  timeBlockRef,
                  blockTitle,
                  props.setShowEditPopUp
                )
              }>
              <Delete />
            </DeleteBtn>
            <CloseBtn
              aria-label="close"
              onClick={() => {
                props.setShowEditPopUp(false);
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
              value={blockTitle}
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
            <AutoCompleteInput
              setLocation={setLocation}
              locationName={locationName}
              // helperInitAddress={helperInitAddress}
              // setHelperInitAddress={setHelperInitAddress}
              placeId={placeId}
            />
            <LocationCard
              location={location}
              importPlaceData={importPlaceData}
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
            <TimeBlockImgContainer>
              <Card sx={{ m: 1, minWidthh: 200, minHeight: 200 }}>
                <CardMedia
                  component="img"
                  image={timeBlockImage}
                  height="300"
                />
                <label htmlFor="icon-button-file">
                  <Input
                    helperText="Add an image for this time block."
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
            </TimeBlockImgContainer>
          </FormsContainer>
          <Button
            variant="contained"
            onClick={(e) => {
              if (location && blockTitle && startTimeValue && endTimeValue) {
                try {
                  UpdateToDataBase(
                    timeBlockRef,
                    blockTitle,
                    description,
                    startTimeValue,
                    endTimeValue,
                    location,
                    timeBlockImage
                  );
                  props.setShowEditPopUp(false);
                  alert('Successfully updated!');
                } catch (error) {
                  alert('Something went wrong, please try again!');
                  console.log(error);
                }
              } else {
                alert('Please check your inputs!');
              }
            }}>
            Submit
          </Button>
        </PopBox>
      </BlackWrapper>
    </>
  );
}

export default EditTimeBlock;
