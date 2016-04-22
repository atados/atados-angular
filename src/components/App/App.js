import React, { Component, PropTypes } from 'react';
import Header from '../Header/Header';
import look, { StyleSheet } from 'react-look';
import mainCss from './main.css';

StyleSheet.addCSS(mainCss());

class App extends Component {
  render () {
    return (
      <div>
        <Header />
        {this.props.children}
      </div>
    );
  }
}

App.propTypes = {
  children: PropTypes.object
};

export default App;
