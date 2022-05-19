import React from 'react';
import styled from 'styled-components';
import './attractionCard.scss';

const Wrapper = styled.div`
  width: 400px;
  height: 100%;
`;

function RestaurantCard({ place }) {
  if (place.name && place.ranking) {
    let descriptionTen = [];
    const descriptonSplit = place.description.split(' ');

    for (let i = 0; i < 10; i++) {
      if (descriptonSplit[i] !== undefined) {
        descriptionTen.push(`${descriptonSplit[i]} `);
      }
    }

    return (
      <Wrapper>
        <figure className="image-block">
          <h1>{place.name}</h1>
          <h3>{place.address}</h3>
          <img
            src={place.photo.images.original.url}
            alt={place.photo.caption}
          />
          <figcaption className="resturant_card">
            <h3>More Info</h3>

            <p>{descriptionTen}...</p>

            <div
              style={{
                display: 'flex',
                marginBottom: '3px',
                flexWrap: 'wrap',
                width: '100%',
              }}>
              {place.cuisine?.map((type, index) => {
                return (
                  <div className="res-cuisine-type" key={index}>
                    #{type.name}
                  </div>
                );
              })}
            </div>

            <div className="sub-info">
              <div className="sub-title">Status:</div> {place.open_now_text}
            </div>

            <div className="sub-info">
              <div className="sub-title">Phone:</div> {place.phone}
            </div>

            {place.price_level && (
              <div className="sub-info">
                <div className="sub-title">Price Level:</div>{' '}
                {place.price_level}
              </div>
            )}
            {place.rating && (
              <div className="sub-info">
                <div className="sub-title">Rating:</div> {place.rating}
              </div>
            )}

            <div className="sub-info">
              <div className="sub-title">Ranking:</div> {place.ranking}
            </div>

            <div className="button-container">
              <button
                onClick={() => window.open(place.web_url, '_blank').focus()}>
                <span className="iconify" data-icon="fa:tripadvisor"></span>
                See Tripadvisor
              </button>
              {place.booking && (
                <button
                  onClick={() =>
                    window.open(place.booking.url, '_blank').focus()
                  }>
                  Order Delivery
                </button>
              )}
            </div>
          </figcaption>
        </figure>
      </Wrapper>
    );
  } else {
    return null;
  }
}

export default RestaurantCard;
