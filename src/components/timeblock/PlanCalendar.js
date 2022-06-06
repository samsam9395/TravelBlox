import '../../styles/calendarStyle.scss';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';

import { Calendar, Views, momentLocalizer } from 'react-big-calendar';
import React, { useCallback, useMemo } from 'react';

import PropTypes from 'prop-types';
import moment from 'moment';
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';

const localizer = momentLocalizer(moment);
const DnDCalendar = withDragAndDrop(Calendar);

PlanCalendar.propTypes = {
  myEvents: PropTypes.string,
  startDateValue: PropTypes.string,
  setMyEvents: PropTypes.func,
  setCurrentSelectTimeData: PropTypes.func,
  toggleShowEditPopUp: PropTypes.func,
};

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
    props.setCurrentSelectTimeData(event);
    props.toggleShowEditPopUp();
  });

  return (
    props.startDateValue != 0 && (
      <DnDCalendar
        startAccessor="start"
        endAccessor="end"
        dayLayoutAlgorithm={dayLayoutAlgorithm}
        defaultDate={props.startDateValue}
        defaultView={Views.WEEK}
        localizer={localizer}
        events={props.myEvents}
        onSelectEvent={handleSelectEvent}
        onEventDrop={moveEvent}
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
