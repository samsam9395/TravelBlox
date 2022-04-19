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

function FavouritePlanCard(props) {
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

      // props.setCurrentPlanRef((prev) => [
      //   ...prev,
      //   {
      //     collectionID: planId,
      //     planDocId: doc.id,
      //   },
      // ]);

      setDocData(doc.data());
      return doc.data();
    });
  }, [planId]);

  // function redirectToEdit() {
  //   () => navigate('/edit-plan-detail'),
  //     {
  //       state: { testCurrentPlanRef },
  //     };
  // }

  return (
    docData && (
      <SinglePlanContainer
        onClick={() => redirectToEdit()}
        // onClick={() => {
        //   props.setOpenEditPopUp(!props.openEditPopUp);
        // }}
      >
        <PlanMainImageContainer>
          <SinglePlanText>{docData.title}</SinglePlanText>
          <img src={docData.main_image} alt="main image" />
        </PlanMainImageContainer>
      </SinglePlanContainer>
    )
  );
}

function Dashboard(props) {
  const [showAddPlanPopUp, setShowAddPlanPopup] = useState(false);
  const [currentUserId, setCurrentUserId] = useState('');
  const [ownPlansIdList, setOwnPlansIdList] = useState(null);
  const [openEditPopUp, setOpenEditPopUp] = useState(false);
  const [currentPlanRef, setCurrentPlanRef] = useState([]);

  useEffect(async () => {
    const user = localStorage.getItem('userEmail');
    setCurrentUserId(localStorage.getItem('userEmail'));

    const ref = collection(db, 'userId', user, 'own_plans');
    const plansList = await getDocs(ref);

    const list = [];
    plansList.forEach((plan) => {
      list.push(plan.data().collection_id);
    });
    setOwnPlansIdList(list);
  }, []);

  return (
    <>
      <TopSectionWrapper>
        <Avatar
          onClick={() => {
            console.log('clicked');
          }}
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
      {/* {openEditPopUp && <EditPlanDetail currentPlanRef={currentPlanRef} />} */}
      {openEditPopUp && <Navigate to="/add-new-plan"></Navigate>}

      <PlanCollectionWrapper>
        {ownPlansIdList &&
          ownPlansIdList.map((ownPlanId) => (
            <FavouritePlanCard
              ownPlanId={ownPlanId}
              key={ownPlanId}
              setOpenEditPopUp={setOpenEditPopUp}
              openEditPopUp={openEditPopUp}
              setCurrentPlanRef={setCurrentPlanRef}
            />
          ))}
      </PlanCollectionWrapper>
    </>
  );
}

export default Dashboard;
