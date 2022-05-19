import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';

import FullLoading from '../components/general/FullLoading';
import PropTypes from 'prop-types';
import PublicPlanCard from '../components/PublicPlanCard';
import SkyMainImg from '../components/SkyMainImg';
import firebaseDB from '../utils/firebaseConfig';
import styled from 'styled-components';

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
  min-height: 450px;
  align-items: center;

  .empty_notification {
    font-size: 20px;
    padding: 0;
  }
`;

Allplans.propTypes = {
  defaultImg: PropTypes.string,
};

function Allplans(props) {
  const [loadindOpacity, setLoadindOpacity] = useState(1);
  const [allPlansList, setAllPlansList] = useState([]);
  const [inputValue, setInputValue] = useState('');

  const [emptyMatch, setEmptyMatch] = useState(false);
  const [displayPlans, setDisplayPlans] = useState([]);

  useEffect(async () => {
    const allPlansRef = collection(db, 'allPlans');
    const q = query(allPlansRef, where('published', '==', true));
    const allPlans = await getDocs(q);

    if (allPlans.docs.length === 0) {
    } else {
      setAllPlansList(allPlans.docs.map((e) => e.data()));
      setDisplayPlans(allPlans.docs.map((e) => e.data()));
    }
  }, []);

  useEffect(() => {
    if (allPlansList.length > 0) {
      setLoadindOpacity(0);
    }
  }, [allPlansList]);

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
