import React, { useState, useEffect } from 'react';
import {
  GetTravelLocation,
  GetAttraction,
  GetRestaurant,
} from '../../utils/api';
import styled from 'styled-components';
import AttractionCards from './AttractionCards';
import RestaurantCard from './RestaurantCard';
import { themeColours } from '../../utils/globalTheme';
import HashLoader from 'react-spinners/HashLoader';

const MainWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  justify-content: center;
  align-items: center;
`;

const InputWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
`;

const Input = styled.input`
  color: ${themeColours.light_orange};
  height: 30px;
  border-radius: 5px;
  border: 1px solid grey;
  padding-left: 15px;
  margin-right: 10px;
  font-size: 14px;
  min-width: 250px;
  &:focus {
    border: 2px solid ${themeColours.blue};
  }
`;
const AttractionCardWrapper = styled.div`
  display: flex;
  overflow: auto;
  width: 100%;
  flex-direction: column;
  align-items: center;
`;

const AttractionCardContainer = styled.div`
  margin-bottom: 20px;
  /* height: 510px; */
  width: 100%;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  display: -webkit-box;
`;

const SearchBtn = styled.button`
  padding: 10px 20px;
  border-radius: 15px;
  border: none;
  background-color: ${themeColours.light_orange};
  margin: 5px;
  &:hover {
    cursor: pointer;
  }
`;

const RecommendInfo = styled.div`
  font-size: 30px;
  font-weight: 600;
  color: ${themeColours.light_orange};
  margin-bottom: 10px;
  display: flex;
`;

function AttractionInput({ showRecommends, setShowRecommends }) {
  const [autoInput, setAutoInput] = useState('');
  const [attractionList, setAttractionList] = useState([]);
  const [restaurantList, setRestaurantList] = useState([]);
  const [loading, setLoading] = useState(null);

  return (
    <MainWrapper>
      <InputWrapper>
        <Input
          type="text"
          onChange={(e) => {
            setAutoInput(e.target.value);
          }}
        />
        <SearchBtn
          onClick={async () => {
            console.log('clicked', autoInput);
            setLoading(true);
            setShowRecommends(true);
            const geoId = await GetTravelLocation(autoInput);
            const attractionList = await GetAttraction(geoId);
            const resList = await GetRestaurant(geoId);

            if (attractionList && resList) {
              setLoading(false);
            }

            console.log(222, attractionList);
            setAttractionList(attractionList);

            console.log(333, resList);
            setRestaurantList(resList);
          }}>
          Search Attraction and Restaurants by City
        </SearchBtn>
      </InputWrapper>
      {loading && (
        <HashLoader
          color={themeColours.light_orange}
          loading={loading}
          size={100}
        />
      )}

      {showRecommends && !loading && (
        <AttractionCardWrapper>
          <RecommendInfo>Top 10 Attractions {'\u2192'}</RecommendInfo>
          <AttractionCardContainer>
            {attractionList?.map((place, index) => (
              <AttractionCards place={place} key={index} />
            ))}
          </AttractionCardContainer>
        </AttractionCardWrapper>
      )}

      {showRecommends && !loading && (
        <AttractionCardWrapper>
          <RecommendInfo>Top 10 Restaurants {'\u2192'}</RecommendInfo>
          <AttractionCardContainer>
            {restaurantList?.map((place, index) => (
              <RestaurantCard place={place} key={index} />
            ))}
          </AttractionCardContainer>
        </AttractionCardWrapper>
      )}
    </MainWrapper>
  );
}

export default AttractionInput;
