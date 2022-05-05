import React, { useState, useEffect, useRef, memo } from 'react';
import styled from 'styled-components';
import { googleAPI } from '../../utils/credent';

const ApiKey = googleAPI();
const center = { lat: -33.8666, lng: 151.1958 };
const zoom = 15;

const DayMapContainer = styled.div`
  margin-bottom: 20px;
  display: flex;
`;

const MapContainer = styled.div`
  /* border: 1px black solid; */
  height: 650px;
  width: 100%;
`;

const PanelContainer = styled.div`
  min-height: 300px;
  margin-bottom: 30px;
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
  // const [result, setResult] = useState(null);

  // console.log('Map is rendered', props.dayEvents);

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
        props.setMarkerPosition({ placeId: placeIdList[0] });
        map.setZoom(5);
        // const marker = new google.maps.Marker({
        //   position: { placeId: placeIdList },
        //   map: map,
        // });

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

        props.setHasMarker(true);
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

        directionsService
          .route(directionsRequest)
          .then((result) => {
            if (result.status === 'OK') {
              directionsRenderer.setDirections(result);

              const travelDuration = result.routes.map((e) => {
                console.log('333 legs', e.legs);
                // e.legs.map((leg) => {
                //   console.log(444, leg);
                //   console.log(555, leg.duration.text);
                //   console.log(666, leg.steps);
                // });
                return e.legs;
              });

              // directionsRenderer.getDirections();
              props.setResult(travelDuration);
              directionsRenderer.setPanel(document.getElementById('sidebar'));
            } else console.log('something wrong');
          })

          .then((e) => {
            console.log(e);
          });
      }
    }
  }, [ref.current, props.dayEvents]);

  return (
    <MapContainer>
      <div
        style={{
          height: '100%',
          position: 'relative',
        }}
        ref={ref}
      />
    </MapContainer>
  );
};

// dayEvents={dayEvents}
function DayMapCard(props) {
  const [hasMarker, setHasMarker] = useState(false);
  const [markerPosition, setMarkerPosition] = useState('');

  return (
    <DayMapContainer>
      {props.dayEvents && (
        <Map
          center={center}
          zoom={zoom}
          dayEvents={props.dayEvents}
          setHasMarker={setHasMarker}
          setMarkerPosition={setMarkerPosition}
          setResult={props.setResult}
        />
      )}
      {hasMarker && <Marker position={markerPosition} />}

      <PanelContainer id="sidebar"></PanelContainer>
    </DayMapContainer>
  );
}

export default memo(DayMapCard);
