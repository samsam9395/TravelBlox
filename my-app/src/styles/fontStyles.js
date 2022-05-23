import Bombast from '../font/Bombast.ttf';
import CellineFram from '../font/CellineFram.ttf';
import Gellatio from '../font/GellatioPersonalUse-4BZjl.ttf';
import Nafasyah from '../font/Nafasyah-Brushed.ttf';
import { createGlobalStyle } from 'styled-components';

const FontStyles = createGlobalStyle`


@font-face {
  font-family: 'Gellatio';
  src: url(${Gellatio});
  unicode-range: U+00-FF;
}


@font-face {
  font-family: 'CellineFram';
  src: url(${CellineFram});
  unicode-range: U+00-FF;
}

@font-face {
  font-family: 'Nafasyah';
  src: url(${Nafasyah});
}


`;

export default FontStyles;
