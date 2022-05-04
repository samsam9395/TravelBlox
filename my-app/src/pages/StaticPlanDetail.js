import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { doc, getDoc, collection, setDoc } from 'firebase/firestore';
import { Avatar } from '@mui/material';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import DayBlockCard from '../components/DailyEventCard/DayBlockCard';
import { useLocation } from 'react-router-dom';
import firebaseDB from '../utils/firebaseConfig';
import ExportGCalendarBtn from '../components/GoogleCalendar/ExportGCalendarBtn';
import { themeColours, LightOrangeBtn } from '../utils/globalTheme';
import './libraryStyles.scss';
import Timeline from '../components/DailyEventCard/Timeline';
import UserAvatar from '../components/user/Avatar';

const db = firebaseDB();

const UpperContainer = styled.div`
  display: flex;
  flex-direction: column;
  /* justify-content: space-between; */
  box-sizing: content-box;
  width: 100%;
`;

const LowerContainer = styled.div`
  display: flex;
  justify-content: center;
  box-sizing: content-box;
  width: 100%;
`;

const FavFolderWrapper = styled.div`
  display: flex;
  /* flex-direction: column; */
  /* margin-bottom: 30px; */
`;

const PlanInfoWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 20px;
  justify-content: center;
`;

const UserInfoContainer = styled.div`
  padding-top: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;

  .user_info_title {
    text-align: center;
    display: flex;
    margin-top: 20px;
    color: ${themeColours.orange};
    font-weight: 600;
  }

  .authorId {
    color: ${themeColours.dark_blue};
    font-weight: 400;
    padding-left: 10px;
  }
`;

const BtnWrapper = styled.div`
  margin-top: 20px;
  display: flex;
  align-items: center;
`;

const PlanCardsWrapper = styled.div`
  margin-top: 50px;
`;

const PlanMainImageContainer = styled.div`
  /* width: 600px; */
  width: auto;
  height: 500px;
  position: relative;
  overflow: hidden;
  &:hover {
    div {
      color: ${themeColours.pale};
      text-shadow: 2px 2px ${themeColours.dark_blue};

      transition: 0.5s;
    }
  }
`;

const PlanMainImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 60%;
  &:hover {
    opacity: 100%;
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
  color: ${themeColours.light_orange};
  text-shadow: 1px 1px ${themeColours.blue};

  .location_text {
    font-weight: 400;
    letter-spacing: 1px;
    font-size: 25px;
    text-shadow: none;
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
  const planDocRef = location.state.planDocRef;

  const planCollectionRef = doc(db, 'plans', planDocRef);
  const itemEls = useRef(new Array());
  const timelineRefArray = useRef(new Array());

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
      <UpperContainer>
        <PlanMainImageContainer>
          <PlanMainImage src={mainImage} loading="lazy"></PlanMainImage>
          <PlanTitleText>
            {planTitle}
            <div className="location_text">Location: {country.label}</div>
          </PlanTitleText>
        </PlanMainImageContainer>

        <PlanInfoWrapper>
          <UserInfoContainer>
            <UserAvatar currentUserId={author} fromLocate={'static'} />
            <div className="user_info_title">
              Planned by:
              <div className="authorId">{author}</div>
            </div>
          </UserInfoContainer>

          <BtnWrapper>
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
          </BtnWrapper>
        </PlanInfoWrapper>
      </UpperContainer>

      <LowerContainer>
        <Timeline
          NumofDays={timestampList.length}
          RefList={itemEls}
          timelineRefArray={timelineRefArray}
        />
        <PlanCardsWrapper>
          {timestampList.map((day, index) => {
            return (
              <DayBlockCard
                timelineRefArray={timelineRefArray}
                itemEls={itemEls}
                currentDayDate={day}
                day={day}
                planDocRef={planDocRef}
                index={index}
                key={index}
              />
            );
          })}
        </PlanCardsWrapper>
      </LowerContainer>
    </>
  );
}
export default StaticPlanDetail;
