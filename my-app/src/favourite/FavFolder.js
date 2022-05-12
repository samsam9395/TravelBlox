import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { getDocs, getDoc, collection, query, where } from 'firebase/firestore';
import firebaseDB from '../utils/firebaseConfig';
import OwnPlanCard from '../components/OwnPlanCard';
import { themeColours, fonts } from '../styles/globalTheme';

const db = firebaseDB();

const FavPlansCtonainer = styled.div`
  display: flex;
  overflow: auto;
  justify-content: center;
  display: -webkit-box;

  .empty_notification {
    font-family: ${fonts.main_font}, sans-serif;
    font-size: 30px;
    font-weight: 600;
    display: flex;
    flex-direction: column;
    align-items: center;

    .instruction {
      font-size: 18px;
      font-weight: 200;
      display: flex;
      margin-top: 5px;

      .btn_cta {
        margin: 0 5px;
        padding: 0 3px;
        background-color: ${themeColours.light_orange};
        color: white;
      }

      .hightlight_text {
        margin: 0 5px;
        padding: 0 3px;
        font-weight: 600;
        font-style: italic;
      }
    }
  }
`;

const FavPlansWrapper = styled.div`
  margin-right: 30px;
`;

// selectedFolder={selectedFolder}
// favFolderName={favFolderName} currentUserId={currentUserId}
export default function FavFolder({ selectedFolder, currentUserId }) {
  const [favPlansList, setFavlansList] = useState(null);
  const [isEmptyFolder, setIsEmptyFolder] = useState(false);

  useEffect(async () => {
    if (currentUserId) {
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
    }
  }, [selectedFolder]);

  return (
    <FavPlansCtonainer>
      {isEmptyFolder ? (
        <div className="empty_notification">
          No favourite plans added to this folder yet!
          <div className="instruction">
            Discover new plans and
            <div className="btn_cta">add them to favourites</div>!
          </div>
          <div className="instruction">
            Those plans will appear here and
            <div className="hightlight_text"> can be imported</div>
            to your own travel plans!
          </div>
        </div>
      ) : (
        favPlansList?.map((favPlanId, index) => (
          <FavPlansWrapper key={index}>
            <OwnPlanCard
              userIdentity="public"
              ownPlanId={favPlanId.fav_plan_doc_ref}
              key={favPlanId.fav_plan_doc_ref}
            />
          </FavPlansWrapper>
        ))
      )}
    </FavPlansCtonainer>
  );
}
