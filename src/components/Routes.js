import React, { PropTypes } from 'react';
import { App, Landing, PageNotFound } from './index.js';
import { Locations, Location, NotFound } from 'react-router-component';

const Routes = ({ path }) => (
  <Locations path={path} component={App}>
    <NotFound handler={PageNotFound} />
    <Location path="/" handler={Landing} />
  </Locations>
);

Routes.propTypes = {
  path: PropTypes.string,
};

export default Routes;
