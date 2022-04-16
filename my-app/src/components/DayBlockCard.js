import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import PlanCalendar from '../pages/Calendar';
import { display } from '@mui/system';
import MapCard from './MapCard';
import * as ReactDom from 'react-dom';
import { Wrapper, Status } from '@googlemaps/react-wrapper';
import GoogleAPI from '../utils/GoogleAPI';
import {
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  collection,
  query,
  where,
  orderBy,
} from 'firebase/firestore';
import firebaseDB from '../utils/firebaseConfig';

const db = firebaseDB();

const SampleDiv = styled.div`
  border: 1px solid grey;
`;

const SingleDayWrapper = styled.div`
  display: flex;
  width: 100%;
`;

const TimeMapContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const ContentContainer = styled.div`
  padding-right: 15px;
  display: flex;
  flex-direction: column;
`;

const DayScheduleContainer = styled.div`
  min-height: 400px;
  border: 1px solid black;
  margin-bottom: 20px;
`;

const googleAPIKey = GoogleAPI();

function CalendarByDay() {
  const [dayEvent, setDayEvent] = useState('');
  console.log('calendar by day is rendered');

  useEffect(async () => {
    const planRef = doc(db, 'plan101', 'zqZZcY8RO85mFVmtHbVI');
    const docSnap = await getDoc(planRef);
    const blocksListRef = collection(
      db,
      'plan101',
      'zqZZcY8RO85mFVmtHbVI',
      'time_blocks_test'
    );
    let timestamp = new Date(docSnap.data().start_date);

    const qAscend = query(blocksListRef, orderBy('start', 'asc'));
    //new Date(doc.data().start.second * 1000) equals to human readable date

    const q = query(
      blocksListRef,
      where('start', '>=', timestamp)
      // where('start', '<=', '1650196740')
    );
    const querySnapshot = await getDocs(qAscend);
    querySnapshot.forEach((doc) => {
      console.log(doc.data());
    });
  }, []);
}

function DayBlockCard() {
  const [center, setCenter] = useState({
    lat: 0,
    lng: 0,
  });
  const zoom = 4;

  // CalendarByDay();

  return (
    <>
      <SingleDayWrapper>
        <ContentContainer>
          <h2>Day 1</h2>
          <div className="content">
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Natus
            reprehenderit dolorum aspernatur molestias nihil modi praesentium
            magni vero odio! Voluptates explicabo saepe velit nesciunt adipisci,
            natus officia facilis excepturi distinctio. Aliquam, tenetur quasi!
            Est deserunt consequuntur culpa.
          </div>
          <SampleDiv>
            <span>image here</span>
            <img src="" alt="" />
          </SampleDiv>
        </ContentContainer>

        <TimeMapContainer>
          <DayScheduleContainer>Calendar Here</DayScheduleContainer>
          {/* <Wrapper apiKey={googleAPIKey} render={render}> */}
          <MapCard />
          {/* </Wrapper> */}
        </TimeMapContainer>
      </SingleDayWrapper>
    </>
  );
}

export default DayBlockCard;
