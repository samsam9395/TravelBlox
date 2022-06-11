import PropTypes from 'prop-types';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const SinglePlanWrapper = styled.div`
  margin: 10px;

  @media (max-width: 490px) {
    width: 100%;
  }
`;

const SinglePlanContainer = styled.div`
  width: 100%;
  height: 320px;
  object-fit: contain;
  display: flex;
  align-items: center;

  @media (max-width: 1470px) {
    margin: auto;
    width: 100%;
  }

  @media (max-width: 490px) {
    min-width: 85vw;
  }
`;

const PlanTextContainer = styled.div`
  position: absolute;
  text-align: center;
  padding-left: 1em;
  padding-right: 1em;
  width: 100%;
  top: 50%;
  left: 50%;
  opacity: 0;
  -webkit-transform: translate(-50%, -50%);
  -moz-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
  -webkit-transition: all 0.3s ease-in-out 0s;
  -moz-transition: all 0.3s ease-in-out 0s;
  transition: all 0.3s ease-in-out 0s;
`;

const MainImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const SinglePlanText = styled.div`
  color: #fff;
  text-align: center;
  font-weight: 500;
  letter-spacing: 0.15em;
  font-size: 2em;
  text-transform: uppercase;
  position: relative;
  top: 45%;
`;

const PlanMainImageContainer = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  margin: auto;
  overflow: hidden;
  border-radius: 10px;

  &:hover {
    cursor: pointer;
    .overlay {
      opacity: 1;
    }
    .content-details {
      top: 50%;
      left: 50%;
      opacity: 1;
      height: 100%;

      .subInfo_container {
        position: relative;
        top: 60%;
        display: flex;
        flex-direction: column;
      }
    }
  }
  .fadeIn-bottom {
    top: 100%;
  }
`;

const SubInfoContainer = styled.div`
  color: #fff;
  font-size: 0.8em;
  position: relative;
  top: 60%;
`;

const ContentOverlay = styled.div`
  background: rgba(0, 0, 0, 0.7);
  position: absolute;
  height: 100%;
  width: 100%;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  opacity: 0;
  -webkit-transition: all 0.4s ease-in-out 0s;
  -moz-transition: all 0.4s ease-in-out 0s;
  transition: all 0.4s ease-in-out 0s;
`;

PublicPlanCard.propTypes = {
  planInfo: PropTypes.object,
  defaultImg: PropTypes.string,
};

function PublicPlanCard(props) {
  const navigate = useNavigate();

  const redirectToStatic = () => {
    navigate(`/static-plan-detail/${props.planInfo.plan_doc_ref}`);
  };

  return (
    <SinglePlanWrapper>
      <SinglePlanContainer onClick={() => redirectToStatic()}>
        <PlanMainImageContainer>
          <ContentOverlay className="overlay" />
          <MainImage
            src={props.planInfo.main_image || props.defaultImg}
            alt="main image"></MainImage>

          <PlanTextContainer className="content-details fadeIn-bottom">
            <SinglePlanText>{props.planInfo.title}</SinglePlanText>
            <SubInfoContainer>
              <div>Author: {props.planInfo.author}</div>
              {props.planInfo.country && (
                <div>Country: {props.planInfo.country['label']}</div>
              )}
            </SubInfoContainer>
          </PlanTextContainer>
        </PlanMainImageContainer>
      </SinglePlanContainer>
    </SinglePlanWrapper>
  );
}

export default PublicPlanCard;
