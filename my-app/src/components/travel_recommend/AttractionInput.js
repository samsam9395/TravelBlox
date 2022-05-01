import React, { useState, useEffect } from 'react';
import {
  GetTravelLocation,
  GetAttraction,
  GetRestaurant,
} from '../../utils/api';
import styled from 'styled-components';
import AttractionCards from './AttractionCards';
import RestaurantCard from './RestaurantCard';

const AttractionCardContainer = styled.div`
  display: flex;
  flex-direction: row;
  padding: 20px;
  width: 100%;
  overflow: auto;
  border: 1px solid black;
`;

const SearchBtn = styled.div`
  padding: 10px 20px;
  border-radius: 15px;
  border: none;
`;

function AttractionInput() {
  const [autoInput, setAutoInput] = useState('');
  const [attractionList, setAttractionList] = useState([]);
  const [restaurantList, setRestaurantList] = useState([]);

  return (
    <>
      <input
        type="text"
        onChange={(e) => {
          setAutoInput(e.target.value);
        }}
      />
      <button
        onClick={async () => {
          console.log('clicked', autoInput);

          const geoId = await GetTravelLocation(autoInput);
          const attractionList = await GetAttraction(geoId);

          console.log(222, attractionList);
          setAttractionList(attractionList);
        }}>
        Search Location
      </button>

      <input
        type="text"
        onChange={(e) => {
          setAutoInput(e.target.value);
        }}
      />
      <button
        onClick={async () => {
          console.log('clicked', autoInput);
          const geoId = await GetTravelLocation(autoInput);
          const resList = await GetRestaurant(geoId);

          console.log(222, resList);
          setRestaurantList(resList);
        }}>
        Search Restaurant
      </button>

      <AttractionCardContainer>
        {attractionList?.map((place, index) => (
          <AttractionCards place={place} key={index} />
        ))}
      </AttractionCardContainer>
      <AttractionCardContainer>
        {restaurantList?.map((place, index) => (
          <RestaurantCard place={place} key={index} />
        ))}
      </AttractionCardContainer>
    </>
  );
}

export default AttractionInput;
