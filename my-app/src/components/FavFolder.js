import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { getDocs, getDoc, collection, query, where } from 'firebase/firestore';
import firebaseDB from '../utils/firebaseConfig';
import OwnPlanCard from '../components/OwnPlanCard';

const db = firebaseDB();

const SingleFolderContainer = styled.div`
  min-width: 300px;
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

const SinglePlanContainer = styled.div`
  width: 450px;
  height: 450px;
  margin: 0 15px;
  display: flex;
  justify-content: center;
  align-items: center;
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

    if (favPlansIdList.docs.length === 0) {
      console.log('No fav plans yet!');
    } else {
      setFavlansIdList(favPlansIdList.docs.map((e) => e.data()));
    }
  }, []);

  return (
    <>
      {showFavPlans ? (
        <SinglePlanContainer>
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
        </SinglePlanContainer>
      ) : (
        <SingleFolderContainer
          onClick={() => {
            setShowFavPlans(true);
            // props.setHideOtherCards(true);
          }}>
          <FavFolderContainer>
            <SingleFolderText>{props.favFolderName}</SingleFolderText>
          </FavFolderContainer>
        </SingleFolderContainer>
      )}
    </>
  );
}
