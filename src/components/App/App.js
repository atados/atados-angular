import React, { PropTypes } from 'react';
import Header from '../Header/Header';
import { StyleSheet } from 'react-look';
import mainCss from './main.css';

StyleSheet.addCSS(mainCss());

const App = ({ children }) => (
  <div className="atadosApp">
    <Header />
    {children}
  </div>
);

App.propTypes = {
  children: PropTypes.object
};

export default App;
