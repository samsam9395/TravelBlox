import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer, Views } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const DateTitle = styled.div`
  font-weight: 600;
  font-size: 14px;
`;
export default function DayCalendar(props) {
  //   const [dayTimeBlocks, setDayTimeBlocks] = useState([]);
  const localizer = momentLocalizer(moment);

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
