import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import Header from './components/general/Header';
import Footer from './components/general/Footer';

ReactDOM.render(
  // <React.StrictMode>
  <BrowserRouter>
    <Header />
    <App />
    <Footer />
  </BrowserRouter>,
  // </React.StrictMode>,
  document.getElementById('root')
);
