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
};
