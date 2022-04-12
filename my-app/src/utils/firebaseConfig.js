import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

function firebaseDB() {
  const firebaseConfig = {
    apiKey: 'AIzaSyANvhkQrPiRG0nnj-OB0ScD5V4Om67NNYA',
    authDomain: 'travelblox-a8094.firebaseapp.com',
    projectId: 'travelblox-a8094',
    storageBucket: 'travelblox-a8094.appspot.com',
    messagingSenderId: '185395226556',
    appId: '1:185395226556:web:9e15f0dd0e5eaeb6deadb9',
    measurementId: 'G-MXSCJH84FB',
  };

  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
  return db;
}

export default firebaseDB;
