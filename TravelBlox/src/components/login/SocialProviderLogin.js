import facebookIcon from '../../images/login/facebook.png';
import googleIcon from '../../images/login/google.png';
import { signInProvider } from '../../utils/functionList';
import styled from 'styled-components';
import { themeColours } from '../../styles/globalTheme';

const Container = styled.div`
  width: 100%;
  height: 20px;
  padding: 20px;
  background-color: white;
  display: flex;
  margin: 10px 0 20px 0;
  align-items: center;
  justify-content: center;
  border-radius: 20px;
  border: 1px solid ${themeColours.light_grey};

  .content_container {
    width: 80%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .imgLogo {
    width: 25px;
    height: 25px;
    margin-right: 10px;
  }

  .text {
    text-align: center;
    width: 200px;
  }

  @media (max-width: 768px) {
    padding: 20px 5px;
    font-size: 12px;

    .content_container {
      width: 100%;
    }
  }
`;

function SocialProviderLogin() {
  return (
    <>
      <Container
        className="hoverCursor"
        onClick={(e) => signInProvider(e, 'google')}>
        <div className="content_container">
          <img src={googleIcon} alt="Google logo" className="imgLogo" />
          <div className="text">Sign in with Google</div>
        </div>
      </Container>
      <Container
        className="hoverCursor"
        onClick={(e) => signInProvider(e, 'facebook')}>
        <div className="content_container">
          <img src={facebookIcon} alt="Google logo" className="imgLogo" />
          <div className="text">Sign in with Facebook</div>
        </div>
      </Container>
    </>
  );
}

export default SocialProviderLogin;
