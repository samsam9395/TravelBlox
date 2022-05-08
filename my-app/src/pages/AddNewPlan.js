import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

import { TextField, Button, IconButton, Box, Stack } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import { PhotoCamera } from '@mui/icons-material';
import '../styles/calendarStyle.scss';
import PlanCalendar from './PlanCalendar';
import AddNewTimeBlock from './AddNewTimeBlock';
import EditTimeBlock from './EditTimeBlock';
import { doc, setDoc } from 'firebase/firestore';
import firebaseDB from '../utils/firebaseConfig';
import { useNavigate, useLocation } from 'react-router-dom';
import CountrySelector from '../components/CountrySelector';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import DatePicker from '../components/Input/DatePicker';
import {
  handleMainImageUpload,
  addPlanToAllPlans,
  saveToDataBase,
  listenToSnapShot,
  getFavPlan,
} from '../utils/functionList';
import FavFolderDropdown from '../components/FavFolderDropdown';
import {
  EditableMainImageContainer,
  EditableMainImage,
  FlexColumnWrapper,
} from '../styles/globalTheme';

const db = firebaseDB();

const Wrapper = styled.div`
  padding: 50px;
  margin: auto;
`;

const TopContainer = styled.div`
  display: flex;
  justify-content: space-evenly;
  align-items: center;
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

async function addPlanToUserInfo(currentUserId, createPlanDocId) {
  console.log('saving this docRef to firebase', createPlanDocId);
  try {
    const userInfoRef = doc(
      db,
      'userId',
      currentUserId,
      'own_plans',
      createPlanDocId
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

// user={user} accessToken, email
function AddNewPlan(props) {
  const location = useLocation();
  const [planTitle, setPlanTitle] = useState('');
  const [country, setCountry] = useState('');
  const [mainImage, setMainImage] = useState(null);
  const [showPopUp, setShowPopUp] = useState(false);
  const [myEvents, setMyEvents] = useState([]);
  const [showEditPopUp, setShowEditPopUp] = useState(false);
  const [currentSelectTimeData, setCurrentSelectTimeData] = useState('');
  const [currentSelectTimeId, setCurrentSelectTimeId] = useState('');
  const [hasCreatedCollection, setHasCreatedCollection] = useState(false);
  // const [collectionRef, setCollectionRef] = useState(null);
  const [startDateValue, setStartDateValue] = useState(new Date());
  const [endDateValue, setEndDateValue] = useState(new Date());
  const [planDocRef, setPlanDocRef] = useState('');
  const [addedTimeBlock, setAddedTimeBlock] = useState(false);
  const [isPublished, setIsPublished] = useState(false);
  const [favPlansNameList, setFavPlansNameList] = useState(null);
  const [showFavPlans, setShowFavPlans] = useState(false);
  const [dropDownOption, setDropDownOption] = useState(
    location.state.favFolderNames || []
  );
  const [selectedPlanId, setSelectedPlanId] = useState('');

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
    setPlanDocRef(createPlanDocId);
    try {
      await setDoc(doc(db, 'plans', createPlanDocId), {
        author: currentUserId,
        start_date: startDateValue,
        end_date: endDateValue,
        title: planTitle,
        main_image: mainImage,
        published: false,
        planDocRef: createPlanDocId,
      });

      setHasCreatedCollection(true);
      // setCollectionRef('plans');

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

  useEffect(() => {
    if (addedTimeBlock) {
      console.log('addedTimeBlock is', addedTimeBlock);
      console.log('onsnap open');
      listenToSnapShot(setMyEvents, planDocRef);
    }
  }, [addedTimeBlock]);

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
            <CountrySelector setCountry={setCountry} country={country} />

            <DatePicker
              setStartDateValue={setStartDateValue}
              setEndDateValue={setEndDateValue}
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

          <FlexColumnWrapper>
            {mainImage && (
              <EditableMainImageContainer>
                <EditableMainImage src={mainImage}></EditableMainImage>
              </EditableMainImageContainer>
            )}

            <label htmlFor="icon-button-file" className="upload_icon">
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
          </FlexColumnWrapper>
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
                      getFavPlan(
                        e.target.textContent,
                        currentUserId,
                        setFavPlansNameList
                      );
                    }}
                  />
                  {showFavPlans && favPlansNameList && (
                    <FavFolderDropdown
                      showFavPlans={showFavPlans}
                      favPlansNameList={favPlansNameList}
                      setSelectedPlanId={setSelectedPlanId}
                      selectedPlanId={selectedPlanId}
                      planDocRef={planDocRef}
                      setAddedTimeBlock={setAddedTimeBlock}
                    />
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
                  if (
                    saveToDataBase(
                      myEvents,
                      planTitle,
                      country,
                      mainImage,
                      planDocRef,
                      startDateValue,
                      endDateValue,
                      isPublished
                    )
                  ) {
                    navigate('/dashboard');
                  }
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
