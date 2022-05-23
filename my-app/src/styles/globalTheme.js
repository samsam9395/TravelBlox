import styled from 'styled-components';

export const themeColours = {
  light_orange: '#e7ac81',
  darker_orange: '#bb8c6b',
  milktea: '#E4D1B9',
  pale: '#fceebf',
  lighter_blue: 'hsl(184, 23%, 80%)',
  light_blue: '#6ca5a9',
  greyer_blue: '#6a8c8f',
  dark_blue: '#00213a',
  black: '#0E0E0F',
  light_grey: '#80808087',
  orange_grey: '#d9c1b0',
};

export const fonts = {
  main_font: 'Roboto',
  secondary_font: 'Oswald',
  handwriting: 'Nafasyah',
};

export const LightOrangeBtn = styled.button`
  letter-spacing: 1.5px;
  min-width: 100px;
  padding: ${(props) => props.padding || '10px 20px'};
  border-radius: ${(props) => props.radius || '15px'};
  border: none;
  background-color: ${themeColours.light_orange};
  margin-top: ${(props) => props.marginTop};
  margin-bottom: ${(props) => props.marginBottom};
  color: white;
  font-family: ${fonts.main_font}, sans-serif;
  font-size: ${(props) => props.fontSize || '14px'};
  width: ${(props) => props.width || 'auto'};
  &:hover {
    cursor: pointer;
    background-color: ${themeColours.darker_orange};
  }

  @media (max-width: 768px) {
    width: 100%;
    letter-spacing: normal;
    font-size: 12px;
    padding: 10px;
  }
`;

export const LightBlueBtn = styled.button`
  letter-spacing: 1.5px;
  min-width: 100px;
  padding: ${(props) => props.padding || '10px 20px'};
  border-radius: 15px;
  border: none;
  background-color: ${themeColours.light_blue};
  margin: 5px;
  color: white;
  font-family: ${fonts.main_font}, sans-serif;
  font-size: ${(props) => props.fontSize || '14px'};
  width: ${(props) => props.width || 'auto'};
  &:hover {
    cursor: pointer;
    background-color: ${themeColours.greyer_blue};
  }

  @media (max-width: 768px) {
    width: 100%;
  }
`;

export const PaleBtn = styled.button`
  letter-spacing: 1.5px;
  min-width: 100px;
  padding: 10px 20px;
  border-radius: 15px;
  border: none;
  background-color: ${themeColours.pale};
  margin: 5px;
  font-family: ${fonts.main_font}, sans-serif;
  font-size: 16px;
  &:hover {
    cursor: pointer;
    background-color: ${themeColours.darker_orange};
  }
`;

export const PaleEmptyBtn = styled.button`
  letter-spacing: 1.5px;
  min-width: 100px;
  padding: 10px 20px;
  border-radius: 15px;
  border: 2px solid ${themeColours.pale};
  background-color: white;
  margin: 5px;
  font-family: ${fonts.main_font}, sans-serif;
  font-size: 16px;
  color: ${themeColours.light_grey};
  &:hover {
    cursor: pointer;
    background-color: ${themeColours.pale};
  }
  @media (max-width: 768px) {
    width: 100%;
  }
`;

export const FlexColumnWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  .upload_icon {
    margin: auto;
    height: 150px;
    &:hover {
      cursor: pointer;
    }
  }
`;

export const EditableMainImageContainer = styled.div`
  height: 400px;
  width: auto;
  object-fit: contain;
  border: none;
`;
export const EditableMainImage = styled.img`
  border: none;
  min-width: 150px;
  width: auto;
  height: 100%;
  object-fit: cover;
  @media (max-width: 1024px) {
    width: 100%;
  }
`;

export const ContentWrapper = styled.div`
  padding: 70px 80px 100px 80px;
  overflow-x: hidden;
  max-width: 1300px;
  margin: auto;

  @media (max-width: 768px) {
    padding: 80px 15px 80px 15px;
  }
`;
