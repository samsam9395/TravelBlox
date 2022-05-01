import styled from 'styled-components';

export const themeColours = {
  orange: '#f1651d',
  light_orange: '#fea360',
  pale: '#fceebf',
  light_blue: '#55cfd6',
  blue: '#0a97b7',
  dark_blue: '#00213a',
};

// ref url: https://colorpalettes.net/color-palette-2368/
// dark blue here: https://colorpalettes.net/color-palette-3901/

export const LightOrangeBtn = styled.button`
  padding: 10px 20px;
  border-radius: 15px;
  border: none;
  background-color: ${themeColours.light_orange};
  margin: 5px;
  &:hover {
    cursor: pointer;
  }
`;
