import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import StarRateIcon from '@mui/icons-material/StarRate';
import StarHalfIcon from '@mui/icons-material/StarHalf';

const CardWrapper = styled.div`
  width: 100%;
  /* max-width: 500px; */
  max-height: 500px;
  padding: 10px;
  display: flex;
  flex-direction: row;
`;

const MainImage = styled.img`
  max-height: 300px;
`;

const InfoWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const InfoContainer = styled.div`
  display: flex;
  padding: 5px 10px;
  margin-left: 20px;
  width: 100%;
  align-items: center;
`;

const InfoTitle = styled.div`
  font-weight: 600;
  margin-right: 15px;
`;

const ATag = styled.a`
  color: orange;
  font-weight: 800;
  font-style: oblique;
  text-decoration: none;
  &,
  &:active,
  &:visited {
    text-decoration: none;
  }
`;

const Tag = styled.div`
  min-width: 60px;
  border-radius: 15px;
  border: none;
  background-color: yellowgreen;
  padding: 10px 15px;
  margin-right: 15px;
`;

const StarContainer = styled.div`
  display: flex;
  align-items: center;
  padding: 0 10px;
`;

export default function LocationCard(props) {
  const [mainImg, setMainImg] = useState('');
  const [locationTypes, setLocationTypes] = useState([]);
  const location = props.location;

  if (location) {
    console.log(location.address_components.map((e) => e.long_name));
    console.log(location.address_components);
  }

  useEffect(() => {
    if (location) {
      setMainImg(location.photos[0].getUrl());
      setLocationTypes(location.types);
    }
  }, [location]);

  useEffect(() => {
    let integer = Math.trunc(location.rating);
  }, [location.rating]);

  return (
    <CardWrapper>
      <MainImage src={mainImg}></MainImage>

      <InfoWrapper>
        <InfoContainer>
          <InfoTitle>Name:</InfoTitle>
          {location.name}
        </InfoContainer>

        <InfoContainer>
          <InfoTitle>Address: </InfoTitle>
          {location.formatted_address}
        </InfoContainer>

        <InfoContainer>
          <InfoTitle>Contact number: </InfoTitle>
          {location.formatted_phone_number}
        </InfoContainer>

        <InfoContainer>
          <InfoTitle>Contact International number: </InfoTitle>
          {location.international_phone_number}
        </InfoContainer>

        <InfoContainer>
          <InfoTitle>Status: </InfoTitle>
          {location.business_status}
        </InfoContainer>

        <InfoContainer>
          <InfoTitle>See on: </InfoTitle>
          <ATag href={location.url}>Google</ATag>
        </InfoContainer>

        <InfoContainer>
          <InfoTitle>Rating: </InfoTitle>
          {location.rating}
          <StarContainer>
            {[...Array(Math.trunc(location.rating))].map((e, i) => (
              <StarRateIcon style={{ color: '#FFD700' }} key={i}></StarRateIcon>
            ))}
            {location.rating % 1 != 0 && (
              <StarHalfIcon style={{ color: '#FFD700' }}></StarHalfIcon>
            )}
          </StarContainer>
        </InfoContainer>

        <InfoContainer>
          {locationTypes.map((tag) => (
            <Tag>{tag}</Tag>
          ))}
        </InfoContainer>
      </InfoWrapper>
    </CardWrapper>
  );
}
