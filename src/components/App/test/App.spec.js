/* global jest, describe */
jest.unmock('../App');

import React from 'react';
import { expect } from 'chai';
import { render } from 'enzyme';
// import { findDOMNode } from 'react-dom';
// import TestUtils from 'react-addons-test-utils';
import App from '../App';

describe('App', () => {
  it('renders', () => {
    const app = render(
      <App />
    );

    expect(app.find('.atadosApp')).to.have.length(1);
  });
});
