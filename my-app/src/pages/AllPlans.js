import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import {
  getDocs,
  collection,
  getDoc,
  doc,
  query,
  where,
} from 'firebase/firestore';
import firebaseDB from '../utils/firebaseConfig';
import PublicPlanCard from '../components/PublicPlanCard';
import { themeColours } from '../styles/globalTheme';
import FullLoading from '../components/general/FullLoading';
import SkyMainImg from '../components/all_plan/SkyMainImg';
import Swal from 'sweetalert2';
import '../styles/alertStyles.scss';

const db = firebaseDB();

const WidthWrapper = styled.div`
  width: 100%;
  overflow-x: hidden;
`;

const PlanCollectionWrapper = styled.div`
  display: flex;
  padding: 15px;
  width: 100%;
  box-sizing: content-box;
  flex-wrap: wrap;
  justify-content: flex-start;
  /* transform: translate(5%, 0%); */
  .empty_notification {
    font-size: 20px;
  }
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
  const [loadindOpacity, setLoadindOpacity] = useState(1);
  const [allPlansList, setAllPlansList] = useState([]);
  const [inputValue, setInputValue] = useState('');

  const [discoverMainImg, setDiscoverMainImg] = useState('');
  const [emptyMatch, setEmptyMatch] = useState(false);
  const [displayPlans, setDisplayPlans] = useState([]);
  const navigate = useNavigate();

  // useEffect(() => {
  //   if (!props.user) {
  //     Swal.fire('Please login first!');
  //     navigate('/');
  //   }
  // }, []);

  useEffect(async () => {
    // const allPlans = await getDocs(collection(db, 'allPlans'));
    const allPlansRef = collection(db, 'allPlans');
    const q = query(allPlansRef, where('published', '==', true));
    const allPlans = await getDocs(q);

    console.log(77, allPlans);

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
    if (inputValue !== '') {
      const filteredData = allPlansList.filter((item) => {
        // return item.title.toLowerCase().startsWith(inputValue.toLowerCase());
        if (
          item.title.toLowerCase().includes(inputValue.toLowerCase()) ||
          item.country.label
            ?.toLowerCase()
            .includes(inputValue.toLowerCase()) ||
          item.author.toLowerCase().includes(inputValue.toLowerCase())
        ) {
          return item;
        }
      });
      setDisplayPlans(filteredData);
    } else {
      setDisplayPlans(allPlansList);
    }
  }, [inputValue]);

  useEffect(() => {
    if (displayPlans.length < 1) {
      setEmptyMatch(true);
    } else {
      setEmptyMatch(false);
    }
  }, [displayPlans]);

  return (
    <>
      <FullLoading opacity={loadindOpacity} />
      <WidthWrapper>
        <SkyMainImg setInputValue={setInputValue} inputValue={inputValue} />
      </WidthWrapper>

      <PlanCollectionWrapper>
        {emptyMatch && (
          <div className="empty_notification">
            Oops, no results were found. Please try another search.
          </div>
        )}
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
