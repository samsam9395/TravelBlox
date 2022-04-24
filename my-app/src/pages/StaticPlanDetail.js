import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import {
  doc,
  getDoc,
  collection,
  setDoc,
  addDoc,
  query,
  where,
  getDocs,
} from 'firebase/firestore';

import { Button, Card, CardMedia, Typography, Avatar } from '@mui/material';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

import DayBlockCard from '../components/DayBlockCard';
import { useLocation } from 'react-router-dom';
import firebaseDB from '../utils/firebaseConfig';
const db = firebaseDB();
const UpperContainer = styled.div`
  display: flex;
  padding: 0 30px;
`;

const PlanInfoWrapper = styled.div`
  padding: 0 30px;
  width: 100%;
`;

const UserRightSideWrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding-left: 30px;
`;

const UserInfoWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const PlanCardsWrapper = styled.div`
  margin-top: 50px;
  padding: 0 30px;
`;

function addDays(date, days) {
  var result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

function loopThroughDays(startday, days) {
  const scheduleTimestampList = [];
  const lastDay = addDays(startday, days - 1);
  for (let i = 0; i < days; i++) {
    const nextday = addDays(startday, i);
    scheduleTimestampList.push(nextday);
    // console.log(nextday)
    if (nextday === lastDay) {
      console.log('reached last day');
      break;
    }
  }
  return scheduleTimestampList;
}

// handleFavAction(collectionID, author)
async function handleFavAction(collectionID, author, selectFavFolder) {
  const currentUserEmail = localStorage.getItem('userEmail');
  console.log(selectFavFolder);
  console.log('selected');
  if (currentUserEmail === author) {
    alert('Do not favourite your own plan!');
  } else if (selectFavFolder !== '') {
    console.log(selectFavFolder);
    const favRef = doc(
      db,
      'userId',
      currentUserEmail,
      'fav_plans',
      collectionID
    );
    // const q = query(favRef, where('fav_collection_id' === collectionID));

    try {
      await setDoc(favRef, {
        fav_collection_id: collectionID,
        fav_plan_doc_ref: favRef.id,
        infolder: selectFavFolder,
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
  // const [selectFavFolder, setSelectFavFolder] = useState('default');

  const location = useLocation();
  const collectionID = location.state.collectionID;
  const planDocRef = location.state.planDocRef;

  const planCollectionRef = doc(db, collectionID, planDocRef);

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

  useEffect(() => {
    setTimestampList(loopThroughDays(startDate.seconds * 1000, numberofDays));
  }, [numberofDays]);

  return (
    <>
      <UpperContainer>
        <Card sx={{ width: 400 }}>
          <CardMedia component="img" image={mainImage} height="200" />
          <Typography gutterBottom variant="h5" component="div">
            {planTitle}
          </Typography>
        </Card>

        <UserRightSideWrapper>
          <UserInfoWrapper>
            <Avatar
              alt="Remy Sharp"
              src="/static/images/avatar/1.jpg"
              sx={{ width: 56, height: 56 }}
            />
            <span>Made by: {author}</span>
          </UserInfoWrapper>
        </UserRightSideWrapper>
      </UpperContainer>
      <PlanInfoWrapper>
        <Typography variant="h5" component="div">
          Location: {country}
        </Typography>
        <Button
          variant="contained"
          onClick={() => setShowFavDropDown(!showfavDropDown)}>
          Favourite this plan
        </Button>
        {showfavDropDown && (
          <Autocomplete
            disablePortal
            id="combo-box-demo"
            options={props.favFolderNames}
            sx={{ width: 300 }}
            renderInput={(params) => (
              <TextField {...params} label="Favourite Folders" />
            )}
            onChange={(e) => {
              handleFavAction(collectionID, author, e.target.textContent);
            }}
          />
        )}
      </PlanInfoWrapper>
      <PlanCardsWrapper>
        {timestampList.map((day, index) => {
          return (
            <DayBlockCard
              currentDayDate={day}
              collectionID={collectionID}
              planDocRef={planDocRef}
              index={index}
              key={index}
            />
          );
        })}
      </PlanCardsWrapper>
    </>
  );
}
export default StaticPlanDetail;
