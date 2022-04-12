import React, { useState, useEffect, useCallback, useMemo } from 'react';
import './planDetail.scss';
import { Calendar, momentLocalizer, Views } from 'react-big-calendar';
import moment from 'moment';
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';
import PropTypes from 'prop-types';

const localizer = momentLocalizer(moment);
const DnDCalendar = withDragAndDrop(Calendar);

function PlanCalendar(props, { dayLayoutAlgorithm = 'no-overlap' }) {
  // const [myEvents, setMyEvents] = useState([]);

  //resize and dragable
  const { defaultDate, scrollToTime } = useMemo(
    () => ({
      defaultDate: new Date(2015, 3, 12),
      scrollToTime: new Date(1970, 1, 1, 6),
    }),
    []
  );

  const moveEvent = useCallback(
    ({ event, start, end, isAllDay: droppedOnAllDaySlot = false }) => {
      const { allDay } = event;
      if (!allDay && droppedOnAllDaySlot) {
        event.allDay = true;
      }

      props.setMyEvents((prev) => {
        const existing = prev.find((ev) => ev.id === event.id) ?? {};
        const filtered = prev.filter((ev) => ev.id !== event.id);
        return [...filtered, { ...existing, start, end, allDay }];
      });
    },
    [props.setMyEvents]
  );

  const resizeEvent = useCallback(
    ({ event, start, end }) => {
      props.setMyEvents((prev) => {
        const existing = prev.find((ev) => ev.id === event.id) ?? {};
        const filtered = prev.filter((ev) => ev.id !== event.id);
        return [...filtered, { ...existing, start, end }];
      });
    },
    [props.setMyEvents]
  );

  const handleSelectEvent = useCallback((event) => console.log(event), []);

  //   //create event
  //   const handleSelectSlot = useCallback(
  //     ({ start, end }) => {
  //       const title = window.prompt('New Event name');
  //       if (title) {
  //         props.setMyEvents((prev) => [...prev, { start, end, title }]);
  //       }
  //     },
  //     [props.setMyEvents]
  //   );

  console.log(props.myEvents);

  return (
    <DnDCalendar
      startAccessor="start"
      endAccessor="end"
      dayLayoutAlgorithm={dayLayoutAlgorithm}
      defaultDate={moment().toDate()}
      defaultView={Views.WEEK}
      localizer={localizer}
      events={props.myEvents}
      onSelectEvent={handleSelectEvent}
      //   onSelectSlot={handleSelectSlot}
      onEventDrop={moveEvent}
      onEventResize={resizeEvent}
      scrollToTime={scrollToTime}
      draggableAccessor={(event) => true}
      selectable
    />
  );
}

PlanCalendar.propTypes = {
  dayLayoutAlgorithm: PropTypes.string,
};

export default PlanCalendar;
