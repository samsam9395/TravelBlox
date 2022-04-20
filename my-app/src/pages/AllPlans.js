import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import {
  InputLabel,
  TextField,
  Button,
  FormControl,
  MenuItem,
  Select,
  IconButton,
  Box,
  Card,
  CardMedia,
  CircularProgress,
  Typography,
  Stack,
} from '@mui/material';
import EditPlanDetail from './EditPlanDetail';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import CountrySelector from '../components/CountrySelector';
import {
  getDocs,
  getDoc,
  collection,
  query,
  where,
  orderBy,
  doc,
} from 'firebase/firestore';
import firebaseDB from '../utils/firebaseConfig';
import OwnPlanCard from '../components/OwnPlanCard';

const db = firebaseDB();

const SinglePlanContainer = styled.div`
  width: 350px;
  height: 350px;
`;

const SinglePlanText = styled.div`
  font-size: 14px;
  font-weight: 600;
`;

const PlanMainImageContainer = styled.div`
  width: 100%;
`;

const ImageContainer = styled.div`
  height: 300px;
  width: 300px;
`;

const MainImage = styled.img`
  max-height: 100%;
`;

//planInfo={planInfo}
function FavPlanCard(props) {
  const navigate = useNavigate();

  const redirectToStatic = () => {
    navigate('/static-plan-detail', {
      state: { collection_id: props.collection_id },
    });
  };

  //   useEffect(async () => {
  //     const ref = collection(db, planId);
  //     const ownPlanData = await getDocs(ref);

  //     ownPlanData.forEach((doc) => {
  //       setTestCurrentPlanRef({
  //         collectionID: planId,
  //         planDocId: doc.id,
  //       });

  //       setDocData(doc.data());
  //       return doc.data();
  //     });
  //   }, [planId]);

  return (
    <SinglePlanContainer onClick={() => redirectToStatic()}>
      <PlanMainImageContainer>
        <SinglePlanText>{props.planInfo.title}</SinglePlanText>
        <ImageContainer>
          <MainImage
            src={props.planInfo.main_image}
            alt="main image"></MainImage>
        </ImageContainer>
        <Typography variant="h5" component="div">
          Author: {props.planInfo.author}
        </Typography>
      </PlanMainImageContainer>
    </SinglePlanContainer>
  );
}

const PlanCollectionWrapper = styled.div`
  display: flex;
  padding: 15px;
  width: 100%;
  box-sizing: content-box;
  overflow: auto;
  border: 1px solid black;
  margin: 30px 0;
`;

function Allplans() {
  const [allPlansList, setAllPlansList] = useState([]);

  useEffect(async () => {
    const allPlans = await getDocs(collection(db, 'allPlans'));
    console.log(allPlans);

    if (allPlans.docs.length === 0) {
      console.log('No plans yet!');
    } else {
      setAllPlansList(allPlans.docs.map((e) => e.data()));
    }
  }, []);

  return (
    <PlanCollectionWrapper>
      {allPlansList.map((planInfo, index) => (
        <FavPlanCard planInfo={planInfo} key={index} />
      ))}
    </PlanCollectionWrapper>
  );
}

export default Allplans;
