// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyANvhkQrPiRG0nnj-OB0ScD5V4Om67NNYA',
  authDomain: 'travelblox-a8094.firebaseapp.com',
  projectId: 'travelblox-a8094',
  storageBucket: 'travelblox-a8094.appspot.com',
  messagingSenderId: '185395226556',
  appId: '1:185395226556:web:9e15f0dd0e5eaeb6deadb9',
  measurementId: 'G-MXSCJH84FB',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
