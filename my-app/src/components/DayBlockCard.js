import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { display } from '@mui/system';
import { Box, CircularProgress } from '@mui/material';

import { getDocs, collection, query, where, orderBy } from 'firebase/firestore';
import firebaseDB from '../utils/firebaseConfig';
import DayMapCard from './DailyEventCard/DayMapCard';
import DayCalendar from './DailyEventCard/DayCalendar';

const db = firebaseDB();

const MainWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const SingleDayWrapper = styled.div`
  display: flex;
  width: 100%;
  margin-bottom: 60px;
  /* height: 2000px; */
`;

const TimeMapContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 700px;
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
  margin-bottom: 30px;
`;

function addOneDay(date) {
  var result = new Date(date);
  result.setDate(result.getDate() + 1);
  // console.log('next day is ', result);
  return result;
}

async function CalendarByDay(blocksListRef, currentDayDate) {
  const eventByDayList = [];

  // console.log('10 is', currentDayDate); //111 currentDayDate is Tue Apr 26 2022 17:40:59 GMT+0800 (Taipei Standard Time)
  // console.log('20 Next of CurrentDayDate is', addOneDay(currentDayDate)); //222 Next of CurrentDayDate is Wed Apr 27 2022 17:40:59 GMT+0800 (Taipei Standard Time)

  const q = query(
    blocksListRef,
    where('start', '>=', currentDayDate),
    where('start', '<=', addOneDay(currentDayDate)),
    orderBy('start', 'asc')
  );

  try {
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((doc) => {
      // console.log(333, doc);
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
// currentDayDate={day}
// planDocRef={planDocRef}
// index={index}
function DayBlockCard(props) {
  const [dayEvents, setDayEvents] = useState([]);
  const [hasReturned, setHasReturned] = useState(false);
  const [dayTimeBlocks, setDayTimeBlocks] = useState([]);
  const [timeBlockImage, setTimeBlockImage] = useState('');
  const [result, setResult] = useState(null);
  const blocksListRef = collection(
    db,
    'plans',
    props.planDocRef,
    'time_blocks'
  );

  useEffect(() => {
    CalendarByDay(blocksListRef, props.currentDayDate)
      .then((eventList) => {
        // console.log(eventList);
        setDayEvents(eventList);
        setHasReturned(true);
        return eventList;
      })
      .catch((error) => {
        console.log(error);
      });
  }, [props.currentDayDate]);

  useEffect(() => {
    dayEvents.forEach((block) => {
      // console.log(block);
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
  // console.log(11, result);

  return (
    <MainWrapper>
      <h2>
        Day{props.index + 1}, {props.currentDayDate.toDateString()}
      </h2>
      <SingleDayWrapper>
        <DailyContentWrapper>
          {dayEvents.map((singleEvent, index) => {
            // console.log('here', singleEvent.end.secodns); //single event end time
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
          {/* this renders duration text, but position need to be fixed
          {
            result?.map((res) => {
              return res.map((e) => {
                console.log(e);
                console.log(33, e.duration.text);

                return <h2>Duration is: {e.duration.text}</h2>;
              });
            })} */}
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

          <DayMapCard dayEvents={dayEvents} setResult={setResult} />
        </TimeMapContainer>
      </SingleDayWrapper>
    </MainWrapper>
  );
}

export default DayBlockCard;
