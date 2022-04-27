import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Button } from '@mui/material';
import { googleCalendarConfig } from '../../utils/credent';

function ExportGCalendarBtn() {
  const googleConfig = googleCalendarConfig();

  function handleExport() {
    const gapi = window.gapi;
    console.log(gapi);

    gapi.load('client:auth2', () => {
      console.log('loaded client');

      gapi.client.init({
        apikey: googleConfig.API_KEY,
        clientId: googleConfig.CLIENT_ID,
        discoveryDocs: googleConfig.DISCOVERY_DOCS,
        scope: googleConfig.SCOPES,
      });

      gapi.client.load('calendar', 'v3', () => console.log('bam! signed in '));

      gapi.auth2
        .getAuthInstance()
        .signIn()
        .then(() => {
          const calendar = {
            summary: 'testCalendar',
          };

          const request = gapi.client.calendar.calendars.insert({
            resource: calendar,
          });

          request.execute((calendar) => {
            console.log(calendar);
          });

          //   const newCalendar = createCalendar();
          //   console.log(newCalendar);
          //   return newCalendar;
        });
      // .then((newCalendarId) => {
      //   console.log(333, newCalendarId);
      //   const event = {
      //     summary: 'Google I/O 2015',
      //     location: '800 Howard St., San Francisco, CA 94103',
      //     description:
      //       "A chance to hear more about Google's developer products.",
      //     start: {
      //       dateTime: '2022-04-28T09:00:00-07:00',
      //       timeZone: 'America/Los_Angeles',
      //     },
      //     end: {
      //       dateTime: '2022-04-28T17:00:00-07:00',
      //       timeZone: 'America/Los_Angeles',
      //     },
      //     // 'recurrence': [
      //     //   'RRULE:FREQ=DAILY;COUNT=2'
      //     // ],
      //     attendees: [
      //       { email: 'lpage@example.com' },
      //       { email: 'sbrin@example.com' },
      //     ],
      //     reminders: {
      //       useDefault: false,
      //       overrides: [
      //         { method: 'email', minutes: 24 * 60 },
      //         { method: 'popup', minutes: 10 },
      //       ],
      //     },
      //   };

      //   var request = gapi.client.calendar.events.insert({
      //     calendarId: 'primary',
      //     resource: event,
      //   });

      //   request.execute((event) => {
      //     console.log(event);
      //     window.open(event.htmlLink);
      //   });
      // });
    });
  }

  return (
    <Button variant="outlined" onClick={() => handleExport()}>
      Export to Google Calendar
    </Button>
  );
}

export default ExportGCalendarBtn;
