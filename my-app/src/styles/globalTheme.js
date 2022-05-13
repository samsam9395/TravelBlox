import styled from 'styled-components';

export const themeColours = {
  light_orange: '#e7ac81', //new
  darker_orange: '#bb8c6b',
  milktea: '#E4D1B9',
  pale: '#fceebf',
  lighter_blue: 'hsl(184, 23%, 80%)', //new
  light_blue: '#6ca5a9', //new
  greyer_blue: '#6a8c8f', //new
  // blue: '#0a97b7',
  dark_blue: '#00213a',
  black: '#0E0E0F',
  light_grey: '#80808087',
  orange_grey: '#d9c1b0',
};

// ref url: https://colorpalettes.net/color-palette-2368/
// dark blue here: https://colorpalettes.net/color-palette-3901/

export const fonts = {
  main_font: 'Roboto',
  secondary_font: 'Oswald',
  handwriting: 'Gellatio',
};

export const LightOrangeBtn = styled.button`
  letter-spacing: 1.5px;
  min-width: 100px;
  /* padding: 10px 20px; */
  padding: ${(props) => props.padding || '10px 20px'};
  border-radius: 15px;
  border: none;
  background-color: ${themeColours.light_orange};
  margin-top: ${(props) => props.marginTop};
  margin-bottom: ${(props) => props.marginBottom};
  color: white;
  font-family: 'Roboto', sans-serif;
  font-size: ${(props) => props.fontSize || '14px'};
  width: ${(props) => props.width || 'auto'};
  &:hover {
    cursor: pointer;
    background-color: ${themeColours.darker_orange};
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
  font-family: 'Roboto', sans-serif;
  font-size: ${(props) => props.fontSize || '14px'};
  width: ${(props) => props.width || 'auto'};
  &:hover {
    cursor: pointer;
    background-color: ${themeColours.greyer_blue};
  }
`;

export const OrangeBtn = styled.button`
  letter-spacing: 1.5px;
  min-width: 100px;
  padding: ${(props) => props.padding || '10px 20px'};
  /* padding: 10px 20px; */
  border-radius: 15px;
  border: none;
  background-color: ${themeColours.light_orange};
  margin: 5px;
  color: white;
  font-family: 'Roboto', sans-serif;
  font-size: ${(props) => props.fontSize || '14px'};
  &:hover {
    cursor: pointer;
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
  font-family: 'Roboto', sans-serif;
  font-size: 16px;
  &:hover {
    cursor: pointer;
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
  font-family: 'Roboto', sans-serif;
  font-size: 16px;
  color: ${themeColours.light_grey};
  &:hover {
    cursor: pointer;
    background-color: ${themeColours.pale};
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
