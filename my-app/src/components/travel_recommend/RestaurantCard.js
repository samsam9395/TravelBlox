import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import './attractionCard.scss';
const CardContainer = styled.div``;

function RestaurantCard({ place }) {
  if (place.name) {
    // console.log(place);
    let descriptionTen = [];
    const descriptonSplit = place.description.split('.');
    for (let i = 0; i < 1; i++) {
      if (descriptonSplit[i] !== undefined) {
        descriptionTen.push(`${descriptonSplit[i]}.`);
      }
    }
    {
      place.cuisine && console.log(44, place.cuisine);
    }
    {
      place.awards && console.log(55, place.awards);
    }

    return (
      <figure className="image-block">
        <h1>{place.name}</h1>
        <h3>{place.address}</h3>
        <img src={place.photo.images.original.url} alt={place.photo.caption} />
        <figcaption>
          <h3>More Info</h3>

          <p>{descriptionTen}</p>
          <div className="sub-info">
            <div className="sub-title">Status:</div> {place.open_now_text}
          </div>

          {place.cuisine &&
            place.cuisine.map((type) => {
              <div className="res-cuisine-type">{type.name}</div>;
            })}

          <div className="sub-info">
            <div className="sub-title">Phone:</div> {place.phone}
          </div>

          {place.price_level && (
            <div className="sub-info">
              <div className="sub-title">Price Level:</div> {place.price_level}
            </div>
          )}
          {place.rating && (
            <div className="sub-info">
              <div className="sub-title">Rating:</div> {place.rating}
            </div>
          )}
          {place.ranking && (
            <div className="sub-info">
              <div className="sub-title">Ranking:</div> {place.ranking}
            </div>
          )}

          {place.awards?.map((award) => {
            <div
              className="res-award"
              style={{
                backgroundImage: `url(${award.images.large})`,
              }}></div>;
          })}
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
    );
  } else {
    return null;
  }
}

export default RestaurantCard;
