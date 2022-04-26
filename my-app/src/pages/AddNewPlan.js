import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';

import {
  TextField,
  Button,
  IconButton,
  Box,
  Card,
  CardMedia,
  Stack,
} from '@mui/material';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Autocomplete from '@mui/material/Autocomplete';
import { PhotoCamera } from '@mui/icons-material';
import './planDetail.scss';
import PlanCalendar from './PlanCalendar';
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
  ref,
} from 'firebase/firestore';
import firebaseDB from '../utils/firebaseConfig';
import { useNavigate, useLocation } from 'react-router-dom';
import OnlyDatePicker from '../components/Input/onlyDatePicker';
import OwnPlanCard from '../components/OwnPlanCard';
import CountrySelector from '../components/CountrySelector';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';

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

async function addPlanToUserInfo(currentUserId, createPlanDocId) {
  console.log('saving this docRef to firebase', createPlanDocId);
  try {
    const userInfoRef = doc(
      collection(db, 'userId', currentUserId, 'own_plans')
    );

    await setDoc(
      userInfoRef,
      {
        collection_id: createPlanDocId,
      },
      { merge: true }
    );
  } catch (error) {
    console.log(error);
  }
}

async function addPlanToAllPlans(
  currentUserId,
  createPlanDocId,
  planTitle,
  mainImage,
  country,
  isPublished
) {
  try {
    const allPlansRef = doc(db, 'allPlans', createPlanDocId);

    await setDoc(
      allPlansRef,
      {
        author: currentUserId,
        // collection_id: createPlanDocId,
        // plan_doc_ref: planDocRef,
        plan_doc_ref: createPlanDocId,
        title: planTitle,
        main_image: mainImage,
        country: country,
        published: isPublished,
      },
      { merge: true }
    );
  } catch (error) {
    console.log(error);
  }
}

// user={user} accessToken, email
function AddNewPlan(props) {
  const location = useLocation();
  const [planTitle, setPlanTitle] = useState('');
  const [country, setCountry] = useState('');
  const [mainImage, setMainImage] = useState('');
  const [showPopUp, setShowPopUp] = useState(false);
  const [myEvents, setMyEvents] = useState([]);
  const [showEditPopUp, setShowEditPopUp] = useState(false);
  const [currentSelectTimeData, setCurrentSelectTimeData] = useState('');
  const [currentSelectTimeId, setCurrentSelectTimeId] = useState('');
  const [hasCreatedCollection, setHasCreatedCollection] = useState(false);
  const [firebaseReady, setFirebaseReady] = useState(false);
  const [collectionRef, setCollectionRef] = useState(null);
  const [startDateValue, setStartDateValue] = useState(new Date());
  const [endDateValue, setEndDateValue] = useState(new Date());
  const [planDocRef, setPlanDocRef] = useState('');
  // const [collectionID, setCollectionId] = useState('');
  const [addedTimeBlock, setAddedTimeBlock] = useState(false);
  const [isPublished, setIsPublished] = useState(false);

  const [showFavContainer, setShowFavContainer] = useState(false);
  const currentUserId = props.user.email;
  const navigate = useNavigate();

  const createNewCollection = async (
    startDateValue,
    endDateValue,
    planTitle,
    mainImage
  ) => {
    const currentTimeMilli = new Date().getTime();
    const createPlanDocId = `plan${currentTimeMilli}`;
    // setCollectionId(createCollectionId);
    setPlanDocRef(createPlanDocId);
    try {
      await setDoc(doc(db, 'plans', createPlanDocId), {
        author: currentUserId,
        start_date: startDateValue,
        end_date: endDateValue,
        title: planTitle,
        main_image: mainImage,
        published: false,
        planDocRef: planDocRef,
      });

      setHasCreatedCollection(true);
      setCollectionRef('plans');

      addPlanToUserInfo(props.user.email, createPlanDocId);

      addPlanToAllPlans(
        props.user.email,
        createPlanDocId,
        planTitle,
        mainImage,
        country,
        isPublished
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
    planDocRef,
    startDateValue,
    endDateValue,
    isPublished
  ) {
    console.log(100, collectionRef);
    console.log(200, planDocRef);

    const batch = writeBatch(db);

    myEvents.forEach((singleEvent) => {
      const id = singleEvent.id;
      let updateRef = doc(db, 'plans', planDocRef, 'time_blocks', id);
      batch.update(updateRef, {
        end: singleEvent.end,
        start: singleEvent.start,
      });
    });

    const upperLevelUpdateRef = doc(db, 'plans', planDocRef);
    batch.update(upperLevelUpdateRef, {
      title: planTitle,
      country: country,
      main_image: mainImage,
      start_date: startDateValue,
      end_date: endDateValue,
      // origin_author: props.user.email,
      published: isPublished,
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
  const [showFavPlans, setShowFavPlans] = useState(false);
  const [dropDownOption, setDropDownOption] = useState(
    location.state.favFolderNames || []
  );
  const [selectedPlanId, setSelectedPlanId] = useState('');

  async function getFavPlan(folderName) {
    const favRef = collection(db, 'userId', props.user.email, 'fav_plans');
    const planQuery = query(favRef, where('infolder', '==', folderName));
    const plansList = await getDocs(planQuery);

    console.log(plansList.docs.map((e) => e.data().fav_plan_title));
    const list = plansList.docs.map((e) => e.data());

    if (list.length === 0) {
      console.log('No fav plans yet!');
      setFavPlansNameList('');
    } else {
      setFavPlansNameList(list);
    }
    console.log(5555, favPlansNameList);
  }

  async function importTimeBlock(selectedPlanId, planDocRef) {
    console.log(selectedPlanId);
    const importBlocksListRef = collection(
      db,
      'plans',
      selectedPlanId,
      'time_blocks'
    );

    const docSnap = await getDocs(importBlocksListRef);
    const data = docSnap.docs.map((e) => e.data());
    console.log(data);
    if (data) {
      console.log('runs 5555');

      const batch = writeBatch(db);

      const blocksListRef = doc(
        collection(db, 'plans', planDocRef, 'time_blocks')
      );

      data.forEach(async (e) => {
        try {
          await setDoc(
            blocksListRef,
            {
              status: 'imported',
              start: new Date(e.start.seconds * 1000),
              end: new Date(e.end.seconds * 1000),
              title: e.title,
              id: e.id,
              blockData: {
                place_id: e.place_id,
                place_format_address: e.place_format_address,
                place_name: e.place_name,
                place_formatted_phone_number:
                  location.international_phone_number || '',
                place_url: e.place_url,
                place_types: e.place_types,
                place_img: e.place_img,
              },
            },
            { merge: true }
          );
          setFirebaseReady(true);
          setAddedTimeBlock(true);
          alert('Imported!');
        } catch (error) {
          console.log(error);
        }
      });
    }
  }

  /*=====  End of import  ======*/

  useEffect(async () => {
    if (addedTimeBlock) {
      try {
        // const blocksListRef = collection(
        //   db,
        //   collectionID,
        //   collectionID,
        //   'time_blocks'
        // );
        setFirebaseReady(true);
        console.log('setFirebaseReady' + firebaseReady);
      } catch (error) {
        console.log(error);
      }
      if (firebaseReady) {
        const blocksListRef = collection(
          db,
          'plans',
          planDocRef,
          'time_blocks'
        );
        console.log('onsnap open');

        onSnapshot(blocksListRef, (doc) => {
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
                  status: 'origin',
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
                  status: 'origin',
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
          collectionID={'plans'}
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
          collectionID={'plans'}
          planDocRef={planDocRef}
          status={'origin'}
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
              country={country}
              // setIsLoading={setIsLoading}
            />
            <OnlyDatePicker
              setStartDateValue={setStartDateValue}
              startDateValue={startDateValue}
              setEndDateValue={setEndDateValue}
              endDateValue={endDateValue}
            />

            <FormControlLabel
              control={
                <Switch
                  checked={isPublished}
                  onChange={() => setIsPublished(!isPublished)}
                />
              }
              label="Published"
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
                          onChange={(e) => setSelectedPlanId(e.target.value)}
                          label="Plans">
                          <MenuItem value="">
                            <em>None</em>
                          </MenuItem>
                          {favPlansNameList.map((e, index) => (
                            <MenuItem
                              value={e.fav_plan_doc_ref || ''}
                              key={index}>
                              {e.fav_plan_title}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                      <Button
                        variant="outlined"
                        onClick={() =>
                          importTimeBlock(selectedPlanId, planDocRef)
                        }>
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
                    props.user.email,
                    myEvents,
                    planTitle,
                    country,
                    mainImage,
                    planDocRef,
                    startDateValue,
                    endDateValue,
                    isPublished
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
