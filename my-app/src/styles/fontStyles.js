import { createGlobalStyle } from 'styled-components';
import Gellatio from '../font/GellatioPersonalUse-4BZjl.ttf';

const FontStyles = createGlobalStyle`


@font-face {
  font-family: 'Gellatio';
  src: url(${Gellatio});
}
`;

export default FontStyles;
