import './../styles/calendarStyle.scss';

import { Box, IconButton, TextField } from '@mui/material';
import {
  EditableMainImage,
  EditableMainImageContainer,
  FlexColumnWrapper,
  LightBlueBtn,
  PaleBtn,
  ReminderText,
  themeColours,
} from '../styles/globalTheme';
import React, { useContext, useEffect, useState } from 'react';

import AddNewTimeBlock from '../components/timeblock/AddNewTimeBlock';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import CountrySelector from '../components/timeblock/CountrySelector';
import DatePicker from '../components/input/DatePicker';
import EditTimeBlock from '../components/timeblock/EditTimeBlock';
import FavFolderDropdown from '../components/favourite/FavouriteFolderDropdown';
import FormControlLabel from '@mui/material/FormControlLabel';
import FullLoading from '../components/general/FullLoading';
import { PhotoCamera } from '@mui/icons-material';
import PlanCalendar from '../components/timeblock/PlanCalendar';
import Swal from 'sweetalert2';
import Switch from '@mui/material/Switch';
import ToggleAttractionSearch from '../components/travel_recommend/ToggleAttraction';
import { UserContext } from '../App';
import firebaseService from '../utils/fireabaseService';
import styled from 'styled-components';
import { uploadImagePromise } from '../utils/functionList';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';

const Wrapper = styled.div`
  padding: 100px 50px;
  margin: auto;
`;

const TopContainer = styled.div`
  display: flex;
  justify-content: center;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const TitleSection = styled.div`
  display: flex;
  flex-direction: column;
  margin-right: 20px;

  @media (max-width: 768px) {
    margin-bottom: 30px;
    width: 100%;
    margin-right: 0;
  }
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

  .import_btn {
    position: relative;
  }

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: normal;
    height: auto;
    margin: 30px 0;
  }
`;

const LeftBtnContainer = styled.div`
  display: flex;
  align-items: center;
  position: relative;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: normal;
  }
`;

function EditPlanDetail() {
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
  const [startInitDateValue, setStartInitDateValue] = useState(null);
  const [endInitDateValue, setEndInitDateValue] = useState(null);
  const [showFavContainer, setShowFavContainer] = useState(false);
  const [isPublished, setIsPublished] = useState(false);
  const [loadindOpacity, setLoadindOpacity] = useState(1);

  const currentUserId = useContext(UserContext)?.userEmail;
  const navigate = useNavigate();

  useEffect(() => {
    if (planAuthor) {
      if (currentUserId) {
        if (currentUserId !== planAuthor) {
          Swal.fire('You do not have authority to edit this plan!');
          navigate('/dashboard');
        }
      } else {
        Swal.fire('Please login to your account first!');
        navigate('/');
      }
    }
  }, [planAuthor]);

  useEffect(async () => {
    const {
      author,
      country,
      title,
      main_image,
      published,
      start_date,
      end_date,
    } = await firebaseService.getEditDetailData(planDocRef);

    setPlanAuthor(author);
    setCountry(country);
    setPlanTitle(title);
    setMainImage(main_image);
    setIsPublished(published);
    setStartDateValue(new Date(start_date.seconds * 1000));
    setEndDateValue(new Date(end_date.seconds * 1000));

    setStartInitDateValue(new Date(start_date.seconds * 1000));
    setEndInitDateValue(new Date(end_date.seconds * 1000));

    firebaseService.listenToSnapShot(planDocRef, setMyEvents);
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
          closePopUp={() => setShowPopUp(false)}
          planDocRef={planDocRef}
          startDateValue={startDateValue}
        />
      )}
      {showEditPopUp && (
        <EditTimeBlock
          closePopUp={() => setShowEditPopUp(false)}
          currentSelectTimeData={currentSelectTimeData}
          planDocRef={planDocRef}
        />
      )}
      <ArrowBackIosIcon
        className="hoverCursor"
        onClick={() => navigate('/dashboard')}
      />
      <TopContainer>
        <TitleSection>
          <TextField
            required
            sx={{
              m: 1,
              width: '97%',
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
          <ReminderText>
            Checking this will make your travel plan public to others.
          </ReminderText>
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
            toggleShowEditPopUp={() => setShowEditPopUp(true)}
            setCurrentSelectTimeData={setCurrentSelectTimeData}
            startDateValue={startDateValue}
          />
        )}
      </CalendarContainer>
      <ReminderText>
        Make sure to save for your changes after moving around the events!
      </ReminderText>
      <BottomBtnContainer>
        <LeftBtnContainer>
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
                if (
                  firebaseService.saveToDataBase(
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
                  Swal.fire('Successfully saved!');
                }
              } catch (error) {
                console.log(error);
                Swal.fire('Oops!Something went wrong, please try again!');
              }
            }}>
            Save
          </LightBlueBtn>
        </LeftBtnContainer>
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
                if (firebaseService.deletePlan(planDocRef, currentUserId)) {
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
