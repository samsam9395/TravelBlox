import React, { useState, useEffect, useCallback, useMemo } from 'react';
import './../styles/calendarStyle.scss';
import { Calendar, momentLocalizer, Views } from 'react-big-calendar';
import moment from 'moment';
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';
import PropTypes from 'prop-types';

const localizer = momentLocalizer(moment);
const DnDCalendar = withDragAndDrop(Calendar);

// setImportData={setImportData}
// setMyEvents={setMyEvents}
// myEvents={myEvents}
// setShowEditPopUp={setShowEditPopUp}
// setCurrentSelectTimeData={setCurrentSelectTimeData}
// setCurrentSelectTimeId={setCurrentSelectTimeId}
// startDateValue={startDateValue}
function PlanCalendar(props, { dayLayoutAlgorithm = 'no-overlap' }) {
  //resize and dragable
  const { defaultDate, scrollToTime } = useMemo(
    () => ({
      defaultDate: new Date(2015, 3, 12),
      scrollToTime: new Date(1970, 1, 1, 6),
    }),
    []
  );

  console.log(props.startDateValue);

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
      // console.log('okies');
      console.log(event);
      // console.log(event.id);
      props.setCurrentSelectTimeId(event.id);
      props.setCurrentSelectTimeData(event);
      props.setShowEditPopUp(true);
    } else {
      console.log(event.status);
      console.log(event);
      props.setCurrentSelectTimeData(event);
      // console.log(event.id); //this is timeBlockId
      props.setCurrentSelectTimeId(event.id);
      props.setShowEditPopUp(true);
    }
  });

  // console.log(props.myEvents);
  // console.log('calendar start value', typeof props.startDateValue);

  return (
    props.startDateValue != 0 && (
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
    )
  );
}

PlanCalendar.propTypes = {
  dayLayoutAlgorithm: PropTypes.string,
};

export default React.memo(PlanCalendar);
