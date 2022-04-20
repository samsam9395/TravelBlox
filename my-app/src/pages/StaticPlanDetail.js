import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import {
  InputLabel,
  TextField,
  Button,
  FormControl,
  MenuItem,
  Select,
  IconButton,
  Box,
  Card,
  CardMedia,
  CircularProgress,
  Typography,
  Avatar,
} from '@mui/material';
import {
  doc,
  getDoc,
  getDocs,
  collectionGroup,
  query,
  where,
  onSnapshot,
  collection,
  setDoc,
} from 'firebase/firestore';
import firebaseDB from '../utils/firebaseConfig';
import DayBlockCard from '../components/DayBlockCard';
import DayMapCard from '../components/DayMapCard';
import { Wrapper, Status } from '@googlemaps/react-wrapper';
import { useLocation } from 'react-router-dom';

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

function StaticPlanDetail() {
  const [mainImage, setMainImage] = useState(null);
  const [planTitle, setPlanTitle] = useState('');
  const [country, setCountry] = useState('');
  const [hasVisited, setHasVitied] = useState(true);
  const [author, setAuthor] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [numberofDays, setNumberofDays] = useState(0);
  const [timestampList, setTimestampList] = useState([]);

  const location = useLocation();
  const collectionID = location.state.collectionID;
  const planDocRef = location.state.planDocRef;

  const planCollectionRef = doc(db, collectionID, planDocRef);

  useEffect(async () => {
    // const planRef = doc(db, 'plan101', 'zqZZcY8RO85mFVmtHbVI');
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
    setTimestampList(loopThroughDays(startDate.seconds * 1000, numberofDays));
  }, [endDate, startDate]);

  let currentDayDate = new Date('14 Jan 2022');

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
      </PlanInfoWrapper>
      <PlanCardsWrapper>
        <DayBlockCard
          currentDayDate={currentDayDate}
          collectionID={collectionID}
          planDocRef={planDocRef}
        />
      </PlanCardsWrapper>
    </>
  );
}

export default StaticPlanDetail;
