import {
  FacebookAuthProvider,
  GoogleAuthProvider,
  getAdditionalUserInfo,
  getAuth,
  signInWithPopup,
} from 'firebase/auth';

import Swal from 'sweetalert2';
import firebaseService from './fireabaseService';
import { googleServices } from './api';

export function uploadImagePromise(imgFile) {
  const reader = new FileReader();
  reader.readAsDataURL(imgFile);

  return new Promise((resolve, reject) => {
    reader.onload = () => {
      resolve(reader.result);
    };

    reader.onerror = (error) => {
      reject(error);
    };
  });
}

export function renameGoogleMaDataIntoFirebase(location, placeId) {
  return {
    place_id: location.place_id || placeId,
    place_name: location.name,
    place_format_address: location.formatted_address,
    place_img: location.mainImg || location.photos[0].getUrl() || '',
    place_formatted_phone_number: location.formatted_phone_number || '',
    place_international_phone_number: location.international_phone_number || '',
    place_url: location.url,
    rating: location.rating || '',
    place_types: location.types || '',
    place_lat: location.geometry.location.lat(),
    place_lng: location.geometry.location.lng(),
  };
}

export async function signInProvider(e, providerPlatform) {
  let provider;
  e.preventDefault();
  const auth = getAuth();

  if (providerPlatform === 'google') {
    provider = new GoogleAuthProvider();
    provider.setCustomParameters({
      prompt: 'select_account',
    });
  }

  if (providerPlatform === 'facebook') {
    provider = new FacebookAuthProvider();
    provider.setCustomParameters({
      display: 'popup',
    });
  }

  try {
    const result = await signInWithPopup(auth, provider);

    if (
      getAdditionalUserInfo(result).isNewUser === true &&
      provider === 'google'
    ) {
      firebaseService.addNewUserToDataBase(result.user, 'google');
    }

    if (
      getAdditionalUserInfo(result).isNewUser === true &&
      provider === 'facebook'
    ) {
      firebaseService.addNewUserToDataBase(result.user, 'facebook');
    }
  } catch (error) {
    const errorCode = error.code;
    const email = error.customData.email;
    if (errorCode === 'auth/account-exists-with-different-credential') {
      Swal.fire(
        `Your email ${email} has signed in with another social provider already!`
      );
    } else if (error.code === 'auth/email-already-in-use') {
      Swal.fire('Email already in use, please pick another one!');
    }
  }
}

export function addDays(date, days) {
  var result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

export function loopThroughDays(startday, days) {
  const scheduleTimestampList = [];
  const lastDay = addDays(startday, days);

  for (let i = 0; i <= days; i++) {
    const nextday = addDays(startday, i);
    scheduleTimestampList.push(nextday);

    if (nextday === lastDay) {
      break;
    }
  }
  return scheduleTimestampList;
}

export function calculateIfGoogleImgExpired(dateEdited) {
  const currentTime = new Date();
  const expirationTime = new Date(dateEdited).setDate(
    new Date(dateEdited).getDate() + 2
  );

  if (currentTime > expirationTime) {
    return true;
  } else {
    return false;
  }
}

export function createLocationKeyPairs(data, renewGoolgeImg) {
  if (renewGoolgeImg) {
    return {
      name: data.place_name,
      formatted_address: data.place_format_address,
      formatted_phone_number: data.place_formatted_phone_number || '',
      international_phone_number: data.place_international_phone_number || '',
      url: data.place_url,
      place_types: data.types || '',
      mainImg: renewGoolgeImg || data.place_img || '',
      rating: data.rating || '',
      place_id: data.place_id,
    };
  } else {
    return {
      name: data.place_name,
      formatted_address: data.place_format_address,
      formatted_phone_number: data.place_formatted_phone_number || '',
      international_phone_number: data.place_international_phone_number || '',
      url: data.place_url,
      place_types: data.types || '',
      mainImg: data.place_img || '',
      rating: data.rating || '',
      place_id: data.place_id,
    };
  }
}

export async function checkGoogleImgExpirationDate(data, timeBlockRef) {
  if (calculateIfGoogleImgExpired(data.timeEdited.seconds * 1000)) {
    const renewGoolgeImg = await googleServices.getlaceDetail(data.place_id);

    const locationInfo = createLocationKeyPairs(
      data,
      renewGoolgeImg.photos[0].getUrl()
    );

    firebaseService.updateExpiredGoogleImgToDataBase(
      timeBlockRef,
      renewGoolgeImg.photos[0].getUrl()
    );
    return locationInfo;
  } else {
    return createLocationKeyPairs(data);
  }
}
