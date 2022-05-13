import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { googleCalendarConfig } from '../../utils/credent';
import { getDocs, collection } from 'firebase/firestore';
import firebaseDB from '../../utils/firebaseConfig';
import { LightBlueBtn } from '../../styles/globalTheme';

const db = firebaseDB();

// planDocRef={planDocRef} planTitle={planTitle}
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
    // console.log(events);
  }, []);

  function handleExport() {
    const gapi = window.gapi;
    console.log(window.gapi);

    console.log(gapi);

    gapi.load('client:auth2', () => {
      console.log('loaded client');
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
            // console.log(calendar);

            // adding events
            eventsToExport.forEach((event) => {
              // console.log(event);
              const request = gapi.client.calendar.events.insert({
                calendarId: calendar.id,
                resource: event,
              });

              batch.add(request);
            });
            try {
              batch.execute((newCalendar, res) => {
                // console.log(Object.values(newCalendar)[0]);
                window.open(Object.values(newCalendar)[0].result.htmlLink);
              });
            } catch (error) {
              console.log(error);
            }
          });
        });
    });
  }

  return (
    <LightBlueBtn
      fontSize="12px"
      width="165px"
      padding="10px"
      onClick={() => handleExport()}>
      Export to Google Calendar
    </LightBlueBtn>
  );
}

export default ExportGCalendarBtn;
