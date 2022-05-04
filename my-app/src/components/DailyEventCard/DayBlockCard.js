import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { display } from '@mui/system';
import { Box, CircularProgress } from '@mui/material';

import { getDocs, collection, query, where, orderBy } from 'firebase/firestore';
import firebaseDB from '../../utils/firebaseConfig';
import DayMapCard from './DayMapCard';
import DayCalendar from './DayCalendar';
import Weather from '../weather/Weather';

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
  max-width: 300px;
`;

const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin: 20px 0;
`;
const DailyContentWrapper = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  margin-right: 35px;
`;

const DayScheduleContainer = styled.div`
  min-height: 400px;
  /* border: 1px solid black; */
  margin-bottom: 60px;
`;

const TimeBlockImg = styled.img`
  margin-bottom: 15px;
  max-width: 100%;
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

// currentDayDate={day}
// planDocRef={planDocRef}
// index={index}
function DayBlockCard(props) {
  const [dayEvents, setDayEvents] = useState([]);
  const [hasReturned, setHasReturned] = useState(false);
  const [dayTimeBlocks, setDayTimeBlocks] = useState([]);
  const [result, setResult] = useState(null);
  const [lat, setLat] = useState(null);
  const [lng, setLng] = useState(null);
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
        if (eventList[0].place_lat) {
          setLat(eventList[0].place_lat);
          setLng(eventList[0].place_lng);
        }

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
  //  console.log(11, result);
  // console.log(dayEvents);
  console.log(111, dayEvents[1]);

  return (
    <MainWrapper ref={props.ref}>
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
                <TimeBlockImg
                  src={singleEvent.timeblock_img}
                  alt="evernt_main_image"></TimeBlockImg>
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
          {lat && lng && <Weather lat={lat} lng={lng} />}
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
          </DayScheduleContainer>

          <DayMapCard dayEvents={dayEvents} setResult={setResult} />
        </TimeMapContainer>
      </SingleDayWrapper>
    </MainWrapper>
  );
}

export default DayBlockCard;
