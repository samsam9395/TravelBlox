import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { doc, getDoc, collection, setDoc } from 'firebase/firestore';
import { googleAPI } from '../utils/credent';
import { Wrapper } from '@googlemaps/react-wrapper';
import { Button, Card, CardMedia, Typography, Avatar } from '@mui/material';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import DayBlockCard from '../components/DayBlockCard';
import { useLocation } from 'react-router-dom';
import firebaseDB from '../utils/firebaseConfig';
import ExportGCalendarBtn from '../components/GoogleCalendar/ExportGCalendarBtn';
import { themeColours, LightOrangeBtn } from '../utils/globalTheme';
const db = firebaseDB();
const ApiKey = googleAPI();

const UpperContainer = styled.div`
  display: flex;
  justify-content: space-between;
  box-sizing: content-box;
  width: 100%;
`;

const FavFolderWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 30px;
`;

const UserRightSideWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 20px;
`;

const UserInfoWrapper = styled.div`
  padding-top: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  .avatar_image {
    margin-bottom: 20px;
  }
  margin-bottom: 40px;
  div {
    text-align: center;
  }
`;

const PlanCardsWrapper = styled.div`
  margin-top: 50px;
  padding: 0 30px;
`;

const PlanMainImageContainer = styled.div`
  /* width: 600px; */
  width: auto;
  height: 500px;
  position: relative;
  overflow: hidden;
  &:hover {
    div {
      color: ${themeColours.dark_blue};
      text-shadow: 1px 1px ${themeColours.pale};
      transition: 0.5s;
    }
  }
`;

const PlanMainImage = styled.img`
  width: auto;
  min-height: 100%;
  &:hover {
    opacity: 60%;
    transition: 0.35s;
  }
`;

const PlanTitleText = styled.div`
  position: absolute;
  font-weight: 800;
  top: 100px;
  left: 50px;
  font-size: 60px;
  letter-spacing: 5px;
  color: ${themeColours.pale};
  text-shadow: 2px 2px ${themeColours.dark_blue};
  .location_text {
    letter-spacing: 1px;
    font-size: 25px;
  }
`;

function addDays(date, days) {
  var result = new Date(date);
  result.setDate(result.getDate() + days);
  // console.log('777, nextday is ', result);
  return result;
}

function loopThroughDays(startday, days) {
  const scheduleTimestampList = [];
  const lastDay = addDays(startday, days);
  // console.log(111, startday);
  // console.log(222, lastDay);

  for (let i = 0; i <= days; i++) {
    const nextday = addDays(startday, i);
    scheduleTimestampList.push(nextday);
    // console.log(scheduleTimestampList);

    if (nextday === lastDay) {
      console.log('reached last day');
      break;
    }
  }
  return scheduleTimestampList;
}

// handleFavAction(collectionID, author)
async function handleFavAction(planDocRef, author, selectFavFolder, planTitle) {
  const currentUserEmail = localStorage.getItem('userEmail');

  if (currentUserEmail === author) {
    alert('Do not favourite your own plan!');
  } else if (selectFavFolder !== '') {
    // console.log(selectFavFolder);
    const favRef = doc(db, 'userId', currentUserEmail, 'fav_plans', planDocRef);

    try {
      await setDoc(favRef, {
        fav_plan_doc_ref: planDocRef,
        infolder: selectFavFolder,
        fav_plan_title: planTitle,
      });
      alert('Successfully favourite this plan!');
    } catch (error) {
      console.log(error);
    }
  } else {
    alert('Please select a folder!');
  }
}

function StaticPlanDetail(props) {
  const [mainImage, setMainImage] = useState(null);
  const [planTitle, setPlanTitle] = useState('');
  const [country, setCountry] = useState('');
  const [hasVisited, setHasVitied] = useState(true);
  const [author, setAuthor] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [numberofDays, setNumberofDays] = useState(0);
  const [timestampList, setTimestampList] = useState([]);
  const [showfavDropDown, setShowFavDropDown] = useState(false);

  const location = useLocation();
  // const collectionID = location.state.collectionID;
  const planDocRef = location.state.planDocRef;

  const planCollectionRef = doc(db, 'plans', planDocRef);

  useEffect(async () => {
    const docSnap = await getDoc(planCollectionRef);
    const data = docSnap.data();
    console.log(data);

    setPlanTitle(data.title);
    setCountry(data.country);
    setMainImage(data.main_image);
    setStartDate(data.start_date);
    setEndDate(data.end_date);
    setHasVitied(data.visited);
    setAuthor(data.author);
  }, []);

  useEffect(() => {
    const nofDays =
      (endDate.seconds * 1000 - startDate.seconds * 1000) /
      (1000 * 60 * 60 * 24);
    setNumberofDays(nofDays);
  }, [endDate, startDate]);

  // console.log('numberofDays should not change', numberofDays);

  useEffect(() => {
    if (loopThroughDays(startDate.seconds * 1000, numberofDays).length === 0) {
      setTimestampList(loopThroughDays(startDate.seconds * 1000, 0));
    } else {
      setTimestampList(loopThroughDays(startDate.seconds * 1000, numberofDays));
    }
  }, [numberofDays]);

  // console.log(111, 'timestampList is ', timestampList);

  return (
    <>
      {/* <Wrapper apiKey={ApiKey}> */}
      <UpperContainer>
        <PlanMainImageContainer>
          <PlanMainImage src={mainImage} loading="lazy"></PlanMainImage>
          <PlanTitleText>
            {planTitle}
            <div className="location_text">Location: {country.label}</div>
          </PlanTitleText>
        </PlanMainImageContainer>

        <UserRightSideWrapper>
          <UserInfoWrapper>
            <Avatar
              className="avatar_image"
              alt="Remy Sharp"
              src="/static/images/avatar/1.jpg"
              sx={{ width: 100, height: 100 }}
            />
            <div>Planned by: {author}</div>
          </UserInfoWrapper>
          <FavFolderWrapper>
            <LightOrangeBtn
              style={{ width: 210 }}
              variant="contained"
              onClick={() => setShowFavDropDown(!showfavDropDown)}>
              Favourite this plan
            </LightOrangeBtn>
            {showfavDropDown && (
              <Autocomplete
                disablePortal
                id="combo-box-demo"
                options={props.favFolderNames}
                sx={{ width: 210 }}
                renderInput={(params) => (
                  <TextField {...params} label="Favourite Folders" />
                )}
                onChange={(e) => {
                  handleFavAction(
                    planDocRef,
                    author,
                    e.target.textContent,
                    planTitle
                  );
                }}
              />
            )}
          </FavFolderWrapper>
          <ExportGCalendarBtn planDocRef={planDocRef} planTitle={planTitle} />
        </UserRightSideWrapper>
      </UpperContainer>

      <PlanCardsWrapper>
        {timestampList.map((day, index) => {
          return (
            <DayBlockCard
              currentDayDate={day}
              day={day}
              planDocRef={planDocRef}
              index={index}
              key={index}
            />
          );
        })}
      </PlanCardsWrapper>
      {/* </Wrapper> */}
    </>
  );
}
export default StaticPlanDetail;
