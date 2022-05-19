import React, { useEffect, useState } from 'react';

import Close from '@mui/icons-material/Close';
import { IconButton } from '@mui/material';
import styled from 'styled-components';

const Wrapper = styled.div`
  width: 100vw;
  height: 100vh;
  position: fixed;
  /* top: 55px; */
  top: 0;
  left: 0;
  background-color: #000000d9;
  z-index: 30;
  padding-top: 60px;
`;

const ImageContainer = styled.div`
  display: flex;

  justify-content: center;
  align-items: center;
  height: 100%;
  position: relative;

  img {
    /* max-width: 80%; */
    border-radius: 10px;
    max-height: 80%;
  }

  .close_btn_icon {
    right: 20px;
    top: 20px;
    position: absolute;
  }
`;

const CloseBtn = styled(IconButton)`
  top: 0;
  width: 60px;
  z-index: 35;
  right: 0;
  position: absolute;
`;

function ImageEnlarge({ mainImage, setShowFullImage }) {
  return (
    <Wrapper>
      <ImageContainer>
        <CloseBtn
          className="close_btn_icon"
          aria-label="close"
          onClick={() => {
            setShowFullImage(false);
          }}>
          <Close style={{ color: 'white' }} />
        </CloseBtn>
        {/* <div className="img_container"> */}
        <img src={mainImage} alt="Plan image full size" />
        {/* </div> */}
      </ImageContainer>
    </Wrapper>
  );
}

export default ImageEnlarge;
