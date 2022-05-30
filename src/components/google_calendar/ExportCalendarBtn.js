import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';

import { LightBlueBtn } from '../../styles/globalTheme';
import PropTypes from 'prop-types';
import Swal from 'sweetalert2';
import firebaseDB from '../../utils/firebaseConfig';

const db = firebaseDB();

ExportCalendarBtn.propTypes = {
  planDocRef: PropTypes.string,
  planTitle: PropTypes.string,
};

function ExportCalendarBtn(props) {
  const [eventsToExport, setEventsToExport] = useState([]);

  useEffect(async () => {
    const blocksListRef = collection(
      db,
      'plans',
      props.planDocRef,
      'time_blocks'
    );
    const docSnap = await getDocs(blocksListRef);
    const data = docSnap.docs.map((e) => e.data());

    const events = data.map((e) => ({
      summary: e.title,
      location: e.place_format_address,
      description: `Place link is: ${e.place_url}`,
      start: {
        dateTime: new Date(e.start.seconds * 1000).toISOString(),
      },
      end: {
        dateTime: new Date(e.end.seconds * 1000).toISOString(),
      },
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'email', minutes: 24 * 60 },
          { method: 'popup', minutes: 30 },
        ],
      },
    }));

    setEventsToExport(events);
  }, []);

  function handleExport() {
    const gapi = window.gapi;
    gapi.load('client:auth2', () => {
      const batch = gapi.client.newBatch();

      gapi.client.init({
        apikey: process.env.REACT_APP_GOOGLE_CALENDAR_API_KEY,
        clientId: process.env.REACT_APP_GOOGLE_CALENDAR_CLIENT_ID,
        discoveryDocs: process.env.REACT_APP_GOOGLE_CALENDAR_DISCOVERY_DOCS,
        scope: process.env.REACT_APP_GOOGLE_CALENDAR_SCOPE,
      });

      gapi.auth2
        .getAuthInstance()
        .signIn()
        .then(() => {
          const calendar = {
            summary: `TravelBlox: ${props.planTitle}`,
          };

          const request = gapi.client.calendar.calendars.insert({
            resource: calendar,
          });

          request.execute((calendar) => {
            eventsToExport.forEach((event) => {
              const request = gapi.client.calendar.events.insert({
                calendarId: calendar.id,
                resource: event,
              });

              batch.add(request);
            });
            try {
              batch.execute((newCalendar, res) => {
                window.open(Object.values(newCalendar)[0].result.htmlLink);
              });
            } catch (error) {
              Swal.fire('Oops, something went wrong. Please try search again!');
              console.log(error);
            }
          });
        });
    });
  }

  return (
    <LightBlueBtn
      fontSize="14px"
      width="165px"
      padding="10px"
      onClick={() => handleExport()}>
      Export to Google Calendar
    </LightBlueBtn>
  );
}

export default ExportCalendarBtn;
