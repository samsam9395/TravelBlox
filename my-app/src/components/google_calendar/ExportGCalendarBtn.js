import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import { googleCalendarConfig } from '../../utils/credent';
import { getDocs, collection } from 'firebase/firestore';
import firebaseDB from '../../utils/firebaseConfig';
import { LightBlueBtn } from '../../styles/globalTheme';
import Swal from 'sweetalert2';

const db = firebaseDB();

ExportGCalendarBtn.propTypes = {
  planDocRef: PropTypes.string,
  planTitle: PropTypes.string,
};

function ExportGCalendarBtn(props) {
  const googleConfig = googleCalendarConfig();
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

export default ExportGCalendarBtn;
