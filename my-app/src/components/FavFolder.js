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

const FavPlansCtonainer = styled.div`
  display: flex;
  overflow: auto;
  justify-content: center;

  .empty_notification {
    font-size: 20px;
  }
`;

// selectedFolder={selectedFolder}
// favFolderName={favFolderName} currentUserId={currentUserId}
export default function FavFolder({ selectedFolder, currentUserId }) {
  const [favPlansList, setFavlansList] = useState(null);
  const [isEmptyFolder, setIsEmptyFolder] = useState(false);
  const [showFavPlans, setShowFavPlans] = useState(false);

  useEffect(async () => {
    const favRef = collection(db, 'userId', currentUserId, 'fav_plans');
    const planQuery = query(favRef, where('infolder', '==', selectedFolder));
    const favPlansIdList = await getDocs(planQuery);

    if (favPlansIdList.docs.length === 0) {
      console.log('No fav plans yet!');
      setIsEmptyFolder(true);
    } else {
      setIsEmptyFolder(false);
      setFavlansList(favPlansIdList.docs.map((e) => e.data()));
    }
  }, [selectedFolder]);

  console.log(favPlansList);

  return (
    <FavPlansCtonainer>
      {isEmptyFolder ? (
        <div className="empty_notification">
          No favourite plans added to this folder yet!
        </div>
      ) : (
        favPlansList?.map((favPlanId) => (
          <OwnPlanCard
            userIdentity="public"
            ownPlanId={favPlanId.fav_plan_doc_ref}
            key={favPlanId.fav_plan_doc_ref}
          />
        ))
      )}
    </FavPlansCtonainer>
  );
}
