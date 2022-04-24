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
  //resize and dragable
  const { defaultDate, scrollToTime } = useMemo(
    () => ({
      defaultDate: new Date(2015, 3, 12),
      scrollToTime: new Date(1970, 1, 1, 6),
    }),
    []
  );

  const moveEvent = ({ event, start, end }) => {
    const newEvents = props.myEvents.map((existingEvent) => {
      return existingEvent.id == event.id
        ? { ...existingEvent, start, end }
        : existingEvent;
    });
    props.setMyEvents(newEvents);
  };

  const handleSelectEvent = useCallback((event) => {
    if (event.status === 'imported') {
      console.log(event.status);
      console.log('okies');
      console.log(event.blockData);
      props.setCurrentSelectTimeData(event);
    } else {
      console.log(event);
      props.setCurrentSelectTimeData(event);
      props.setShowEditPopUp(true);
      props.setCurrentSelectTimeId(event.id);
      console.log(event.id);
      console.log(props.currentSelectTimeId);
    }
  });

  console.log(props.myEvents);

  console.log(props.startDateValue);

  return (
    <DnDCalendar
      startAccessor="start"
      endAccessor="end"
      dayLayoutAlgorithm={dayLayoutAlgorithm}
      // defaultDate={moment().toDate()}
      defaultDate={props.startDateValue}
      defaultView={Views.WEEK}
      localizer={localizer}
      events={props.myEvents}
      onSelectEvent={handleSelectEvent}
      //   onSelectSlot={handleSelectSlot}
      onEventDrop={moveEvent}
      //   onEventResize={resizeEvent}
      scrollToTime={scrollToTime}
      draggableAccessor={(event) => true}
      selectable
      resizable
    />
  );
}

PlanCalendar.propTypes = {
  dayLayoutAlgorithm: PropTypes.string,
};

export default React.memo(PlanCalendar);
