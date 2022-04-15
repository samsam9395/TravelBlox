import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import GoogleAPI from '../utils/GoogleAPI';
import { Loader } from '@googlemaps/js-api-loader';
import { Wrapper, Status } from '@googlemaps/react-wrapper';

//Direction API
//https://maps.googleapis.com/maps/api/directions/json?origin=Toronto&destination=Montreal&key=YOUR_API_KEY

const DayMapContainer = styled.div`
  min-height: 300px;
  min-width: 200px;
  border: 1px solid black;
  margin-bottom: 20px;
`;

const googleAPIKey = GoogleAPI();

// const Marker = (options) => {
//   const [marker, setMarker] = useState();

//   useEffect(() => {
//     if (!marker) {
//       setMarker(new google.maps.Marker());
//     }

//     // remove marker from map on unmount
//     return () => {
//       if (marker) {
//         marker.setMap(null);
//       }
//     };
//   }, [marker]);
//   useEffect(() => {
//     if (marker) {
//       marker.setOptions(options);
//     }
//   }, [marker, options]);
//   return null;
// };

const Map = (props) => {
  const ref = React.useRef(null);
  const [map, setMap] = React.useState();

  React.useEffect(() => {
    if (ref.current && !map) {
      setMap(new window.google.maps.Map(ref.current, {}));
    }
  }, [ref, map]);

  return <div ref={ref} />;
};

console.log(GoogleAPI());

function MapCard(props) {
  const ref = useRef(null);
  const [map, setMap] = useState();
  const center = { lat: -34.397, lng: 150.644 };
  const zoom = 8;

  useEffect(() => {
    if (ref.current && !map) {
      setMap(new window.google.maps.Map(ref.current, {}));
    }
  }, [ref, map]);

  return (
    <>
      <Wrapper apiKey={GoogleAPI()}>
        <Map center={center} zoom={zoom} />
      </Wrapper>
      <DayMapContainer>Map Here</DayMapContainer>
      {/* <div ref={ref} id="map" /> */}
    </>
  );
}

export default MapCard;
