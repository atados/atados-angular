import React, {PropTypes} from 'react';
import {Component} from 'react';
import store from './store';

const Hello = ({
  number,
  onClick
}) => (
  <div>
    <h1 onClick={(e) => {
      e.preventDefault();
      onClick();
    }}>
      Number: {number}
    </h1>
  </div>
);

Hello.propTypes = {
  onClick: PropTypes.func.isRequired,
  number: PropTypes.number.isRequired
};

export default Hello;
