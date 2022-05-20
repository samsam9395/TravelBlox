import './../styles/calendarStyle.scss';

import { Box, IconButton, TextField } from '@mui/material';
import {
  EditableMainImage,
  EditableMainImageContainer,
  FlexColumnWrapper,
  LightBlueBtn,
  PaleBtn,
  themeColours,
} from '../styles/globalTheme';
import React, { useEffect, useState } from 'react';
import { doc, getDoc, writeBatch } from 'firebase/firestore';
import {
  listenToSnapShot,
  saveToDataBase,
  uploadImagePromise,
} from '../utils/functionList';

import AddNewTimeBlock from '../components/timeblock/AddNewTimeBlock';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import CountrySelector from '../components/CountrySelector';
import DatePicker from '../components/input/DatePicker';
import EditTimeBlock from '../components/timeblock/EditTimeBlock';
import FavFolderDropdown from '../components/favourite/FavFolderDropdown';
import FormControlLabel from '@mui/material/FormControlLabel';
import FullLoading from '../components/general/FullLoading';
import { PhotoCamera } from '@mui/icons-material';
import PlanCalendar from '../components/timeblock/PlanCalendar';
import PropTypes from 'prop-types';
import Swal from 'sweetalert2';
import Switch from '@mui/material/Switch';
import ToggleAttractionSearch from '../components/travel_recommend/ToggleAttraction';
import firebaseDB from '../utils/firebaseConfig';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';

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
`;

const Input = styled('input')({
  display: 'none',
});

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

EditTimeBlock.propTypes = {
  userId: PropTypes.string,
  favFolderNames: PropTypes.object,
  currentPlanRef: PropTypes.string,
};

function EditPlanDetail(props) {
  const { planDocRef } = useParams();
  const [planAuthor, setPlanAuthor] = useState('');
  const [planTitle, setPlanTitle] = useState('');
  const [country, setCountry] = useState('');
  const [mainImage, setMainImage] = useState(null);
  const [showPopUp, setShowPopUp] = useState(false);
  const [myEvents, setMyEvents] = useState([]);
  const [showEditPopUp, setShowEditPopUp] = useState(false);
  const [currentSelectTimeData, setCurrentSelectTimeData] = useState('');
  const [startDateValue, setStartDateValue] = useState(null);
  const [endDateValue, setEndDateValue] = useState(null);
  const [startInitDateValue, setStartInitDateValue] = useState(0);
  const [endInitDateValue, setEndInitDateValue] = useState(0);
  const [showFavContainer, setShowFavContainer] = useState(false);
  const [isPublished, setIsPublished] = useState(false);
  const [loadindOpacity, setLoadindOpacity] = useState(1);

  const currentUserId = props.userId;

  const navigate = useNavigate();

  const redirectToDashboard = () => {
    navigate('/dashboard');
  };

  async function deletePlan(planDocRef, currentUserId) {
    const batch = writeBatch(db);
    const plansRef = doc(db, 'plans', planDocRef);
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
    batch.delete(userInfoRef);

    try {
      await batch.commit();
      return true;
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    if (planAuthor) {
      if (localStorage.getItem('userEmail')) {
        if (localStorage.getItem('userEmail') !== planAuthor) {
          Swal.fire('You can only edit your own plan!');
          navigate('/dashboard');
        }
      } else {
        Swal.fire('Please login to your account first!');
        navigate('/');
      }
    }
  }, [localStorage.getItem('userEmail'), planAuthor]);

  useEffect(async () => {
    const docSnap = await getDoc(doc(db, 'plans', planDocRef));
    const {
      author,
      country,
      title,
      main_image,
      published,
      start_date,
      end_date,
    } = docSnap.data();

    setPlanAuthor(author);
    setCountry(country);
    setPlanTitle(title);
    setMainImage(main_image);
    setIsPublished(published);
    setStartDateValue(new Date(start_date.seconds * 1000));
    setEndDateValue(new Date(end_date.seconds * 1000));

    setStartInitDateValue(new Date(start_date.seconds * 1000));
    setEndInitDateValue(new Date(end_date.seconds * 1000));
  }, []);

  useEffect(async () => {
    listenToSnapShot(setMyEvents, planDocRef);
  }, []);

  useEffect(() => {
    if (mainImage && startDateValue) {
      setLoadindOpacity(0);
    }
  }, [mainImage, startDateValue]);

  return (
    <Wrapper>
      <FullLoading opacity={loadindOpacity} />
      {showPopUp && (
        <AddNewTimeBlock
          setShowPopUp={setShowPopUp}
          showPopUp={showPopUp}
          planDocRef={planDocRef}
          startDateValue={startDateValue}
          endDateValue={endDateValue}
        />
      )}
      {showEditPopUp && (
        <EditTimeBlock
          setShowEditPopUp={setShowEditPopUp}
          currentSelectTimeData={currentSelectTimeData}
          planDocRef={planDocRef}
        />
      )}
      <ArrowBackIosIcon
        className="hoverCursor"
        onClick={() => redirectToDashboard()}
      />
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
          <CountrySelector
            setCountry={setCountry}
            country={country}
            planTitle={planTitle}
          />

          {endDateValue && startDateValue && (
            <DatePicker
              setStartDateValue={setStartDateValue}
              setEndDateValue={setEndDateValue}
              startDateValue={startDateValue}
              endDateValue={endDateValue}
              startInitDateValue={startInitDateValue}
              endInitDateValue={endInitDateValue}
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
              onChange={async (e) => {
                const imageFile = await uploadImagePromise(e.target.files[0]);
                setMainImage(imageFile);
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
        <CalendarColourBackground></CalendarColourBackground>
        {startDateValue && (
          <PlanCalendar
            setMyEvents={setMyEvents}
            myEvents={myEvents}
            setShowEditPopUp={setShowEditPopUp}
            setCurrentSelectTimeData={setCurrentSelectTimeData}
            startDateValue={startDateValue}
          />
        )}
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

          <LightBlueBtn
            className="import_btn"
            onClick={() => setShowFavContainer(!showFavContainer)}>
            Import Favourite
          </LightBlueBtn>

          {showFavContainer && (
            <FavFolderDropdown
              planDocRef={planDocRef}
              startDateValue={startDateValue}
              currentUserId={currentUserId}
              setShowFavContainer={setShowFavContainer}
            />
          )}

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
                Swal.fire('Oops!Something went wrong, please try again!');
              }
            }}>
            Save
          </LightBlueBtn>
        </div>
        <PaleBtn
          variant="contained"
          onClick={() => {
            Swal.fire({
              title: 'Are you sure?',
              text: "You won't be able to revert this!",
              icon: 'warning',
              showCancelButton: true,
              confirmButtonColor: '#3085d6',
              cancelButtonColor: '#d33',
              confirmButtonText: 'Yes, delete it!',
            }).then((result) => {
              if (result.isConfirmed) {
                if (deletePlan(planDocRef, currentUserId)) {
                  Swal.fire('Successfully deleted!');
                  navigate('/dashboard');
                }
              }
            });
          }}>
          Delete
        </PaleBtn>
      </BottomBtnContainer>
    </Wrapper>
  );
}

export default EditPlanDetail;
