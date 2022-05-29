import '../styles/alertStyles.scss';

import { fonts, themeColours } from './globalTheme';

import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
body {
box-sizing: border-box;
outline: 0;
margin: 0;
border: 0;
font-family: ${fonts.main_font}, Helvetica, sans-serif;
color: ${themeColours.dark_blue};
scroll-behavior: smooth;

button{
  cursor: pointer;
}

.hoverCursor{
  cursor: pointer;
}

.flexColumnWrap{
  display: flex;
  flex-direction: column;
align-items: center;
}



}
`;

export default GlobalStyle;
