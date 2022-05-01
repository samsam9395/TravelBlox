import axios from 'axios';

export const GetTravelLocation = async (autoInput) => {
  const URL =
    'https://travel-advisor.p.rapidapi.com/locations/v2/auto-complete';

  console.log(autoInput);
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

export const GetAttraction = async (geoId) => {
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
    console.log(data);

    return data;
  } catch (error) {
    console.log(error);
  }
};

export const GetRestaurant = async (geoId) => {
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
    // console.log(33, data);

    return data;
  } catch (error) {
    console.log(error);
  }
};
