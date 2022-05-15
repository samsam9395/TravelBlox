import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import logo from '../../images/main-logo-transparent.png';
import { Link, useNavigate } from 'react-router-dom';
import { themeColours } from '../../styles/globalTheme';

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  position: fixed;
  top: 0;
  background-color: ${(props) => props.backgroundColour};
  border-bottom: ${(props) =>
    props.backgroundColour === 'white'
      ? `2px solid ${themeColours.pale}`
      : 'none'};
  padding: 0px 40px;
  z-index: 100;
`;

const SubNavLink = styled(Link)`
  text-decoration: none;
  font-weight: 600;
  color: ${(props) =>
    props.backgroundColour === 'transparent'
      ? 'white'
      : themeColours.dark_blue};
  text-shadow: ${(props) =>
    props.backgroundColour === 'transparent' ? '2px 3px 0 #7A7A7A' : 'none'};
  width: 80px;

  &:active {
    text-decoration: none;
    color: ${themeColours.light_orange};
  }
  &:visited {
    text-decoration: none;
    color: 'red';
  }
  &:hover {
    cursor: pointer;
    color: ${themeColours.light_orange};
  }
`;

const Logo = styled.div`
  width: 60px;
  height: 60px;
  background-image: url(${logo});
  background-size: cover;
`;

const NavLinkWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;

function Header() {
  const navigate = useNavigate();
  const [backgroundColour, setBackgroundColour] = useState('transparent');
  // const [startScrollListen, setStartScrollListen] = useState(true);
  useEffect(() => {
    var scrollTrigger = 60;
    if (startScrollListen) {
      window.onscroll = function () {
        // We add pageYOffset for compatibility with IE.
        if (
          window.scrollY >= scrollTrigger ||
          window.pageYOffset >= scrollTrigger
        ) {
          setBackgroundColour('white');
        }

        if (window.scrollY == 0) {
          //user scrolled to the top of the page
          setBackgroundColour('transparent');
        }
      };
    }
  }, []);

  useEffect(() => {
    if (!window.location.href.includes('/discover')) {
      console.log('did not includes!', window.location.href);
      setStartScrollListen(false);
    } else {
      setStartScrollListen(true);
    }
  }, []);

  return (
    <Wrapper backgroundColour={backgroundColour}>
      <Logo
        className="hoverCursor"
        onClick={() => navigate('/discover')}></Logo>
      <NavLinkWrapper>
        <SubNavLink backgroundColour={backgroundColour} to="/discover">
          Discover
        </SubNavLink>
        <SubNavLink backgroundColour={backgroundColour} to="/dashboard">
          Dashboard
        </SubNavLink>
      </NavLinkWrapper>
    </Wrapper>
  );
}

export default Header;
