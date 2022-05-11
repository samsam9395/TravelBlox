import { createGlobalStyle } from 'styled-components';
import Gellatio from '../font/GellatioPersonalUse-4BZjl.ttf';
import PosterJapan from '../font/poster_font_jap.ttf';

const FontStyles = createGlobalStyle`


@font-face {
  font-family: 'Gellatio';
  src: url(${Gellatio});
}
@font-face {
  font-family: 'PosterJapan';
  src: url(${PosterJapan});
}

`;

export default FontStyles;
