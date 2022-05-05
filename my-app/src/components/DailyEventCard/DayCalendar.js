import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer, Views } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';
import styled from 'styled-components';

const DateTitle = styled.div`
  font-weight: 600;
  font-size: 14px;
`;
export default function DayCalendar({
  currentDayDate,
  dayTimeBlocks,
  showType,
}) {
  const localizer = momentLocalizer(moment);

  if (showType === 'week') {
    return (
      <Calendar
        defaultDate={currentDayDate}
        localizer={localizer}
        events={dayTimeBlocks}
        startAccessor="start"
        endAccessor="end"
        defaultView={Views.WEEK}
        toolbar={false}
      />
    );
  }

  if (showType === 'day') {
    return (
      <>
        <DateTitle>{currentDayDate.toDateString()}</DateTitle>
        <Calendar
          defaultDate={currentDayDate}
          localizer={localizer}
          events={dayTimeBlocks}
          startAccessor="start"
          endAccessor="end"
          defaultView={Views.DAY}
          toolbar={false}
        />
      </>
    );
  }
}
