import Swal from 'sweetalert2';

export const googleServices = {
  getlaceDetail(placeId) {
    let map = new window.google.maps.Map(document.createElement('div'));
    return new Promise(function (resolve, reject) {
      let placesService = new window.google.maps.places.PlacesService(map);
      placesService.getDetails(
        {
          placeId: placeId,
          fields: ['photos'],
        },
        (place) => {
          resolve(place);
          return place;
        }
      );
    });
  },
  async setWayPointRoute(placeIdList, map, sideRouteRef) {
    const directionsService = new window.google.maps.DirectionsService();
    const directionsRenderer = new window.google.maps.DirectionsRenderer();

    if (placeIdList && placeIdList.length === 1) {
      const directionsRequest = {
        origin: { placeId: placeIdList[0] },
        destination: { placeId: placeIdList.at(-1) },
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
          }
        })
        .catch((e) => {
          if (e.code === 'ZERO_RESULTS') {
            Swal.fire({
              icon: 'error',
              title: 'Oops! ',
              text: 'No route found for this schedule.',
            });
          }
        });
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

      directionsService
        .route(directionsRequest)
        .then((result) => {
          if (result.status === 'OK') {
            directionsRenderer.setDirections(result);
            directionsRenderer.setPanel(sideRouteRef.current);
          }
        })
        .catch((e) => {
          if (e.code === 'ZERO_RESULTS') {
            Swal.fire({
              icon: 'error',
              title: 'Oops! ',
              text: 'No route found for this schedule.',
            });
          }
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

            directionsRenderer.setPanel(sideRouteRef.current);
          }
        })
        .catch((e) => {
          if (e.code === 'ZERO_RESULTS') {
            Swal.fire({
              icon: 'error',
              title: 'Oops! ',
              text: 'No route found for this schedule.',
            });
          }
        });
    }
  },
};
