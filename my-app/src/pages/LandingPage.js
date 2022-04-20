import React, { useEffect, useState } from 'react';
import Footer from '../components/Footer';
import Header from '../components/Header';
import styled from 'styled-components';
import {
  getFirestore,
  doc,
  getDocs,
  collection,
  setDoc,
} from 'firebase/firestore';
import Login from './Login';
import { Link, Navigate } from 'react-router-dom';
import firebaseDB from '../utils/firebaseConfig';

const db = firebaseDB();

const MainImage = styled.img`
  margin-top: 80px;
  width: 100%;
`;

function LandingPage() {
  const [mainImage, setMainImage] = useState(null);
  const [hasSignedIn, setHasSignedIn] = useState(false);
  const [isNewUser, setIsNewUser] = useState(false);
  const [canRedirect, setCanRedirect] = useState(false);
  const [userId, setUserId] = useState('');

  useEffect(async () => {
    const querySnapshot = await getDocs(collection(db, 'main-components'));
    querySnapshot.forEach((doc) => {
      setMainImage(doc.data().image);
    });
  }, []);

  useEffect(() => {
    if (localStorage.getItem('accessToken')) {
      // setCanRedirect(true);
      console.log('accessToken is  ', localStorage.getItem('accessToken'));
    }
  }, []);

  useEffect(async () => {
    if (isNewUser && userId) {
      await setDoc(doc(db, 'userId', userId), {
        id: userId,
      });
      await setDoc(collection(db, 'userId', userId, 'time_blocks'));
    }
  }, [isNewUser]);

  return (
    <>
      <Header />
      <MainImage src={mainImage} />
      <Login
        setHasSignedIn={setHasSignedIn}
        hasSignedIn={hasSignedIn}
        setIsNewUser={setIsNewUser}
        setUserId={setUserId}
      />
      {canRedirect && <Navigate to="/dashboard"></Navigate>}
      <Footer />
    </>
  );
}

export default LandingPage;
