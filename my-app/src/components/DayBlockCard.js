import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { display } from '@mui/system';
import { Box, CircularProgress } from '@mui/material';
import DayMapCard from './DayMapCard';
import * as ReactDom from 'react-dom';
import { Wrapper, Status } from '@googlemaps/react-wrapper';
import GoogleAPI from '../utils/GoogleAPI';
import { getDocs, collection, query, where, orderBy } from 'firebase/firestore';
import firebaseDB from '../utils/firebaseConfig';
// import './planDetail.scss';
// import { Calendar, momentLocalizer, Views } from 'react-big-calendar';
// import moment from 'moment';
// import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';
// import PropTypes from 'prop-types';
import DayCalendar from './DayCalendar';

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
const DailyContentWrapper = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  padding-right: 15px;
`;

const DayScheduleContainer = styled.div`
  min-height: 400px;
  border: 1px solid black;
  margin-bottom: 20px;
`;

const CalendarWrapper = styled.div`
  width: 300px;
  height: 300px;
`;

const googleAPIKey = GoogleAPI();

function addOneDay(date) {
  var result = new Date(date);
  result.setDate(result.getDate() + 1);
  return result;
}

async function CalendarByDay(blocksListRef, currentDayDate) {
  const eventByDayList = [];
  console.log('calendar by day is rendered');

  // const blocksListRef = collection(
  //   db,
  //   'plan101',
  //   'zqZZcY8RO85mFVmtHbVI',
  //   'time_blocks_test'
  // );

  const q = query(
    blocksListRef,
    where('start', '>=', currentDayDate),
    where('start', '<=', addOneDay(currentDayDate)),
    orderBy('start', 'asc')
  );
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    eventByDayList.push(doc.data());
  });

  return eventByDayList;
}

function DayBlockCard(props) {
  const [dayEvents, setDayEvents] = useState([]);
  const [hasReturned, setHasReturned] = useState(false);
  const [dayTimeBlocks, setDayTimeBlocks] = useState([]);
  // const [center, setCenter] = useState({
  //   lat: 0,
  //   lng: 0,
  // });
  // const zoom = 4;

  const blocksListRef = collection(
    db,
    props.collectionID,
    props.planDocRef,
    'time_blocks'
  );

  useEffect(() => {
    CalendarByDay(blocksListRef, props.currentDayDate)
      .then((eventList) => {
        setDayEvents(eventList);
        setHasReturned(true);
        return eventList;
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    dayEvents.forEach((block) => {
      setDayTimeBlocks((prev) => [
        ...prev,
        {
          start: new Date(block.start.seconds * 1000),
          end: new Date(block.end.seconds * 1000),
          title: block.title,
          id: block.id,
          address: block.address,
          text: block.text,
        },
      ]);
    });
  }, [hasReturned]);

  useEffect(() => {
    console.log(dayEvents);
  }, [dayEvents]);

  return (
    <>
      <h2>Day1, {props.currentDayDate.toDateString()}</h2>
      <SingleDayWrapper>
        <DailyContentWrapper>
          {dayTimeBlocks.map((singleBlock, index) => {
            return (
              <ContentContainer key={index}>
                <div className="content">{singleBlock.text}</div>
                <SampleDiv>
                  <span>image here</span>
                  <img src="" alt="" />
                </SampleDiv>
                <div>{singleBlock.address}</div>
              </ContentContainer>
            );
          })}
        </DailyContentWrapper>

        <TimeMapContainer>
          <DayScheduleContainer>
            {hasReturned ? (
              <DayCalendar
                currentDayDate={props.currentDayDate}
                dayTimeBlocks={dayTimeBlocks}
              />
            ) : (
              <Box sx={{ display: 'flex' }} align="center" justify="center">
                <CircularProgress size={14} sx={{ py: 2 }} />
              </Box>
            )}
            )
          </DayScheduleContainer>
          {/* <Wrapper apiKey={googleAPIKey} > */}
          <DayMapCard dayEvents={dayEvents} />
          {/* </Wrapper> */}
        </TimeMapContainer>
      </SingleDayWrapper>
    </>
  );
}

export default DayBlockCard;
