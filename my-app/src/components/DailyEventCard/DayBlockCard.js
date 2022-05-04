import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { Box, CircularProgress } from '@mui/material';

import { getDocs, collection, query, where, orderBy } from 'firebase/firestore';
import firebaseDB from '../../utils/firebaseConfig';
import DayMapCard from './DayMapCard';
import DayCalendar from './DayCalendar';
import Weather from '../weather/Weather';
import { themeColours } from '../../utils/globalTheme';

const db = firebaseDB();

const MainWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const SingleDayWrapper = styled.div`
  display: flex;
  margin-bottom: 60px;
  /* height: 2000px; */
`;

const LeftWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-right: 35px;
  max-width: 980px;
  /* flex-grow: 2; */
`;

const RightWrapper = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 400px;
  margin-left: auto;
  min-width: 300px;
  /* flex-grow: 1; */
`;

const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const DayScheduleContainer = styled.div`
  min-height: 400px;
  margin-bottom: 60px;
`;

const TimeBlockImg = styled.img`
  margin-bottom: 15px;
  max-width: 100%;
`;

const DayTitle = styled.div`
  font-size: 36px;
  font-weight: 600;
  font-family: 'Oswald', sans-serif;
  margin-bottom: 50px;
  color: ${themeColours.orange};
  display: flex;
  align-items: baseline;
  .date {
    padding-left: 10px;
    font-size: 18px;
  }
`;

const EventTitle = styled.div`
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 20px;

  .event_location {
    font-size: 12px;
    margin: 10px 0;
  }
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

// timelineRefArray={timelineRefArray}
// itemEls={itemEls}
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

  const dayRef = useRef(null);

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
    props.itemEls.current.push(dayRef);
  }, []);

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

  function changeTimelineEnterColor(timelineRefArray, index) {
    // console.log(timelineRefArray.current[0].current[index]);
    const enteredElement = timelineRefArray.current[0].current[index];
    enteredElement.style.borderRadius = '50%';
    enteredElement.style.backgroundColor = themeColours.light_blue;
  }

  function removeTimelineEnterColor(timelineRefArray, index) {
    const enteredElement = timelineRefArray.current[0].current[index];
    enteredElement.style.borderRadius = 0;
    enteredElement.style.backgroundColor = 'transparent';
  }

  return (
    <MainWrapper
      onMouseEnter={() =>
        changeTimelineEnterColor(props.timelineRefArray, props.index)
      }
      onMouseLeave={() =>
        removeTimelineEnterColor(props.timelineRefArray, props.index)
      }>
      <DayTitle ref={dayRef}>
        Day {props.index + 1}
        <div className="date"> {props.currentDayDate.toDateString()}</div>
      </DayTitle>
      <SingleDayWrapper>
        <LeftWrapper>
          {dayEvents.map((singleEvent, index) => {
            // console.log('here', singleEvent.end.secodns); //single event end time
            return (
              <ContentContainer key={index}>
                <EventTitle>
                  {singleEvent.title.toUpperCase()}
                  {/* <div>Place: {singleEvent.place_name}</div> */}
                  <div className="event_location">
                    Address: {singleEvent.place_format_address}
                  </div>
                </EventTitle>
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
        </LeftWrapper>

        <RightWrapper>
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
        </RightWrapper>
      </SingleDayWrapper>
    </MainWrapper>
  );
}

export default DayBlockCard;