import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import GoogleAPI from '../utils/GoogleAPI';
import { Wrapper, Status } from '@googlemaps/react-wrapper';

const ApiKey = 'AIzaSyAclJIAm-8LUEgGfbnL4fS9KiIHbg1ZR8k';
const center = { lat: -33.8666, lng: 151.1958 };
const zoom = 15;

const MapContainer = styled.div`
  border: 1px black solid;
  height: 450px;
  width: 450px;
`;

const render = (status) => {
  return <h1>{status}</h1>;
};

const Map = () => {
  const ref = useRef(null);
  const [map, setMap] = useState();

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

  return (
    <div
      style={{
        height: '100%',
        position: 'relative',
      }}
      ref={ref}
    />
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
