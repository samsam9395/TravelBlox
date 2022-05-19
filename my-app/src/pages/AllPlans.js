import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
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
import FullLoading from '../components/general/FullLoading';
import SkyMainImg from '../components/SkyMainImg';

const db = firebaseDB();

const AllPlansWrapper = styled.div`
  padding: 10px 80px;
  display: flex;
  justify-content: center;
`;

const PlanCollectionWrapper = styled.div`
  display: flex;
  padding: 15px;
  box-sizing: content-box;
  flex-wrap: wrap;
  justify-content: flex-start;
  max-width: 1400px;
  .empty_notification {
    font-size: 20px;
  }
`;

// defaultImg={defaultImg}
function Allplans(props) {
  const [loadindOpacity, setLoadindOpacity] = useState(1);
  const [allPlansList, setAllPlansList] = useState([]);
  const [inputValue, setInputValue] = useState('');

  const [discoverMainImg, setDiscoverMainImg] = useState('');
  const [emptyMatch, setEmptyMatch] = useState(false);
  const [displayPlans, setDisplayPlans] = useState([]);
  const navigate = useNavigate();

  useEffect(async () => {
    // const allPlans = await getDocs(collection(db, 'allPlans'));
    const allPlansRef = collection(db, 'allPlans');
    const q = query(allPlansRef, where('published', '==', true));
    const allPlans = await getDocs(q);

    if (allPlans.docs.length === 0) {
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
      <SkyMainImg setInputValue={setInputValue} inputValue={inputValue} />
      <AllPlansWrapper>
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
      </AllPlansWrapper>
    </>
  );
}

export default Allplans;
