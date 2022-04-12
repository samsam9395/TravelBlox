import React, { useState, useEffect } from 'react';
import './planDetail.scss';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import { DateTime } from 'luxon';

const localizer = momentLocalizer(DateTime);

// console.log(moment().toDate());
// console.log(DateTime.local());

function PlanCalendar() {
  return (
    <Calendar
      startAccessor="start"
      endAccessor="end"
      defaultDate={DateTime.local()}
      localizer={localizer}
    />
  );
}

export default PlanCalendar;
