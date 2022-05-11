import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import Header from './components/general/Header';
import Footer from './components/general/Footer';
import FontStyles from './styles/fontStyles';

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
