import React, { useEffect, useState } from 'react';
import Footer from '../components/Footer';
import Header from '../components/Header';
import styled from 'styled-components';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDocs, collection } from 'firebase/firestore';
import Login from './Login';
import { Link, Navigate } from 'react-router-dom';

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
// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

const mainDocRef = doc(db, 'main-components', 'yVBOQX8SFxUUhr3vkgFp');

const MainImage = styled.img`
  margin-top: 80px;
  width: 100%;
`;

function LandingPage() {
  const [mainImage, setMainImage] = useState(null);
  const [hasSignedIn, setHasSignedIn] = useState(false);

  useEffect(async () => {
    const querySnapshot = await getDocs(collection(db, 'main-components'));
    querySnapshot.forEach((doc) => {
      setMainImage(doc.data().image);
    });
  }, []);

  useEffect(() => {
    if (localStorage.getItem('accessToken')) {
      setHasSignedIn(true);
    }
  }, []);

  return (
    <>
      <Header />
      <MainImage src={mainImage} />
      <Login setHasSignedIn={setHasSignedIn} hasSignedIn={hasSignedIn} />
      {hasSignedIn && <Navigate to="/dashboard"></Navigate>}
      <Footer />
    </>
  );
}

export default LandingPage;
