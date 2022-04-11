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
`;

const NavLink = styled.div`
  &:active,
  &:visited {
    text-decoration: none;
  }
  width: 80px;
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
`;
function Header() {
  return (
    <Wrapper>
      <Logo></Logo>
      <NavLinkWrapper>
        <NavLink>Home</NavLink>
        <NavLink>Discover</NavLink>
        <NavLink>Dashboard</NavLink>
      </NavLinkWrapper>
    </Wrapper>
  );
}

export default Header;
