import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { getDocs, getDoc, collection, doc } from 'firebase/firestore';
import firebaseDB from '../utils/firebaseConfig';
import EditPlanDetail from '../pages/EditPlanDetail';
import CountrySelector from '../components/CountrySelector';

const db = firebaseDB();

const SinglePlanContainer = styled.div`
  width: 450px;
  height: 450px;
  object-fit: contain;
  display: flex;
  align-items: center;
  padding: 1em 0;
`;

const PlanTextContainer = styled.div`
  position: absolute;
  text-align: center;
  padding-left: 1em;
  padding-right: 1em;
  width: 100%;
  top: 50%;
  left: 50%;
  opacity: 0;
  -webkit-transform: translate(-50%, -50%);
  -moz-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
  -webkit-transition: all 0.3s ease-in-out 0s;
  -moz-transition: all 0.3s ease-in-out 0s;
  transition: all 0.3s ease-in-out 0s;
`;

const MainImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const SinglePlanText = styled.div`
  color: #fff;
  text-align: center;
  font-weight: 500;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  position: relative;
  top: 50%;
`;

const PlanMainImageContainer = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  margin: auto;
  overflow: hidden;
  .content-overlay {
    background: rgba(0, 0, 0, 0.7);
    position: absolute;
    height: 100%;
    width: 100%;
    left: 0;
    top: 0;
    bottom: 0;
    right: 0;
    opacity: 0;
    -webkit-transition: all 0.4s ease-in-out 0s;
    -moz-transition: all 0.4s ease-in-out 0s;
    transition: all 0.4s ease-in-out 0s;
  }

  &:hover {
    cursor: pointer;
    .content-overlay {
      opacity: 1;
    }
    .content-details {
      top: 50%;
      left: 50%;
      opacity: 1;
      height: 100%;
    }
  }
  .fadeIn-bottom {
    top: 100%;
  }
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
    console.log(props.planId);
    const docSnap = await getDoc(doc(db, 'plans', planId));

    console.log(docSnap.data());
    setDocData(docSnap.data());
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
          <div className="content-overlay"></div>
          <MainImage src={docData.main_image} alt="main image"></MainImage>

          <PlanTextContainer className="content-details fadeIn-bottom">
            <SinglePlanText>{docData.title}</SinglePlanText>
          </PlanTextContainer>
        </PlanMainImageContainer>
      </SinglePlanContainer>
    )
  );
}

export default OwnPlanCard;

{
  /* <div class="container">
  <div class="content">
    <a href="https://unsplash.com/photos/HkTMcmlMOUQ" target="_blank">
      <div class="content-overlay"></div>
      <img class="content-image" src="https://images.unsplash.com/photo-1433360405326-e50f909805b3?ixlib=rb-0.3.5&q=80&fm=jpg&crop=entropy&w=1080&fit=max&s=359e8e12304ffa04a38627a157fc3362">
      
      <div class="content-details fadeIn-bottom">
        <h3 class="content-title">This is a title</h3>

      </div>
    </a>
  </div>
</div> */
}
