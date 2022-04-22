import React from 'react';
import styled from 'styled-components';
import logo from '../images/main-logo.png';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  position: fixed;
  top: 0;
  background-color: white;
  padding: 0 24px;
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
  &:active,
  &:visited {
    text-decoration: none;
  }
  &:hover {
    cursor: pointer;
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
          <TestLink to="/landing">Home</TestLink>
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
