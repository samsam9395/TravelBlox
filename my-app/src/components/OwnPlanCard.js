import React, { useEffect, useState } from 'react';
import { collection, doc, getDoc, getDocs } from 'firebase/firestore';

import PropTypes from 'prop-types';
import firebaseDB from '../utils/firebaseConfig';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const db = firebaseDB();

const SinglePlanContainer = styled.div`
  width: 450px;
  height: 450px;
  object-fit: contain;
  display: flex;
  align-items: center;
  padding: 1em 0;

  @media (max-width: 768px) {
    width: 350px;
    height: 350px;
  }
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

OwnPlanCard.propTypes = {
  ownPlanId: PropTypes.string,
  userIdentity: PropTypes.string,
};

// props.ownPlanId
// props.userIdentity
function OwnPlanCard(props) {
  const [docData, setDocData] = useState(null);
  const [doImport, setDoimport] = useState(false);
  const planId = props.ownPlanId;

  const navigate = useNavigate();

  const redirectToEdit = () => {
    navigate(`/edit-plan-detail/${planId}`);
  };

  const redirectToStatic = () => {
    navigate(`/static-plan-detail${planId}`);
  };

  useEffect(async () => {
    const docSnap = await getDoc(doc(db, 'plans', planId));

    setDocData(docSnap.data());
  }, [planId]);

  useEffect(async () => {
    if (doImport) {
      const ref = collection(db, 'plans', planId, 'time_blocks');
      const importTimeBlocks = await getDocs(ref);

      importTimeBlocks.forEach((doc) => {
        return doc.data();
      });
    }
  }, [doImport]);

  function renderSwitch(identity) {
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
