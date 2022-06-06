import styled from 'styled-components';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  background-color: black;
  color: white;
  height: 60px;
  padding: 15px 15px;
`;

const Title = styled.div`
  font-weight: 800;
  font-size: 16px;
  letter-spacing: 2px;
  margin-bottom: 10px;
`;

const Rights = styled.div`
  font-size: 12px;
`;

function Footer() {
  return (
    <Wrapper>
      <Title>EXPLORE. DRAG. PLAN. </Title>
      <Rights>© 2022 TripBlox. All Rights Reserved.</Rights>
    </Wrapper>
  );
}

export default Footer;
