import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import TextField from '@mui/material/TextField';
import SearchIcon from '@mui/icons-material/Search';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { getDocs, collection, getDoc, doc } from 'firebase/firestore';
import firebaseDB from '../utils/firebaseConfig';
import PublicPlanCard from '../components/PublicPlanCard';
import { themeColours } from '../styles/globalTheme';
import FullLoading from '../components/general/FullLoading';
import SkyMainImg from '../components/all_plan/SkyMainImg';

const db = firebaseDB();

const PlanCollectionWrapper = styled.div`
  display: flex;
  padding: 15px;
  width: 100%;
  box-sizing: content-box;
  flex-wrap: wrap;
  justify-content: center;
  margin: 30px 0;
`;

// const MainImgContainer = styled.div`
//   width: 100%;
//   height: 320px;
// `;

// const MainImg = styled.img`
//   width: 100%;
//   height: 100%;
//   object-fit: cover;
//   object-position: 0 -92px;
//   @media (max-width: 768px) {
//     object-position: unset;
//   }
// `;

// defaultImg={defaultImg}
function Allplans(props) {
  const [allPlansList, setAllPlansList] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [displayPlans, setDisplayPlans] = useState([]);
  const [discoverMainImg, setDiscoverMainImg] = useState('');
  const [loadindOpacity, setLoadindOpacity] = useState(1);

  useEffect(async () => {
    const allPlans = await getDocs(collection(db, 'allPlans'));
    // console.log(allPlans);

    if (allPlans.docs.length === 0) {
      console.log('No plans yet!');
    } else {
      setAllPlansList(allPlans.docs.map((e) => e.data()));
      setDisplayPlans(allPlans.docs.map((e) => e.data()));
    }
  }, []);

  useEffect(async () => {
    const discoverMainImg = await getDoc(
      doc(db, 'main-components', 'discover_main_image')
    );

    setDiscoverMainImg(discoverMainImg.data().discover_main_image);
  }, []);

  useEffect(() => {
    if (discoverMainImg) {
      setLoadindOpacity(0);
    }
  }, [discoverMainImg]);

  useEffect(() => {
    let list = [];

    allPlansList.map((e) => {
      // console.log(222, e.country.label);
      if (e.author === inputValue.toLowerCase()) {
        // console.log('its equal!!! ', e);
        list.push(e);
        setDisplayPlans(list);
      } else if (e.title.toLowerCase().includes(inputValue.toLowerCase())) {
        // console.log('title includes ', e);
        list.push(e);
        setDisplayPlans(list);
      } else if (e.country.label.toLowerCase() === inputValue.toLowerCase()) {
        // console.log('country is equal!!! ', e);
        list.push(e);
        setDisplayPlans(list);
      }
      console.log(displayPlans);
    });
  }, [inputValue]);

  return (
    <>
      <FullLoading opacity={loadindOpacity} />
      <SkyMainImg setInputValue={setInputValue} inputValue={inputValue} />
      {/* <MainImgContainer>
        <MainImg src={discoverMainImg}></MainImg>
      </MainImgContainer> */}

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
