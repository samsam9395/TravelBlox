import App from './App';
import { BrowserRouter } from 'react-router-dom';
import FontStyles from './styles/fontStyles';
import Footer from './components/general/Footer';
import Header from './components/general/Header';
import React from 'react';
import ReactDOM from 'react-dom';

ReactDOM.render(
  // <React.StrictMode>
  <BrowserRouter>
    <FontStyles />
    <Header />
    <App />
    <Footer />
  </BrowserRouter>,
  // </React.StrictMode>,
  document.getElementById('root')
);
