import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { getDocs, getDoc, collection, doc } from 'firebase/firestore';
import firebaseDB from '../utils/firebaseConfig';
import EditPlanDetail from '../pages/EditPlanDetail';
import CountrySelector from '../components/CountrySelector';

const db = firebaseDB();

const SinglePlanContainer = styled.div`
  width: 500px;
  height: 100%;
  display: flex;
  align-items: center;
`;

const SinglePlanText = styled.div`
  font-size: 20px;
  font-weight: 600;
  text-align: center;
  margin-bottom: 30px;
`;

const PlanMainImageContainer = styled.div`
  width: 100%;
`;

const ImageContainer = styled.div`
  display: flex;
  align-items: center;
  height: 300px;
  width: 100%;
`;

const MainImage = styled.img`
  width: 100%;
`;

// props.ownPlanId
// props.userIdentity
function OwnPlanCard(props) {
  const [docData, setDocData] = useState(null);
  const [currentPlanRef, setCurrentPlanRef] = useState(null);
  const [doImport, setDoimport] = useState(false);
  const planId = props.ownPlanId;

  const navigate = useNavigate();

  console.log(props.ownPlanId);

  const redirectToEdit = () => {
    navigate('/edit-plan-detail', {
      state: {
        from: 'dashboard',
        // collectionID: currentPlanRef.collectionID,
        planDocRef: planId,
      },
    });
  };

  const redirectToStatic = () => {
    navigate('/static-plan-detail', { state: { currentPlanRef: planId } });
  };

  useEffect(async () => {
    // if (planId) {
    console.log(props.planId);
    const docSnap = await getDoc(doc(db, 'plans', planId));

    console.log(docSnap.data());
    setDocData(docSnap.data());
    // }

    // console.log('helloooooooooo');
    // const ownPlanData = await getDoc(doc(db, 'plans', planId));
    // console.log(ownPlanData);
    // console.log(111, ownPlanData.data().title);
    // console.log(ownPlanData.data());

    // console.log(
    //   ownPlanData.forEach((e) => {
    //     console.log(e);
    //     console.log(e.data());
    //   })
    // );
    // console.log(ownPlanData.data());
    // setDocData(ownPlanData.data());

    // ownPlanData.forEach((doc) => {
    //   setCurrentPlanRef({
    //     // collectionID: planId,
    //     planDocRef: planId,
    //   });

    //   setDocData(doc.data());
    //   return doc.data();
    // });
  }, [planId]);

  useEffect(async () => {
    if (doImport) {
      const ref = collection(db, 'plans', planId, 'time_blocks');
      const importTimeBlocks = await getDocs(ref);

      importTimeBlocks.forEach((doc) => {
        console.log(doc.data());
        return doc.data();
      });
    }
  }, [doImport]);

  function renderSwitch(identity) {
    // console.log(identity);
    switch (identity) {
      case 'author':
        redirectToEdit();
        break;
      case 'importer':
        setDoimport(true);
        break;
      case 'public':
        redirectToStatic();
        break;
    }
  }

  return (
    docData && (
      <SinglePlanContainer onClick={() => renderSwitch(props.userIdentity)}>
        <PlanMainImageContainer>
          <SinglePlanText>{docData.title}</SinglePlanText>
          <ImageContainer>
            <MainImage src={docData.main_image} alt="main image"></MainImage>
          </ImageContainer>
        </PlanMainImageContainer>
      </SinglePlanContainer>
    )
  );
}

export default OwnPlanCard;
