import React, { useState, useEffect } from 'react';
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
import DatePicker from '../components/Input/DatePicker';
import CountrySelector from '../components/CountrySelector';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';

import {
  doc,
  getDoc,
  getDocs,
  query,
  where,
  onSnapshot,
  collection,
  setDoc,
  writeBatch,
  deleteDoc,
} from 'firebase/firestore';
import firebaseDB from '../utils/firebaseConfig';
import { useNavigate, useLocation } from 'react-router-dom';
import ToggleAttractionSearch from '../components/travel_recommend/ToggleAttraction';
import {
  handleMainImageUpload,
  addPlanToAllPlans,
  saveToDataBase,
  deleteBlockInMylist,
  listenToSnapShot,
} from '../utils/functionList';

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
  const [startDateValue, setStartDateValue] = useState(0);
  const [endDateValue, setEndDateValue] = useState(0);
  const [startInitDateValue, setStartInitDateValue] = useState(0);
  const [endInitDateValue, setEndInitDateValue] = useState(0);
  const [showFavContainer, setShowFavContainer] = useState(false);
  const [isPublished, setIsPublished] = useState(false);
  const [showDeletePopUp, setShowDeletePopUp] = useState(false);

  //React Route
  const location = useLocation();
  const planDocRef = location.state.planDocRef;
  const currentUserId = props.userId;
  const blocksListRef = collection(db, 'plans', planDocRef, 'time_blocks');

  const navigate = useNavigate();

  const redirectToStatic = () => {
    navigate('/static-plan-detail', {
      state: {
        fromPage: 'editPlans',
        planDocRef: planDocRef,
      },
    });
  };

  /*=============================================
=            import section on edit plan            =
=============================================*/
  const [favPlansNameList, setFavPlansNameList] = useState(null);
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

  async function importTimeBlock(selectedPlanId) {
    console.log(selectedPlanId);
    const blocksListRef = collection(
      db,
      'plans',
      selectedPlanId,
      'time_blocks'
    );

    const docSnap = await getDocs(blocksListRef);

    // console.log(docSnap.docs.map((e) => e.data()));
    const data = docSnap.docs.map((e) => e.data());
    const importEvents = data.map((e) => ({
      status: 'imported',
      start: new Date(e.start.seconds * 1000),
      end: new Date(e.end.seconds * 1000),
      title: e.title,
      id: e.id,
      place_id: e.place_id,
      place_format_address: e.place_format_address,
      place_name: e.place_name,
      place_formatted_phone_number: location.international_phone_number || '',
      place_url: e.place_url,
      place_types: e.place_types,
      place_img: e.place_img,
    }));
    console.log(importEvents);
    return importEvents; //for updating local event
  }

  async function deletePlan(planDocRef, currentUserId) {
    const batch = writeBatch(db);
    const plansRef = doc(db, 'plans', planDocRef);
    // const plansTimeblockRef = doc(db, 'plans', planDocRef, 'time_blocks');
    const userInfoRef = doc(
      db,
      'userId',
      currentUserId,
      'own_plans',
      planDocRef
    );
    const allPlansRef = doc(db, 'allPlans', planDocRef);

    batch.delete(allPlansRef);
    batch.delete(plansRef);
    // batch.delete(plansTimeblockRef);
    batch.delete(userInfoRef);

    try {
      await batch.commit();
      console.log('Successfully deleted!');
      navigate('/dashboard');
    } catch (error) {
      console.log(error);
    }
  }

  async function addImportToDataBase(planDocRef, importResult) {
    console.log('adding to dataBase', importResult);
    console.log('db', 'plans', planDocRef, 'time_blocks');

    console.log(11, importResult);
    if (importResult) {
      // try batch
      const batch = writeBatch(db);

      importResult.forEach(async (timeblock) => {
        console.log(22, timeblock);

        const createRef = doc(
          collection(db, 'plans', planDocRef, 'time_blocks')
        );
        const importActionRef = doc(
          db,
          'plans',
          planDocRef,
          'time_blocks',
          createRef.id
        );

        batch.set(
          importActionRef,
          {
            title: timeblock.title,
            start: timeblock.start,
            end: timeblock.end,
            place_id: timeblock.place_id,
            place_name: timeblock.place_name,
            place_format_address: timeblock.place_format_address,
            id: createRef.id,
            place_img: timeblock.place_img || '',
            place_formatted_phone_number:
              timeblock.place_formatted_phone_number || '',
            place_url: timeblock.place_url,
            place_types: timeblock.place_types || '',
            status: 'imported',
          },
          { merge: true }
        );
      });
      try {
        await batch.commit();
        console.log('Successfully imported!');
      } catch (error) {
        console.log(error);
      }
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
    const docSnap = await getDoc(doc(db, 'plans', planDocRef));

    setCountry(docSnap.data().country);
    setPlanTitle(docSnap.data().title);
    setMainImage(docSnap.data().main_image);

    setStartDateValue(new Date(docSnap.data().start_date.seconds * 1000));
    setEndDateValue(new Date(docSnap.data().end_date.seconds * 1000));

    setStartInitDateValue(new Date(docSnap.data().start_date.seconds * 1000));
    setEndInitDateValue(new Date(docSnap.data().end_date.seconds * 1000));
  }, []);

  useEffect(async () => {
    listenToSnapShot(setMyEvents, planDocRef);
  }, []);

  return (
    <Wrapper>
      {showPopUp && (
        <AddNewTimeBlock
          setShowPopUp={setShowPopUp}
          showPopUp={showPopUp}
          // collectionID={collectionID}
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
          <CountrySelector
            setCountry={setCountry}
            country={country}
            planTitle={planTitle}
          />

          <DatePicker
            setStartDateValue={setStartDateValue}
            setEndDateValue={setEndDateValue}
            startDateValue={startDateValue}
            endDateValue={endDateValue}
            startInitDateValue={startInitDateValue}
            endInitDateValue={endInitDateValue}
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
                handleMainImageUpload(e, setMainImage);
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

      <ToggleAttractionSearch />

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
                        <MenuItem value={e.fav_plan_doc_ref || ''} key={index}>
                          {e.fav_plan_title}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <Button
                    variant="outlined"
                    onClick={async () => {
                      // importTimeBlock(selectedPlanId, planDocRef);
                      const importResult = await importTimeBlock(
                        selectedPlanId
                      );
                      console.log(importResult);
                      addImportToDataBase(planDocRef, importResult);
                      console.log(myEvents);
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
                  myEvents,
                  planTitle,
                  country,
                  mainImage,
                  planDocRef,
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
                planDocRef,
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
        <Button
          variant="contained"
          onClick={() => {
            deletePlan(planDocRef, currentUserId);
          }}>
          Delete
        </Button>
      </Stack>
    </Wrapper>
  );
}

export default EditPlanDetail;
