import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';

import { Wrapper, Status } from '@googlemaps/react-wrapper';
import { GoogleMap, LoadScript, useJsApiLoader } from '@react-google-maps/api';
import { googleAPI } from '../utils/credent';
const ApiKey = googleAPI();

const center = { lat: -33.8666, lng: 151.1958 };
const zoom = 15;

const MapContainer = styled.div`
  border: 1px black solid;
  height: 450px;
  width: 450px;
`;

const render = (status) => {
  console.log(status);
  return <h1>{status}</h1>;
};

const Map = () => {
  const ref = useRef(null);
  const [map, setMap] = useState();
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: ApiKey,
  });

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

  if (isLoaded) {
    // console.log(window.google.maps);
    const directionsService = new window.google.maps.DirectionsService();
    const directionsRenderer = new window.google.maps.DirectionsRenderer();

    const directionsRequest = {
      origin: { placeId: 'ChIJwbKbCiWuEmsRgBXuDPx5lJ0' },
      destination: { placeId: 'ChIJu284rCWuEmsR0XGjjcQ0YOI' },
      waypoints: [
        {
          location: { placeId: 'ChIJZ16jQCSuEmsRMSwlmuwPU08' },
          stopover: true,
        },
        //   {
        //     location: { placeId: 'ChIJld6bwiujfDURi41L4vVa10I' },
        //     stopover: true,
        //   },
      ],
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

  if (loadError) {
    console.log(loadError);
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

function TestMap() {
  console.log('this is rendered');
  return (
    <MapContainer>
      <Wrapper apiKey={ApiKey} render={render}>
        <Map center={center} zoom={zoom} />
      </Wrapper>
    </MapContainer>
  );
}

export default TestMap;
