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
  Avatar,
  Stack,
} from '@mui/material';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { getDocs, getDoc, collection } from 'firebase/firestore';
import firebaseDB from '../utils/firebaseConfig';
import EditPlanDetail from '../pages/EditPlanDetail';
import CountrySelector from '../components/CountrySelector';

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

function OwnPlanCard(props) {
  const [docData, setDocData] = useState(null);
  const [testCurrentPlanRef, setTestCurrentPlanRef] = useState(null);
  const planId = props.ownPlanId;

  const navigate = useNavigate();

  const redirectToEdit = () => {
    navigate('/edit-plan-detail', { state: testCurrentPlanRef });
  };

  useEffect(async () => {
    const ref = collection(db, planId);
    const ownPlanData = await getDocs(ref);

    ownPlanData.forEach((doc) => {
      setTestCurrentPlanRef({
        collectionID: planId,
        planDocId: doc.id,
      });

      setDocData(doc.data());
      return doc.data();
    });
  }, [planId]);

  return (
    docData && (
      <SinglePlanContainer onClick={() => redirectToEdit()}>
        <PlanMainImageContainer>
          <SinglePlanText>{docData.title}</SinglePlanText>
          <ImageContainer>
            <MainImage src={docData.main_image} alt="main image"></MainImage>
          </ImageContainer>

          {/* <ImageContainer src={docData.main_image} alt="main image" /> */}
        </PlanMainImageContainer>
      </SinglePlanContainer>
    )
  );
}

export default OwnPlanCard;
