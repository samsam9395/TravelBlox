import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { ReactComponent as CircularMoon } from '../../images/loading/circular_moon.svg';
import GoldenPalmTreeWindow from '../../images/loading/golden_palm_window.png';
import SimpleSparkle from '../../images/loading/simple_sparkle.png';

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
`;

const pulse = keyframes`
0% {
  transform: scale(1);
  opacity: .2;
  transform-origin: center;
}
20% {
  transform: scale(1);
  opacity: .4;
  transform-origin: center;
}
60% {
  transform: scale(1.5);
  opacity: 1;
  transform-origin: center;
}
80% {
  transform: scale(1.2);
  opacity: .6;
  transform-origin: center;
}
100% {
  transform: scale(1);
  opacity: .4;
  transform-origin: center;
}
`;

const Wrapper = styled.div`
  left: 0;
  top: 0;
  position: fixed;
  background-color: white;
  z-index: 80;
  opacity: ${(props) => props.opacity};
  transition: opacity 1.8s;
  width: ${(props) => (props.changeDisplay ? 0 : '100vw')};
  height: ${(props) => (props.changeDisplay ? 0 : '100vh')};
`;

const ElementContainer = styled.div`
  position: relative;
  margin: auto;
  width: 10%;
  min-height: 700px;
  top: 30vh;

  .svg_element {
    width: 100%;
    position: absolute;
  }

  .circular_moon {
    position: absolute;
    left: -60%;
    top: -5%;
    width: 210%;
    animation: ${rotate} infinite 20s linear;
  }

  .palm_tree_img {
    width: 100%;
  }

  .simple_sparkle_img {
    width: 10%;
    position: absolute;
    top: -80px;
    right: 163%;
    animation: ${pulse} infinite 2s linear;
  }

  .simple_sparkle_img_bottom {
    width: 8%;
    position: absolute;
    bottom: -330px;
    left: 130%;
    -webkit-animation: bmNaQt infinite 2s linear;
    animation: bmNaQt infinite 5s linear;
  }

  .simple_sparkle_img_big {
    width: 17%;
    position: absolute;
    top: -50px;
    left: 175%;
    animation: ${pulse} infinite 3s linear;
  }
`;

function FullLoading({ opacity }) {
  const [changeDisplay, setChangeDisplay] = useState(false);

  useEffect(() => {
    if (opacity === 0) {
      const timeout = setTimeout(() => {
        setChangeDisplay(true);
      }, 1400);

      return () => {
        clearTimeout(timeout);
      };
    }
  }, [opacity]);

  return (
    <Wrapper opacity={opacity} changeDisplay={changeDisplay}>
      <ElementContainer>
        <CircularMoon className="svg_element circular_moon"></CircularMoon>
        <div className="svg_element">
          <img
            className="palm_tree_img"
            src={GoldenPalmTreeWindow}
            alt="Golden Palm Tree Window"
          />
        </div>

        <div className="svg_element">
          <img
            right="200%"
            className="simple_sparkle_img"
            src={SimpleSparkle}
            alt="Simple Sparkle"
          />
        </div>

        <div className="svg_element">
          <img
            right="200%"
            className="simple_sparkle_img_bottom"
            src={SimpleSparkle}
            alt="Simple Sparkle"
          />
        </div>

        <div className="svg_element">
          <img
            className="simple_sparkle_img_big"
            src={SimpleSparkle}
            alt="Simple Sparkle"
          />
        </div>
      </ElementContainer>
    </Wrapper>
  );
}

export default FullLoading;
