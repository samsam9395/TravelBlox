import App from './App';
import { BrowserRouter } from 'react-router-dom';
import FontStyles from './styles/fontStyles';
import Footer from './components/general/Footer';
import Header from './components/general/Header';
import ReactDOM from 'react-dom';

ReactDOM.render(
  <BrowserRouter>
    <FontStyles />
    <Header />
    <App />
    <Footer />
  </BrowserRouter>,
  document.getElementById('root')
);
