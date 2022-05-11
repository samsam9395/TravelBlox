import { createGlobalStyle } from 'styled-components';
import { themeColours } from './globalTheme';

const GlobalStyle = createGlobalStyle`
body {
box-sizing: border-box;
outline: 0;
margin: 0;
border: 0;
font-family: 'Roboto', Helvetica, sans-serif;
color: ${themeColours.dark_blue};
scroll-behavior: smooth;
/* overflow: hidden; */

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
