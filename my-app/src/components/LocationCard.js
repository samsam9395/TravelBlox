import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import StarRateIcon from '@mui/icons-material/StarRate';
import StarHalfIcon from '@mui/icons-material/StarHalf';

const CardWrapper = styled.div`
  width: 100%;
  /* max-width: 500px; */
  max-height: 500px;
  display: flex;
  flex-direction: row;
  margin: 30px 0;
`;

const MainImage = styled.img`
  max-height: 300px;
  max-width: 60%;
  flex: 1 1 auto;
`;

const InfoWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 40%;
  flex-direction: column;
  align-content: center;
  justify-content: center;
  align-items: flex-start;
`;

const InfoContainer = styled.div`
  display: flex;
  padding: 5px;
  margin-left: 1em;
  max-width: 100%;
  align-items: center;
  flex-wrap: wrap;
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
  /* min-width: 60px; */
  border-radius: 15px;
  border: none;
  background-color: yellowgreen;
  padding: 5px 12px;
  margin: 3px 5px;
`;

const StarContainer = styled.div`
  display: flex;
  align-items: center;
  padding: 0 10px;
`;

export default function LocationCard(props) {
  const [mainImg, setMainImg] = useState('');
  const [locationTypes, setLocationTypes] = useState([]);
  const [location, setLocation] = useState({});

  useEffect(() => {
    if (props.location) {
      setLocation(props.location);
    }
  }, [props]);

  useEffect(() => {
    // console.log(location);

    if (location.mainImg) {
      setMainImg(location.mainImg);
    } else if (location.photos) {
      setMainImg(location.photos[0].getUrl());
    } else if (location.place_img) {
      setMainImg(location.place_img);
      setLocationTypes(location.place_types);
    }

    if (location) {
      setLocationTypes(location.types);
    }
  }, [location]);

  return (
    Object.keys(location).length !== 0 && (
      <CardWrapper>
        <MainImage src={mainImg}></MainImage>

        <InfoWrapper>
          <InfoContainer>
            <InfoTitle>Name:</InfoTitle>
            {location.name}
          </InfoContainer>

          <InfoContainer>
            <InfoTitle>Address: </InfoTitle>
            {location.formatted_address || location.place_format_address}
          </InfoContainer>

          {location.formatted_phone_number ||
            (location.place_formatted_phone_number && (
              <InfoContainer>
                <InfoTitle>Contact number: </InfoTitle>
                {location.formatted_phone_number ||
                  location.place_formatted_phone_number}
              </InfoContainer>
            ))}

          {location.international_phone_number && (
            <InfoContainer>
              <InfoTitle>Contact International number: </InfoTitle>
              {location.international_phone_number}
            </InfoContainer>
          )}

          {location.business_status && (
            <InfoContainer>
              <InfoTitle>Status: </InfoTitle>
              {location.business_status}
            </InfoContainer>
          )}

          <InfoContainer>
            <InfoTitle>See on: </InfoTitle>
            <ATag href={location.url || location.place_url}>Google</ATag>
          </InfoContainer>

          <InfoContainer>
            <InfoTitle>Rating: </InfoTitle>
            {location.rating}
            <StarContainer>
              {location.rating &&
                [...Array(Math.trunc(location.rating))].map((e, i) => (
                  <StarRateIcon
                    style={{ color: '#FFD700' }}
                    key={i}></StarRateIcon>
                ))}
              {location.rating && location.rating % 1 != 0 && (
                <StarHalfIcon style={{ color: '#FFD700' }}></StarHalfIcon>
              )}
            </StarContainer>
          </InfoContainer>

          <InfoContainer>
            {locationTypes &&
              locationTypes.map((tag, i) => <Tag key={i}>{tag}</Tag>)}
          </InfoContainer>
        </InfoWrapper>
      </CardWrapper>
    )
  );
}
