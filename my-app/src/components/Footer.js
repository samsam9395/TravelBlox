import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  position: fixed;
  bottom: 0;
  background-color: black;
  color: white;
  height: 120px;
  padding: 15px 15px;
`;

const Title = styled.div`
  font-weight: 800;
  font-size: 16px;
  letter-spacing: 2px;
  margin-bottom: 30px;
`;

const SubTitle = styled.div`
  font-size: 12px;
  text-align: center;
  margin-bottom: 30px;
`;

const Rights = styled.div`
  font-size: 12px;
  position: absolute;
  bottom: 0;
`;

function Footer() {
  return (
    <Wrapper>
      <Title>EXPLORE. DRAG. PLAN. </Title>
      <SubTitle>
        We easify your travel planning experience! Stay worry free about the
        preperation and only focus on your travel day!{' '}
      </SubTitle>
      <Rights>© 2022 TripBlox. All Rights Reserved.</Rights>
    </Wrapper>
  );
}

export default Footer;
