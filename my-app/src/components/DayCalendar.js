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
  //   console.log(props.dayEvents);

  //   useEffect(() => {
  //     props.dayEvents.forEach((block) => {
  //       console.log(block);
  //       setDayTimeBlocks((prev) => [
  //         ...prev,
  //         {
  //           start: new Date(block.start.seconds * 1000),
  //           end: new Date(block.end.seconds * 1000),
  //           title: block.title,
  //           id: block.id,
  //           address: block.address,
  //           text: block.text,
  //         },
  //       ]);
  //     });
  //   }, []);

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
