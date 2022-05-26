import React, { memo, useEffect, useRef, useState } from 'react';

import PropTypes from 'prop-types';
import styled from 'styled-components';

const DayMapContainer = styled.div`
  margin-bottom: 20px;
  display: flex;
  width: 100%;
  font-size: 14px;
`;

const MapContainer = styled.div`
  width: 100%;
`;

const PanelContainer = styled.div`
  max-width: 250px;
  /* min-height: 300px; */
  margin-bottom: 0 30px;
  margin-left: 15px;
  /* max-height: 100%; */
  overflow: auto;
  height: 100%;
  box-sizing: border-box;
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

DayMapCard.propTypes = {
  dayEvents: PropTypes.object,
};

// dayEvents={dayEvents}
function DayMapCard(props) {
  const [hasMarker, setHasMarker] = useState(false);
  const [markerPosition, setMarkerPosition] = useState('');
  const sideRouteRef = useRef(null);

  const [map, setMap] = useState();
  const [placeIdList, setPlaceIdList] = useState([]);
  const ref = useRef(null);

  useEffect(() => {
    props.dayEvents.forEach((eventBlock) => {
      placeIdList.push(eventBlock.place_id);
      setPlaceIdList(placeIdList);
    });
  }, [props.dayEvents, ref.current]);

  useEffect(() => {
    if (ref.current && !map) {
      setMap(
        new window.google.maps.Map(ref.current, {
          center: { lat: 40.76, lng: -73.983 },
          zoom: 15,
          maxZoom: 18,
          mapTypeId: 'roadmap',
        })
      );
    }
  }, [ref, map]);

  useEffect(async () => {
    if (ref.current) {
      const directionsService = new window.google.maps.DirectionsService();
      const directionsRenderer = new window.google.maps.DirectionsRenderer();

      if (placeIdList && placeIdList.length === 1) {
        setMarkerPosition({ placeId: placeIdList[0] });
        map.setZoom(5);

        const directionsRequest = {
          origin: { placeId: placeIdList[0] },
          destination: { placeId: placeIdList.at(-1) },
          provideRouteAlternatives: false,
          travelMode: 'DRIVING',
          unitSystem: window.google.maps.UnitSystem.METRIC,
        };
        directionsRenderer.setMap(map);

        directionsService.route(directionsRequest).then((result) => {
          if (result.status === 'OK') {
            directionsRenderer.setDirections(result);
          } else console.log('something wrong');
        });

        setHasMarker(true);
      }

      if (placeIdList && placeIdList.length === 2) {
        const directionsRequest = {
          origin: { placeId: placeIdList[0] },
          destination: { placeId: placeIdList.at(-1) },
          provideRouteAlternatives: false,
          travelMode: 'DRIVING',
          unitSystem: window.google.maps.UnitSystem.METRIC,
        };
        directionsRenderer.setMap(map);

        directionsService.route(directionsRequest).then((result) => {
          if (result.status === 'OK') {
            directionsRenderer.setDirections(result);
            const travelDuration = result.routes.map((e) => {
              return e.legs;
            });

            props.setResult(travelDuration);
            directionsRenderer.setPanel(document.getElementById('sidebar'));
          } else console.log('something wrong');
        });
      }

      if (placeIdList && placeIdList.length > 2) {
        const waypointsList = placeIdList.slice(1).slice(0, -1);
        const waypoints = [];

        waypointsList.forEach((singleRoute) => {
          waypoints.push({
            location: { placeId: singleRoute },
            stopover: true,
          });
        });

        const directionsRequest = {
          origin: { placeId: placeIdList[0] },
          destination: { placeId: placeIdList.at(-1) },
          waypoints: waypoints,
          provideRouteAlternatives: false,
          travelMode: 'DRIVING',
          unitSystem: window.google.maps.UnitSystem.METRIC,
        };
        directionsRenderer.setMap(map);

        directionsService.route(directionsRequest).then((result) => {
          if (result.status === 'OK') {
            directionsRenderer.setDirections(result);

            const travelDuration = result.routes.map((e) => {
              return e.legs;
            });

            props.setResult(travelDuration);
            directionsRenderer.setPanel(sideRouteRef.current);
          } else console.log('something wrong');
        });
      }
    }
  }, [ref.current, props.dayEvents]);

  return (
    <DayMapContainer>
      {props.dayEvents && (
        <MapContainer>
          <div
            style={{
              height: '100%',
              position: 'relative',
            }}
            ref={ref}
          />
        </MapContainer>
      )}
      {hasMarker && <Marker position={markerPosition} />}

      <PanelContainer id="sidebar" ref={sideRouteRef}></PanelContainer>
    </DayMapContainer>
  );
}

export default memo(DayMapCard);
