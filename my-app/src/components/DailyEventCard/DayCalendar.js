import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer, Views } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';
import styled from 'styled-components';

const DateTitle = styled.div`
  font-weight: 600;
  font-size: 14px;
`;
export default function DayCalendar(props) {
  const localizer = momentLocalizer(moment);

  console.log(props.currentDayDate);
  console.log(77777, props.dayTimeBlocks);

  return (
    <>
      <DateTitle>{props.currentDayDate.toDateString()}</DateTitle>
      <Calendar
        defaultDate={props.currentDayDate}
        localizer={localizer}
        events={props.dayTimeBlocks}
        startAccessor="start"
        endAccessor="end"
        defaultView={Views.DAY}
        toolbar={false}
      />
    </>
  );
}
