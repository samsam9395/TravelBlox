import '../styles/calendarStyle.scss';

import { Box, IconButton, Stack, TextField } from '@mui/material';
import {
  EditableMainImage,
  EditableMainImageContainer,
  FlexColumnWrapper,
  LightBlueBtn,
  PaleEmptyBtn,
  themeColours,
} from '../styles/globalTheme';
import React, { useContext, useEffect, useState } from 'react';
import {
  addPlanToAllPlans,
  listenToSnapShot,
  saveToDataBase,
  uploadImagePromise,
} from '../utils/functionList';
import { doc, getDoc, setDoc } from 'firebase/firestore';

import AddNewTimeBlock from '../components/timeblock/AddNewTimeBlock';
import CountrySelector from '../components/CountrySelector';
import DatePicker from '../components/input/DatePicker';
import EditTimeBlock from '../components/timeblock/EditTimeBlock';
import FavFolderDropdown from '../components/favourite/FavFolderDropdown';
import FormControlLabel from '@mui/material/FormControlLabel';
import { PhotoCamera } from '@mui/icons-material';
import PlanCalendar from '../components/timeblock/PlanCalendar';
import PropTypes from 'prop-types';
import Swal from 'sweetalert2';
import Switch from '@mui/material/Switch';
import { UserContext } from '../App';
import firebaseDB from '../utils/firebaseConfig';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const db = firebaseDB();

const Wrapper = styled.div`
  padding: 100px 50px;
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

  .instruction_text {
    color: ${themeColours.light_grey};
    font-size: 12px;
  }
`;

const CalendarContainer = styled.div`
  width: 100%;
  height: 60vh;
  margin-top: 60px;
  margin-bottom: 30px;
  position: relative;
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
  } catch (error) {}
}

const BottomBtnContainer = styled.div`
  display: flex;
  align-items: center;
  height: 150px;
  margin-bottom: 30px;
  position: relative;
`;

const CalendarColourBackground = styled.div`
  background-color: #fdfcf8;
  width: 100%;
  height: 60vh;
  z-index: -10;
  border-radius: 15%;
  right: 0;
  top: 15px;
  position: absolute;
`;

AddNewPlan.propTypes = {
  defaultImg: PropTypes.string,
};
// defaultImg={defaultImg}
function AddNewPlan(props) {
  const [username, setUsername] = useState('');
  const [planTitle, setPlanTitle] = useState('');
  const [country, setCountry] = useState('');
  const [mainImage, setMainImage] = useState(null);
  const [showPopUp, setShowPopUp] = useState(false);
  const [myEvents, setMyEvents] = useState([]);
  const [showEditPopUp, setShowEditPopUp] = useState(false);
  const [currentSelectTimeData, setCurrentSelectTimeData] = useState('');
  const [currentSelectTimeId, setCurrentSelectTimeId] = useState('');
  const [hasCreatedCollection, setHasCreatedCollection] = useState(false);
  const [startDateValue, setStartDateValue] = useState(new Date());
  const [endDateValue, setEndDateValue] = useState(new Date());
  const [planDocRef, setPlanDocRef] = useState('');
  const [addedTimeBlock, setAddedTimeBlock] = useState(false);
  const [isPublished, setIsPublished] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState('');

  const [showFavContainer, setShowFavContainer] = useState(false);
  const navigate = useNavigate();

  const userInfo = useContext(UserContext);

  const createNewCollection = async (
    startDateValue,
    endDateValue,
    planTitle,
    mainImage
  ) => {
    const currentTimeMilli = new Date().getTime();
    const createPlanDocId = `plan${currentTimeMilli}`;
    setPlanDocRef(createPlanDocId);

    if (mainImage === null || '') {
      mainImage = props.defaultImg;
      setMainImage(props.defaultImg);
    }

    try {
      await setDoc(doc(db, 'plans', createPlanDocId), {
        author: userInfo.userEmail,
        author_name: username,
        start_date: startDateValue,
        end_date: endDateValue,
        title: planTitle,
        main_image: mainImage,
        published: false,
        planDocRef: createPlanDocId,
      });

      setHasCreatedCollection(true);

      addPlanToUserInfo(userInfo.userEmail, createPlanDocId);

      addPlanToAllPlans(
        userInfo.userEmail,
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

  useEffect(async () => {
    if (addedTimeBlock) {
      listenToSnapShot(planDocRef, setMyEvents);
    }
  }, [addedTimeBlock]);

  useEffect(async () => {
    if (userInfo.userEmail) {
      const userDoc = await getDoc(doc(db, 'userId', userInfo.userEmail));
      if (userDoc.data().username) {
        setUsername(userDoc.data().username);
      }
    }
  }, [userInfo.userEmail]);

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
          setShowEditPopUp={setShowEditPopUp}
          currentSelectTimeData={currentSelectTimeData}
          currentSelectTimeId={currentSelectTimeId}
          planDocRef={planDocRef}
          status={'origin'}
        />
      ) : null}
      <>
        {!hasCreatedCollection && (
          <InstructionText>
            Please create some basic info first!
          </InstructionText>
        )}
        <TopContainer>
          <TitleSection>
            <TextField
              required
              sx={{
                m: 1,
                width: 300,
                label: { color: themeColours.light_orange },
              }}
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
              startDateValue={new Date()}
              endDateValue={new Date()}
              setStartDateValue={setStartDateValue}
              setEndDateValue={setEndDateValue}
            />

            {hasCreatedCollection && (
              <>
                <FormControlLabel
                  control={
                    <Switch
                      style={{ color: themeColours.light_orange }}
                      checked={isPublished}
                      onChange={() => setIsPublished(!isPublished)}
                    />
                  }
                  label="Published"
                />
                <div className="instruction_text">
                  Checking this will make your travel plan public to others.
                </div>
              </>
            )}
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
                onChange={async (e) => {
                  const imageFile = await uploadImagePromise(e.target.files[0]);
                  setMainImage(imageFile);
                }}
              />
              <Box textAlign="center">
                <IconButton
                  color="primary"
                  aria-label="upload picture"
                  component="div">
                  <PhotoCamera style={{ color: themeColours.light_blue }} />
                </IconButton>
              </Box>
            </label>
          </FlexColumnWrapper>
        </TopContainer>

        {hasCreatedCollection ? (
          <>
            <CalendarContainer>
              <CalendarColourBackground></CalendarColourBackground>
              <PlanCalendar
                startDateValue={startDateValue}
                setMyEvents={setMyEvents}
                myEvents={myEvents}
                setShowEditPopUp={setShowEditPopUp}
                setCurrentSelectTimeData={setCurrentSelectTimeData}
                setCurrentSelectTimeId={setCurrentSelectTimeId}
              />
            </CalendarContainer>
            <BottomBtnContainer>
              <LightBlueBtn
                onClick={() => {
                  setShowPopUp(true);
                }}>
                Add new event
              </LightBlueBtn>

              <LightBlueBtn
                onClick={() => setShowFavContainer(!showFavContainer)}>
                Import Favourite
              </LightBlueBtn>

              {showFavContainer && (
                <FavFolderDropdown
                  setSelectedPlanId={setSelectedPlanId}
                  selectedPlanId={selectedPlanId}
                  planDocRef={planDocRef}
                  startDateValue={startDateValue}
                  currentUserId={userInfo.userEmail}
                />
              )}

              <LightBlueBtn
                variant="contained"
                onClick={() => {
                  if (myEvents.length === 0) {
                    Swal.fire('Please create at least one event!');
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
              </LightBlueBtn>
            </BottomBtnContainer>
          </>
        ) : (
          <ButtonContainer>
            <LightBlueBtn
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
                  Swal.fire('Please provide the required fields!');
                }
              }}>
              All Set
            </LightBlueBtn>
            <PaleEmptyBtn onClick={() => navigate('/dashboard')}>
              Nah create later
            </PaleEmptyBtn>
          </ButtonContainer>
        )}
      </>
    </Wrapper>
  );
}

export default AddNewPlan;
