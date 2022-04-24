import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';

import {
  TextField,
  Button,
  IconButton,
  Box,
  Card,
  CardMedia,
  CircularProgress,
  Stack,
} from '@mui/material';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Autocomplete from '@mui/material/Autocomplete';
import { PhotoCamera } from '@mui/icons-material';
import './planDetail.scss';
import PlanCalendar from './Calendar';
import AddNewTimeBlock from './AddNewTimeBlock';
import EditTimeBlock from './EditTimeBlock';
import {
  doc,
  onSnapshot,
  collection,
  setDoc,
  writeBatch,
  updateDoc,
  addDoc,
  query,
  where,
  getDocs,
} from 'firebase/firestore';
import firebaseDB from '../utils/firebaseConfig';
import { Link, Navigate, useNavigate, useLocation } from 'react-router-dom';
import OnlyDatePicker from '../components/Input/onlyDatePicker';
import OwnPlanCard from '../components/OwnPlanCard';
import CountrySelector from '../components/CountrySelector';

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

function deleteBlockInMylist(prev, id) {
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

const FavCollectionContainer = styled.div`
  width: 100%;
  padding: 20px;
  border: 1px solid black;
`;

async function addPlanToUserInfo(currentUserId, createCollectionId) {
  try {
    const userInfoRef = doc(
      collection(db, 'userId', currentUserId, 'own_plans')
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

async function addPlanToAllPlans(
  currentUserId,
  createCollectionId,
  planDocRef,
  planTitle,
  mainImage,
  country
) {
  try {
    const allPlansRef = doc(db, 'allPlans', createCollectionId);

    await setDoc(
      allPlansRef,
      {
        author: currentUserId,
        collection_id: createCollectionId,
        // plan_doc_ref: planDocRef,
        plan_doc_ref: createCollectionId,
        title: planTitle,
        mainImage: mainImage,
        country: country,
      },
      { merge: true }
    );
  } catch (error) {
    console.log(error);
  }
}

function AddNewPlan() {
  const location = useLocation();
  const [currentUserId, setCurrentUserId] = useState(location.state.user.email);
  const [planTitle, setPlanTitle] = useState('');
  const [country, setCountry] = useState('');
  const [mainImage, setMainImage] = useState('');
  const [showPopUp, setShowPopUp] = useState(false);
  const [myEvents, setMyEvents] = useState([]);
  const [showEditPopUp, setShowEditPopUp] = useState(false);
  const [currentSelectTimeData, setCurrentSelectTimeData] = useState('');
  const [currentSelectTimeId, setCurrentSelectTimeId] = useState('');
  // const [isLoading, setIsLoading] = useState(true);
  const [hasCreatedCollection, setHasCreatedCollection] = useState(false);
  const [firebaseReady, setFirebaseReady] = useState(false);
  const [collectionRef, setCollectionRef] = useState(null);
  const [startDateValue, setStartDateValue] = useState(new Date());
  const [endDateValue, setEndDateValue] = useState(new Date());
  const [planDocRef, setPlanDocRef] = useState('');
  const [collectionID, setCollectionId] = useState('');
  const [addedTimeBlock, setAddedTimeBlock] = useState(false);

  const [showFavContainer, setShowFavContainer] = useState(false);
  const navigate = useNavigate();

  const favFolderNames = location.state.favFolderNames;

  const createNewCollection = async (
    startDateValue,
    endDateValue,
    planTitle,
    mainImage
  ) => {
    const currentTimeMilli = new Date().getTime();
    const author = localStorage.getItem('userEmail');
    const createCollectionId = `plan${currentTimeMilli}`;
    setCollectionId(createCollectionId);

    try {
      const docRef = await setDoc(
        doc(db, createCollectionId, createCollectionId),
        {
          author: author,
          start_date: startDateValue,
          end_date: endDateValue,
          title: planTitle,
          main_image: mainImage,
        }
      );
      console.log('Document written with ID: ', docRef);

      setHasCreatedCollection(true);
      setPlanDocRef(createCollectionId);
      setCollectionRef(createCollectionId);

      addPlanToUserInfo(currentUserId, createCollectionId);

      addPlanToAllPlans(
        currentUserId,
        createCollectionId,
        createCollectionId,
        planTitle,
        mainImage,
        country
      );

      console.log(
        '247 adding these ',
        currentUserId,
        createCollectionId,
        createCollectionId,
        planTitle,
        mainImage,
        country
      );
    } catch (e) {
      console.error('Error adding document: ', e);
    }
  };
  async function saveToDataBase(
    currentUserId,
    myEvents,
    planTitle,
    country,
    mainImage,
    collectionRef,
    planDocRef,
    startDateValue,
    endDateValue
  ) {
    console.log(
      111111,
      currentUserId,
      myEvents,
      planTitle,
      country,
      mainImage,
      collectionRef,
      planDocRef,
      startDateValue,
      endDateValue
    );

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
      origin_author: currentUserId,
    });

    try {
      await batch.commit();
      alert('Successfully created new plan!');
      navigate('/dashboard');
    } catch (error) {
      console.log(error.message);
    }
  }

  /*=============================================
  =            import            =
  =============================================*/
  const [favPlansNameList, setFavPlansNameList] = useState(null);
  const [favPlansIdList, setFavlansNameList] = useState(null);
  const [showFavPlans, setShowFavPlans] = useState(false);
  const [dropDownOption, setDropDownOption] = useState(
    location.state.favFolderNames || []
  );
  const [selectedPlanId, setSelectedPlanId] = useState('');

  async function getFavPlan(folderName) {
    const favRef = collection(db, 'userId', currentUserId, 'fav_plans');
    const planQuery = query(favRef, where('infolder', '==', folderName));
    const plansList = await getDocs(planQuery);

    console.log(plansList.docs.map((e) => e.data().fav_plan_title));
    const list = plansList.docs.map((e) => e.data());

    if (list.length === 0) {
      console.log('No fav plans yet!');
      setFavPlansNameList('');
    } else {
      setFavPlansNameList(list);
      console.log(5555, favPlansNameList);
    }
  }

  async function importTimeBlock(selectedPlanId) {
    console.log(selectedPlanId);
    const blocksListRef = collection(
      db,
      selectedPlanId,
      selectedPlanId,
      'time_blocks'
    );

    const docSnap = await getDocs(blocksListRef);

    if (docSnap) {
      console.log(docSnap.docs.map((e) => e.data()));
      // console.log(docSnap.map((e) => e.data()));
    }
  }

  /*=====  End of import  ======*/

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
                ...deleteBlockInMylist(prev, id),
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
              setMyEvents((prev) => [...deleteBlockInMylist(prev, id)]);
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
              autoComplete="off"
            />
            <CountrySelector
              setCountry={setCountry}
              // setIsLoading={setIsLoading}
            />
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
        {/* hasCreatedCollection */}
        {hasCreatedCollection ? (
          <>
            <CalendarContainer>
              <PlanCalendar
                startDateValue={startDateValue}
                setMyEvents={setMyEvents}
                myEvents={myEvents}
                setShowEditPopUp={setShowEditPopUp}
                setCurrentSelectTimeData={setCurrentSelectTimeData}
                setCurrentSelectTimeId={setCurrentSelectTimeId}
              />
            </CalendarContainer>
            <Stack
              sx={{ m: 2 }}
              direction="row"
              alignItems="center"
              spacing={2}>
              <Button
                variant="contained"
                onClick={() => {
                  setShowPopUp(true);
                }}>
                Add new event
              </Button>
              <Button
                variant="contained"
                onClick={() => setShowFavContainer(!showFavContainer)}>
                Import Favourite
              </Button>

              {showFavContainer && (
                <div>
                  <Autocomplete
                    disablePortal
                    id="combo-box-demo"
                    options={dropDownOption}
                    sx={{ width: 300 }}
                    renderInput={(params) => (
                      <TextField {...params} label="Favourite Folders" />
                    )}
                    onChange={(e) => {
                      setShowFavPlans(true);
                      console.log(e.target.textContent);
                      getFavPlan(e.target.textContent);
                    }}
                  />
                  {showFavPlans && favPlansNameList && (
                    <Stack direction="row" alignItems="center" spacing={2}>
                      <FormControl
                        variant="standard"
                        sx={{ m: 1, minWidth: 120 }}>
                        <InputLabel id="demo-simple-select-standard-label">
                          Plan
                        </InputLabel>
                        <Select
                          labelId="demo-simple-select-standard-label"
                          id="demo-simple-select-standard"
                          value={selectedPlanId}
                          onChange={
                            (e) => setSelectedPlanId(e.target.value)
                            // setSelectedPlan({
                            //   planId: e.target.value,
                            //   planRef: e.target.data,
                            // })
                          }
                          label="Plans">
                          <MenuItem value="">
                            <em>None</em>
                          </MenuItem>
                          {favPlansNameList.map((e, index) => (
                            <MenuItem
                              value={e.fav_collection_id || ''}
                              key={index}>
                              {e.fav_plan_title}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                      <Button
                        variant="outlined"
                        onClick={() => importTimeBlock(selectedPlanId)}>
                        Import
                      </Button>
                    </Stack>
                  )}
                </div>
              )}
            </Stack>

            <Button
              sx={{ m: 5 }}
              variant="contained"
              onClick={() => {
                console.log(myEvents.length);
                if (myEvents.length === 0) {
                  alert('Please create at least one event!');
                } else {
                  saveToDataBase(
                    currentUserId,
                    myEvents,
                    planTitle,
                    country,
                    mainImage,
                    collectionRef,
                    planDocRef,
                    startDateValue,
                    endDateValue
                  );
                }
              }}>
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
                    console.log('going to create new plan');
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
              <Button variant="outlined" onClick={() => navigate('/dashboard')}>
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
