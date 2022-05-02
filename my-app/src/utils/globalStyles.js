import { createGlobalStyle } from 'styled-components';
import { themeColours } from '../utils/globalTheme';

const GlobalStyle = createGlobalStyle`
body {
box-sizing: border-box;
outline: 0;
margin: 0;
padding: 100px 45px 150px 45px;
border: 0;
font-family: 'Roboto', Helvetica, sans-serif;
color: ${themeColours.dark_blue}
  }
`;

export default GlobalStyle;
