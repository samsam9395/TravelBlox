import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { getDocs, getDoc, collection, query, where } from 'firebase/firestore';
import firebaseDB from '../utils/firebaseConfig';
import OwnPlanCard from '../components/OwnPlanCard';

const db = firebaseDB();

const SingleFolderContainer = styled.div`
  width: 300px;
  height: 300px;
  margin: 0 30px;
  background-color: #8ecae6;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const SingleFolderText = styled.div`
  font-size: 20px;
  font-weight: 600;
  text-align: center;
  margin-top: auto;
`;

const FavFolderContainer = styled.div`
  width: 100%;
`;

// favFolderName={favFolderName} currentUserId={currentUserId}
export default function FavFolder(props) {
  const [favPlansIdList, setFavlansIdList] = useState(null);
  const [showFavPlans, setShowFavPlans] = useState(false);

  useEffect(async () => {
    const favRef = collection(db, 'userId', props.currentUserId, 'fav_plans');
    const planQuery = query(
      favRef,
      where('infolder', '==', props.favFolderName)
    );
    const favPlansIdList = await getDocs(planQuery);
    console.log('folder comp is running', favPlansIdList);

    if (favPlansIdList.docs.length === 0) {
      console.log('No fav plans yet!');
    } else {
      const favList = favPlansIdList.docs.map((e) => e.data());
      console.log(favList);
      setFavlansIdList(favPlansIdList.docs.map((e) => e.data()));
    }
  }, []);

  return (
    <>
      {showFavPlans ? (
        <>
          <ArrowBackIosIcon
            onClick={() => setShowFavPlans(false)}></ArrowBackIosIcon>
          {favPlansIdList &&
            favPlansIdList.map((favPlanId) => (
              <OwnPlanCard
                userIdentity="public"
                ownPlanId={favPlanId.fav_collection_id}
                key={favPlanId.fav_collection_id}
              />
            ))}
        </>
      ) : (
        <SingleFolderContainer onClick={() => setShowFavPlans(true)}>
          <FavFolderContainer>
            <SingleFolderText>{props.favFolderName}</SingleFolderText>
          </FavFolderContainer>
        </SingleFolderContainer>
      )}
    </>
  );
}
