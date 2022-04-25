import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import {
  TextField,
  Button,
  IconButton,
  Box,
  Card,
  CardMedia,
  // CircularProgress,
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
import OnlyDatePicker from '../components/Input/onlyDatePicker';
import CountrySelector from '../components/CountrySelector';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';

import {
  doc,
  getDoc,
  getDocs,
  // collectionGroup,
  query,
  where,
  onSnapshot,
  collection,
  setDoc,
  writeBatch,
  // updateDoc,
} from 'firebase/firestore';
import firebaseDB from '../utils/firebaseConfig';
import { useNavigate, useLocation } from 'react-router-dom';

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

const FavCollectionContainer = styled.div`
  width: 100%;
  padding: 20px;
  border: 1px solid black;
`;

async function saveToDataBase(
  planCollectionRef,
  collectionID,
  planDocRef,
  myEvents,
  planTitle,
  country,
  mainImage,
  startDateValue,
  endDateValue,
  isPublished
) {
  const batch = writeBatch(db);
  console.log(9999, country);

  myEvents.forEach((singleEvent) => {
    const id = singleEvent.id;
    let updateRef = doc(db, collectionID, planDocRef, 'time_blocks', id);
    batch.update(updateRef, {
      end: singleEvent.end,
      start: singleEvent.start,
    });
  });

  batch.update(planCollectionRef, {
    title: planTitle,
    country: country,
    main_image: mainImage,
    start_date: startDateValue,
    end_date: endDateValue,
    published: isPublished,
  });

  await batch.commit();
}

function deleteBlockInMylist(prev, id) {
  const indexOfObject = prev.findIndex((timeblock) => {
    return timeblock.id === id;
  });

  // let updateList = [...prev].slice(indexOfObject, 1);
  let updateList = prev.splice(indexOfObject, 1);

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

async function addPlanToAllPlans(
  currentUserId,
  collectionID,
  planTitle,
  mainImage,
  country,
  isPublished
) {
  try {
    const allPlansRef = doc(db, 'allPlans', collectionID);

    await setDoc(
      allPlansRef,
      {
        author: currentUserId,
        collection_id: collectionID,
        // plan_doc_ref: planDocRef,
        plan_doc_ref: collectionID,
        title: planTitle,
        mainImage: mainImage,
        country: country,
        published: isPublished,
      },
      { merge: true }
    );
  } catch (error) {
    console.log(error);
  }
}

// props
// userId={user.email} favFolderNames={favFolderNames}

//currentPlanRef
function EditPlanDetail(props) {
  const [planTitle, setPlanTitle] = useState('');
  const [country, setCountry] = useState('');
  const [mainImage, setMainImage] = useState(null);
  const [showPopUp, setShowPopUp] = useState(false);
  const [myEvents, setMyEvents] = useState([]);
  const [showEditPopUp, setShowEditPopUp] = useState(false);
  const [currentSelectTimeData, setCurrentSelectTimeData] = useState('');
  const [currentSelectTimeId, setCurrentSelectTimeId] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [startDateValue, setStartDateValue] = useState(0);
  const [endDateValue, setEndDateValue] = useState(0);
  const [showFavContainer, setShowFavContainer] = useState(false);
  const [isPublished, setIsPublished] = useState(false);

  //React Route
  const location = useLocation();
  const collectionID = location.state.collectionID;
  const planDocRef = location.state.planDocRef;

  const currentUserId = props.userId;

  const planCollectionRef = doc(db, collectionID, planDocRef);
  const blocksListRef = collection(db, collectionID, planDocRef, 'time_blocks');

  const navigate = useNavigate();
  const redirectToStatic = () => {
    navigate('/static-plan-detail', {
      state: {
        fromPage: 'editPlans',
        collectionID: collectionID,
        planDocRef: collectionID,
      },
    });
  };

  /*=============================================
=            import on edit plan            =
=============================================*/
  const [favPlansNameList, setFavPlansNameList] = useState(null);
  const [favPlansIdList, setFavPlanIdList] = useState(null);
  const [showFavPlans, setShowFavPlans] = useState(false);
  const [dropDownOption, setDropDownOption] = useState(
    props.favFolderNames || []
  );
  const [selectedPlanId, setSelectedPlanId] = useState('');
  const [importData, setImportData] = useState({});

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
      console.log(list);
      setFavPlansNameList(list);
      console.log(5555, favPlansNameList);
    }
  }

  console.log(importData);

  async function importTimeBlock(selectedPlanId) {
    console.log(selectedPlanId);
    const blocksListRef = collection(
      db,
      selectedPlanId,
      selectedPlanId,
      'time_blocks'
    );

    const docSnap = await getDocs(blocksListRef);

    // console.log(docSnap.docs.map((e) => e.data()));
    const data = docSnap.docs.map((e) => e.data());
    console.log(data);

    const timeBlockRef = doc(
      collection(db, collectionID, collectionID, 'time_blocks')
    );
    data.forEach(async (timeblock) => {
      console.log(timeblock);
      try {
        await setDoc(
          timeBlockRef,
          {
            title: timeblock.title,
            start: timeblock.start,
            end: timeblock.end,
            place_id: timeblock.place_id,
            place_name: timeblock.place_name,
            place_format_address: timeblock.place_format_address,
            id: timeblock.id,
            place_img: timeblock.place_img || '',
            place_formatted_phone_number:
              timeblock.place_formatted_phone_number || '',
            place_url: timeblock.place_url,
            place_types: timeblock.place_types || '',
            status: 'imported',
          },
          { merge: true }
        );
        console.log(collectionID);
        alert('Successfully imported!');
      } catch (error) {
        console.log(error);
      }
    });
    // const importEvents = data.map((e) => ({
    //   status: 'imported',
    //   start: new Date(e.start.seconds * 1000),
    //   end: new Date(e.end.seconds * 1000),
    //   title: e.title,
    //   id: e.id,
    //   blockData: {
    //     place_id: e.place_id,
    //     place_format_address: e.place_format_address,
    //     place_name: e.place_name,
    //     place_formatted_phone_number: location.international_phone_number || '',
    //     place_url: e.place_url,
    //     place_types: e.place_types,
    //     place_img: e.place_img,
    //   },
    // }));
    // console.log(importEvents);
    // return importEvents; //for updating local event
  }

  function addToDataBase(collectionID, importResult) {
    console.log('adding to dataBase', importResult);
    console.log('db', collectionID, collectionID, 'time_blocks');

    const timeBlockRef = doc(
      collection(db, collectionID, collectionID, 'time_blocks')
    );

    console.log(importResult);
    if (importResult) {
      importResult.map(async (timeblock) => {
        console.log(timeblock);
        try {
          await setDoc(
            timeBlockRef,
            {
              title: timeblock.title,
              start: timeblock.start,
              end: timeblock.end,
              place_id: timeblock.place_id,
              place_name: timeblock.place_name,
              place_format_address: timeblock.place_format_address,
              id: timeblock.id,
              place_img: timeblock.place_img || '',
              place_formatted_phone_number:
                timeblock.place_formatted_phone_number || '',
              place_url: timeblock.place_url,
              place_types: timeblock.place_types || '',
              status: 'imported',
            },
            { merge: true }
          );
          console.log(collectionID);
          alert('Successfully imported!');
        } catch (error) {
          console.log(error);
        }
      });
    }
  }

  /*=====  End of import on edit plan  ======*/

  useEffect(() => {
    console.log(console.log('location state is', location.state));
  }, []);

  useEffect(() => {
    setDropDownOption(props.favFolderNames);
  }, [props.favFolderNames]);

  useEffect(async () => {
    const docSnap = await getDoc(planCollectionRef);
    console.log(docSnap.data().country);
    setCountry(docSnap.data().country);
    setPlanTitle(docSnap.data().title);

    setMainImage(docSnap.data().main_image);
    setStartDateValue(new Date(docSnap.data().start_date.seconds * 1000));
    setEndDateValue(new Date(docSnap.data().end_date.seconds * 1000));
  }, []);

  useEffect(async () => {
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
              status: change.doc.data().status || '',
              place_format_address: change.doc.data().place_format_address,
              place_name: change.doc.data().place_id,
              place_img: change.doc.data().place_img || '',
              place_url: change.doc.data().place_url,
              place_types: change.doc.data().place_types || '',
              place_formatted_phone_number:
                change.doc.data().place_formatted_phone_number || '',
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
              status: change.doc.data().status || '',
              place_format_address: change.doc.data().place_format_address,
              place_name: change.doc.data().place_id,
              place_img: change.doc.data().place_img || '',
              place_url: change.doc.data().place_url,
              place_types: change.doc.data().place_types || '',
              place_formatted_phone_number:
                change.doc.data().place_formatted_phone_number || '',
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
  }, []);

  console.log(myEvents);

  return (
    <Wrapper>
      {showPopUp && (
        <AddNewTimeBlock
          setShowPopUp={setShowPopUp}
          showPopUp={showPopUp}
          collectionID={collectionID}
          planDocRef={planDocRef}
          // setAddedTimeBlock={setAddedTimeBlock}
          startDateValue={startDateValue}
          endDateValue={endDateValue}
        />
      )}
      {showEditPopUp ? (
        <EditTimeBlock
          importData={importData}
          showEditPopUp={showEditPopUp}
          setShowEditPopUp={setShowEditPopUp}
          currentSelectTimeData={currentSelectTimeData}
          currentSelectTimeId={currentSelectTimeId}
          collectionID={collectionID}
          planDocRef={planDocRef}
        />
      ) : null}
      <TopContainer>
        <TitleSection>
          <TextField
            sx={{ m: 1, minWidth: 80 }}
            label="Title"
            variant="outlined"
            value={planTitle}
            onChange={(e) => {
              setPlanTitle(e.target.value);
            }}
          />
          <CountrySelector setCountry={setCountry} country={country} />
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
      <CalendarContainer>
        <PlanCalendar
          setImportData={setImportData}
          setMyEvents={setMyEvents}
          myEvents={myEvents}
          setShowEditPopUp={setShowEditPopUp}
          setCurrentSelectTimeData={setCurrentSelectTimeData}
          setCurrentSelectTimeId={setCurrentSelectTimeId}
          startDateValue={startDateValue}
        />
      </CalendarContainer>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        spacing={2}>
        <Stack direction="row" alignItems="center" spacing={2}>
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
                  <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
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
                        <MenuItem value={e.fav_collection_id || ''} key={index}>
                          {e.fav_plan_title}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <Button
                    variant="outlined"
                    onClick={async () => {
                      // importTimeBlock(selectedPlanId)
                      const importResult = await importTimeBlock(
                        selectedPlanId
                      );
                      // console.log(importResult);
                      addToDataBase(collectionID, importResult);
                      console.log(myEvents);
                      // let list = [];
                      // importResult.forEach((e) => {
                      //   list = myEvents.push(e);
                      // });
                      // setMyEvents(myEvents);
                      // console.log(myEvents);
                    }}>
                    Import
                  </Button>
                </Stack>
              )}
            </div>
          )}

          <Button
            variant="contained"
            onClick={() => {
              try {
                saveToDataBase(
                  planCollectionRef,
                  collectionID,
                  planDocRef,
                  myEvents,
                  planTitle,
                  country,
                  mainImage,
                  startDateValue,
                  endDateValue,
                  isPublished
                );
                alert('Saved!');
              } catch (error) {
                console.log(error);
                alert('Oops!Something went wrong, please try again!');
              }
            }}>
            Save
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              addPlanToAllPlans(
                currentUserId,
                collectionID,
                planTitle,
                mainImage,
                country,
                isPublished
              );
              redirectToStatic();
            }}>
            Publish
          </Button>
        </Stack>
        <Button variant="contained">Delete</Button>
      </Stack>
    </Wrapper>
  );
}

export default EditPlanDetail;
