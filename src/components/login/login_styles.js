import styled from 'styled-components';
import { themeColours } from '../../styles/globalTheme';

export const Title = styled.div`
  font-size: 20px;
  font-weight: 800;
  margin-bottom: 15px;
`;

export const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 20px 30px;
  width: 40%;
`;

export const InputWrapper = styled.div`
  margin-top: 20px;
`;

export const SignUpSwitcher = styled.div`
  font-size: 14px;
  letter-spacing: 1.5px;
  display: flex;
  flex-direction: column;

  .signSection {
    display: flex;
    margin-top: 5px;
  }

  .click_here {
    color: #d06224;
    font-weight: 800;
    padding: 0 10px;
  }
`;

export const Divider = styled.div`
  margin: auto;
  color: ${themeColours.light_grey};
  padding: 10px 0;
`;
