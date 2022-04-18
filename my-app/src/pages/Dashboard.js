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
} from '@mui/material';
import {
  doc,
  getDoc,
  getDocs,
  collectionGroup,
  query,
  where,
  onSnapshot,
  collection,
  setDoc,
} from 'firebase/firestore';
import firebaseDB from '../utils/firebaseConfig';
import EditPlanDetail from './EditPlanDetail';
import { Link, Navigate } from 'react-router-dom';
import CountrySelector from '../components/CountrySelector';

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

function CreateNewPlan(props) {
  return (
    <>
      <TextField
        sx={{ m: 1, minWidth: 100 }}
        size="small"
        label="Name for New Plan"
        variant="outlined"
        value={props.collectionName}
        onChange={(e) => {
          props.setCollectionName(e.target.value);
        }}
      />
      <CountrySelector />
      <Button
        variant="outlined"
        onClick={() => {
          props.setWillRedirect(true);
        }}>
        Create
      </Button>
    </>
  );
}

function Dashboard(props) {
  const [showAddPlanPopUp, setShowAddPlanPopup] = useState(false);
  const [willRedirect, setWillRedirect] = useState(false);

  function handlePopupAddPlan() {
    console.log('redirected');
    setWillRedirect(true);
  }

  return (
    <>
      <TopSectionWrapper>
        <Avatar
          alt="Remy Sharp"
          src="/static/images/avatar/1.jpg"
          sx={{ width: 56, height: 56 }}
        />
        <h4>Name</h4>
      </TopSectionWrapper>
      <AddPlanBtn
        onClick={() => {
          setShowAddPlanPopup(!showAddPlanPopUp);
        }}>
        Add New Plan
      </AddPlanBtn>
      {showAddPlanPopUp && <Navigate to="/add-new-plan"></Navigate>}
      {/* {willRedirect && <Navigate to="/edit-plan-detail"></Navigate>} */}
      {/* {willRedirect && <Navigate to="/add-new-plan"></Navigate>} */}
    </>
  );
}

export default Dashboard;
