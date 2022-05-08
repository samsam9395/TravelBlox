import React, { useState, useEffect, useCallback } from 'react';
import { Calendar, momentLocalizer, Views } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';
import styled from 'styled-components';
import { getDocs, collection } from 'firebase/firestore';
import firebaseDB from '../../utils/firebaseConfig';

const db = firebaseDB();

const DateTitle = styled.div`
  font-weight: 600;
  font-size: 14px;
`;

const SingleDayWrapper = styled.div`
  display: flex;
  margin-bottom: 60px;
  /* height: 2000px; */
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

export default function DayCalendar({
  planDocRef,
  currentDayDate,
  dayTimeBlocks,
  showType,
}) {
  const localizer = momentLocalizer(moment);
  const [allPlansList, setAllPlansList] = useState([]);

  useEffect(async () => {
    if (planDocRef) {
      const blocksListRef = collection(db, 'plans', planDocRef, 'time_blocks');

      const allTimeBlocks = await getDocs(blocksListRef);
      // console.log(allTimeBlocks);
      allTimeBlocks.docs.forEach((e) => {
        // console.log(e);
        const block = e.data();
        // console.log(111, block);
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

  // console.log(allPlansList);

  // console.log('currentDayDate', currentDayDate);

  const handleSelectEvent = useCallback((event) => {
    // console.log(event);
    window.open(event.place_url, '_blank').focus();
  });

  return (
    <SingleDayWrapper>
      <CalendarIndiWrapper>
        <DayScheduleContainer>
          {/* {hasReturned ? ( */}
          {allPlansList && currentDayDate && (
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
          )}
          {/* ) : (
                <Box sx={{ display: 'flex' }} align="center" justify="center">
                  <CircularProgress size={14} sx={{ py: 2 }} />
                </Box>
              )} */}
        </DayScheduleContainer>
      </CalendarIndiWrapper>
    </SingleDayWrapper>
  );

  // if (showType === 'day') {
  //   return (
  //     <>
  //       <DateTitle>{currentDayDate.toDateString()}</DateTitle>
  //       <Calendar
  //         defaultDate={currentDayDate}
  //         localizer={localizer}
  //         events={dayTimeBlocks}
  //         startAccessor="start"
  //         endAccessor="end"
  //         defaultView={Views.DAY}
  //         toolbar={false}
  //       />
  //     </>
  //   );
  // }
}
