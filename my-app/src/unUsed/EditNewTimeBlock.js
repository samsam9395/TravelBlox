import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { TextField, Button, IconButton, Autocomplete } from '@mui/material';
import { Delete, Close } from '@mui/icons-material';
import firebaseDB from '../utils/firebaseConfig';
import { doc, setDoc, collection, getDoc, deleteDoc } from 'firebase/firestore';
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
`;

const db = firebaseDB();

async function UpdateToDataBase(
  blockTitle,
  description,
  startTimeValue,
  endTimeValue,
  location,
  locationId,
  locationName,
  id,
  collectionID,
  planDocRef
) {
  const timeBlockRef = doc(db, collectionID, planDocRef, 'time_blocks', id);

  if (location) {
    await setDoc(
      timeBlockRef,
      {
        title: blockTitle,
        text: description,
        start: startTimeValue,
        end: endTimeValue,
        place_id: location.place_id,
        place_name: location.place_name,
      },
      {
        merge: true,
      }
    );
  } else {
    await setDoc(
      timeBlockRef,
      {
        title: blockTitle,
        text: description,
        start: startTimeValue,
        end: endTimeValue,
        place_id: locationId,
        place_name: locationName,
      },
      {
        merge: true,
      }
    );
  }

  console.log('successfully post to firebase!');
}

async function retreiveFromDataBase(
  id,
  setDataReady,
  setInitialTimeBlockData,
  collectionID,
  planDocRef
) {
  const timeBlockRef = doc(db, collectionID, planDocRef, 'time_blocks', id);
  const timeBlockSnap = await getDoc(timeBlockRef);

  if (timeBlockSnap.exists()) {
    console.log('retreived');
    const initialData = timeBlockSnap.data();
    console.log(initialData);

    if (setInitialTimeBlockData) {
      setInitialTimeBlockData(initialData);
    }
    if (setDataReady) {
      setDataReady(true);
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

function EditNewTimeBlock(props) {
  const [initialTimeBlockData, setInitialTimeBlockData] = useState({});
  const [blockTitle, setBlockTitle] = useState('');
  const [locationName, setLocationName] = useState('');
  const [locationId, setLocationId] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [startTimeValue, setStartTimeValue] = useState(
    props.currentSelectTimeData.start || null
  );
  const [endTimeValue, setEndTimeValue] = useState(
    props.currentSelectTimeData.end || null
  );
  const [dataReady, setDataReady] = useState(false);

  //   collectionID={collectionID}
  //   planDocRef={planDocRef}

  const timeBlockRef = doc(
    db,
    props.collectionID,
    props.planDocRef,
    'time_blocks',
    props.currentSelectTimeId
  );

  useEffect(() => {
    retreiveFromDataBase(
      props.currentSelectTimeId,
      setDataReady,
      setInitialTimeBlockData,
      props.collectionID,
      props.planDocRef
    );
  }, []);

  useEffect(() => {
    setDescription(initialTimeBlockData.text);
    setBlockTitle(initialTimeBlockData.title);
    //  setLocation(initialTimeBlockData.place_id);
    setLocationName(initialTimeBlockData.place_name);
    setLocationId(initialTimeBlockData.id);
  }, [initialTimeBlockData]);

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
          </FormsContainer>
          <Button
            variant="contained"
            onClick={(e) => {
              if (
                (location || locationId) &&
                blockTitle &&
                startTimeValue &&
                endTimeValue
              ) {
                try {
                  UpdateToDataBase(
                    blockTitle,
                    description,
                    startTimeValue,
                    endTimeValue,
                    location,
                    locationId,
                    locationName,
                    props.currentSelectTimeId,
                    props.collectionID,
                    props.planDocRef
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

export default EditNewTimeBlock;
