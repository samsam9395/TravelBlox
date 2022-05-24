import axios from 'axios';

export const getTravelLocation = async (autoInput) => {
  const URL =
    'https://travel-advisor.p.rapidapi.com/locations/v2/auto-complete';

  const options = {
    params: { query: autoInput, lang: 'en_US', units: 'km' },
    headers: {
      'X-RapidAPI-Host': 'travel-advisor.p.rapidapi.com',
      'X-RapidAPI-Key': '2badfdb36dmsh57a4cae10dfc882p1fe90bjsn853cb9eddb1a',
    },
  };

  try {
    const {
      data: { data },
    } = await axios.get(URL, options);

    return data.Typeahead_autocomplete.results[0].detailsV2.locationId;
  } catch (error) {
    console.log(error);
  }
};

export const getAttraction = async (geoId) => {
  const URL = 'https://travel-advisor.p.rapidapi.com/attractions/list';
  const options = {
    params: {
      location_id: geoId,
      currency: 'USD',
      lang: 'en_US',
      lunit: 'km',
      limit: '15',
      sort: 'ranking',
    },
    headers: {
      'X-RapidAPI-Host': 'travel-advisor.p.rapidapi.com',
      'X-RapidAPI-Key': '2badfdb36dmsh57a4cae10dfc882p1fe90bjsn853cb9eddb1a',
    },
  };

  try {
    const {
      data: { data },
    } = await axios.get(URL, options);

    return data;
  } catch (error) {
    console.log(error);
  }
};

export const getRestaurant = async (geoId) => {
  const URL = 'https://travel-advisor.p.rapidapi.com/restaurants/list';
  const options = {
    params: {
      location_id: geoId,
      restaurant_tagcategory: geoId,
      restaurant_tagcategory_standalone: geoId,
      currency: 'USD',
      lunit: 'km',
      limit: '15',
      lang: 'en_US',
    },
    headers: {
      'X-RapidAPI-Host': 'travel-advisor.p.rapidapi.com',
      'X-RapidAPI-Key': '2badfdb36dmsh57a4cae10dfc882p1fe90bjsn853cb9eddb1a',
    },
  };

  try {
    const {
      data: { data },
    } = await axios.get(URL, options);

    return data;
  } catch (error) {
    console.log(error);
  }
};

export const getWeather = async (lat, lon) => {
  const URL = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude={minutely,alerts,hourly}&units=metric&appid=6060e464dec17a57b82e0889afbad877`;

  try {
    const data = await axios.get(URL);

    return data;
  } catch (error) {
    console.log(error);
  }
};

export async function getGooglePlaceDetail(placeId, ref) {
  console.log(ref);
  if (ref) {
    const service = new window.google.maps.places.PlacesService(ref);

    var request = {
      placeId: 'ChIJN1t_tDeuEmsRUsoyG83frY4',
      fields: ['name', 'rating', 'formatted_phone_number', 'geometry'],
    };

    console.log(33, service.getDetails());
    service.getDetails(request, (place, status) => {
      if (
        status === window.google.maps.places.PlacesServiceStatus.OK &&
        place
      ) {
        console.log(place);
      }
    });
  }
}

export async function checkImg(imgURL) {
  try {
    const data = await axios.get(
      'https://maps.googleapis.com/maps/api/place/js/PhotoService.GetPhoto?1sAap_uEAWXzkWzauzq6gWK4qHHXeNp8WxkAgYSLcqMrqYgYUV7f1n3xF2LqgYBg-622BG9JS0BC-bY8uF9G06Tv5rjB9jgCH9IaDISa06tysSuFqk860bXm37s2ah1tXLywaK7DECBHb9mGDcNoIpF423dYJMEJZCmx-eqNs-nQZZRqsRUZEQ&3u6528&5m1&2e1&callback=none&key=AIzaSyAclJIAm-8LUEgGfbnL4fS9KiIHbg1ZR8k&token=73573'
    );
    console.log(555, data);
  } catch (error) {
    console.log(555, error.code);
    console.log(555, error);
  }
}
