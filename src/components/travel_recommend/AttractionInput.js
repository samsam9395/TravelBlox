import { LightOrangeBtn, themeColours } from '../../styles/globalTheme';
import {
  getAttraction,
  getRestaurant,
  getTravelLocation,
} from '../../utils/api';
import { useEffect, useState } from 'react';

import AttractionCards from './AttractionCards';
import HashLoader from 'react-spinners/HashLoader';
import RestaurantCard from './RestaurantCard';
import Swal from 'sweetalert2';
import styled from 'styled-components';

const MainWrapper = styled.div`
  margin-top: 30px;
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

  @media (max-width: 768px) {
    flex-direction: column;
  }
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
  margin-top: 30px;
  display: flex;
  overflow: auto;
  width: 100%;
  flex-direction: column;
  align-items: center;
`;

const AttractionCardContainer = styled.div`
  margin-bottom: 20px;
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
  color: white;
  &:hover {
    cursor: pointer;
    background-color: ${themeColours.light_orange};
  }
`;

const RecommendInfo = styled.div`
  font-size: 30px;
  font-weight: 600;
  color: ${themeColours.light_orange};
  margin-bottom: 10px;
  display: flex;

  @media (max-width: 768px) {
    margin-top: 30px;
  }
`;

function AttractionInput() {
  const [autoInput, setAutoInput] = useState('');
  const [attractionList, setAttractionList] = useState([]);
  const [restaurantList, setRestaurantList] = useState([]);
  const [loading, setLoading] = useState(null);
  const [showRecommends, setShowRecommends] = useState(false);
  const [showHideCardsBtn, setShowHideCardsBtn] = useState(false);

  useEffect(() => {
    if (attractionList === undefined || restaurantList === undefined) {
      Swal.fire('Please try search again!');
    }
  }, [attractionList, restaurantList]);

  useEffect(() => {
    if (attractionList.length > 0 || restaurantList.length > 0) {
      setShowHideCardsBtn(true);
    }
  }, [attractionList, restaurantList]);

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
            setLoading(true);
            setShowRecommends(true);
            const geoId = await getTravelLocation(autoInput);
            const attractionList = await getAttraction(geoId);
            const resList = await getRestaurant(geoId);

            if (attractionList && resList) {
              setLoading(false);
            }
            setAttractionList(attractionList);
            setRestaurantList(resList);
          }}>
          Search Attraction and Restaurants by City
        </SearchBtn>
      </InputWrapper>
      {loading && (
        <div className="flexColumnWrap">
          <HashLoader
            color={themeColours.light_orange}
            loading={loading}
            size={100}
          />
          <div style={{ margin: 15 }}>
            Trying hard to decide what to recommend you ...... hanging there!
          </div>
        </div>
      )}

      {showRecommends && !loading && (
        <>
          <RecommendInfo>Top Attractions {'\u2192'}</RecommendInfo>
          <AttractionCardWrapper>
            <AttractionCardContainer>
              {attractionList?.map((place, index) => (
                <AttractionCards place={place} key={index} />
              ))}
            </AttractionCardContainer>
          </AttractionCardWrapper>
        </>
      )}

      {showRecommends && !loading && (
        <>
          <RecommendInfo>Top Restaurants {'\u2192'}</RecommendInfo>
          <AttractionCardWrapper>
            <AttractionCardContainer>
              {restaurantList?.map((place, index) => (
                <RestaurantCard place={place} key={index} />
              ))}
            </AttractionCardContainer>
          </AttractionCardWrapper>
        </>
      )}

      {showHideCardsBtn && (
        <LightOrangeBtn
          marginTop="30px"
          marginBottom="30px"
          onClick={() => setShowRecommends(!showRecommends)}>
          {showRecommends ? 'Hide Cards' : 'Show Cards'}
        </LightOrangeBtn>
      )}
    </MainWrapper>
  );
}

export default AttractionInput;
