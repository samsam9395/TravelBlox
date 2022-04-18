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
import EditPlanDetail from './EditPlanDetail';
import { Link, Navigate } from 'react-router-dom';
import CountrySelector from '../components/CountrySelector';
import { getDocs, collection, query, where, orderBy } from 'firebase/firestore';
import firebaseDB from '../utils/firebaseConfig';

const db = firebaseDB();

const TopSectionWrapper = styled.div`
  display: flex;
`;

const AddPlanBtn = styled.button`
  height: 25px;
  width: 100%;
  padding: 20px;
  text-align: center;
  border: none;
  border-radius: 15px;
  background-color: aliceblue;
`;

const PlanCollectionWrapper = styled.div`
  display: flex;
  padding: 15px;
  width: 100%;
  box-sizing: content-box;
  overflow: auto;
  border: 1px solid black;
  margin: 30px 0;
`;

const SinglePlanContainer = styled.div`
  width: 350px;
  height: 350px;
`;

const SinglePlanText = styled.div`
  font-size: 14px;
  font-weight: 600;
`;

function Dashboard(props) {
  const [showAddPlanPopUp, setShowAddPlanPopup] = useState(false);
  const [currentUserId, setCurrentUserId] = useState('');

  useEffect(() => {
    if (localStorage.getItem('accessToken')) {
      setCurrentUserId(localStorage.getItem('userEmail'));
    }
  }, []);

  return (
    <>
      <TopSectionWrapper>
        <Avatar
          alt="Remy Sharp"
          src="/static/images/avatar/1.jpg"
          sx={{ width: 56, height: 56 }}
        />
        <h4>Welcom! {currentUserId}</h4>
      </TopSectionWrapper>
      <AddPlanBtn
        onClick={() => {
          setShowAddPlanPopup(!showAddPlanPopUp);
        }}>
        Add New Plan
      </AddPlanBtn>
      {showAddPlanPopUp && <Navigate to="/add-new-plan"></Navigate>}
      <PlanCollectionWrapper>
        <SinglePlanContainer>
          <img src="" alt="" />
          <SinglePlanText>Plan</SinglePlanText>
        </SinglePlanContainer>
      </PlanCollectionWrapper>
    </>
  );
}

export default Dashboard;
