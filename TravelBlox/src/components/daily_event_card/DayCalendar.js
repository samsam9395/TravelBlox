import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';

import { Calendar, Views, momentLocalizer } from 'react-big-calendar';
import React, { useCallback, useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';

import BeatLoader from 'react-spinners/BeatLoader';
import firebaseDB from '../../utils/firebaseConfig';
import moment from 'moment';
import styled from 'styled-components';
import { themeColours } from '../../styles/globalTheme';

const db = firebaseDB();

const SingleDayWrapper = styled.div`
  display: flex;
  margin-bottom: 60px;
  flex-direction: column;

  max-width: 900px;

  @media (max-width: 768px) {
    max-width: 100%;
  }
`;

const CalendarIndiWrapper = styled.div`
  width: 100%;
  height: 500px;
  display: flex;
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
  const [calendarDefaultView, setCalendarDefaultView] = 'WEEK';

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
