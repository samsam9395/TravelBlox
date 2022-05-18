import React, { useState, useEffect, useCallback } from 'react';
import { Calendar, momentLocalizer, Views } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';
import styled from 'styled-components';
import { getDocs, collection } from 'firebase/firestore';
import firebaseDB from '../../utils/firebaseConfig';
import { themeColours } from '../../styles/globalTheme';
import BeatLoader from 'react-spinners/BeatLoader';

const db = firebaseDB();

const DateTitle = styled.div`
  font-weight: 600;
  font-size: 14px;
`;

const SingleDayWrapper = styled.div`
  display: flex;
  margin-bottom: 60px;
  /* height: 2000px; */
  flex-direction: column;
`;

const CalendarIndiWrapper = styled.div`
  width: 100%;
  height: 500px;
  display: flex;

  margin-right: 35px;
  /* max-width: 750px; */
  /* flex-grow: 2; */
`;

const DayScheduleContainer = styled.div`
  height: 100%;
  margin-bottom: 30px;
  display: flex;
  width: 100%;
`;

const SmallNotice = styled.div`
  font-size: 14px;
  color: ${themeColours.orange_grey};
  margin: 50px 20px;
`;

export default function DayCalendar({ planDocRef, currentDayDate }) {
  const localizer = momentLocalizer(moment);
  const [allPlansList, setAllPlansList] = useState([]);

  useEffect(async () => {
    if (planDocRef) {
      const blocksListRef = collection(db, 'plans', planDocRef, 'time_blocks');

      const allTimeBlocks = await getDocs(blocksListRef);
      allTimeBlocks.docs.forEach((e) => {
        const block = e.data();
        setAllPlansList((prev) => [
          ...prev,
          {
            start: new Date(block.start.seconds * 1000),
            end: new Date(block.end.seconds * 1000),
            title: block.title,
            id: block.id,
            address: block.address,
            text: block.text,
            place_name: block.place_name,
            place_url: block.place_url,
          },
        ]);
      });
    }
  }, []);

  const handleSelectEvent = useCallback((event) => {
    window.open(event.place_url, '_blank').focus();
  });

  return (
    <SingleDayWrapper>
      <CalendarIndiWrapper>
        <DayScheduleContainer>
          {allPlansList && currentDayDate ? (
            <Calendar
              defaultDate={currentDayDate}
              localizer={localizer}
              events={allPlansList}
              startAccessor="start"
              endAccessor="end"
              defaultView={Views.WEEK}
              onSelectEvent={handleSelectEvent}
              // toolbar={false}
            />
          ) : (
            <BeatLoader color={themeColours.milktea} size={8}></BeatLoader>
          )}
        </DayScheduleContainer>
      </CalendarIndiWrapper>
      <SmallNotice>
        Try click on the even timeblock, it will redirect you to its detail
        information!
      </SmallNotice>
    </SingleDayWrapper>
  );
}
