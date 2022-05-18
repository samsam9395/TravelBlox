import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

function firebaseDB() {
  const app = initializeApp(process.env.REACT_APP_FIREBASE_CONFIG);
  const db = getFirestore(app);
  return db;
}

export default firebaseDB;
