import React from 'react';
import styled from 'styled-components';
import './attractionCard.scss';

const Wrapper = styled.div`
  width: 400px;
  height: 500px;
`;

function AttractionCards({ place }) {
  if (place.name && place.ranking) {
    let descriptionTen = [];
    const descriptonSplit = place.description.split('.');
    for (let i = 0; i < 1; i++) {
      if (descriptonSplit[i] !== undefined) {
        descriptionTen.push(`${descriptonSplit[i]}.`);
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
          <figcaption>
            <h3>More Info</h3>

            <p>{descriptionTen}</p>
            <div className="sub-info">
              <div className="sub-title">Status:</div> {place.open_now_text}
            </div>

            {place.ranking && (
              <div className="sub-info">
                <div className="sub-title">Ranking:</div> {place.ranking}
              </div>
            )}
            {place.rating && (
              <div className="sub-info">
                <div className="sub-title">Rating:</div> {place.rating}
              </div>
            )}

            <div className="button-container">
              <button
                onClick={() => window.open(place.web_url, '_blank').focus()}>
                <span className="iconify" data-icon="fa:tripadvisor"></span>
                See Tripadvisor
              </button>
              {place.website && (
                <button
                  onClick={() => window.open(place.website, '_blank').focus()}>
                  See Website
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

export default AttractionCards;
