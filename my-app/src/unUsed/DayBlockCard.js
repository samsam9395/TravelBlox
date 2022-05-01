import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { display } from '@mui/system';
import { Box, CircularProgress } from '@mui/material';

import { getDocs, collection, query, where, orderBy } from 'firebase/firestore';
import firebaseDB from '../utils/firebaseConfig';
import DayMapCard from './DailyEventCard/DayMapCard';
import DayCalendar from './DailyEventCard/DayCalendar';

const db = firebaseDB();

const Wrapper = styled.div`
  display: flex;
`;

const SingleDayWrapper = styled.div`
  display: flex;
  width: 100%;
`;

const TimeMapContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 800px;
`;

const RightSideContainer = styled.div`
  width: 800px;
  background-color: red;
  height: 400px;
`;

const ContentContainer = styled.div`
  padding-right: 15px;
  display: flex;
  flex-direction: column;
  margin: 20px 0;
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

function addOneDay(date) {
  var result = new Date(date);
  result.setDate(result.getDate() + 1);
  return result;
}

async function CalendarByDay(blocksListRef, currentDayDate) {
  const eventByDayList = [];
  console.log('calendar by day is rendered');

  const q = query(
    blocksListRef,
    where('start', '>=', currentDayDate),
    where('start', '<=', addOneDay(currentDayDate)),
    orderBy('start', 'asc')
  );

  try {
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((doc) => {
      eventByDayList.push(doc.data());
    });
  } catch (error) {
    console.log(error);
  }

  return eventByDayList;
}

// function calculateTimeBlockDUration(startTime, endTime) {
//   endTime.seconds - startTime.seconds;
// }

function DayBlockCard(props) {
  const [dayEvents, setDayEvents] = useState([]);
  const [hasReturned, setHasReturned] = useState(false);
  const [dayTimeBlocks, setDayTimeBlocks] = useState([]);
  const [timeBlockImage, setTimeBlockImage] = useState('');

  const blocksListRef = collection(
    db,
    'plans',
    props.planDocRef,
    'time_blocks'
  );

  useEffect(() => {
    console.log('crrentDay', props.currentDayDate);
    CalendarByDay(blocksListRef, props.currentDayDate)
      .then((eventList) => {
        setDayEvents(eventList);
        setHasReturned(true);
        return eventList;
      })
      .catch((error) => {
        console.log(error);
      });
  }, [props.currentDayDate]);

  useEffect(() => {
    console.log(dayEvents);
    dayEvents.forEach((block) => {
      console.log(block);
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

  // useEffect(() => {
  //   console.log(dayEvents);
  // }, [dayEvents]);

  return (
    <SingleDayWrapper>
      <RightSideContainer>WTFFFFF</RightSideContainer>
      <h1>OMG WHAT THE FK WHYYYYYY!</h1>
      <h2>
        Day {props.index + 1}, {props.currentDayDate.toDateString()}
      </h2>
      <DailyContentWrapper>
        {dayEvents.map((singleEvent, index) => {
          return (
            <ContentContainer key={index}>
              <h2>{singleEvent.title}</h2>
              <div>Place: {singleEvent.place_name}</div>
              <div>Name: {singleEvent.place_format_address}</div>
              <img src={singleEvent.timeblock_img} alt="" />
              <h3 className="content">Context: {singleEvent.text}</h3>
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

        <DayMapCard dayEvents={dayEvents} />
      </TimeMapContainer>
    </SingleDayWrapper>
  );
}

export default DayBlockCard;