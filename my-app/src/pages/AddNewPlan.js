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
  Box,
  Card,
  CardMedia,
  CircularProgress,
  Stack,
} from '@mui/material';
import { PhotoCamera } from '@mui/icons-material';
import './planDetail.scss';
import PlanCalendar from './Calendar';
import AddNewTimeBlock from './AddNewTimeBlock';
import EditTimeBlock from './EditTimeBlock';
import {
  doc,
  getDoc,
  getDocs,
  collectionGroup,
  query,
  where,
  onSnapshot,
  collection,
  setDoc,
  writeBatch,
  updateDoc,
  addDoc,
} from 'firebase/firestore';
import firebaseDB from '../utils/firebaseConfig';
import { Link, Navigate } from 'react-router-dom';
import OnlyDatePicker from '../components/onlyDatePicker';

const db = firebaseDB();

const Wrapper = styled.div`
  padding: 50px;
  margin: auto;
`;

const TopContainer = styled.div`
  display: flex;
`;

const TitleSection = styled.div`
  display: flex;
  flex-direction: column;
`;

const CalendarContainer = styled.div`
  width: 100%;
  height: 60vh;
  border: 1px solid black;
  margin-top: 40px;
`;

const Input = styled('input')({
  display: 'none',
});

async function saveToDataBase(
  myEvents,
  planTitle,
  country,
  mainImage,
  collectionRef,
  planDocRef,
  startDateValue,
  endDateValue
) {
  const batch = writeBatch(db);

  myEvents.forEach((singleEvent) => {
    const id = singleEvent.id;
    let updateRef = doc(db, collectionRef, planDocRef, 'time_blocks', id);
    batch.update(updateRef, {
      end: singleEvent.end,
      start: singleEvent.start,
    });
  });

  const upperLevelUpdateRef = doc(db, collectionRef, planDocRef);
  batch.update(upperLevelUpdateRef, {
    title: planTitle,
    country: country,
    main_image: mainImage,
    start_date: startDateValue,
    end_date: endDateValue,
  });

  await batch.commit();
}

function DeleteBlockInMylist(prev, id) {
  const indexOfObject = prev.findIndex((timeblock) => {
    return timeblock.id === id;
  });
  console.log(prev);
  console.log(indexOfObject);
  // let updateList = [...prev].slice(indexOfObject, 1);
  let updateList = prev.splice(indexOfObject, 1);
  console.log(prev);
  return prev;
}

function handleImageUpload(e, setMainImage) {
  console.log(e.target.files[0]);
  const reader = new FileReader();
  if (e) {
    reader.readAsDataURL(e.target.files[0]);
  }

  reader.onload = function () {
    // console.log(reader.result); //base64encoded string
    setMainImage(reader.result);
  };
  reader.onerror = function (error) {
    console.log('Error: ', error);
  };
}

const InstructionText = styled.div`
  font-size: 12px;
  font-weight: 600;
  font-style: italic;
  line-height: 1.5;
  text-align: center;
  padding: 10px 0;
`;

const ButtonContainer = styled.div`
  display: flex;
  padding: 30px;
  align-items: center;
  justify-content: center;
`;

async function addPlanToUserInfo(currentUserId, createCollectionId) {
  try {
    const userInfoRef = doc(
      collection(db, 'userId', currentUserId, 'own plans')
    );

    await setDoc(
      userInfoRef,
      {
        collection_id: createCollectionId,
      },
      { merge: true }
    );
  } catch (error) {
    console.log(error);
  }
}

function AddNewPlan() {
  const [user, setUser] = useState('');
  const [planTitle, setPlanTitle] = useState('');
  const [country, setCountry] = useState('');
  const [countryList, setCountryList] = useState([]);
  const [mainImage, setMainImage] = useState('');
  const [showPopUp, setShowPopUp] = useState(false);
  const [myEvents, setMyEvents] = useState([]);
  const [showEditPopUp, setShowEditPopUp] = useState(false);
  const [currentSelectTimeData, setCurrentSelectTimeData] = useState('');
  const [currentSelectTimeId, setCurrentSelectTimeId] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [hasCreatedCollection, setHasCreatedCollection] = useState(false);
  const [firebaseReady, setFirebaseReady] = useState(false);
  const [collectionRef, setCollectionRef] = useState(null);
  const [startDateValue, setStartDateValue] = useState(0);
  const [endDateValue, setEndDateValue] = useState(0);
  const [planDocRef, setPlanDocRef] = useState('');
  const [collectionID, setCollectionId] = useState('');
  const [addedTimeBlock, setAddedTimeBlock] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(''); //this is completely duplicated with dashboard, need to find a way to pass data to here

  useEffect(() => {
    if (localStorage.getItem('accessToken')) {
      setCurrentUserId(localStorage.getItem('userEmail'));
    }
  }, []);

  const createNewCollection = async (
    startDateValue,
    endDateValue,
    planTitle,
    mainImage
  ) => {
    const currentTimeMilli = new Date().getTime();
    const author = localStorage.getItem('userEmail');
    const createCollectionId = `plan${currentTimeMilli}`;

    try {
      const docRef = await addDoc(collection(db, createCollectionId), {
        author: author,
        start_date: startDateValue,
        end_date: endDateValue,
        title: planTitle,
        main_image: mainImage,
      });
      console.log('Document written with ID: ', docRef.id);
      setHasCreatedCollection(true);
      setPlanDocRef(docRef.id);
      setCollectionId(createCollectionId);
      addPlanToUserInfo(currentUserId, createCollectionId);
    } catch (e) {
      console.error('Error adding document: ', e);
    }
  };

  useEffect(() => {
    if (localStorage.getItem('accessToken')) {
      setUser(localStorage.getItem('accessToken'));
    }
  }, []);

  useEffect(async () => {
    const list = await (
      await fetch('https://restcountries.com/v3.1/all')
    ).json();
    setCountryList(list.sort());
    setIsLoading(false);
  }, []);

  useEffect(async () => {
    if (addedTimeBlock) {
      try {
        const blocksListRef = collection(
          db,
          collectionID,
          planDocRef,
          'time_blocks'
        );
        setFirebaseReady(true);
        setCollectionRef(blocksListRef);
        console.log('setFirebaseReady' + firebaseReady);
      } catch (error) {
        console.log(error);
      }
      if (firebaseReady) {
        console.log('onsnap open');
        onSnapshot(collectionRef, (doc) => {
          doc.docChanges().forEach((change) => {
            if (change.type === 'added') {
              // console.log(myEvents);
              // console.log(change.doc.data());
              setMyEvents((prev) => [
                ...prev,
                {
                  start: new Date(change.doc.data().start.seconds * 1000),
                  end: new Date(change.doc.data().end.seconds * 1000),
                  title: change.doc.data().title,
                  id: change.doc.data().id,
                },
              ]);
            }
            if (change.type === 'modified') {
              console.log('Modified time: ', change.doc.data());
              const id = change.doc.data().id;
              setMyEvents((prev) => [
                ...DeleteBlockInMylist(prev, id),
                {
                  start: new Date(change.doc.data().start.seconds * 1000),
                  end: new Date(change.doc.data().end.seconds * 1000),
                  title: change.doc.data().title,
                  id: change.doc.data().id,
                },
              ]);
            }
            if (change.type === 'removed') {
              console.log('Removed time: ', change.doc.data());
              const id = change.doc.data().id;
              setMyEvents((prev) => [...DeleteBlockInMylist(prev, id)]);
            }
          });
        });
      }
    }
  }, [addedTimeBlock, firebaseReady]);

  return (
    <Wrapper>
      {showPopUp ? (
        <AddNewTimeBlock
          setShowPopUp={setShowPopUp}
          showPopUp={showPopUp}
          collectionID={collectionID}
          planDocRef={planDocRef}
          setAddedTimeBlock={setAddedTimeBlock}
          startDateValue={startDateValue}
        />
      ) : null}
      {showEditPopUp ? (
        // <EditNewTimeBlock
        //   showEditPopUp={showEditPopUp}
        //   setShowEditPopUp={setShowEditPopUp}
        //   currentSelectTimeData={currentSelectTimeData}
        //   currentSelectTimeId={currentSelectTimeId}
        //   collectionID={collectionID}
        //   planDocRef={planDocRef}
        // />
        <EditTimeBlock
          showEditPopUp={showEditPopUp}
          setShowEditPopUp={setShowEditPopUp}
          currentSelectTimeData={currentSelectTimeData}
          currentSelectTimeId={currentSelectTimeId}
          collectionID={collectionID}
          planDocRef={planDocRef}
        />
      ) : null}
      <>
        <InstructionText>Please create some basic info first!</InstructionText>
        <TopContainer>
          <TitleSection>
            <TextField
              required
              sx={{ m: 1, minWidth: 80 }}
              label="Title"
              variant="outlined"
              value={planTitle}
              onChange={(e) => {
                setPlanTitle(e.target.value);
              }}
            />
            <FormControl sx={{ m: 1, minWidth: 80 }} size="small">
              <InputLabel id="select-country">County</InputLabel>
              {isLoading ? (
                <Box sx={{ display: 'flex' }} align="center" justify="center">
                  <CircularProgress size={14} sx={{ py: 2 }} />
                </Box>
              ) : (
                <Select
                  required
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
            <OnlyDatePicker
              setStartDateValue={setStartDateValue}
              startDateValue={startDateValue}
              setEndDateValue={setEndDateValue}
              endDateValue={endDateValue}
            />
          </TitleSection>
          <Card sx={{ width: 400 }}>
            <CardMedia component="img" image={mainImage} height="200" />
            <label htmlFor="icon-button-file">
              <Input
                accept="image/*"
                id="icon-button-file"
                type="file"
                onChange={(e) => {
                  handleImageUpload(e, setMainImage);
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
        </TopContainer>
        {hasCreatedCollection ? (
          <>
            <CalendarContainer>
              <PlanCalendar
                setMyEvents={setMyEvents}
                myEvents={myEvents}
                setShowEditPopUp={setShowEditPopUp}
                setCurrentSelectTimeData={setCurrentSelectTimeData}
                setCurrentSelectTimeId={setCurrentSelectTimeId}
              />
            </CalendarContainer>
            <Button
              variant="contained"
              onClick={() => {
                setShowPopUp(true);
              }}>
              Add new event
            </Button>
            <Button
              variant="contained"
              onClick={() =>
                saveToDataBase(
                  myEvents,
                  planTitle,
                  country,
                  mainImage,
                  collectionRef,
                  planDocRef
                )
              }>
              Save
            </Button>
          </>
        ) : (
          <ButtonContainer>
            <Stack direction="row" alignItems="center" spacing={2}>
              <Button
                variant="contained"
                onClick={() => {
                  if (startDateValue && endDateValue && planTitle) {
                    createNewCollection(
                      startDateValue,
                      endDateValue,
                      planTitle,
                      mainImage
                    );
                  } else {
                    alert('Please provide the required fields!');
                  }
                }}>
                All Set
              </Button>
              <Button
                variant="outlined"
                onClick={() => <Navigate to="/dashboard"></Navigate>}>
                Nah create later
              </Button>
            </Stack>
          </ButtonContainer>
        )}
      </>
    </Wrapper>
  );
}

export default AddNewPlan;
