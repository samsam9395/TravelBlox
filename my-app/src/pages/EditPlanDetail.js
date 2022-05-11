import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { TextField, Button, IconButton, Box, Stack } from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { PhotoCamera } from '@mui/icons-material';
import './../styles/calendarStyle.scss';
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
  collection,
  writeBatch,
} from 'firebase/firestore';
import firebaseDB from '../utils/firebaseConfig';
import { useNavigate, useLocation } from 'react-router-dom';
import ToggleAttractionSearch from '../components/travel_recommend/ToggleAttraction';
import {
  handleMainImageUpload,
  addPlanToAllPlans,
  saveToDataBase,
  listenToSnapShot,
  getFavPlan,
} from '../utils/functionList';
import FavFolderDropdown from '../favourite/FavFolderDropdown';
import {
  themeColours,
  EditableMainImageContainer,
  EditableMainImage,
  FlexColumnWrapper,
  LightBlueBtn,
  LightOrangeBtn,
  OrangeBtn,
  BlueBtn,
  PaleBtn,
} from '../styles/globalTheme';
import '../favourite/favDropDown.scss';

const db = firebaseDB();

const Wrapper = styled.div`
  padding: 50px;
  margin: auto;
`;

const TopContainer = styled.div`
  display: flex;
  justify-content: center;
`;

const TitleSection = styled.div`
  display: flex;
  flex-direction: column;
  margin-right: 30px;
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

const CalendarContainer = styled.div`
  width: 100%;
  height: 60vh;
  margin-top: 60px;
  margin-bottom: 30px;
  position: relative;

  /* background-color: #fdf7e1; */
`;

const Input = styled('input')({
  display: 'none',
});

const TypeInput = styled.input`
  width: 91%;
  margin-left: 8px;
  margin-bottom: 10px;
  height: 56px;
  padding-left: 20px;
  font-size: 16px;
  border-radius: 5px;
  border: 1px solid ${themeColours.light_grey};

  &:focus,
  &:hover {
    border-color: ${themeColours.light_orange};
  }
`;

const BottomBtnContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 150px;
  margin-bottom: 30px;

  .left_btns {
    display: flex;
    align-items: center;
    position: relative;
  }

  .import_btn_wrapper {
    display: flex;
    flex-direction: column;

    .import_btn {
      position: relative;
    }
  }
`;

const SelectImportDropdown = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  bottom: -60px;
  left: 164px;
`;
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
  const [startDateValue, setStartDateValue] = useState(null);
  const [endDateValue, setEndDateValue] = useState(null);
  const [startInitDateValue, setStartInitDateValue] = useState(0);
  const [endInitDateValue, setEndInitDateValue] = useState(0);
  const [showFavContainer, setShowFavContainer] = useState(false);
  const [isPublished, setIsPublished] = useState(false);
  // import
  const [favPlansNameList, setFavPlansNameList] = useState(null);
  const [showFavPlans, setShowFavPlans] = useState(false);
  const [dropDownOption, setDropDownOption] = useState(
    props.favFolderNames || []
  );
  const [selectedPlanId, setSelectedPlanId] = useState('');
  const [selectedFolderId, setSelectedFolderId] = useState('');
  const [importData, setImportData] = useState({});

  //React Route
  const location = useLocation();
  const planDocRef = location.state.planDocRef;
  const currentUserId = props.userId;
  // const blocksListRef = collection(db, 'plans', planDocRef, 'time_blocks');

  const navigate = useNavigate();

  const redirectToStatic = () => {
    navigate('/static-plan-detail', {
      state: {
        fromPage: 'editPlans',
        planDocRef: planDocRef,
      },
    });
  };

  const redirectToDashboard = () => {
    navigate('/dashboard');
  };

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
      alert('Successfully deleted!');
      navigate('/dashboard');
    } catch (error) {
      console.log(error);
    }
  }

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
          planDocRef={planDocRef}
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
      <ArrowBackIosIcon
        className="hoverCursor"
        onClick={() => redirectToDashboard()}
      />
      <TopContainer>
        <TitleSection>
          {/* <TypeInput
            value={planTitle}
            onChange={(e) => {
              setPlanTitle(e.target.value);
            }}
            placeholder="Plan Title"></TypeInput> */}
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
          <CountrySelector
            setCountry={setCountry}
            country={country}
            planTitle={planTitle}
          />

          {endDateValue && startDateValue ? (
            <DatePicker
              setStartDateValue={setStartDateValue}
              setEndDateValue={setEndDateValue}
              startDateValue={startDateValue}
              endDateValue={endDateValue}
              startInitDateValue={startInitDateValue}
              endInitDateValue={endInitDateValue}
            />
          ) : (
            <DatePicker
              setStartDateValue={setStartDateValue}
              setEndDateValue={setEndDateValue}
              startDateValue={new Date()}
              endDateValue={new Date()}
              startInitDateValue={new Date()}
              endInitDateValue={new Date()}
            />
          )}

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
        </TitleSection>

        <FlexColumnWrapper>
          <EditableMainImageContainer>
            <EditableMainImage src={mainImage}></EditableMainImage>
          </EditableMainImageContainer>

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
                style={{ color: themeColours.blue }}
                aria-label="upload picture"
                component="div">
                <PhotoCamera style={{ color: themeColours.light_blue }} />
              </IconButton>
            </Box>
          </label>
        </FlexColumnWrapper>
      </TopContainer>

      <ToggleAttractionSearch />

      <CalendarContainer>
        {/* <div className="background_line"></div> */}
        <CalendarColourBackground></CalendarColourBackground>

        {startDateValue ? (
          <PlanCalendar
            setImportData={setImportData}
            setMyEvents={setMyEvents}
            myEvents={myEvents}
            setShowEditPopUp={setShowEditPopUp}
            setCurrentSelectTimeData={setCurrentSelectTimeData}
            setCurrentSelectTimeId={setCurrentSelectTimeId}
            startDateValue={startDateValue}
          />
        ) : null}
      </CalendarContainer>
      <BottomBtnContainer>
        <div className="left_btns">
          <LightBlueBtn
            variant="contained"
            onClick={() => {
              setShowPopUp(true);
            }}>
            Add new event
          </LightBlueBtn>
          {/* <LightBlueBtn
            variant="contained"
            onClick={() => setShowFavContainer(!showFavContainer)}>
            Import Favourite
          </LightBlueBtn> */}

          {/* <div className="import_btn_wrapper"> */}
          <LightBlueBtn
            className="import_btn"
            onClick={() => setShowFavContainer(!showFavContainer)}>
            Import Favourite
          </LightBlueBtn>

          {showFavContainer && (
            <FavFolderDropdown
              showFavPlans={showFavPlans}
              selectedPlanId={selectedPlanId}
              planDocRef={planDocRef}
              startDateValue={startDateValue}
              currentUserId={currentUserId}
            />
          )}
          {/* </div> */}

          <LightBlueBtn
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
              } catch (error) {
                console.log(error);
                alert('Oops!Something went wrong, please try again!');
              }
            }}>
            Save
          </LightBlueBtn>
          {/* <Button
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
          </Button> */}
        </div>
        <PaleBtn
          variant="contained"
          onClick={() => {
            deletePlan(planDocRef, currentUserId);
          }}>
          Delete
        </PaleBtn>
      </BottomBtnContainer>
    </Wrapper>
  );
}

export default EditPlanDetail;
