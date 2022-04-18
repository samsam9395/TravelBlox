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
import {
  getDocs,
  collection,
  query,
  where,
  orderBy,
  doc,
} from 'firebase/firestore';
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

const PlanMainImageContainer = styled.div`
  width: 100%;
`;

function Dashboard(props) {
  const [showAddPlanPopUp, setShowAddPlanPopup] = useState(false);
  const [currentUserId, setCurrentUserId] = useState('');
  const [hasRetreived, sethasRetreived] = useState(false);
  const [ownPlansList, setOwnPlansList] = useState([]);
  const [ownPlansListData, setOwnPlansListData] = useState([]);

  useEffect(async () => {
    const user = localStorage.getItem('userEmail');
    setCurrentUserId(localStorage.getItem('userEmail'));

    const ref = collection(db, 'userId', user, 'own_plans');

    const plansList = await getDocs(ref);

    // setOwnPlansList(plansList);
    console.log('planlist  run');
    const test = [];
    plansList.forEach((plan) => {
      console.log('planlistData  run');
      console.log(plan);
      console.log(plan.data().collection_id);
      // setOwnPlansList(plansList);
      test.push(plan.data().collection_id);
    });
    // console.log(ownPlansListData);
    // console.log(typeof ownPlansList);
    // if (ownPlansList !== []) {
    //   console.log(123, ownPlansList);
    //   const test = ownPlansList.map((plan) => plan.data().collection_id);
    //   console.log(345, test);
    //   setOwnPlansListData(test);
    // }
    console.log(4321, test);
    setOwnPlansListData(test);
  }, []);

  // useEffect(() => {
  //   // console.log(123, ownPlansList);
  //   const test = [];
  //   ownPlansList.forEach((plan) => {
  //     console.log('planlistData  run');
  //     console.log(plan);
  //     console.log(plan.data().collection_id);
  //     // setOwnPlansList(plansList);
  //     test.push(plan.data().collection_id);
  //   });
  //   // console.log(ownPlansListData);
  //   console.log(typeof ownPlansList);
  //   // if (ownPlansList !== []) {
  //   //   console.log(123, ownPlansList);
  //   //   const test = ownPlansList.map((plan) => plan.data().collection_id);
  //   //   console.log(345, test);
  //   //   setOwnPlansListData(test);
  //   // }
  //   console.log(4321, test);
  //   setOwnPlansListData(test);
  // }, [ownPlansList]);

  // if (ownPlansListData) {
  //   console.log('ownPlansListData is now true');
  // }

  // console.log(1234, ownPlansListData, ownPlansListData?.[0]);

  // return ownPlansListData?.[0] ?? 'test';

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
      <div>{ownPlansListData?.[0]}</div>
      <div>
        {ownPlansListData.map(
          (plan, index) => (
            <SinglePlanContainer key={index}>
              <PlanMainImageContainer>
                <img src={plan.main_image} alt="main image" />
              </PlanMainImageContainer>
              <SinglePlanText>{plan.title}</SinglePlanText>
            </SinglePlanContainer>
          )

          // <SinglePlanContainer key={index}>
          //   <PlanMainImageContainer>
          //     <img src={plan.main_image} alt="main image" />
          //   </PlanMainImageContainer>
          //   <SinglePlanText>{plan.title}</SinglePlanText>
          // </SinglePlanContainer>
        )}
      </div>
    </>
  );
}

export default Dashboard;
