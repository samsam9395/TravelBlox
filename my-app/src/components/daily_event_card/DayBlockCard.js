import React, { useEffect, useRef, useState } from 'react';
import { collection, getDocs, orderBy, query, where } from 'firebase/firestore';

import DayMapCard from './DayMapCard';
import Weather from '../weather/Weather';
import firebaseDB from '../../utils/firebaseConfig';
import styled from 'styled-components';
import { themeColours } from '../../styles/globalTheme';

const db = firebaseDB();

const MainWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const SingleDayWrapper = styled.div`
  display: flex;
  margin-bottom: 60px;
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const LeftWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-right: 35px;
  max-width: 750px;

  @media (max-width: 768px) {
    width: 100%;
    margin-right: 20px;
  }
`;

const MapIndivWrapper = styled.div`
  display: flex;
  width: 100%;
  height: 400px;
  overflow: hidden;
`;

const CalendarIndiWrapper = styled.div`
  width: 100%;
  height: 400px;
  display: flex;
  margin-right: 35px;
`;

const RightWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: auto;
  width: 300px;

  @media (max-width: 768px) {
    margin-left: 0;
    margin: auto;
  }
`;

const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 30px;
`;

const TimeBlockImg = styled.img`
  margin-bottom: 15px;
  max-width: 100%;
`;

const DayTitle = styled.div`
  scroll-margin-top: 65px;
  font-size: 36px;
  font-weight: 600;
  font-family: 'Oswald', sans-serif;
  margin-bottom: 50px;
  color: ${themeColours.light_orange};
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

const EventContentText = styled.div`
  font-size: 16px;
  display: inline-block;
`;

function addOneDay(date) {
  var result = new Date(date);
  result.setDate(result.getDate() + 1);
  return result;
}

async function CalendarByDay(blocksListRef, currentDayDate) {
  const eventByDayList = [];

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

// timelineRefArray={timelineRefArray}
// itemEls={itemEls}
// currentDayDate={day}
// planDocRef={planDocRef}
// index={index}
// showTab={showTab}
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

  const dayRef = useRef([]);

  useEffect(() => {
    CalendarByDay(blocksListRef, props.currentDayDate)
      .then((eventList) => {
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

  function changeTimelineEnterColor(timelineRefArray, index) {
    const enteredElement = timelineRefArray.current[0].current[index];
    enteredElement.style.borderRadius = '50%';
    enteredElement.style.backgroundColor = themeColours.light_blue;
  }

  function removeTimelineEnterColor(timelineRefArray, index) {
    const enteredElement = timelineRefArray.current[0].current[index];
    enteredElement.style.borderRadius = 0;
    enteredElement.style.backgroundColor = 'transparent';
  }

  useEffect(() => {
    if (props.showTab !== 'calendar' && dayRef !== null) {
      props.itemEls.current.push(dayRef);
    }
  }, []);

  if (props.showTab === 'dayByday') {
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
              return (
                <ContentContainer key={index}>
                  <EventTitle>
                    {singleEvent.title.toUpperCase()}
                    <div className="event_location">
                      Address: {singleEvent.place_format_address}
                    </div>
                  </EventTitle>
                  <TimeBlockImg
                    src={singleEvent.timeblock_img}
                    alt="evernt_main_image"></TimeBlockImg>
                  <EventContentText style={{ whiteSpace: 'pre-wrap' }}>
                    {singleEvent.text}
                  </EventContentText>
                </ContentContainer>
              );
            })}
          </LeftWrapper>
          <RightWrapper>
            {lat && lng && <Weather lat={lat} lng={lng} />}
          </RightWrapper>
        </SingleDayWrapper>
      </MainWrapper>
    );
  }

  if (props.showTab === 'route') {
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
          <MapIndivWrapper>
            <DayMapCard dayEvents={dayEvents} setResult={setResult} />
          </MapIndivWrapper>
        </SingleDayWrapper>
      </MainWrapper>
    );
  }
}

export default DayBlockCard;
