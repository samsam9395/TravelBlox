import React from 'react';
import styled from 'styled-components';
import logo from '../../images/main-logo.png';
import { Link, useNavigate } from 'react-router-dom';
import { themeColours } from '../../styles/globalTheme';

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  position: fixed;
  top: 0;
  background-color: white;
  border-bottom: 2px solid ${themeColours.pale};
  padding: 0px 40px;
  z-index: 100;
`;

const NavLink = styled.div`
  &:active,
  &:visited {
    text-decoration: none;
  }
  width: 80px;
`;

const SubNavLink = styled(Link)`
  text-decoration: none;
  color: ${themeColours.dark_blue};
  width: 80px;
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

  return (
    <Wrapper>
      <Logo
        className="hoverCursor"
        onClick={() => navigate('/discover')}></Logo>
      <NavLinkWrapper>
        {/* <NavLink>
         
        </NavLink>
        <NavLink> */}
        <SubNavLink to="/discover">Discover</SubNavLink>
        <SubNavLink to="/dashboard">Dashboard</SubNavLink>
        {/* </NavLink> */}
      </NavLinkWrapper>
    </Wrapper>
  );
}

export default Header;
