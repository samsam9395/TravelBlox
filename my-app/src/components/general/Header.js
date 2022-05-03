import React from 'react';
import styled from 'styled-components';
import logo from '../../images/main-logo.png';
import { Link } from 'react-router-dom';
import { themeColours } from '../../utils/globalTheme';

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  position: fixed;
  top: 0;
  background-color: white;
  border-bottom: 2px solid ${themeColours.pale};
  padding: 0 24px;
  z-index: 100;
`;

const NavLink = styled.div`
  &:active,
  &:visited {
    text-decoration: none;
  }
  width: 80px;
`;

const TestLink = styled(Link)`
  text-decoration: none;
  color: ${themeColours.dark_blue};
  &:active {
    text-decoration: none;
    color: ${themeColours.orange};
  }
  &:visited {
    text-decoration: none;
    color: inherit;
  }
  &:hover {
    cursor: pointer;
    color: ${themeColours.orange};
  }
`;

const Logo = styled.div`
  width: 80px;
  height: 80px;
  background-image: url(${logo});
  background-size: cover;
`;

const NavLinkWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-right: 30px;
`;
function Header() {
  return (
    <Wrapper>
      <Logo></Logo>
      <NavLinkWrapper>
        <NavLink>
          <TestLink to="/">Home</TestLink>
        </NavLink>
        <NavLink>
          <TestLink to="/discover">Discover</TestLink>
        </NavLink>
        <NavLink>
          <TestLink to="/dashboard">Dashboard</TestLink>
        </NavLink>
      </NavLinkWrapper>
    </Wrapper>
  );
}

export default Header;
