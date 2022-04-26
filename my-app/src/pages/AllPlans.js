import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import Input from '@mui/material/Input';
import InputAdornment from '@mui/material/InputAdornment';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import CountrySelector from '../components/CountrySelector';
import { getDocs, collection } from 'firebase/firestore';
import firebaseDB from '../utils/firebaseConfig';
import OwnPlanCard from '../components/OwnPlanCard';
import PublicPlanCard from '../components/PublicPlanCard';

const db = firebaseDB();

const PlanCollectionWrapper = styled.div`
  display: flex;
  padding: 15px;
  width: 100%;
  box-sizing: content-box;
  /* overflow: auto; */
  flex-wrap: wrap;
  border: 1px solid black;
  margin: 30px 0;
`;

// defaultImg={defaultImg}
function Allplans(props) {
  const [allPlansList, setAllPlansList] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [displayPlans, setDisplayPlans] = useState([]);

  useEffect(async () => {
    const allPlans = await getDocs(collection(db, 'allPlans'));
    console.log(allPlans);

    if (allPlans.docs.length === 0) {
      console.log('No plans yet!');
    } else {
      setAllPlansList(allPlans.docs.map((e) => e.data()));
      setDisplayPlans(allPlans.docs.map((e) => e.data()));
    }
  }, []);

  useEffect(() => {
    let list = [];

    allPlansList.map((e) => {
      console.log(222, e.country.label);
      if (e.author === inputValue.toLowerCase()) {
        console.log('its equal!!! ', e);
        list.push(e);
        setDisplayPlans(list);
      } else if (e.title.toLowerCase().includes(inputValue.toLowerCase())) {
        console.log('title includes ', e);
        list.push(e);
        setDisplayPlans(list);
      } else if (e.country.label.toLowerCase() === inputValue.toLowerCase()) {
        console.log('country is equal!!! ', e);
        list.push(e);
        setDisplayPlans(list);
      }
      console.log(displayPlans);
    });
  }, [inputValue]);

  return (
    <>
      <FormControl fullWidth sx={{ m: 1 }} variant="standard">
        {/* <InputLabel htmlFor="standard-adornment-amount">Search</InputLabel> */}
        <Input
          id="standard-adornment-amount"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          startAdornment={
            <InputAdornment position="start">Search</InputAdornment>
          }
        />
      </FormControl>
      <PlanCollectionWrapper>
        {displayPlans.map((planInfo, index) => (
          <PublicPlanCard
            planInfo={planInfo}
            key={index}
            defaultImg={props.defaultImg}
          />
        ))}
      </PlanCollectionWrapper>
    </>
  );
}

export default Allplans;
