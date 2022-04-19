import React, { useState, useEffect, useRef, memo } from 'react';
import styled from 'styled-components';
import GoogleAPI from '../utils/GoogleAPI';
import { Wrapper, Status } from '@googlemaps/react-wrapper';

const ApiKey = GoogleAPI();
const center = { lat: -33.8666, lng: 151.1958 };
const zoom = 15;

const DayMapContainer = styled.div`
  height: 650px;
  width: 450px;
  border: 1px solid black;
  margin-bottom: 20px;
`;

const MapContainer = styled.div`
  border: 1px black solid;
  height: 450px;
  width: 450px;
`;

const Marker = (position) => {
  const [marker, setMarker] = React.useState();

  React.useEffect(() => {
    if (!marker) {
      setMarker(new window.google.maps.Marker());
    }

    // remove marker from map on unmount
    return () => {
      if (marker) {
        marker.setMap(null);
      }
    };
  }, [marker]);

  React.useEffect(() => {
    if (marker) {
      marker.setOptions(position);
    }
  }, [marker, position]);
  return null;
};

const Map = (props) => {
  const ref = useRef(null);
  const [map, setMap] = useState();
  const [placeIdList, setPlaceIdList] = useState([]);

  // console.log(props.dayEvents);

  useEffect(() => {
    props.dayEvents.forEach((eventBlock) => {
      placeIdList.push(eventBlock.place_id);
      setPlaceIdList(placeIdList);
      console.log(placeIdList);
    });
  }, [props.dayEvents, ref.current]);

  useEffect(() => {
    if (ref.current && !map) {
      setMap(
        new window.google.maps.Map(ref.current, {
          center: { lat: 40.76, lng: -73.983 },
          zoom: 15,
          mapTypeId: 'roadmap',
        })
      );
    }
  }, [ref, map]);

  if (ref.current) {
    const directionsService = new window.google.maps.DirectionsService();
    const directionsRenderer = new window.google.maps.DirectionsRenderer();

    if (placeIdList && placeIdList.length === 1) {
      props.setMarkerPosition({ placeId: placeIdList });
      // const marker = new google.maps.Marker({
      //   position: { placeId: placeIdList },
      //   map: map,
      // });

      const directionsRequest = {
        origin: { placeId: placeIdList[0] },
        destination: { placeId: placeIdList.at(-1) },
        provideRouteAlternatives: false,
        travelMode: 'WALKING',
      };
      directionsRenderer.setMap(map);

      directionsService.route(directionsRequest).then((result) => {
        if (result.status === 'OK') {
          directionsRenderer.setDirections(result);
        } else console.log('something wrong');
      });

      props.setHasMarker(true);
    }

    if (placeIdList && placeIdList.length === 2) {
      const directionsRequest = {
        origin: { placeId: placeIdList[0] },
        destination: { placeId: placeIdList.at(-1) },
        provideRouteAlternatives: false,
        travelMode: 'WALKING',
      };
      directionsRenderer.setMap(map);

      directionsService.route(directionsRequest).then((result) => {
        if (result.status === 'OK') {
          directionsRenderer.setDirections(result);
        } else console.log('something wrong');
      });
    }

    if (placeIdList && placeIdList.length > 2) {
      const waypointsList = placeIdList.slice(1).slice(0, -1);
      const waypoints = [];
      // console.log(waypointsList);
      waypointsList.forEach((singleRoute) => {
        waypoints.push({
          location: { placeId: singleRoute },
          stopover: true,
        });
      });
      // console.log(waypoints); //ChIJJQ6Ck8zFyIARfxB2vQVF2Z0
      // console.log(placeIdList[0]); //ChIJ69QoNDjEyIARTIMmDF0Z4kM
      // console.log(placeIdList.at(-1)); //ChIJVY-sauoz3YARb5koICraTBw

      const directionsRequest = {
        origin: { placeId: placeIdList[0] },
        destination: { placeId: placeIdList.at(-1) },

        waypoints: waypoints,
        provideRouteAlternatives: false,
        travelMode: 'WALKING',
      };
      directionsRenderer.setMap(map);

      //   renderDirections(directionsService, directionsRenderer, map);
      directionsService.route(directionsRequest).then((result) => {
        if (result.status === 'OK') {
          directionsRenderer.setDirections(result);
        } else console.log('something wrong');
      });
    }
  }

  return (
    <>
      <div
        style={{
          height: '100%',
          position: 'relative',
        }}
        ref={ref}
      />
    </>
  );
};

function DayMapCard(props) {
  console.log('this is rendered');
  const [hasMarker, setHasMarker] = useState(false);
  const [markerPosition, setMarkerPosition] = useState('');

  return (
    <DayMapContainer>
      <Wrapper apiKey={ApiKey}>
        <Map
          center={center}
          zoom={zoom}
          dayEvents={props.dayEvents}
          setHasMarker={setHasMarker}
          setMarkerPosition={setMarkerPosition}
        />
        {hasMarker && <Marker position={markerPosition} />}
      </Wrapper>
    </DayMapContainer>
  );
}

export default DayMapCard;
